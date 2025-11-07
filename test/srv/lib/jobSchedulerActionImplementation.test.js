'use strict';

const cds = require('@sap/cds');
const { expect } = cds.test(__dirname + '/../../..');
const sinon = require('sinon');

// Lib reuse files
const serviceCredentials = require('../../../srv/lib/serviceCredentials');
const { httpCodes, visitStatusCode } = require('../../../srv/lib/codes');
const Notification = require('../../../srv/lib/notification');
const TenantManager = require('../../../srv/lib/tenantManager');
const JobScheduler = require('../../../srv/lib/jobScheduler');
const JobSchedulerActionImplementation = require('../../../srv/lib/jobSchedulerActionImplementation');

describe('JobSchedulerActionImplementation Constructor', function () {
  let jobAction;

  beforeEach(function () {
    // Create an instance of the class
    jobAction = new JobSchedulerActionImplementation();
  });

  it('should initialize scheduleData with default values', function () {
    const expectedScheduleData = {
      active: true,
      data: {},
      time: JobScheduler.SCHEDULE_TIME_PATTERN_NOW,
      description: JobScheduler.SCHEDULE_DESCRIPTION_IMMEDIATELY
    };

    expect(jobAction.scheduleData.active).to.equal(expectedScheduleData.active);
    expect(jobAction.scheduleData.time).to.equal(expectedScheduleData.time);
    expect(jobAction.scheduleData.description).to.equal(
      expectedScheduleData.description
    );
  });
});

describe('JobSchedulerActionImplementation - getTomorrowDate Method', function () {
  let jobAction;
  let clock;

  beforeEach(function () {
    jobAction = new JobSchedulerActionImplementation();
    // Use Sinon clock to simulate fixed date/time for testing purposes
    clock = sinon.useFakeTimers(new Date(2023, 0, 1).getTime()); // Jan 1, 2023
  });

  afterEach(function () {
    clock.restore();
  });

  it("should return tomorrow's date in YYYY-MM-DD format", async function () {
    const expectedDate = '2023-01-02'; // Expected result based on static time provided by the clock

    const result = jobAction.getTomorrowDate();

    expect(result).to.equal(expectedDate);
  });
});

describe('JobSchedulerActionImplementation - generateConsumerJobs Method', function () {
  let jobAction;
  let tenantManagerStub;
  let jobSchedulerStartJobStub;
  let consoleLogStub;
  let consoleErrorStub;
  let serviceCredentialsStub;
  let jobSchedulerCreateStub;
  let reqMock;

  beforeEach(function () {
    jobAction = new JobSchedulerActionImplementation();

    // Stubbing dependencies
    tenantManagerStub = sinon.stub(
      TenantManager.prototype,
      'getSubscriberTenantIds'
    );
    jobSchedulerStartJobStub = sinon.stub();
    jobSchedulerCreateStub = sinon.stub(JobScheduler, 'create').resolves({
      startJob: jobSchedulerStartJobStub,
      updateSchedulerRunLog: sinon.stub()
    });

    serviceCredentialsStub = sinon
      .stub(serviceCredentials, 'getServiceCredentials')
      .returns({ tenantid: 'mockProviderTenantID' });

    // Stubbing console functions
    consoleLogStub = sinon.stub(console, 'log');
    consoleErrorStub = sinon.stub(console, 'error');

    // Mock request object
    reqMock = {
      error: sinon.stub(),
      headers: {
        'x-sap-job-id': 'mock-job-id',
        'x-sap-job-schedule-id': 'mock-job-schedule-id',
        'x-sap-job-run-id': 'mock-job-run-id'
      }
    };
  });

  afterEach(function () {
    tenantManagerStub.restore();
    consoleLogStub.restore();
    consoleErrorStub.restore();
    serviceCredentialsStub.restore();
    jobSchedulerCreateStub.restore();
  });

  it('should successfully generate jobs for all tenants', async function () {
    process.env['test_tenant_id'] = 'mockProviderTenantID';

    const tenantData = [
      {
        subscribedTenantId: 'mockTenantID1',
        subscribedSubdomain: 'mockSubdomain1'
      },
      {
        subscribedTenantId: 'mockTenantID2',
        subscribedSubdomain: 'mockSubdomain2'
      }
    ];

    tenantManagerStub.resolves(tenantData);
    jobSchedulerStartJobStub.resolves({ jobId: 'mockJobID' });

    await jobAction.generateConsumerJobs(reqMock);

    // Verify job scheduling interactions
    expect(
      consoleLogStub.calledWith(
        `Action generateConsumerJobs: Number of Consumer Tenants: 2`
      )
    ).to.be.true;
    expect(
      consoleLogStub.calledWith(
        sinon.match(/Job started successfully for tenantId/)
      )
    ).to.be.true;
    expect(jobSchedulerStartJobStub.callCount).to.equal(tenantData.length);

    // Restore the environment variables
    delete process.env['test_tenant_id'];
  });
});

