'use strict';

const cds = require('@sap/cds');
const { expect } = cds.test(__dirname + '/../../..');
const sinon = require('sinon');

// Jobs client package
const jobSchedulerClient = require('@sap/jobs-client');

// Lib reuse files
const JobScheduler = require('../../../srv/lib/jobScheduler');
const serviceCredentials = require('../../../srv/lib/serviceCredentials');

describe('JobScheduler Class - initialize Method', () => {
  let serviceCredentialsStub;
  let errorLogStub;

  beforeEach(() => {
    // Stub to simulate service credentials with a URL
    serviceCredentialsStub = sinon
      .stub(serviceCredentials, 'getServiceCredentials')
      .returns({
        url: 'http://example.com'
      });
    errorLogStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    // Restore all stubs back to their original methods
    serviceCredentialsStub.restore();
    errorLogStub.restore();
  });

  describe('JobScheduler Class - initialize method success', () => {
    let serviceTokenStub;

    beforeEach(() => {
      // Stub to simulate getting a JWT token
      serviceTokenStub = sinon
        .stub(serviceCredentials, 'getServiceToken')
        .resolves('mockToken');
    });

    afterEach(() => {
      serviceTokenStub.restore();
    });

    it('should initialize jobSchedulerClient with JWT and service URL', async () => {
      const jobScheduler = await JobScheduler.create({}, 'mockConsumerID');

      // Validate that the jobScheduler has correct JWT and jobSchedulerClient initialized
      expect(jobScheduler.jwt).to.equal('mockToken');
      expect(jobScheduler.jobSchedulerClient).to.be.instanceOf(
        jobSchedulerClient.Scheduler
      );
      expect(serviceCredentialsStub.calledOnce).to.be.true;
      expect(serviceTokenStub.calledOnce).to.be.true;
      expect(jobScheduler.jobSchedulerClient._accessToken).to.equal(
        'mockToken'
      );
    });
  });

  describe('JobScheduler Class - initialize method failure', () => {
    let serviceTokenStub;

    beforeEach(() => {
      // Stub to simulate getting a JWT token
      serviceTokenStub = sinon
        .stub(serviceCredentials, 'getServiceToken')
        .rejects();
    });

    afterEach(() => {
      serviceTokenStub.restore();
    });

    it('should throw an error if initialization fails', async () => {
      try {
        await JobScheduler.create({}, 'mockConsumerID');
      } catch (error) {
        expect(error.message).to.equal('Error');
        expect(serviceCredentialsStub.calledOnce).to.be.true;
        expect(errorLogStub.calledOnce).to.be.true;
      }
    });
  });
});

