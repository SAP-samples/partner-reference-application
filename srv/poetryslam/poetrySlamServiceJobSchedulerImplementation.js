'strict';
// Type definition required for CDSLint
/** @typedef {import('@sap/cds').CRUDEventHandler.On} OnHandler */

const cds = require('@sap/cds');
const JobScheduler = require('../lib/jobScheduler');
const { httpCodes } = require('../lib/codes');

// Type definition required for CDSLint
/** @type {OnHandler} */
module.exports = async (srv) => {
  // -----------------------------------------------------------------------------------------------
  // Entity action "sendReminderForPoetrySlam": Triggers job generation in Job Scheduler service
  // which sends reminder to all visitors of a specific poetry slam event
  // -----------------------------------------------------------------------------------------------

  srv.on('sendReminderForPoetrySlam', async (req) => {
    // Generate one-time job for sending reminder of poetry slam event
    const poetrySlamID = req.params[req.params.length - 1].ID;

    const poetrySlam = await SELECT.one('PoetrySlamService.PoetrySlams').where({
      ID: poetrySlamID
    });

    if (!poetrySlam) {
      console.error('Poetry Slam not found');
      req.error(httpCodes.bad_request, 'POETRYSLAM_NOT_FOUND', [
        srv.poetrySlamId
      ]);
      return;
    }

    // Manual transaction to directly commit changes to the database
    const tx = cds.tx();
    try {
      const currentTenantID =
        cds.context?.tenant || process.env['test_tenant_id'];
      const jobScheduler = await JobScheduler.create(req, currentTenantID);
      let jobName = `send_reminder_for_event (${currentTenantID.replace(/-/g, '_')})`;

      req.info(httpCodes.ok, 'ACTION_JOB_EXECUTION_STARTED');
      poetrySlam.isJobStatusShown = true;
      poetrySlam.jobStatusText = 'Job Execution started';

      await tx.run(
        UPDATE.entity('PoetrySlamService.PoetrySlams')
          .set({
            jobStatusText: poetrySlam.jobStatusText
          })
          .where({ ID: poetrySlamID })
      );

      await tx.commit();

      // Schedule job to run once
      const scheduleData = {
        active: true,
        time: JobScheduler.SCHEDULE_TIME_PATTERN_NOW,
        description: `Immediately for Poetry Slam ${poetrySlam.number}`,
        data: {
          poetrySlamID: poetrySlamID
        }
      };

      await jobScheduler.startJob(jobName, scheduleData, 'sendReminder');
      return poetrySlam;
    } catch (e) {
      await tx.rollback();
      console.error(
        'ACTION jobscheduler: Error during job generation',
        e.message
      );
      req.error(500, 'ACTION_JOB_EXECUTION_FAILED');
    }
  });
};
