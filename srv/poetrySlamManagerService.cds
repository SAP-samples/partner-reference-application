using {sap.samples.poetryslams as poetrySlamManagerModel} from '../db/poetrySlamManagerModel';
using sap from '@sap/cds/common';

//Service for Poetry Slam Applications for role PoetrySlamManager
service PoetrySlamManager @(
    path: 'poetryslammanager',
    impl: './poetrySlamManagerServiceImplementation.js'
) {

    // ----------------------------------------------------------------------------
    // Entity inclusions

    // Poetry Slams (draft enabled)
    @odata.draft.enabled
    entity PoetrySlams as
        select from poetrySlamManagerModel.PoetrySlams {
            // Selects all fields of the PoetrySlams domain model,
            *,
            maxVisitorsNumber - freeVisitorSeats as bookedSeats       : Integer @title: '{i18n>bookedSeats}',
            // Relevant for coloring of status in UI to show criticality
            virtual null                         as statusCriticality : Integer
        } actions {

            // Action: Cancel
            @(
                // Defines that poetryslam entitiy is affected and targeted by the action
                Common.SideEffects             : {TargetProperties: [
                    'poetryslam/status_code',
                    'poetryslam/statusCriticality'
                ]},
                // Determines that poetryslam entitiy is used when the action is performed
                cds.odata.bindingparameter.name: 'poetryslam'
            )
            action cancel()  returns PoetrySlams;

            // Action: Publish
            @(
                // Defines that poetryslam entity is affected and targeted by the action
                Common.SideEffects             : {TargetProperties: [
                    'poetryslam/status_code',
                    'poetryslam/statusCriticality'
                ]},
                // Determines that poetryslam entitiy is used when the action is performed
                cds.odata.bindingparameter.name: 'poetryslam'
            )
            action publish() returns PoetrySlams;
        };

    // Visitors
    @readonly
    entity Visitors    as
        projection on poetrySlamManagerModel.Visitors {
            * // Selects all fields of the Visitors database model
        };

    // Visits
    entity Visits      as
        projection on poetrySlamManagerModel.Visits {
            *, // Selects all fields of the Visits database model
            virtual null as statusCriticality : Integer @title: '{i18n>statusCriticality}'
        } actions {
            // Action: Cancel Visit
            @(
                Common.SideEffects             : {TargetProperties: [
                    'visits/statusCriticality',
                    'visits/status_code',
                    'visits/parent/status_code',
                    'visits/parent/statusCriticality',
                    'visits/parent/freeVisitorSeats',
                    'visits/parent/bookedSeats'
                ]},
                cds.odata.bindingparameter.name: 'visits'
            )
            action cancelVisit()  returns Visits;

            // Action: Confirm Visit
            @(
                Common.SideEffects             : {TargetProperties: [
                    'visits/statusCriticality',
                    'visits/status_code',
                    'visits/parent/status_code',
                    'visits/parent/statusCriticality',
                    'visits/parent/freeVisitorSeats',
                    'visits/parent/bookedSeats'
                ]},
                cds.odata.bindingparameter.name: 'visits'
            )
            action confirmVisit() returns Visits;
        };

    // Currencies
    entity Currencies  as projection on sap.common.Currencies;

    // ----------------------------------------------------------------------------
    // Function to get user information (example for entity-independend function)

    type userRoles {
        identified    : Boolean;
        authenticated : Boolean;
    };

    type user {
        id     : String;
        locale : String;
        roles  : userRoles;
    };

    function userInfo() returns user;
}