describe('JobScheduler Class - startJob Method', () => {
  let jobScheduler;
  let getJobByNameStub;
  let getJobScheduleStub;
  let createJobScheduleStub;
  let updateJobScheduleStub;
  let createJobStub;
  let errorLogStub;
  let serviceCredentialsStub;
  let serviceTokenStub;
  let stubConsoleLog;

  beforeEach(async () => {
    // Stub to simulate service credentials with a URL
    serviceCredentialsStub = sinon
      .stub(serviceCredentials, 'getServiceCredentials')
      .returns({
        url: 'http://example.com'
      });
    errorLogStub = sinon.stub(console, 'error');
    serviceTokenStub = sinon
      .stub(serviceCredentials, 'getServiceToken')
      .resolves('mockToken');

    // Create instance of JobScheduler with dummy data
    jobScheduler = await JobScheduler.create({}, 'mockConsumerID');

    // Stub methods that interact with job scheduler
    getJobByNameStub = sinon.stub(jobScheduler, 'getJobByName');
    getJobScheduleStub = sinon.stub(jobScheduler, 'getJobSchedule');
    createJobScheduleStub = sinon.stub(jobScheduler, 'createJobSchedule');
    updateJobScheduleStub = sinon.stub(jobScheduler, 'updateJobSchedule');
    createJobStub = sinon.stub(jobScheduler, 'createJob');
    stubConsoleLog = sinon.stub(console, 'log');
  });

  afterEach(() => {
    // Restore all the stubs back to their original methods
    getJobByNameStub.restore();
    getJobScheduleStub.restore();
    createJobScheduleStub.restore();
    updateJobScheduleStub.restore();
    createJobStub.restore();
    serviceCredentialsStub.restore();
    errorLogStub.restore();
    serviceTokenStub.restore();
    stubConsoleLog.restore();
  });

  it('should create a new schedule if not existing', async () => {
    const jobId = 'mockJobID';
    const scheduleId = 'mockScheduleID';

    // Simulating that a job was found, but no schedule exists
    getJobByNameStub.resolves({ _id: jobId });
    getJobScheduleStub.resolves(null);
    createJobScheduleStub.resolves({ scheduleId });

    const result = await jobScheduler.startJob('newJob', {}, 'anAction');

    // Assert that createJobSchedule was called once and returned the correct ids
    expect(createJobScheduleStub.calledOnce).to.be.true;
    expect(createJobScheduleStub.calledWithExactly(jobId, {})).to.be.true;

    // Assert that correct jobId and scheduleId are returned
    expect(result).to.deep.equal(jobId);

    // Verify that the correct log message was produced
    expect(stubConsoleLog.calledOnce).to.be.true;
  });

  it('should update an existing schedule', async () => {
    const jobId = 'mockJobID';
    const scheduleId = 'mockScheduleID';

    // Simulating that a job and an existing schedule were found
    getJobByNameStub.resolves({ _id: jobId });
    getJobScheduleStub.resolves({ scheduleId: scheduleId });
    updateJobScheduleStub.resolves({ scheduleId });

    const result = await jobScheduler.startJob('updateJob', {}, 'anAction');

    // Assert that updateJobSchedule was called once and returned the correct ids
    expect(updateJobScheduleStub.calledOnce).to.be.true;
    expect(updateJobScheduleStub.calledWithExactly(jobId, scheduleId, {})).to.be
      .true;

    // Assert that correct jobId and scheduleId are returned
    expect(result).to.deep.equal(jobId);

    // Verify that the correct log message was produced
    expect(
      stubConsoleLog.calledOnceWithExactly(
        `JobScheduler: Schedule updated successfully for job: 'updateJob`
      )
    ).to.be.true;
  });

  it('should create a new job if none exists', async () => {
    const jobId = 'mockNewJobId';
    const scheduleId = 'mockNewScheduleId';

    // Simulating that no job was found initially
    getJobByNameStub.resolves(null);
    createJobStub.resolves({
      _id: jobId,
      schedules: [{ scheduleId }]
    });
    const newJob = {
      _id: jobId,
      schedules: [{ scheduleId }]
    };

    const result = await jobScheduler.startJob('noExistingJob', {}, 'anAction');

    // Assert that createJob was called once
    expect(createJobStub.calledOnce).to.be.true;

    // Assert that correct jobId and scheduleId are returned
    expect(result).to.deep.equal(jobId);

    // Verify that the correct log message was produced
    expect(
      stubConsoleLog.calledOnceWithExactly(
        `JobScheduler: New job created successfully: ${newJob}`
      )
    ).to.be.true;
  });
});

describe('JobScheduler Class - getJobByName Method', () => {
  let jobScheduler;
  let fetchJobStub;
  let consoleErrorStub;

  beforeEach(async () => {
    // Stub to simulate service credentials with a URL
    sinon.stub(serviceCredentials, 'getServiceCredentials').returns({
      url: 'http://example.com'
    });
    sinon.stub(serviceCredentials, 'getServiceToken').resolves('mockToken');
    // Create instance of JobScheduler for testing
    jobScheduler = await JobScheduler.create({}, 'mockConsumerID');

    // Stub jobSchedulerClient.fetchJob method
    fetchJobStub = sinon.stub(jobScheduler.jobSchedulerClient, 'fetchJob');

    // Stub console.log and console.error to verify logging
    sinon.stub(console, 'log');
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    // Restore all the stubs back to their original methods
    sinon.restore();
  });

  it('should fetch job successfully and log the result', async () => {
    const jobName = 'mockJobName';
    const jobResult = { message: 'Success!', _id: 'mockJobID' };

    // Simulate successful job fetching
    fetchJobStub.callsArgWith(1, null, jobResult);

    const result = await jobScheduler.getJobByName(jobName);

    // Assert that fetchJob was called
    expect(fetchJobStub.calledOnce).to.be.true;

    // Verify the correct job result and log message were produced
    expect(result).to.deep.equal(jobResult);
    expect(result).to.equal(jobResult);
  });

  it('should log an error if fetching job fails', async () => {
    const jobName = 'mockJobName';
    const errorMsg = 'Fetch Error';

    // Simulate an error during job fetching
    fetchJobStub.callsArgWith(1, new Error(errorMsg));

    await expect(jobScheduler.getJobByName(jobName)).to.rejected;
    expect(fetchJobStub.calledOnce).to.be.true;

    // Verify the correct error message was logged
    expect(
      consoleErrorStub.calledOnceWithExactly(
        `JobScheduler: Error retrieving jobs: Fetch Error`
      )
    ).to.be.true;
  });
});

