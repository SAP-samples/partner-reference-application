'use strict';

const JobScheduler = require('./jobScheduler');
const TenantManager = require('./tenantManager');
const Notification = require('./notification');
const cds = require('@sap/cds');
const { httpCodes, poetrySlamStatusCode, visitStatusCode } = require('./codes');

class JobSchedulerActionImplementation {
  constructor() {
    // Initialize scheduleData using a synchronous method and store it in the instance
    this.scheduleData = {
      active: true,
      time: JobScheduler.SCHEDULE_TIME_PATTERN_NOW,
      description: JobScheduler.SCHEDULE_DESCRIPTION_IMMEDIATELY,
      data: { date: this.getTomorrowDate() }
    };
  }

  // Timezone offset is used to use function toISOString() without changing the returned date value
  getTomorrowDate() {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setMinutes(
      tomorrow.getTimezoneOffset() > 0
        ? tomorrow.getMinutes() + tomorrow.getTimezoneOffset()
        : tomorrow.getMinutes() - tomorrow.getTimezoneOffset()
    );
    return tomorrow.toISOString().split('T')[0]; // Returns the date in YYYY-MM-DD format
  }

  setJobStatusText(visitCount, notificationCount) {
    return cds.i18n.labels.at(
      'JOBSCHEDULER_JOB_STATUS_TEXT',
      cds.context.locale ?? 'en',
      [visitCount, notificationCount]
    );
  }

  // ----------------------------------------------------------------------------
  //  Implmentation of action endpoint: generate job for subscribed tenants
  // ----------------------------------------------------------------------------
  async generateConsumerJobs(req) {
    const tenantManager = new TenantManager();
    // Get all subscribed tenants
    const tenantData = await tenantManager.getSubscriberTenantIds();
    console.log(
      `Action generateConsumerJobs: Number of Consumer Tenants: ${tenantData.length}`
    );
    let jobCount = 0;
    let jobData;
    // Using Promise.all for parallel initialization and job scheduling
    await Promise.all(
      tenantData.map(async (tenant) => {
        const jobScheduler = await JobScheduler.create(
          req,
          tenant.subscribedTenantId
        );
        let formattedSubdomain = `(${tenant.subscribedSubdomain.replace(/-/g, '_')})`;
        let jobName = `send_reminder_for_all_events_until_date ${formattedSubdomain}`;
        // Start job for tenant
        jobData = await jobScheduler.startJob(
          jobName,
          this.scheduleData,
          'sendReminder'
        );
        if (jobData) {
          jobCount++;
        }
        console.log(
          `Action generateConsumerJobs: Job started successfully for tenantId: ${tenant.subscribedTenantId}`
        );
      })
    );
    const providerTenantID = tenantManager.getProviderTenantId();

    const jobSchedulerProvider = await JobScheduler.create(
      req,
      providerTenantID
    );

    const logMessages = `For ${tenantData.length} subscribed tenants, ${jobCount} jobs were successfully scheduled.`;
    const logData = {
      success: tenantData.length === jobCount,
      message: logMessages
    };

    await jobSchedulerProvider.updateSchedulerRunLog(
      req.headers['x-sap-job-id'],
      req.headers['x-sap-job-schedule-id'],
      req.headers['x-sap-job-run-id'],
      logData
    );
  }

  // ----------------------------------------------------------------------------
  //  Implmentation of action endpoint: send reminder notification
  // ----------------------------------------------------------------------------
  async sendReminder(req, tx) {
    const { poetrySlamID, date } = req.data;

    // date is the default parameter - if it is not filled, then poetrySlamID must be filled
    if (date) {
      await this.handleReminderByDate(req, date);
    } else if (poetrySlamID) {
      await this.handleReminderByPoetrySlamID(req, poetrySlamID, tx);
    } else {
      console.error(`Action sendReminder: Error while sending notifications`);
      req.error(httpCodes.bad_request, 'ACTION_JOB_REMINDER_NO_ID_OR_DATE');
    }
  }

