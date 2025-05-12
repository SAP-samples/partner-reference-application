using {sap.samples.poetryslams as poetrySlamManagerModel} from '../../db/poetrySlamManagerModel';
using sap from '@sap/cds/common';

//Service for Poetry Slam Applications for role PoetrySlamManager
service PoetrySlamService @(
  path: 'poetryslamservice',
  impl: './poetrySlamServiceImplementation.js'
) {

  // ----------------------------------------------------------------------------
  // Entity inclusions

  // Poetry Slams (draft enabled)
  @odata.draft.enabled
  @Common.SemanticObject: 'poetryslams'
  @Common.SemanticKey   : [ID]
  entity PoetrySlams as
    select from poetrySlamManagerModel.PoetrySlams {
      // Selects all fields of the PoetrySlams domain model
      *,
      maxVisitorsNumber - freeVisitorSeats as bookedSeats                  : Integer @title     : '{i18n>bookedSeats}',
      // Relevant for coloring of status in UI to show criticality
      virtual null                         as statusCriticality            : Integer @title     : '{i18n>statusCriticality}',
      virtual null                         as projectSystemName            : String  @title: '{i18n>projectSystemName}'        @odata.Type: 'Edm.String',
      // SAP Business ByDesign projects: visibility of button "Create Project in SAP Business ByDesign"
      virtual null                         as createByDProjectEnabled      : Boolean @odata.Type: 'Edm.Boolean',
      virtual null                         as isByD                        : Boolean @odata.Type: 'Edm.Boolean',
      // SAP S/4HANA Cloud projects: visibility of button "Create Project in SAP S/4HANA Cloud", code texts
      virtual null                         as createS4HCProjectEnabled     : Boolean @odata.Type: 'Edm.Boolean',
      virtual null                         as projectProfileCodeText       : String  @title: '{i18n>projectProfile}'           @odata.Type: 'Edm.String',
      virtual null                         as processingStatusText         : String  @title: '{i18n>processingStatus}'         @odata.Type: 'Edm.String',
      virtual null                         as isS4HC                       : Boolean @odata.Type: 'Edm.Boolean',
      // SAP Business One purchase order: visibility of button "Create Purchase Order in SAP Business One"
      virtual null                         as createB1PurchaseOrderEnabled : Boolean @odata.Type: 'Edm.Boolean',
      virtual null                         as purchaseOrderSystemName      : String  @title: '{i18n>purchaseOrderSystemName}'  @odata.Type: 'Edm.String',
      virtual null                         as isB1                         : Boolean @odata.Type: 'Edm.Boolean',
      virtual null                         as isJobStatusShown             : Boolean @odata.Type: 'Edm.Boolean',

      // Projection of remote service data as required by the UI
      toByDProject                                                         : Association to PoetrySlamService.ByDProjects
                                                                               on toByDProject.projectID = $self.projectID,
      toS4HCProject                                                        : Association to PoetrySlamService.S4HCProjects
                                                                               on toS4HCProject.project = $self.projectID,
      toB1PurchaseOrder                                                    : Association to PoetrySlamService.B1PurchaseOrder
                                                                               on toB1PurchaseOrder.docNum = $self.purchaseOrderID
    }
    actions {
      // Action: Cancel
      @(
        // Defines that poetryslam entity is affected and targeted by the action
        Common.SideEffects             : {TargetProperties: [
          'poetryslam/status_code',
          'poetryslam/statusCriticality'
        ]},
        // Determines that poetryslam entity is used when the action is performed
        cds.odata.bindingparameter.name: 'poetryslam'
      )
      action cancel()                     returns PoetrySlams;

      // Action: Publish
      @(
        // Defines that poetryslam entity is affected and targeted by the action
        Common.SideEffects             : {TargetProperties: [
          'poetryslam/status_code',
          'poetryslam/statusCriticality'
        ]},
        // Determines that poetryslam entity is used when the action is performed
        cds.odata.bindingparameter.name: 'poetryslam'
      )
      action publish()                    returns PoetrySlams;

      // Action: Schedule to once send E-Mail Reminder to all visitors for a specific poetry slam event
      @(
        // Determines that poetryslam entity is used when the action is performed
        cds.odata.bindingparameter.name: 'poetryslam',
        // Defines that poetryslam entity is affected and targeted by the action
        Common.SideEffects             : {TargetProperties: [
          'poetryslam/isJobStatusShown',
          'poetryslam/jobStatusText'
        ]}
      )
      action sendReminderForPoetrySlam()  returns PoetrySlams;

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
      action createByDProject()           returns PoetrySlams;

      // SAP S/4HANA Cloud projects: action to create a project in SAP S/4HANA Cloud
      @(
        Common.SideEffects             : {TargetEntities: [
          '_poetryslam',
          '_poetryslam/toS4HCProject'
        ]},
        cds.odata.bindingparameter.name: '_poetryslam'
      )
      action createS4HCProject()          returns PoetrySlams;

      // SAP Business One purchase order: action to create a purchase order in SAP Business One
      @(
        Common.SideEffects             : {TargetEntities: [
          '_poetryslam',
          '_poetryslam/toB1PurchaseOrder'
        ]},
        cds.odata.bindingparameter.name: '_poetryslam'
      )
      action createB1PurchaseOrder()      returns PoetrySlams;

      // Action: print guest list
      action printGuestList(
        @(
          title: '{i18n>selectPrintQueue}',
          mandatory: true,
          Common: {
            ValueListWithFixedValues: true,
            ValueList               : {
              $Type         : 'Common.ValueListType',
              CollectionPath: 'PrintQueues',
              Parameters    : [
                {
                  $Type            : 'Common.ValueListParameterInOut',
                  ValueListProperty: 'name',
                  LocalDataProperty: printQueue
                },
                {
                  $Type            : 'Common.ValueListParameterDisplayOnly',
                  ValueListProperty: 'descr'
                }
              ]
            },
          }
        )
        printQueue : String
      );

      @(cds.odata.bindingparameter.collection)
      action createWithAI(
        @(
          title: '{i18n>languageInput}',
          mandatory: true,
          UI.ParameterDefaultValue: 'EN',
          Common: {
            ValueListWithFixedValues: false,
            ValueList               : {
              $Type         : 'Common.ValueListType',
              CollectionPath: 'Language',
              Parameters    : [
                {
                  $Type            : 'Common.ValueListParameterInOut',
                  ValueListProperty: 'name',
                  LocalDataProperty: language,

                },
                {
                  $Type            : 'Common.ValueListParameterDisplayOnly',
                  ValueListProperty: 'code'
                },
                {
                  $Type            : 'Common.ValueListParameterDisplayOnly',
                  ValueListProperty: 'descr'
                }
              ]
            },
          }
        )
        language : String,
        @(
          title: '{i18n>tagsInput}',
          UI.Placeholder: '{i18n>placeholder}',
          mandatory: true
        )
        tags : String,
        @(
          title: '{i18n>rhymeInput}',
          UI.ParameterDefaultValue: true,
        )
        rhyme : Boolean
      )                                   returns PoetrySlams;
      // ERP systems: action to clear the project data
      @(
        Common.SideEffects             : {TargetEntities: [
          '_poetryslam',
          '_poetryslam/toS4HCProject',
          '_poetryslam/toByDProject'
        ]},
        cds.odata.bindingparameter.name: '_poetryslam'
      )
      action clearProjectData();

      // SAP Business One purchase order: action to clear the purchase order data
      @(
        Common.SideEffects             : {TargetEntities: [
          '_poetryslam',
          '_poetryslam/toB1PurchaseOrder'
        ]},
        cds.odata.bindingparameter.name: '_poetryslam'
      )
      action clearPurchaseOrderData();
    };

  // PrintQueues (virtual entity for value help)
  @readonly
  @cds.persistence.skip
  entity PrintQueues {
    key name  : String;
        descr : String;
  };

  // Visitors
  @readonly
  @Common.SemanticObject: 'visitors'
  @Common.SemanticKey   : [ID]
  entity Visitors    as
    projection on poetrySlamManagerModel.Visitors {
      * // Selects all fields of the Visitors database model
    };

  // Visits
  @Common.SemanticObject: 'visits'
  @Common.SemanticKey   : [ID]
  entity Visits      as
    projection on poetrySlamManagerModel.Visits {
      *, // Selects all fields of the Visits database model
      virtual null as statusCriticality : Integer @title: '{i18n>statusCriticality}'
    }
    actions {
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

      // Action: Inform a specific visitor about the event
      action sendEMail();
    };

  // Generated PDF document with SAP Forms Service by Adobe
  @readonly
  @cds.persistence.skip
  entity PDFDocument {
    key ID        : UUID;
        content   : LargeBinary @Core.MediaType  : mediaType;
        mediaType : String      @Core.IsMediaType: true;
  }

  // Currencies
  entity Currencies  as projection on sap.common.Currencies;
  
  // Languages
  entity Language    as projection on sap.common.Languages;

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

  function userInfo()       returns user;

  @Common.SideEffects: {TargetEntities: ['/PoetrySlamService.EntityContainer/PoetrySlams']}
  action   createTestData() returns Boolean;
}

