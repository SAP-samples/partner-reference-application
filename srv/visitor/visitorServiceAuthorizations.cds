using {VisitorService} from './visitorService';

// ----------------------------------------------------------------------------
// Required authorization roles
annotate VisitorService with @(requires: ['PoetrySlamFull' // Full authorization for managers
]);

annotate VisitorService.Visitors with @(restrict: [{
  // Managers can change all visitors, create new and delete
  grant: ['*'],
  to   : 'PoetrySlamFull'
}]);

annotate VisitorService.PoetrySlams with @(restrict: [{
  // Managers can read all data
  grant: ['READ'],
  to   : 'PoetrySlamFull'
}]);

annotate VisitorService.Visits with @(restrict: [{
  // Managers can read all data
  grant: ['READ'],
  to   : 'PoetrySlamFull'
}]);
