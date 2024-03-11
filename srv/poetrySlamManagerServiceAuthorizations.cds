using {PoetrySlamManager} from './poetrySlamManagerService';

// ----------------------------------------------------------------------------
// Required authorization roles
annotate PoetrySlamManager with @(requires: [
    'PoetrySlamFull',          // Full authorization for managers
    'PoetrySlamRestricted',    // Restricted access for visitors
    'PoetrySlamReadonly'       // Read-only access for APIs
]);

// ----------------------------------------------------------------------------
// Restriction per authorization role:
annotate PoetrySlamManager.PoetrySlams with @(restrict: [
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

annotate PoetrySlamManager.Visitors with @(restrict: [
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

annotate PoetrySlamManager.Visits with @(restrict: [
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

// SAP Business ByDesign projects: Managers can read and create remote projects
annotate PoetrySlamManager.ByDProjects with @(restrict: [{
    grant: ['*'],
    to   : 'PoetrySlamFull'
}]);

annotate PoetrySlamManager.ByDProjectSummaryTasks with @(restrict: [{
    grant: ['*'],
    to   : 'PoetrySlamFull'
}]);

annotate PoetrySlamManager.ByDProjectTasks with @(restrict: [{
    grant: ['*'],
    to   : 'PoetrySlamFull'
}]);

// S/4 projects: Managers can read and create remote projects
annotate PoetrySlamManager.S4HCProjects with @(restrict: [{
    grant: ['*'],
    to   : 'PoetrySlamFull'
}]);

annotate PoetrySlamManager.S4HCEnterpriseProjectElement with @(restrict: [{
    grant: ['*'],
    to   : 'PoetrySlamFull'
}]);

annotate PoetrySlamManager.S4HCEntProjTeamMember with @(restrict: [{
    grant: ['*'],
    to   : 'PoetrySlamFull'
}]);

annotate PoetrySlamManager.S4HCEntProjEntitlement with @(restrict: [{
    grant: ['*'],
    to   : 'PoetrySlamFull'
}]);

annotate PoetrySlamManager.S4HCProjectsProjectProfileCode with @(restrict: [{
    grant: ['*'],
    to   : 'PoetrySlamFull'
}]);

annotate PoetrySlamManager.S4HCProjectsProcessingStatus with @(restrict: [{
    grant: ['*'],
    to   : 'PoetrySlamFull'
}]);

// SAP Business One purchase orders: Managers can read and create remote purchase orders
annotate PoetrySlamManager.B1PurchaseOrder with @(restrict: [{
    grant: ['*'],
    to   : 'PoetrySlamFull'
}]);