describe('JobScheduler Class - getJobSchedule Method', () => {
  let jobScheduler;
  let fetchJobSchedulesStub;
  let consoleErrorStub;

  beforeEach(async () => {
    // Stub to simulate service credentials with a URL
    sinon.stub(serviceCredentials, 'getServiceCredentials').returns({
      url: 'http://example.com'
    });
    sinon.stub(serviceCredentials, 'getServiceToken').resolves('mockToken');
    // Create an instance of JobScheduler for testing
    jobScheduler = await JobScheduler.create({}, 'mockConsumerID');

    // Stub jobSchedulerClient.fetchJobSchedules method
    fetchJobSchedulesStub = sinon.stub(
      jobScheduler.jobSchedulerClient,
      'fetchJobSchedules'
    );

    // Stub console.log and console.error to verify logging
    sinon.stub(console, 'log');
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    // Restore all the stubs back to their original methods
    sinon.restore();
  });

  it('should retrieve schedule successfully with poetrySlamID', async () => {
    const jobID = 'mockJobID';
    const poetrySlamID = 'mockPoetrySlamID';
    const mockSchedule = {
      description: 'mockDescription',
      data: JSON.stringify({ poetrySlamID })
    };

    // Simulate successful schedule retrieval
    fetchJobSchedulesStub.callsArgWith(1, null, { results: [mockSchedule] });

    const result = await jobScheduler.getJobSchedule(jobID, poetrySlamID);

    // Assert that fetchJobSchedules was called correctly
    expect(fetchJobSchedulesStub.calledOnce).to.be.true;

    // Verify the correct schedule is retrieved
    expect(result).to.deep.equal(mockSchedule);
  });

  it('should retrieve schedule successfully with description "Immediately"', async () => {
    const jobID = 'mockJobID';
    const mockSchedule = {
      description: 'Immediately',
      data: JSON.stringify({ poetrySlamID: 'mockDifferentID' })
    };

    // Simulate successful schedule retrieval
    fetchJobSchedulesStub.callsArgWith(1, null, { results: [mockSchedule] });

    const result = await jobScheduler.getJobSchedule(jobID);

    // Assert that fetchJobSchedules was called correctly
    expect(fetchJobSchedulesStub.calledOnce).to.be.true;

    // Verify the correct schedule is retrieved
    expect(result).to.deep.equal(mockSchedule);
  });

  it('should log an error if JSON parsing fails', async () => {
    const jobID = 'mockJobID';
    const malformedSchedule = {
      description: 'mockDescription',
      data: 'not-json'
    };

    // Simulate schedule retrieval with malformed JSON
    fetchJobSchedulesStub.callsArgWith(1, null, {
      results: [malformedSchedule]
    });

    const result = await jobScheduler.getJobSchedule(jobID, 'mockPoetrySlamID');

    // Assert that fetchJobSchedules was called correctly
    expect(fetchJobSchedulesStub.calledOnce).to.be.true;

    // Verify no schedule is returned due to JSON parsing failure
    expect(result).to.be.undefined;

    // Verify the error message for JSON parsing
    expect(consoleErrorStub.calledWithMatch(/Error parsing schedule data JSON/))
      .to.be.true;
  });

  it('should log an error if fetching schedules fails', async () => {
    const jobID = 'mockJobID';
    const errorMsg = 'Fetch Error';

    // Simulate an error during schedule fetching
    fetchJobSchedulesStub.callsArgWith(1, new Error(errorMsg));

    await expect(jobScheduler.getJobSchedule(jobID, 'mockPoetrySlamID')).to
      .rejected;
    expect(fetchJobSchedulesStub.calledOnce).to.be.true;

    // Verify the correct error message was logged
    expect(
      consoleErrorStub.calledOnceWithExactly(
        `JobScheduler: Error retrieving all schedules: ${errorMsg}`
      )
    ).to.be.true;
  });
});

