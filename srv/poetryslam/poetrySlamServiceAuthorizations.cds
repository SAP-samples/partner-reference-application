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
