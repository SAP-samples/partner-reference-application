//Service for Job Scheduler
@(requires: ['JobScheduler'])
service JobSchedulerService @(
  path: 'jobschedulerservice',
  impl: './jobSchedulerServiceImplementation.js'
) {
  action sendEmailReminder(poetrySlamID : String(255), date : DateTime);
  action generateConsumerJobs();
}