  // Send reminder notifications to the visitors of all poetry slams until a specific date
  async handleReminderByDate(req, date) {
    const futureDate = new Date(date);
    futureDate.setHours(23, 59, 59, 999);
    // Select visits of all published or fully booked poetry slam events until the future date
    // and thereof visitors which have the status booked
    const visits = await SELECT.from('PoetrySlamService.PoetrySlams')
      .columns(
        'title',
        'description',
        'dateTime',
        'visits.status_code as visitStatusCode',
        'visits.visitor.name as visitorName',
        'visits.visitor.email as visitorEMail'
      )
      .where({
        dateTime: { '<=': futureDate },
        'status.code': {
          in: [poetrySlamStatusCode.published, poetrySlamStatusCode.booked]
        },
        'visits.status_code': visitStatusCode.booked
      });

    // Visit was not found
    if (!visits.length) {
      console.info(`ACTION sendReminderByDate: No Visits found.`);
      return;
    }
    // Send notification reminder to each visitor
    for (const visit of visits) {
      const notification = new Notification(
        visit.visitorEMail,
        Notification.getMailTitleForPoetrySlam(),
        Notification.generateMailContentForPoetrySlam(),
        Notification.getNotificationSubtitleForPoetrySlam(),
        visit
      );

      await notification.send(req);
    }
  }

  // Send reminder notifications for the visitors of a specific poetry slam event
  async handleReminderByPoetrySlamID(req, poetrySlamID, tx) {
    // Select visits of a specific and published or fully booked poetry slam event
    // and thereof visitors which have the status booked
    const visits = await SELECT.from('PoetrySlamService.PoetrySlams')
      .columns(
        'title',
        'description',
        'dateTime',
        'visits.status_code as visitStatusCode',
        'visits.visitor.name as visitorName',
        'visits.visitor.email as visitorEMail'
      )
      .where({
        ID: poetrySlamID,
        'status.code': {
          in: [poetrySlamStatusCode.published, poetrySlamStatusCode.booked]
        },
        'visits.status_code': visitStatusCode.booked
      });

    // Initalize Status Text
    let notificationCount = 0;

    // Visit was not found
    if (!visits.length) {
      await tx.run(
        UPDATE.entity('PoetrySlamService.PoetrySlams')
          .set({ jobStatusText: this.setJobStatusText(0, 0) })
          .where({ ID: poetrySlamID })
      );
      console.info(`ACTION handleReminderByPoetrySlamID: No Visits found.`);
      return;
    }

    let currentTenantID = cds.context?.tenant || process.env['test_tenant_id'];

    // Send notification reminder to each visitor
    for (const visit of visits) {
      const notification = new Notification(
        visit.visitorEMail,
        Notification.getMailTitleForPoetrySlam(),
        Notification.generateMailContentForPoetrySlam(),
        Notification.getNotificationSubtitleForPoetrySlam(),
        visit
      );
      // Send notification
      const notificationStatus = await notification.send(req);
      if (notificationStatus === 0) notificationCount++;
    }

    await tx.run(
      UPDATE.entity('PoetrySlamService.PoetrySlams')
        .set({
          jobStatusText: this.setJobStatusText(visits.length, notificationCount)
        })
        .where({ ID: poetrySlamID })
    );

    // Update Job Schedule Log
    const jobSchedulerProvider = await JobScheduler.create(
      req,
      currentTenantID
    );
    const logData = {
      success: true,
      message: this.setJobStatusText(visits.length, notificationCount)
    };
    await jobSchedulerProvider.updateSchedulerRunLog(
      req.headers['x-sap-job-id'],
      req.headers['x-sap-job-schedule-id'],
      req.headers['x-sap-job-run-id'],
      logData
    );
  }
}

// Publish constants and functions
module.exports = JobSchedulerActionImplementation;
