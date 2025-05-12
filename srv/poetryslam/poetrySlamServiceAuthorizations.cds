using {PoetrySlamService} from './poetrySlamService';

// ----------------------------------------------------------------------------
// Required authorization roles
annotate PoetrySlamService with @(requires: [
  // Full authorization for managers
  'PoetrySlamFull',
  // Restricted access for visitors
  'PoetrySlamRestricted',
  // Read-only access for APIs
  'PoetrySlamReadonly'
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
  },
  {
    // Read-only access
    grant: ['READ'],
    to   : 'PoetrySlamReadonly'
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
  },
  {
    // Read-only access
    grant: ['READ'],
    to   : 'PoetrySlamReadonly'
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
  },
  {
    // Read-only access
    grant: ['READ'],
    to   : 'PoetrySlamReadonly'
  }
]);

// SAP Business ByDesign projects: Managers can read remote projects (create is done using the remote service, not the projection in the PoetrySlamService)
annotate PoetrySlamService.ByDProjects with @(restrict: [{
  grant: ['READ'],
  to   : 'PoetrySlamFull'
}]);

// S/4 projects: Managers can read remote projects (create is done using the remote service, not the projection in the PoetrySlamService)
annotate PoetrySlamService.S4HCProjects with @(restrict: [{
  grant: ['READ'],
  to   : 'PoetrySlamFull'
}]);

// SAP Business One purchase orders: Managers can read remote purchase orders (create is done using the remote service, not the projection in the PoetrySlamService)
annotate PoetrySlamService.B1PurchaseOrder with @(restrict: [{
  grant: ['READ'],
  to   : 'PoetrySlamFull'
}]);
