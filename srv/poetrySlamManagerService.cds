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
    entity PoetrySlams                    as
        select from poetrySlamManagerModel.PoetrySlams
        mixin {
            // SAP Business ByDesign projects: Mix-in of SAP Business ByDesign project data
            toByDProject      : Association to RemoteByDProject.ProjectCollection
                                    on toByDProject.ProjectID = $projection.projectID;
            // SAP S/4HANA Cloud projects: Mix-in of SAP S/4HANA Cloud project data
            toS4HCProject     : Association to RemoteS4HCProject.A_EnterpriseProject
                                    on toS4HCProject.Project = $projection.projectID;
            // SAP Business One purchase orders: Mix-in of SAP Business One Purchase Order Data
            toB1PurchaseOrder : Association to RemoteB1.PurchaseOrders
                                    on toB1PurchaseOrder.DocNum = $projection.purchaseOrderID;
        }
        into {
            // Selects all fields of the PoetrySlams domain model,
            *,
            maxVisitorsNumber - freeVisitorSeats as bookedSeats                  : Integer @title     : '{i18n>bookedSeats}',
            // Relevant for coloring of status in UI to show criticality
            virtual null                         as statusCriticality            : Integer @title     : '{i18n>statusCriticality}',
            virtual null                         as projectSystemName            : String  @title     : '{i18n>projectSystemName}'        @odata.Type: 'Edm.String',
            // SAP Business ByDesign projects: visibility of button "Create Project in SAP Business ByDesign"
            virtual null                         as createByDProjectEnabled      : Boolean @odata.Type: 'Edm.Boolean',
            virtual null                         as isByD                        : Boolean @odata.Type: 'Edm.Boolean',
            toByDProject,
            // SAP S/4HANA Cloud projects: visibility of button "Create Project in SAP S/4HANA Cloud", code texts
            virtual null                         as createS4HCProjectEnabled     : Boolean @odata.Type: 'Edm.Boolean',
            virtual null                         as projectProfileCodeText       : String  @title     : '{i18n>projectProfile}'           @odata.Type: 'Edm.String',
            virtual null                         as processingStatusText         : String  @title     : '{i18n>processingStatus}'         @odata.Type: 'Edm.String',
            virtual null                         as isS4HC                       : Boolean @odata.Type: 'Edm.Boolean',
            toS4HCProject,
            // SAP Business One purchase order: visibility of button "Create Purchase Order in SAP Business One"
            virtual null                         as createB1PurchaseOrderEnabled : Boolean @odata.Type: 'Edm.Boolean',
            virtual null                         as purchaseOrderSystemName      : String  @title     : '{i18n>purchaseOrderSystemName}'  @odata.Type: 'Edm.String',
            virtual null                         as isB1                         : Boolean @odata.Type: 'Edm.Boolean',
            toB1PurchaseOrder
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
            action cancel()                returns PoetrySlams;

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
            action publish()               returns PoetrySlams;

            // SAP Business ByDesign projects: action to create a project in SAP Business ByDesign
            @(
                // Defines that poetryslam entity is affected and targeted by the action
                Common.SideEffects             : {TargetEntities: [
                    '_poetryslam',
                    '_poetryslam/toByDProject'
                ]},
                // Determines that poetryslam entity is used when the action is performed
                cds.odata.bindingparameter.name: '_poetryslam'
            )
            action createByDProject()      returns PoetrySlams;

            // SAP S/4HANA Cloud projects: action to create a project in SAP S/4HANA Cloud
            @(
                Common.SideEffects             : {TargetEntities: [
                    '_poetryslam',
                    '_poetryslam/toS4HCProject'
                ]},
                cds.odata.bindingparameter.name: '_poetryslam'
            )
            action createS4HCProject()     returns PoetrySlams;

            // SAP Business One purchase order: action to create a purchase order in SAP Business One
            @(
                Common.SideEffects             : {TargetEntities: [
                    '_poetryslam',
                    '_poetryslam/toB1PurchaseOrder'
                ]},
                cds.odata.bindingparameter.name: '_poetryslam'
            )
            action createB1PurchaseOrder() returns PoetrySlams;
        };

    // Visitors
    @readonly
    entity Visitors                       as
        projection on poetrySlamManagerModel.Visitors {
            * // Selects all fields of the Visitors database model
        };

    // Visits
    entity Visits                         as
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
    entity Currencies                     as projection on sap.common.Currencies;

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

// -------------------------------------------------------------------------------
// Extend service PoetrySlamManager by SAP Business ByDesign projects (principal propagation)
using {byd_khproject as RemoteByDProject} from './external/byd_khproject';

