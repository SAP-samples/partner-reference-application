//Service for Job Scheduler
service JobSchedulerService @(requires: 'JobScheduler')@(
  path: 'jobschedulerservice',
  impl: './jobSchedulerServiceImplementation.js'
) {
  action sendEmailReminder @(requires: 'JobScheduler')(poetrySlamID : String(255), date : DateTime);
  action generateConsumerJobs @(requires: 'JobScheduler')();
}