// -------------------------------------------------------------------------------
// Extend service PoetrySlamService by SAP Business ByDesign projects
using {byd_khproject as RemoteByDProject} from '../external/byd_khproject';

extend service PoetrySlamService with {
  entity ByDProjects     as
    projection on RemoteByDProject.ProjectCollection {
      key ObjectID                       as ID,
          ProjectID                      as projectID,
          ProjectTypeCodeText            as typeCodeText,
          ProjectLifeCycleStatusCodeText as statusCodeText,
          ResponsibleCostCentreID        as costCenter,
          PlannedStartDateTime           as startDateTime,
          PlannedEndDateTime             as endDateTime
    }
};

// -------------------------------------------------------------------------------
// Extend service PoetrySlamService by S/4 projects

using {S4HC_API_ENTERPRISE_PROJECT_SRV_0002 as RemoteS4HCProject} from '../external/S4HC_API_ENTERPRISE_PROJECT_SRV_0002';

extend service PoetrySlamService with {
  entity S4HCProjects    as
    projection on RemoteS4HCProject.A_EnterpriseProject {
      key ProjectUUID           as projectUUID,
          Project               as project,
          ProjectDescription    as projectDescription,
          ResponsibleCostCenter as responsibleCostCenter,
          ProjectStartDate      as projectStartDate,
          ProjectEndDate        as projectEndDate,
          ProjectProfileCode    as projectProfileCode,
          ProcessingStatus      as processingStatus,
    }
};

// -------------------------------------------------------------------------------
// Extend service PoetrySlamService by SAP Business One Purchase Orders

using {b1_sbs_v2 as RemoteB1} from '../external/b1_sbs_v2';

extend service PoetrySlamService with {
  entity B1PurchaseOrder as
    projection on RemoteB1.PurchaseOrders {
      key DocEntry     as docEntry,
          DocNum       as docNum,
          DocDueDate   as docDueDate,
          CreationDate as creationDate,
          DocTotal     as docTotal,
          DocCurrency  as docCurrency
    }
}
