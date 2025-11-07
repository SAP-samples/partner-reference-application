'use strict';

const jobSchedulerClient = require('@sap/jobs-client');
const serviceCredentialsUtil = require('./serviceCredentials');

const { httpRequestMethod } = require('./codes');

class JobScheduler {
  static SCHEDULE_DESCRIPTION_IMMEDIATELY = 'Immediately';
  static SCHEDULE_TIME_PATTERN_NOW = 'now';

  // ----------------------------------------------------------------------------
  //  Job scheduler constructor
  // ----------------------------------------------------------------------------
  constructor(req, consumerId) {
    this.req = req;
    this.consumerId = consumerId;
    this.service_url =
      serviceCredentialsUtil.getServiceCredentials('jobscheduler')?.url;
  }

  static async create(req, consumerId) {
    const jobScheduler = new JobScheduler(req, consumerId);
    await jobScheduler.initialize();
    return jobScheduler;
  }

  async initialize() {
    try {
      this.jwt = await serviceCredentialsUtil.getServiceToken(
        'jobscheduler',
        this.consumerId
      );
      this.jobSchedulerClient = new jobSchedulerClient.Scheduler({
        baseURL: this.service_url,
        token: this.jwt
      });
    } catch (e) {
      console.error(
        `JobScheduler initialze: Error retrieving jwt ${e.message}`
      );
      throw e;
    }
  }
  // ----------------------------------------------------------------------------
  //  Trigger a background job
  // ----------------------------------------------------------------------------
  async startJob(jobName, scheduleData, actionName) {
    let job;
    let schedule;
    try {
      job = await this.getJobByName(jobName);
      // Check if a schedule exists for the job
      schedule = await this.getJobSchedule(
        job._id,
        scheduleData?.data?.poetrySlamID
      );
      if (!schedule) {
        // No schedule exists, create one
        await this.createJobSchedule(job._id, scheduleData);
        console.log(
          `JobScheduler: New schedule created successfully for job: ${jobName}`
        );
        return job._id;
      } else {
        // Schedule exists, update it
        await this.updateJobSchedule(
          job._id,
          schedule.scheduleId,
          scheduleData
        );
        console.log(
          `JobScheduler: Schedule updated successfully for job: '${jobName}`
        );
        return job._id;
      }
    } catch (error) {
      console.error(`JobScheduler: Error processing job ${error.message}.`);
    }

    if (!job) {
      // Create a new job for the tenant if none exists
      try {
        const newJob = await this.createJob(jobName, scheduleData, actionName);
        console.log(`JobScheduler: New job created successfully: ${newJob}`);
        return newJob._id;
      } catch (error) {
        console.error(`JobScheduler: Error creating new job: ${error.message}`);
      }
    }
  }

  // The following methods call the API from @sap/jobs-client.
  // Since the API only provides callback functions, the calls are made
  // using a Promise pattern.

  // ----------------------------------------------------------------------------
  // Retrieve the job by name and filter by tenant ID
  // ----------------------------------------------------------------------------
  async getJobByName(jobName) {
    const req = { name: jobName, tenantId: this.consumerId };
    return await new Promise((resolve, reject) => {
      this.jobSchedulerClient.fetchJob(req, (error, result) => {
        if (error) {
          console.error(
            `JobScheduler: Error retrieving jobs: ${error.message}`
          );
          reject(error);
        } else {
          console.log(
            `JobScheduler: Jobs fetched successfully: ${result.message}`
          );
          resolve(result);
        }
      });
    });
  }

