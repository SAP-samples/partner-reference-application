'strict';
// Adds cds module
const cds = require('@sap/cds');
// Defines required CDS functions for testing
const { expect, GET, axios, POST, test } = cds.test(__dirname + '/../../..');
const { httpCodes } = require('../../../srv/lib/codes');
const sinon = require('sinon');
const JobSchedulerActionImplementation = require('../../../srv/lib/jobSchedulerActionImplementation');

// Executes an action, like 'sendEmail'
const ACTION = (url, name, data = {}, parameters = {}) =>
  POST(url + `/JobSchedulerService.${name}`, data, parameters);

describe('JobScheduler Service', () => {
  before(async () => {
    await test.data.reset();
  });

  describe('Authorizations of JobSchedulerService actions with Peter (authenticated with wrong scope)', () => {
    beforeEach(async () => {
      axios.defaults.auth = { username: 'peter', password: 'welcome' };
    });

    it('should fail calling the service', async () => {
      await expect(GET(`/odata/v4/jobschedulerservice`)).to.rejectedWith(
        httpCodes.forbidden.toString()
      );
    });

    it('should fail calling the service action generateConsumerJobs', async () => {
      await expect(
        ACTION(`/odata/v4/jobschedulerservice`, 'generateConsumerJobs')
      ).to.rejectedWith(httpCodes.forbidden.toString());
    });

    it('should fail calling the service action sendEmailReminder', async () => {
      await expect(
        ACTION(`/odata/v4/jobschedulerservice`, 'sendEmailReminder')
      ).to.rejectedWith(httpCodes.forbidden.toString());
    });
  });

  describe('Authorizations of JobSchedulerService actions with jobservice (Technical User with correct scope)', () => {
    let response;
    let sendReminderStub;

    beforeEach(async () => {
      axios.defaults.auth = { username: 'jobservice', password: 'welcome' };
      response = undefined;
      sendReminderStub = sinon.stub(
        JobSchedulerActionImplementation.prototype,
        'sendReminder'
      );
    });

    afterEach(async () => {
      sinon.restore();
    });

    it('should successfully call the service', async () => {
      response = await GET(`/odata/v4/jobschedulerservice`);
      expect(response.status).to.equal(httpCodes.ok);
    });

    it('should fail to call action generateConsumerJobs in case header with job id is missing', async () => {
      await expect(
        ACTION(`/odata/v4/jobschedulerservice`, 'generateConsumerJobs')
      ).to.rejectedWith(httpCodes.bad_request.toString());
    });

    it('should fail to call action sendEmailReminder in case header with job id is missing', async () => {
      await expect(
        ACTION(`/odata/v4/jobschedulerservice`, 'sendEmailReminder')
      ).to.rejectedWith(httpCodes.bad_request.toString());
    });

    it('should allow to call the service action generateConsumerJobs (rejected with server error due to missing service in unit test)', async () => {
      await expect(
        ACTION(
          `/odata/v4/jobschedulerservice`,
          'generateConsumerJobs',
          {},
          {
            headers: {
              'x-sap-job-id': 'mock-job-id',
              'x-sap-job-schedule-id': 'mock-job-schedule-id',
              'x-sap-job-run-id': 'mock-job-run-id'
            }
          }
        )
      ).to.rejectedWith(httpCodes.internal_server_error.toString());
    });

    it('should allow to call the service action sendEmailReminder (no emails sent for poetry slams with test data)', async () => {
      response = await ACTION(
        `/odata/v4/jobschedulerservice`,
        'sendEmailReminder',
        {
          poetrySlamID: '79ceab87-300d-4b66-8cc3-f82c679b77a1'
        },
        {
          headers: {
            'x-sap-job-id': 'mock-job-id',
            'x-sap-job-schedule-id': 'mock-job-schedule-id',
            'x-sap-job-run-id': 'mock-job-run-id'
          }
        }
      );
      sinon.assert.calledOnce(sendReminderStub);
      expect(response.status).to.equal(httpCodes.ok_no_content);
    });
  });
});