describe('JobSchedulerActionImplementation - sendReminder Method', function () {
  let jobAction;
  let handleReminderByDateStub;
  let handleReminderByPoetrySlamIDStub;
  let reqMock;
  let txMock;
  let consoleErrorStub;

  beforeEach(function () {
    jobAction = new JobSchedulerActionImplementation();

    // Stubbing internal methods
    handleReminderByDateStub = sinon.stub(jobAction, 'handleReminderByDate');
    handleReminderByPoetrySlamIDStub = sinon.stub(
      jobAction,
      'handleReminderByPoetrySlamID'
    );

    // Mocking console.error to track errors
    consoleErrorStub = sinon.stub(console, 'error');

    // Mock request object
    reqMock = {
      data: {},
      error: sinon.stub()
    };

    txMock = {
      run: sinon.stub(),
      commit: sinon.stub(),
      rollback: sinon.stub()
    };
  });

  afterEach(function () {
    handleReminderByDateStub.restore();
    handleReminderByPoetrySlamIDStub.restore();
    consoleErrorStub.restore();
  });

  it('should call handleReminderByDate when date is provided', async function () {
    reqMock.data = { date: '2023-05-01' };

    await jobAction.sendReminder(reqMock, txMock);

    // Validate handleReminderByDate was called
    expect(
      handleReminderByDateStub.calledOnceWithExactly(reqMock, '2023-05-01')
    ).to.be.true;
    expect(handleReminderByPoetrySlamIDStub.notCalled).to.be.true;
  });

  it('should call handleReminderByPoetrySlamID when poetrySlamID is provided', async function () {
    reqMock.data = { poetrySlamID: 'mockPoetrySlamID' };

    await jobAction.sendReminder(reqMock, txMock);

    // Validate handleReminderByPoetrySlamID was called
    expect(
      handleReminderByPoetrySlamIDStub.calledOnceWithExactly(
        reqMock,
        'mockPoetrySlamID',
        txMock
      )
    ).to.be.true;
    expect(handleReminderByDateStub.notCalled).to.be.true;
  });

  it('should log error and call request error when neither date nor poetrySlamID is provided', async function () {
    reqMock.data = {};

    await jobAction.sendReminder(reqMock, txMock);

    // Verify error handling when missing required data
    expect(
      consoleErrorStub.calledOnceWithExactly(
        `Action sendReminder: Error while sending notifications`
      )
    ).to.be.true;
    expect(
      reqMock.error.calledOnceWithExactly(
        httpCodes.bad_request,
        'ACTION_JOB_REMINDER_NO_ID_OR_DATE'
      )
    ).to.be.true;
  });
});

describe('JobSchedulerActionImplementation - handleReminderByDate Method', function () {
  let jobAction;
  let reqMock;
  let consoleInfoStub;
  let consoleErrorStub;
  let selectStub;
  let notificationSendStub;
  let getMailTitleForPoetrySlamStub;
  let generateMailContentForPoetrySlamStub;

  beforeEach(function () {
    jobAction = new JobSchedulerActionImplementation();

    // Mocking console functions
    consoleInfoStub = sinon.stub(console, 'info');
    consoleErrorStub = sinon.stub(console, 'error');

    // Mock request object
    reqMock = {
      error: sinon.stub()
    };

    selectStub = sinon.stub(cds.ql.SELECT, 'from');

    // Stubbing Notification send method within Notification
    notificationSendStub = sinon
      .stub(Notification.prototype, 'send')
      .resolves(0);
    getMailTitleForPoetrySlamStub = sinon.stub(
      Notification,
      'getMailTitleForPoetrySlam'
    );
    generateMailContentForPoetrySlamStub = sinon.stub(
      Notification,
      'generateMailContentForPoetrySlam'
    );
  });

  afterEach(function () {
    consoleInfoStub.restore();
    consoleErrorStub.restore();
    selectStub.restore();
    notificationSendStub.restore();
    getMailTitleForPoetrySlamStub.restore();
    generateMailContentForPoetrySlamStub.restore();
  });

  it('should send reminders for all visits found', async function () {
    selectStub.returns({
      columns: function () {
        return this;
      },
      where: () => {
        return [
          {
            title: 'mockPoetrySlamTitle',
            description: 'mockDescription',
            dateTime: new Date().toISOString(),
            visitorName: 'mockVisitorName',
            visitorEMail: 'visitor@example.com',
            status_code: visitStatusCode.booked
          }
        ];
      }
    });

    await jobAction.handleReminderByDate(reqMock, '2023-05-01');

    // Validate notification was sent
    expect(notificationSendStub.calledOnce).to.be.true;
    expect(getMailTitleForPoetrySlamStub.calledOnce).to.be.true;
    expect(generateMailContentForPoetrySlamStub.calledOnce).to.be.true;
    expect(notificationSendStub.calledWith(reqMock)).to.be.true;
    expect(consoleInfoStub.notCalled).to.be.true;
  });

  it('should log info message when no visits are found', async function () {
    selectStub.returns({
      columns: function () {
        return this;
      },
      where: () => {
        return [];
      } // Simulate no visits found
    });

    await jobAction.handleReminderByDate(reqMock, '2023-05-01');

    // Validate logging behavior
    expect(consoleInfoStub.calledOnce).to.be.true;
    expect(notificationSendStub.notCalled).to.be.true;
  });
});