  // ----------------------------------------------------------------------------
  // Retrieve schedule data to job
  // ----------------------------------------------------------------------------
  async getJobSchedule(jobID, poetrySlamID) {
    const req = { jobId: jobID };
    return await new Promise((resolve, reject) => {
      this.jobSchedulerClient.fetchJobSchedules(req, (error, result) => {
        if (error) {
          console.error(
            `JobScheduler: Error retrieving all schedules: ${error.message}`
          );
          reject(error);
        } else {
          let resultSchedule;
          if (poetrySlamID) {
            // Search for a schedule that has the given description and poetrySlamID
            resultSchedule = result.results.find((s) => {
              try {
                const data = JSON.parse(s.data);
                return data.poetrySlamID === poetrySlamID;
              } catch (e) {
                console.error(
                  `JobScheduler: Error parsing schedule data JSON: ${e.message}`
                );
                return false;
              }
            });
          } else {
            // Search for a schedule that has the given description
            resultSchedule = result.results.find(
              (s) =>
                s.description === JobScheduler.SCHEDULE_DESCRIPTION_IMMEDIATELY
            );
          }
          resolve(resultSchedule);
        }
      });
    });
  }

  // ----------------------------------------------------------------------------
  // Update schedule data
  // ----------------------------------------------------------------------------
  async updateJobSchedule(jobID, scheduleID, scheduleData) {
    const req = {
      jobId: jobID,
      scheduleId: scheduleID,
      schedule: scheduleData
    };
    return await new Promise((resolve, reject) => {
      this.jobSchedulerClient.updateJobSchedule(req, (error, result) => {
        if (error) {
          console.error(
            `JobScheduler: Error updating job schedule: ${error.message}`
          );
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  // ----------------------------------------------------------------------------
  // Create new schedule data
  // ----------------------------------------------------------------------------
  async createJobSchedule(jobID, scheduleData) {
    const req = { jobId: jobID, schedule: scheduleData };
    return await new Promise((resolve, reject) => {
      this.jobSchedulerClient.createJobSchedule(req, (error, result) => {
        if (error) {
          console.error(
            `JobScheduler: Error creating job schedule: ${error.message}`
          );
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  // ----------------------------------------------------------------------------
  // Get run logs of schedule
  // ----------------------------------------------------------------------------
  async getSchedulerRunLogs(jobID, scheduleId) {
    const req = {
      jobId: jobID,
      scheduleId: scheduleId,
      page_size: 15,
      offset: 0
    };
    return await new Promise((resolve, reject) => {
      this.jobSchedulerClient.getRunLogs(req, function (error, result) {
        if (error) {
          console.error(
            `JobScheduler: Error retrieving run logs: ${error.message}`
          );
          reject(error);
        } else {
          resolve(result); //Run log retrieved successfully
        }
      });
    });
  }

  // ----------------------------------------------------------------------------
  // Update run log of schedule
  // ----------------------------------------------------------------------------
  async updateSchedulerRunLog(jobID, scheduleID, runID, data) {
    const req = {
      jobId: jobID,
      scheduleId: scheduleID,
      runId: runID,
      data: data
    };
    return await new Promise((resolve, reject) => {
      this.jobSchedulerClient.updateJobRunLog(req, function (error, result) {
        if (error) {
          console.error(
            `JobScheduler: Error updating run log: ${error.message}`
          );
          reject(error);
        } else {
          resolve(result); //Run log updated successfully
        }
      });
    });
  }

  // ----------------------------------------------------------------------------
  // Create job with schedule data
  // ----------------------------------------------------------------------------
  async createJob(jobName, scheduleData, actionName) {
    const appUrl = serviceCredentialsUtil.getAppUrl();
    const actionEndpointURL = `${appUrl}/odata/v4/jobschedulerservice/${actionName}`;
    const jobData = {
      job: {
        name: jobName,
        description: 'One-time job to send reminder',
        action: actionEndpointURL,
        active: true,
        httpMethod: httpRequestMethod.post,
        ansConfig: {
          onError: true,
          onSuccess: false
        },
        schedules: [scheduleData]
      }
    };
    return await new Promise((resolve, reject) => {
      this.jobSchedulerClient.createJob(jobData, (error, result) => {
        if (error) {
          console.error(
            `JobScheduler: Error registering new job: ${error.message}`
          );
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}

// ----------------------------------------------------------------------------
// Publish class
// ----------------------------------------------------------------------------
module.exports = JobScheduler;