describe('JobScheduler Class - updateJobSchedule Method', () => {
  let jobScheduler;
  let updateJobScheduleStub;
  let consoleErrorStub;

  beforeEach(async () => {
    // Stub to simulate service credentials with a URL
    sinon.stub(serviceCredentials, 'getServiceCredentials').returns({
      url: 'http://example.com'
    });
    sinon.stub(serviceCredentials, 'getServiceToken').resolves('mockToken');
    // Create instance of JobScheduler for testing
    jobScheduler = await JobScheduler.create({}, 'mockConsumerID');

    // Stub jobSchedulerClient.updateJobSchedule method
    updateJobScheduleStub = sinon.stub(
      jobScheduler.jobSchedulerClient,
      'updateJobSchedule'
    );

    // Stub console.log and console.error to verify logging
    sinon.stub(console, 'log');
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    // Restore all the stubs back to their original methods
    sinon.restore();
  });

  it('should update the job schedule successfully and return the result', async () => {
    const jobID = 'mockJobID';
    const scheduleID = 'mockScheduleID';
    const scheduleData = { data: 'updateData' };
    const updateResult = { success: true };

    // Simulate successful schedule update
    updateJobScheduleStub.callsArgWith(1, null, updateResult);

    const result = await jobScheduler.updateJobSchedule(
      jobID,
      scheduleID,
      scheduleData
    );

    // Assert that updateJobSchedule was called with correct arguments
    expect(updateJobScheduleStub.calledOnce).to.be.true;

    // Verify the correct result is returned
    expect(result).to.deep.equal(updateResult);
  });

  it('should log an error if schedule update fails', async () => {
    const jobID = 'mockJobID';
    const scheduleID = 'mockScheduleID';
    const scheduleData = { data: 'updateData' };
    const errorMsg = 'Update Error';

    // Simulate an error during schedule update
    updateJobScheduleStub.callsArgWith(1, new Error(errorMsg));

    await expect(
      jobScheduler.updateJobSchedule(jobID, scheduleID, scheduleData)
    ).to.rejected;
    expect(updateJobScheduleStub.calledOnce).to.be.true;

    // Verify the correct error message was logged
    expect(
      consoleErrorStub.calledOnceWithExactly(
        `JobScheduler: Error updating job schedule: ${errorMsg}`
      )
    ).to.be.true;
  });
});

describe('JobScheduler Class - createJobSchedule Method', () => {
  let jobScheduler;
  let createJobScheduleStub;
  let consoleErrorStub;

  beforeEach(async () => {
    // Stub to simulate service credentials with a URL
    sinon.stub(serviceCredentials, 'getServiceCredentials').returns({
      url: 'http://example.com'
    });
    sinon.stub(serviceCredentials, 'getServiceToken').resolves('mockToken');
    // Create instance of JobScheduler for testing
    jobScheduler = await JobScheduler.create({}, 'mockConsumerID');

    // Stub jobSchedulerClient.createJobSchedule method
    createJobScheduleStub = sinon.stub(
      jobScheduler.jobSchedulerClient,
      'createJobSchedule'
    );

    // Stub console.log and console.error to verify logging
    sinon.stub(console, 'log'); // For completeness if needed later
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    // Restore all the stubs back to their original methods
    sinon.restore();
  });

  it('should successfully create a job schedule and return the result', async () => {
    const jobID = 'mockJobID';
    const scheduleData = { data: 'scheduleData' };
    const createResult = { success: true };

    // Simulate successful schedule creation
    createJobScheduleStub.callsArgWith(1, null, createResult);

    const result = await jobScheduler.createJobSchedule(jobID, scheduleData);

    // Assert that createJobSchedule was called with correct arguments
    expect(createJobScheduleStub.calledOnce).to.be.true;

    // Verify the correct result is returned
    expect(result).to.deep.equal(createResult);
  });

  it('should log an error if job schedule creation fails', async () => {
    const jobID = 'mockJobID';
    const scheduleData = { data: 'scheduleData' };
    const errorMsg = 'Creation Error';

    // Simulate an error during schedule creation
    createJobScheduleStub.callsArgWith(1, new Error(errorMsg));

    await expect(jobScheduler.createJobSchedule(jobID, scheduleData)).to
      .rejected;
    expect(createJobScheduleStub.calledOnce).to.be.true;

    // Verify the correct error message was logged
    expect(
      consoleErrorStub.calledOnceWithExactly(
        `JobScheduler: Error creating job schedule: ${errorMsg}`
      )
    ).to.be.true;
  });
});