describe('JobSchedulerActionImplementation - handleReminderByPoetrySlamID Method', function () {
  let jobAction;
  let reqMock;
  let txMock;
  let consoleInfoStub;
  let consoleErrorStub;
  let stubSELECT;
  let stubUPDATE;
  let notificationSendStub;
  let jobSchedulerCreateStub;
  let getMailTitleForPoetrySlamStub;
  let generateMailContentForPoetrySlamStub;
  let stubCdsContext;

  beforeEach(function () {
    jobAction = new JobSchedulerActionImplementation();

    // Mocking console functions
    consoleInfoStub = sinon.stub(console, 'info');
    consoleErrorStub = sinon.stub(console, 'error');

    // Mock request object
    reqMock = {
      error: sinon.stub(),
      headers: {
        'x-sap-job-id': 'mock-job-id',
        'x-sap-job-schedule-id': 'mock-job-schedule-id',
        'x-sap-job-run-id': 'mock-job-run-id'
      }
    };

    txMock = {
      run: sinon.stub(),
      commit: sinon.stub(),
      rollback: sinon.stub()
    };

    // Stubbing SELECT.from for query emulation
    stubSELECT = sinon.stub(cds.ql.SELECT, 'from').returns({
      columns: function () {
        return this;
      }, // mock chain method columns
      where: function () {
        return [
          {
            title: 'mockPoetrySlamTitle',
            description: 'mockDescription',
            dateTime: new Date().toISOString(),
            visitorName: 'mockVisitorName',
            visitorEMail: 'visitor@example.com',
            status_code: visitStatusCode.booked
          }
        ];
      }
    });

    const fakeContext = {
      locale: 'en'
    };

    // stub cds.context getter to return the fake context
    stubCdsContext = sinon.stub(cds, 'context').get(() => fakeContext);

    // Stubbing UPDATE entity behavior
    stubUPDATE = sinon.stub(cds.ql.UPDATE, 'entity').returns({
      set: function () {
        return this;
      },
      where: function () {
        return 1;
      }
    });

    // Stubbing notification send method within notification
    notificationSendStub = sinon
      .stub(Notification.prototype, 'send')
      .resolves(0);
    getMailTitleForPoetrySlamStub = sinon.stub(
      Notification,
      'getMailTitleForPoetrySlam'
    );
    generateMailContentForPoetrySlamStub = sinon.stub(
      Notification,
      'generateMailContentForPoetrySlam'
    );

    // Stubbing JobScheduler creation and update log method
    jobSchedulerCreateStub = sinon.stub(JobScheduler, 'create').resolves({
      updateSchedulerRunLog: sinon.stub().resolves()
    });
  });

  afterEach(function () {
    consoleInfoStub.restore();
    consoleErrorStub.restore();
    stubSELECT.restore();
    stubUPDATE.restore();
    notificationSendStub.restore();
    jobSchedulerCreateStub.restore();
    getMailTitleForPoetrySlamStub.restore();
    generateMailContentForPoetrySlamStub.restore();
    stubCdsContext.restore();
  });

  it('should send notification reminders for all visits found', async function () {
    process.env['test_tenant_id'] = 'mockTenantID';
    await jobAction.handleReminderByPoetrySlamID(
      reqMock,
      'mockPoetrySlamID',
      txMock
    );

    delete process.env['test_tenant_id'];
    // Validate notification sending and job status text update
    expect(notificationSendStub.calledOnce).to.be.true;
    expect(getMailTitleForPoetrySlamStub.calledOnce).to.be.true;
    expect(generateMailContentForPoetrySlamStub.calledOnce).to.be.true;
    expect(txMock.run.calledOnce).to.be.true;
    expect(txMock.commit.notCalled).to.be.true;
    expect(txMock.rollback.notCalled).to.be.true;
    expect(stubUPDATE.calledOnce).to.be.true;
    expect(consoleInfoStub.notCalled).to.be.true;
    expect(jobSchedulerCreateStub.calledOnce).to.be.true;
    expect(cds.context.locale).to.equal('en');
  });

  it('should log info message when no visits are found', async function () {
    stubSELECT.returns({
      columns: function () {
        return this;
      },
      where: function () {
        return [];
      } // Simulating no visits found
    });

    await jobAction.handleReminderByPoetrySlamID(
      reqMock,
      'mockPoetrySlamID',
      txMock
    );

    // Validate logging behavior and no notification sending
    expect(
      consoleInfoStub.calledOnceWithExactly(
        'ACTION handleReminderByPoetrySlamID: No Visits found.'
      )
    ).to.be.true;
    expect(notificationSendStub.notCalled).to.be.true;
    expect(txMock.run.calledOnce).to.be.true;
    expect(txMock.commit.notCalled).to.be.true;
    expect(txMock.rollback.notCalled).to.be.true;
    expect(cds.context.locale).to.equal('en');
  });
});