extend service PoetrySlamManager with {
    entity ByDProjects                    as
        projection on RemoteByDProject.ProjectCollection {
            key ObjectID                       as ID,
                ProjectID                      as projectID,
                ResponsibleCostCentreID        as costCenter,
                ProjectTypeCode                as typeCode,
                ProjectTypeCodeText            as typeCodeText,
                ProjectLifeCycleStatusCode     as statusCode,
                ProjectLifeCycleStatusCodeText as statusCodeText,
                BlockingStatusCode             as blockingStatusCode,
                PlannedStartDateTime           as startDateTime,
                PlannedEndDateTime             as endDateTime,
                ProjectSummaryTask             as summaryTask : redirected to ByDProjectSummaryTasks,
                Task                           as task        : redirected to ByDProjectTasks
        }

    entity ByDProjectSummaryTasks         as
        projection on RemoteByDProject.ProjectSummaryTaskCollection {
            key ObjectID                         as ID,
                ParentObjectID                   as parentID,
                ID                               as taskID,
                ProjectName                      as projectName,
                ResponsibleEmployeeID            as responsibleEmployee,
                ResponsibleEmployeeFormattedName as responsibleEmployeeName
        }

    entity ByDProjectTasks                as
        projection on RemoteByDProject.TaskCollection {
            key ObjectID                         as ID,
                ParentObjectID                   as parentID,
                TaskID                           as taskID,
                TaskName                         as taskName,
                PlannedDuration                  as duration,
                ResponsibleEmployeeID            as responsibleEmployee,
                ResponsibleEmployeeFormattedName as responsibleEmployeeName
        }
};

// -------------------------------------------------------------------------------
// Extend service PoetrySlamManager by S/4 projects (principal propagation)

using {S4HC_API_ENTERPRISE_PROJECT_SRV_0002 as RemoteS4HCProject} from './external/S4HC_API_ENTERPRISE_PROJECT_SRV_0002';

extend service PoetrySlamManager with {
    entity S4HCProjects                   as
        projection on RemoteS4HCProject.A_EnterpriseProject {
            key ProjectUUID                 as ProjectUUID,
                ProjectInternalID           as ProjectInternalID,
                Project                     as Project,
                ProjectDescription          as ProjectDescription,
                EnterpriseProjectType       as EnterpriseProjectType,
                ProjectStartDate            as ProjectStartDate,
                ProjectEndDate              as ProjectEndDate,
                ProcessingStatus            as ProcessingStatus,
                ResponsibleCostCenter       as ResponsibleCostCenter,
                ProfitCenter                as ProfitCenter,
                ProjectProfileCode          as ProjectProfileCode,
                CompanyCode                 as CompanyCode,
                ProjectCurrency             as ProjectCurrency,
                EntProjectIsConfidential    as EntProjectIsConfidential,
                to_EnterpriseProjectElement as to_EnterpriseProjectElement : redirected to S4HCEnterpriseProjectElement,
                to_EntProjTeamMember        as to_EntProjTeamMember        : redirected to S4HCEntProjTeamMember
        }

    entity S4HCEnterpriseProjectElement   as
        projection on RemoteS4HCProject.A_EnterpriseProjectElement {
            key ProjectElementUUID        as ProjectElementUUID,
                ProjectUUID               as ProjectUUID,
                ProjectElement            as ProjectElement,
                ProjectElementDescription as ProjectElementDescription,
                PlannedStartDate          as PlannedStartDate,
                PlannedEndDate            as PlannedEndDate
        }

    entity S4HCEntProjTeamMember          as
        projection on RemoteS4HCProject.A_EnterpriseProjectTeamMember {
            key TeamMemberUUID        as TeamMemberUUID,
                ProjectUUID           as ProjectUUID,
                BusinessPartnerUUID   as BusinessPartnerUUID,
                to_EntProjEntitlement as to_EntProjEntitlement : redirected to S4HCEntProjEntitlement
        }

    entity S4HCEntProjEntitlement         as
        projection on RemoteS4HCProject.A_EntTeamMemberEntitlement {
            key ProjectEntitlementUUID as ProjectEntitlementUUID,
                TeamMemberUUID         as TeamMemberUUID,
                ProjectRoleType        as ProjectRoleType
        }

};

// Extend service PoetrySlamManager by SAP S/4HANA Cloud Projects ProjectProfileCode
using {S4HC_ENTPROJECTPROCESSINGSTATUS_0001 as RemoteS4HCProjectProcessingStatus} from './external/S4HC_ENTPROJECTPROCESSINGSTATUS_0001';

extend service PoetrySlamManager with {
    entity S4HCProjectsProcessingStatus   as
        projection on RemoteS4HCProjectProcessingStatus.ProcessingStatus {
            key ProcessingStatus     as ProcessingStatus,
                ProcessingStatusText as ProcessingStatusText
        }
};

// Extend service PoetrySlamManager by SAP S/4HANA Cloud Projects ProcessingStatus
using {S4HC_ENTPROJECTPROFILECODE_0001 as RemoteS4HCProjectProjectProfileCode} from './external/S4HC_ENTPROJECTPROFILECODE_0001';

extend service PoetrySlamManager with {
    entity S4HCProjectsProjectProfileCode as
        projection on RemoteS4HCProjectProjectProfileCode.ProjectProfileCode {
            key ProjectProfileCode     as ProjectProfileCode,
                ProjectProfileCodeText as ProjectProfileCodeText
        }
};

// -------------------------------------------------------------------------------
// Extend service PoetrySlamManager by SAP Business One Purchase Orders

using {b1_sbs_v2 as RemoteB1} from './external/b1_sbs_v2';

extend service PoetrySlamManager with {
    entity B1PurchaseOrder                as
        projection on RemoteB1.PurchaseOrders {
            key DocEntry     as DocEntry,
                DocNum       as DocNum,
                DocType      as DocType,
                DocDate      as DocDate,
                DocDueDate   as DocDueDate,
                CreationDate as CreationDate,
                CardCode     as CardCode,
                CardName     as CardName,
                DocTotal     as DocTotal,
                DocCurrency  as DocCurrency
        }
}