describe('JobScheduler Class - getJobSchedule Method', () => {
  let jobScheduler;
  let fetchJobSchedulesStub;
  let consoleErrorStub;

  beforeEach(async () => {
    // Stub to simulate service credentials with a URL
    sinon.stub(serviceCredentials, 'getServiceCredentials').returns({
      url: 'http://example.com'
    });
    sinon.stub(serviceCredentials, 'getServiceToken').resolves('mockToken');
    // Create instance of JobScheduler for testing
    jobScheduler = await JobScheduler.create({}, 'mockConsumerID');

    // Stub jobSchedulerClient.fetchJobSchedules method
    fetchJobSchedulesStub = sinon.stub(
      jobScheduler.jobSchedulerClient,
      'fetchJobSchedules'
    );

    // Stub console.log and console.error to verify logging
    sinon.stub(console, 'log');
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    // Restore all the stubs back to their original methods
    sinon.restore();
  });

  it('should retrieve the schedule successfully based on schedule description', async () => {
    const jobID = 'mockJobID';
    const mockSchedule = {
      description: 'Immediately',
      data: JSON.stringify({ poetrySlamID: 'mockDifferentID' })
    };

    // Simulate successful schedule retrieval with description
    fetchJobSchedulesStub.callsArgWith(1, null, { results: [mockSchedule] });

    const result = await jobScheduler.getJobSchedule(jobID);

    // Assert that fetchJobSchedules received the correct arguments
    expect(fetchJobSchedulesStub.calledOnce).to.be.true;

    // Verify that the correct schedule is chosen and returned
    expect(result).to.deep.equal(mockSchedule);
  });

  it('should retrieve the schedule successfully based on poetrySlamID', async () => {
    const jobID = 'mockJobID';
    const poetrySlamID = 'mockPoetrySlamID';
    const mockSchedule = {
      description: 'mockDescription',
      data: JSON.stringify({ poetrySlamID })
    };

    // Simulate successful schedule retrieval with poetrySlamID
    fetchJobSchedulesStub.callsArgWith(1, null, { results: [mockSchedule] });

    const result = await jobScheduler.getJobSchedule(jobID, poetrySlamID);

    // Assert that fetchJobSchedules was called
    expect(fetchJobSchedulesStub.calledOnce).to.be.true;

    // Verify that the correct schedule is identified and returned
    expect(result).to.deep.equal(mockSchedule);
  });

  it('should log an error if JSON parsing fails during schedule retrieval', async () => {
    const jobID = 'mockJobID';
    const malformedSchedule = {
      description: 'mockDescription',
      data: 'not-json'
    };

    // Simulate schedule retrieval leading to JSON parsing error
    fetchJobSchedulesStub.callsArgWith(1, null, {
      results: [malformedSchedule]
    });

    const result = await jobScheduler.getJobSchedule(jobID, 'mockPoetrySlamID');

    // Assert that fetchJobSchedules processed the right arguments
    expect(fetchJobSchedulesStub.calledOnce).to.be.true;

    // Verify parsing error results in undefined output
    expect(result).to.be.undefined;

    // Confirm JSON parsing error log occurrence
    expect(consoleErrorStub.calledWithMatch(/Error parsing schedule data JSON/))
      .to.be.true;
  });

  it('should log an error if fetching schedules fails', async () => {
    const jobID = 'mockJobID';
    const errorMsg = 'Fetch Error';

    // Simulate error during schedule fetching
    fetchJobSchedulesStub.callsArgWith(1, new Error(errorMsg));

    try {
      await jobScheduler.getJobSchedule(jobID, 'mockPoetrySlamID');
    } catch (error) {
      // Assert correct error handling and logging
      expect(fetchJobSchedulesStub.calledOnce).to.be.true;
      expect(error.message).to.equal(errorMsg);
      expect(
        consoleErrorStub.calledOnceWithExactly(
          `JobScheduler: Error retrieving all schedules: ${errorMsg}`
        )
      ).to.be.true;
    }
  });
});

