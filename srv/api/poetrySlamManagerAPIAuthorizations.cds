using {PoetrySlamManagerAPIService} from './poetrySlamManagerAPI';

// ----------------------------------------------------------------------------
// Required authorization roles
annotate PoetrySlamManagerAPIService with @(requires: [
  // Full authorization for managers
  'PoetrySlamFull',
  // Restricted access for visitors
  'PoetrySlamRestricted',
  // Read-only access for APIs
  'PoetrySlamReadonly'
]);

// ----------------------------------------------------------------------------
// Restriction per authorization role:
annotate PoetrySlamManagerAPIService.PoetrySlams with @(restrict: [
  {
    // Managers can read and change all poetry slams
    grant: [
      'READ',
      'UPDATE'
    ],
    to   : 'PoetrySlamFull'
  },
  {
    // Read-only access
    grant: ['READ'],
    to   : 'PoetrySlamReadonly'
  }
]);

annotate PoetrySlamManagerAPIService.Visitors with @(restrict: [{
  // Read-only access
  grant: ['READ'],
  to   : [
    'PoetrySlamFull',
    'PoetrySlamReadonly'
  ]
}]);

annotate PoetrySlamManagerAPIService.Visits with @(restrict: [{
  // Read-only access
  grant: ['READ'],
  to   : [
    'PoetrySlamFull',
    'PoetrySlamReadonly'
  ]
}]);
