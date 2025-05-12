'strict';

const { httpCodes } = require('../lib/codes');
const JobAction = require('../lib/jobSchedulerActionImplementation');
const cds = require('@sap/cds');

module.exports = cds.service.impl(async (srv) => {
  srv.before('*', (req) => {
    if (
      req.headers &&
      req.headers['x-sap-job-id'] &&
      req.headers['x-sap-job-schedule-id'] &&
      req.headers['x-sap-job-run-id']
    )
      return;

    console.error(
      `JobScheduler API Endpoint: Required headers of the Job Scheduler Service are missing.`
    );
    req.error(httpCodes.bad_request, 'ACTION_JOB_GENERATION_FAILED');
  });

  // ------------------------------------------------------------------------------------
  // Action "generateConsumerJobs": Provider job action of Job Scheduler service
  // ------------------------------------------------------------------------------------

  srv.on('generateConsumerJobs', async (req) => {
    try {
      const jobAction = new JobAction();
      await jobAction.generateConsumerJobs(req);
    } catch (e) {
      console.error(
        `Action generateConsumerJobs: Error while processing jobs: ${e.message}`
      );
      req.error(
        httpCodes.internal_server_error,
        'ACTION_JOB_GENERATION_FAILED'
      );
    }
  });

  // ------------------------------------------------------------------------------------
  // Action "sendEmailReminder": Consumer-specific job action of Job Scheduler service
  // ------------------------------------------------------------------------------------

  srv.on('sendEmailReminder', async (req) => {
    // Manual transaction to directly commit changes to the database
    const tx = cds.tx();
    try {
      const jobAction = new JobAction();
      await jobAction.sendReminder(req, tx);
      await tx.commit();
    } catch (e) {
      tx.rollback();
      console.error(
        `Action sendEmailReminder: Error while processing jobs: ${e.message}`
      );
      req.error(
        httpCodes.internal_server_error,
        'ACTION_JOB_EMAIL_REMINDER_SEND_FAIL'
      );
    }
  });
});