describe('JobScheduler Class - updateSchedulerRunLog Method', () => {
  let jobScheduler;
  let updateJobRunLogStub;
  let consoleErrorStub;

  beforeEach(async () => {
    // Stub to simulate service credentials with a URL
    sinon.stub(serviceCredentials, 'getServiceCredentials').returns({
      url: 'http://example.com'
    });
    sinon.stub(serviceCredentials, 'getServiceToken').resolves('mockToken');
    // Create instance of JobScheduler for testing
    jobScheduler = await JobScheduler.create({}, 'mockConsumerID');

    // Stub jobSchedulerClient.updateJobRunLog method
    updateJobRunLogStub = sinon.stub(
      jobScheduler.jobSchedulerClient,
      'updateJobRunLog'
    );

    // Stub console.log and console.error to verify logging
    sinon.stub(console, 'log'); // For success messages
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    // Restore all the stubs back to their original methods
    sinon.restore();
  });

  it('should successfully update a run log and return the result', async () => {
    const jobID = 'mockJobID';
    const scheduleID = 'mockScheduleID';
    const runID = 'mockRunID';
    const data = { key: 'mockValue' };
    const updateResult = { success: true };

    // Simulate successful run log update
    updateJobRunLogStub.callsArgWith(1, null, updateResult);

    const result = await jobScheduler.updateSchedulerRunLog(
      jobID,
      scheduleID,
      runID,
      data
    );

    // Assert that updateJobRunLog was called
    expect(updateJobRunLogStub.calledOnce).to.be.true;

    // Verify the correct result is returned
    expect(result).to.deep.equal(updateResult);
  });

  it('should log an error if run log update fails', async () => {
    const jobID = 'mockJobID';
    const scheduleID = 'mockScheduleID';
    const runID = 'mockRunID';
    const data = { key: 'mockValue' };
    const errorMsg = 'Update Error';

    // Simulate an error during run log update
    updateJobRunLogStub.callsArgWith(1, new Error(errorMsg));

    await expect(
      jobScheduler.updateSchedulerRunLog(jobID, scheduleID, runID, data)
    ).to.rejected;
    expect(updateJobRunLogStub.calledOnce).to.be.true;

    // Verify the correct error message was logged
    expect(
      consoleErrorStub.calledOnceWithExactly(
        `JobScheduler: Error updating run log: ${errorMsg}`
      )
    ).to.be.true;
  });
});

describe('JobScheduler Class - createJob Method', () => {
  let jobScheduler;
  let createJobStub;
  let consoleErrorStub;

  beforeEach(async () => {
    // Stub to simulate service credentials with a URL
    sinon.stub(serviceCredentials, 'getServiceCredentials').returns({
      url: 'http://example.com'
    });
    sinon.stub(serviceCredentials, 'getServiceToken').resolves('mockToken');
    // Create instance of JobScheduler for testing
    jobScheduler = await JobScheduler.create({}, 'mockConsumerID');

    // Stub jobSchedulerClient.createJob method
    createJobStub = sinon.stub(jobScheduler.jobSchedulerClient, 'createJob');

    // Stub serviceCredentialsUtil.getAppUrl to return a fixed URL
    sinon.stub(serviceCredentials, 'getAppUrl').returns('http://example.com');

    // Stub console.log and console.error to verify logging
    sinon.stub(console, 'log'); // Typically used for success messages
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    // Restore all the stubs back to their original methods
    sinon.restore();
  });

  it('should successfully create a job and return the result', async () => {
    const jobName = 'mockJobName';
    const scheduleData = { frequency: 'Daily' };
    const actionName = 'sendEmailReminder';
    const createResult = { success: true };

    // Simulate successful job creation
    createJobStub.callsArgWith(1, null, createResult);

    const result = await jobScheduler.createJob(
      jobName,
      scheduleData,
      actionName
    );

    // Assert that createJob was called
    expect(createJobStub.calledOnce).to.be.true;

    // Verify that the correct result is returned
    expect(result).to.deep.equal(createResult);
  });

  it('should log an error if job creation fails', async () => {
    const jobName = 'mockJobName';
    const scheduleData = { frequency: 'Daily' };
    const actionName = 'sendEmailReminder';
    const errorMsg = 'Creation Error';

    // Simulate an error during job creation
    createJobStub.callsArgWith(1, new Error(errorMsg));

    await expect(jobScheduler.createJob(jobName, scheduleData, actionName)).to
      .rejected;
    expect(createJobStub.calledOnce).to.be.true;

    // Verify the correct error message was logged
    expect(
      consoleErrorStub.calledOnceWithExactly(
        `JobScheduler: Error registering new job: ${errorMsg}`
      )
    ).to.be.true;
  });
});
