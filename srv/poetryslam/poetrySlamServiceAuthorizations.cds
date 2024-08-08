using {PoetrySlamService} from './poetrySlamService';

// ----------------------------------------------------------------------------
// Required authorization roles
annotate PoetrySlamService with @(requires: [
  'PoetrySlamFull', // Full authorization for managers
  'PoetrySlamRestricted' // Restricted access for visitors
]);

// ----------------------------------------------------------------------------
// Restriction per authorization role:
annotate PoetrySlamService.PoetrySlams with @(restrict: [
  {
    // Managers can change all poetry slams, create new, detele and execute the actions
    grant: ['*'],
    to   : 'PoetrySlamFull'
  },
  {
    // Visitors can read the poetry slams that are published or booked
    grant: ['READ'],
    to   : 'PoetrySlamRestricted',
    where: 'status_code = 2 or status_code = 3'
  }
]);

annotate PoetrySlamService.Visitors with @(restrict: [
  {
    // Managers can change all visitors, create new and delete
    grant: ['*'],
    to   : 'PoetrySlamFull'
  },
  {
    // Visitors can read their own data
    grant: ['READ'],
    to   : 'PoetrySlamRestricted',
    where: 'createdBy = $user'
  }
]);

annotate PoetrySlamService.Visits with @(restrict: [
  {
    // Managers can read all visits, add new visits and ...
    grant: ['*'],
    to   : 'PoetrySlamFull'
  },
  {
    // Visitors can read their own visits and artists ...
    grant: ['READ'],
    to   : 'PoetrySlamRestricted',
    where: 'createdBy = $user or artistIndicator=true'
  }
]);

// SAP Business ByDesign projects: Managers can read and create remote projects
annotate PoetrySlamService.ByDProjects with @(restrict: [{
  grant: ['*'],
  to   : 'PoetrySlamFull'
}]);

annotate PoetrySlamService.ByDProjectSummaryTasks with @(restrict: [{
  grant: ['*'],
  to   : 'PoetrySlamFull'
}]);

annotate PoetrySlamService.ByDProjectTasks with @(restrict: [{
  grant: ['*'],
  to   : 'PoetrySlamFull'
}]);

// S/4 projects: Managers can read and create remote projects
annotate PoetrySlamService.S4HCProjects with @(restrict: [{
  grant: ['*'],
  to   : 'PoetrySlamFull'
}]);

annotate PoetrySlamService.S4HCEnterpriseProjectElement with @(restrict: [{
  grant: ['*'],
  to   : 'PoetrySlamFull'
}]);

annotate PoetrySlamService.S4HCEntProjTeamMember with @(restrict: [{
  grant: ['*'],
  to   : 'PoetrySlamFull'
}]);

annotate PoetrySlamService.S4HCEntProjEntitlement with @(restrict: [{
  grant: ['*'],
  to   : 'PoetrySlamFull'
}]);

annotate PoetrySlamService.S4HCProjectsProjectProfileCode with @(restrict: [{
  grant: ['*'],
  to   : 'PoetrySlamFull'
}]);

annotate PoetrySlamService.S4HCProjectsProcessingStatus with @(restrict: [{
  grant: ['*'],
  to   : 'PoetrySlamFull'
}]);

// SAP Business One purchase orders: Managers can read and create remote purchase orders
annotate PoetrySlamService.B1PurchaseOrder with @(restrict: [{
  grant: ['*'],
  to   : 'PoetrySlamFull'
}]);
