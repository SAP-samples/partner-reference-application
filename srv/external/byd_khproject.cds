/* checksum : 6e6b666341e193fec863b18ecf07b165 */
@cds.external              : true
@m.IsDefaultEntityContainer: 'true'
service byd_khproject {};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'true'
@sap.updatable       : 'true'
@sap.deletable       : 'true'
@sap.label           : 'Project'
entity byd_khproject.ProjectCollection {
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'Object ID'
  key ObjectID                             : String(70) not null;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Project ID'
      ProjectID                            : String(24);

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Project Type'
      @sap.text       : 'ProjectTypeCodeText'
      ProjectTypeCode                      : String(15);

      @sap.label      : 'Project Type Text'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      ProjectTypeCodeText                  : LargeString;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Project Language'
      @sap.text       : 'ProjectLanguageCodeText'
      ProjectLanguageCode                  : String(2);

      @sap.label      : 'Project Language Text'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      ProjectLanguageCodeText              : LargeString;

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'BillableIndicator'
      BillableIndicator                    : Boolean;

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'IntercompanySettlementIndicator'
      IntercompanySettlementIndicator      : Boolean;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Requesting Unit'
      RequestingCostCentreID               : String(20);

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Responsible Unit'
      ResponsibleCostCentreID              : String(20);

      @odata.Type     : 'Edm.DateTimeOffset'
      @odata.Precision: 7
      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Start Date'
      PlannedStartDateTime                 : Timestamp;

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'PlannedStartDateTimeTimeZoneCode'
      @sap.text       : 'PlannedStartDateTimeTimeZoneCodeText'
      PlannedStartDateTimeTimeZoneCode     : String(10);

      @sap.label      : 'PlannedStartDateTimeTimeZoneCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      PlannedStartDateTimeTimeZoneCodeText : LargeString;

      @odata.Type     : 'Edm.DateTimeOffset'
      @odata.Precision: 7
      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Finish Date'
      PlannedEndDateTime                   : Timestamp;

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'PlannedEndDateTimeTimeZoneCode'
      @sap.text       : 'PlannedEndDateTimeTimeZoneCodeText'
      PlannedEndDateTimeTimeZoneCode       : String(10);

      @sap.label      : 'PlannedEndDateTimeTimeZoneCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      PlannedEndDateTimeTimeZoneCodeText   : LargeString;

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'ActualDuration'
      ActualDuration                       : String(20);

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'EstimatedCompletionPercent'
      EstimatedCompletionPercent           : Integer;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'ProjectLifeCycleStatusCode'
      @sap.text       : 'ProjectLifeCycleStatusCodeText'
      ProjectLifeCycleStatusCode           : String(2);

      @sap.label      : 'ProjectLifeCycleStatusCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      ProjectLifeCycleStatusCodeText       : LargeString;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'SchedulingUpToDatenessStatusCode'
      @sap.text       : 'SchedulingUpToDatenessStatusCodeText'
      SchedulingUpToDatenessStatusCode     : String(2);

      @sap.label      : 'SchedulingUpToDatenessStatusCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      SchedulingUpToDatenessStatusCodeText : LargeString;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'BlockingStatusCode'
      @sap.text       : 'BlockingStatusCodeText'
      BlockingStatusCode                   : String(2);

      @sap.label      : 'BlockingStatusCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      BlockingStatusCodeText               : LargeString;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'ClosureStatusCode'
      @sap.text       : 'ClosureStatusCodeText'
      ClosureStatusCode                    : String(2);

      @sap.label      : 'ClosureStatusCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      ClosureStatusCodeText                : LargeString;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'FulfilmentProcessingStatusCode'
      @sap.text       : 'FulfilmentProcessingStatusCodeText'
      FulfilmentProcessingStatusCode       : String(2);

      @sap.label      : 'FulfilmentProcessingStatusCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      FulfilmentProcessingStatusCodeText   : LargeString;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'LifeCycleStatusCode'
      @sap.text       : 'LifeCycleStatusCodeText'
      LifeCycleStatusCode                  : String(2);

      @sap.label      : 'LifeCycleStatusCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      LifeCycleStatusCodeText              : LargeString;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Status'
      @sap.text       : 'ProjectStartingStatusCodeText'
      ProjectStartingStatusCode            : String(2);

      @sap.label      : 'Status Text'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      ProjectStartingStatusCodeText        : LargeString;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'ReleaseStatusCode'
      @sap.text       : 'ReleaseStatusCodeText'
      ReleaseStatusCode                    : String(2);

      @sap.label      : 'ReleaseStatusCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      ReleaseStatusCodeText                : LargeString;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'StoppingStatusCode'
      @sap.text       : 'StoppingStatusCodeText'
      StoppingStatusCode                   : String(2);

      @sap.label      : 'StoppingStatusCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      StoppingStatusCodeText               : LargeString;

      @cds.ambiguous  : 'missing on condition?'
      Team                                 : Association to many byd_khproject.TeamCollection {};

      @cds.ambiguous  : 'missing on condition?'
      ProjectSummaryTask                   : Association to byd_khproject.ProjectSummaryTaskCollection {};

      @cds.ambiguous  : 'missing on condition?'
      Task                                 : Association to many byd_khproject.TaskCollection {};

      @cds.ambiguous  : 'missing on condition?'
      ProjectBuyerParty                    : Association to byd_khproject.ProjectBuyerPartyCollection {};
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'true'
@sap.updatable       : 'true'
@sap.deletable       : 'true'
@sap.label           : 'ProjectSummaryTaskCollection'
entity byd_khproject.ProjectSummaryTaskCollection {
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'Object ID'
  key ObjectID                         : String(70) not null;

      @sap.creatable  : 'true'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'Parent Object ID'
      ParentObjectID                   : String(70);

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'ID'
      ID                               : String(24);

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Task Name'
      ProjectName                      : String(40);

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Person Responsible ID'
      ResponsibleEmployeeID            : String(20);

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'ResponsibleEmployeeFormattedName'
      ResponsibleEmployeeFormattedName : String(80);

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Priority'
      @sap.text       : 'PriorityCodeText'
      PriorityCode                     : String(1);

      @sap.label      : 'Priority Text'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      PriorityCodeText                 : LargeString;

      @odata.Type     : 'Edm.DateTimeOffset'
      @odata.Precision: 7
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'CreationDateTime'
      CreationDateTime                 : Timestamp;

      @odata.Type     : 'Edm.DateTimeOffset'
      @odata.Precision: 7
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'LastChangeDateTime'
      LastChangeDateTime               : Timestamp;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'BlockingStatusCode'
      @sap.text       : 'BlockingStatusCodeText'
      BlockingStatusCode               : String(2);

      @sap.label      : 'BlockingStatusCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      BlockingStatusCodeText           : LargeString;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'LifeCycleStatusCode'
      @sap.text       : 'LifeCycleStatusCodeText'
      LifeCycleStatusCode              : String(2);

      @sap.label      : 'LifeCycleStatusCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      LifeCycleStatusCodeText          : LargeString;

      @cds.ambiguous  : 'missing on condition?'
      Project                          : Association to byd_khproject.ProjectCollection {};
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'true'
@sap.updatable       : 'true'
@sap.deletable       : 'true'
@sap.label           : 'TeamCollection'
entity byd_khproject.TeamCollection {
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'Object ID'
  key ObjectID                                      : String(70) not null;

      @sap.creatable  : 'true'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'Parent Object ID'
      ParentObjectID                                : String(70);

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Team Member ID'
      EmployeeID                                    : String(20);

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'EmployeeFormattedName'
      EmployeeFormattedName                         : String(80);

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Substitute for Project Responsible'
      ProjectResponsibleEmployeeSubstituteIndicator : Boolean;

      @odata.Type     : 'Edm.DateTimeOffset'
      @odata.Precision: 7
      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Start Date'
      PlannedStartDateTime                          : Timestamp;

      @odata.Type     : 'Edm.DateTimeOffset'
      @odata.Precision: 7
      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Finish Date'
      PlannedEndDateTime                            : Timestamp;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Committed Work'
      CommittedWorkQuantity                         : Decimal(31, 14);

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'CommittedWorkQuantityUnitCode'
      @sap.text       : 'CommittedWorkQuantityUnitCodeText'
      CommittedWorkQuantityUnitCode                 : String(3);

      @sap.label      : 'CommittedWorkQuantityUnitCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      CommittedWorkQuantityUnitCodeText             : LargeString;

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'TotalPlannedWorkQuantity'
      TotalPlannedWorkQuantity                      : Decimal(31, 14);

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'TotalPlannedWorkQuantityUnitCode'
      @sap.text       : 'TotalPlannedWorkQuantityUnitCodeText'
      TotalPlannedWorkQuantityUnitCode              : String(3);

      @sap.label      : 'TotalPlannedWorkQuantityUnitCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      TotalPlannedWorkQuantityUnitCodeText          : LargeString;

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'TotalActualWorkQuantity'
      TotalActualWorkQuantity                       : Decimal(31, 14);

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'TotalActualWorkQuantityUnitCode'
      @sap.text       : 'TotalActualWorkQuantityUnitCodeText'
      TotalActualWorkQuantityUnitCode               : String(3);

      @sap.label      : 'TotalActualWorkQuantityUnitCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      TotalActualWorkQuantityUnitCodeText           : LargeString;

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'TotalRemainingWorkQuantity'
      TotalRemainingWorkQuantity                    : Decimal(31, 14);

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'TotalRemainingWorkQuantityUnitCode'
      @sap.text       : 'TotalRemainingWorkQuantityUnitCodeText'
      TotalRemainingWorkQuantityUnitCode            : String(3);

      @sap.label      : 'TotalRemainingWorkQuantityUnitCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      TotalRemainingWorkQuantityUnitCodeText        : LargeString;

      @cds.ambiguous  : 'missing on condition?'
      Project                                       : Association to byd_khproject.ProjectCollection {};
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'true'
@sap.updatable       : 'true'
@sap.deletable       : 'true'
@sap.label           : 'ProjectBuyerPartyCollection'
entity byd_khproject.ProjectBuyerPartyCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Object ID'
  key ObjectID       : String(70) not null;

      @sap.creatable : 'true'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Parent Object ID'
      ParentObjectID : String(70);

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'Party ID'
      PartyID        : String(60);

      @cds.ambiguous : 'missing on condition?'
      Project        : Association to byd_khproject.ProjectCollection {};
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'true'
@sap.updatable       : 'true'
@sap.deletable       : 'true'
@sap.label           : 'TaskCollection'
entity byd_khproject.TaskCollection {
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'Object ID'
  key ObjectID                                            : String(70) not null;

      @sap.creatable  : 'true'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'Parent Object ID'
      ParentObjectID                                      : String(70);

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'TaskUUID'
      TaskUUID                                            : UUID;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'ID'
      TaskID                                              : String(24);

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Task Name'
      TaskName                                            : String(40);

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Person Responsible ID'
      ResponsibleEmployeeID                               : String(20);

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'ResponsibleEmployeeFormattedName'
      ResponsibleEmployeeFormattedName                    : String(80);

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'Summary Task'
      SummaryTaskIndicator                                : Boolean;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Milestone'
      MilestoneIndicator                                  : Boolean;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Phase'
      PhaseIndicator                                      : Boolean;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'LifeCycleStatusCode'
      @sap.text       : 'LifeCycleStatusCodeText'
      LifeCycleStatusCode                                 : String(2);

      @sap.label      : 'LifeCycleStatusCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      LifeCycleStatusCodeText                             : LargeString;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Calendar'
      @sap.text       : 'WorkingDayCalendarCodeText'
      WorkingDayCalendarCode                              : String(6);

      @sap.label      : 'Calendar Text'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      WorkingDayCalendarCodeText                          : LargeString;

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'ParentTaskUUID'
      ParentTaskUUID                                      : UUID;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'ID'
      ParentTaskID                                        : String(24);

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'RightNeighbourTaskUUID'
      RightNeighbourTaskUUID                              : UUID;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'ID'
      RightNeighbourTaskID                                : String(24);

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Duration'
      PlannedDuration                                     : String(20);

      @odata.Type     : 'Edm.DateTimeOffset'
      @odata.Precision: 7
      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Start Constraint Date'
      ConstraintStartDateTime                             : Timestamp;

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'ConstraintStartDateTimeZoneCode'
      @sap.text       : 'ConstraintStartDateTimeZoneCodeText'
      ConstraintStartDateTimeZoneCode                     : String(10);

      @sap.label      : 'ConstraintStartDateTimeZoneCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      ConstraintStartDateTimeZoneCodeText                 : LargeString;

      @odata.Type     : 'Edm.DateTimeOffset'
      @odata.Precision: 7
      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Finish Constraint Date'
      ConstraintEndDateTime                               : Timestamp;

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'ConstraintEndDateTimeZoneCode'
      @sap.text       : 'ConstraintEndDateTimeZoneCodeText'
      ConstraintEndDateTimeZoneCode                       : String(10);

      @sap.label      : 'ConstraintEndDateTimeZoneCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      ConstraintEndDateTimeZoneCodeText                   : LargeString;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Start Constraint Type'
      @sap.text       : 'ScheduleActivityStartDateTimeConstraintTypeCodeText'
      ScheduleActivityStartDateTimeConstraintTypeCode     : String(1);

      @sap.label      : 'Start Constraint Type Text'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      ScheduleActivityStartDateTimeConstraintTypeCodeText : LargeString;

      @sap.creatable  : 'true'
      @sap.updatable  : 'true'
      @sap.filterable : 'true'
      @sap.label      : 'Finish Constraint Type'
      @sap.text       : 'ScheduleActivityEndDateTimeConstraintTypeCodeText'
      ScheduleActivityEndDateTimeConstraintTypeCode       : String(1);

      @sap.label      : 'Finish Constraint Type Text'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      ScheduleActivityEndDateTimeConstraintTypeCodeText   : LargeString;

      @cds.ambiguous  : 'missing on condition?'
      TaskService                                         : Association to many byd_khproject.TaskServiceCollection {};

      @cds.ambiguous  : 'missing on condition?'
      Project                                             : Association to byd_khproject.ProjectCollection {};

      @cds.ambiguous  : 'missing on condition?'
      TaskRelationship                                    : Association to many byd_khproject.TaskRelationshipCollection {};

      @cds.ambiguous  : 'missing on condition?'
      TaskMaterial                                        : Association to many byd_khproject.TaskMaterialCollection {};

      @cds.ambiguous  : 'missing on condition?'
      TaskExpense                                         : Association to many byd_khproject.TaskExpenseCollection {};

      @cds.ambiguous  : 'missing on condition?'
      TaskRevenue                                         : Association to many byd_khproject.TaskRevenueCollection {};
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'true'
@sap.updatable       : 'true'
@sap.deletable       : 'true'
@sap.label           : 'TaskRelationshipCollection'
entity byd_khproject.TaskRelationshipCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Object ID'
  key ObjectID               : String(70) not null;

      @sap.creatable : 'true'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Parent Object ID'
      ParentObjectID         : String(70);

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'Dependency Type'
      @sap.text      : 'DependencyTypeCodeText'
      DependencyTypeCode     : String(2);

      @sap.label     : 'Dependency Type Text'
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      DependencyTypeCodeText : LargeString;

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'Successor Task ID'
      SuccessorTaskID        : String(24);

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'Lag'
      LagDuration            : String(20);

      @cds.ambiguous : 'missing on condition?'
      Task                   : Association to byd_khproject.TaskCollection {};

      @cds.ambiguous : 'missing on condition?'
      Project                : Association to byd_khproject.ProjectCollection {};
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'true'
@sap.updatable       : 'true'
@sap.deletable       : 'true'
@sap.label           : 'TaskServiceCollection'
entity byd_khproject.TaskServiceCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Object ID'
  key ObjectID                             : String(70) not null;

      @sap.creatable : 'true'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Parent Object ID'
      ParentObjectID                       : String(70);

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'Service ID'
      ProductID                            : String(60);

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Product Description'
      ProductDescription                   : String(40);

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'AssignedEmployeeFormattedName'
      AssignedEmployeeFormattedName        : String(80);

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'Team Member ID'
      AssignedEmployeeID                   : String(20);

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'Planned Work'
      PlannedWorkQuantity                  : Decimal(31, 14);

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'PlannedWorkQuantityUnitCode'
      @sap.text      : 'PlannedWorkQuantityUnitCodeText'
      PlannedWorkQuantityUnitCode          : String(3);

      @sap.label     : 'PlannedWorkQuantityUnitCodeText'
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      PlannedWorkQuantityUnitCodeText      : LargeString;

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'Remaining Work'
      RemainingWorkQuantity                : Decimal(31, 14);

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'RemainingWorkQuantityUnitCode'
      @sap.text      : 'RemainingWorkQuantityUnitCodeText'
      RemainingWorkQuantityUnitCode        : String(3);

      @sap.label     : 'RemainingWorkQuantityUnitCodeText'
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      RemainingWorkQuantityUnitCodeText    : LargeString;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Actual Work'
      TotalActualWorkQuantity              : Decimal(31, 14);

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'TotalActualWorkQuantityUnitCode'
      @sap.text      : 'TotalActualWorkQuantityUnitCodeText'
      TotalActualWorkQuantityUnitCode      : String(3);

      @sap.label     : 'TotalActualWorkQuantityUnitCodeText'
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      TotalActualWorkQuantityUnitCodeText  : LargeString;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'TotalCostAmount'
      TotalCostAmount                      : Decimal(28, 6);

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'TotalCostAmountCurrencyCode'
      @sap.text      : 'TotalCostAmountCurrencyCodeText'
      TotalCostAmountCurrencyCode          : String(3);

      @sap.label     : 'TotalCostAmountCurrencyCodeText'
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      TotalCostAmountCurrencyCodeText      : LargeString;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'ValuationPriceAmount'
      ValuationPriceAmount                 : Decimal(28, 6);

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'ValuationPriceAmountCurrencyCode'
      @sap.text      : 'ValuationPriceAmountCurrencyCodeText'
      ValuationPriceAmountCurrencyCode     : String(3);

      @sap.label     : 'ValuationPriceAmountCurrencyCodeText'
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      ValuationPriceAmountCurrencyCodeText : LargeString;

      @cds.ambiguous : 'missing on condition?'
      Task                                 : Association to byd_khproject.TaskCollection {};

      @cds.ambiguous : 'missing on condition?'
      Project                              : Association to byd_khproject.ProjectCollection {};

      @cds.ambiguous : 'missing on condition?'
      TaskServiceConfirmation              : Association to many byd_khproject.TaskServiceConfirmationCollection {};
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'true'
@sap.updatable       : 'true'
@sap.deletable       : 'true'
@sap.label           : 'TaskMaterialCollection'
entity byd_khproject.TaskMaterialCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Object ID'
  key ObjectID                        : String(70) not null;

      @sap.creatable : 'true'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Parent Object ID'
      ParentObjectID                  : String(70);

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'ProductID'
      ProductID                       : String(60);

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'StockIndicator'
      StockIndicator                  : Boolean;

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'Billable'
      BillableIndicator               : Boolean;

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'PlannedQuantity'
      PlannedQuantity                 : Decimal(31, 14);

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'PlannedQuantityUnitCode'
      @sap.text      : 'PlannedQuantityUnitCodeText'
      PlannedQuantityUnitCode         : String(3);

      @sap.label     : 'PlannedQuantityUnitCodeText'
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      PlannedQuantityUnitCodeText     : LargeString;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'ActualQuantity'
      ActualQuantity                  : Decimal(31, 14);

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'ActualQuantityUnitCode'
      @sap.text      : 'ActualQuantityUnitCodeText'
      ActualQuantityUnitCode          : String(3);

      @sap.label     : 'ActualQuantityUnitCodeText'
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      ActualQuantityUnitCodeText      : LargeString;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'RemainingQuantity'
      RemainingQuantity               : Decimal(31, 14);

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'RemainingQuantityUnitCode'
      @sap.text      : 'RemainingQuantityUnitCodeText'
      RemainingQuantityUnitCode       : String(3);

      @sap.label     : 'RemainingQuantityUnitCodeText'
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      RemainingQuantityUnitCodeText   : LargeString;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'TotalCostAmount'
      TotalCostAmount                 : Decimal(28, 6);

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'TotalCostAmountCurrencyCode'
      @sap.text      : 'TotalCostAmountCurrencyCodeText'
      TotalCostAmountCurrencyCode     : String(3);

      @sap.label     : 'TotalCostAmountCurrencyCodeText'
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      TotalCostAmountCurrencyCodeText : LargeString;

      @cds.ambiguous : 'missing on condition?'
      Task                            : Association to byd_khproject.TaskCollection {};

      @cds.ambiguous : 'missing on condition?'
      Project                         : Association to byd_khproject.ProjectCollection {};
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'true'
@sap.updatable       : 'true'
@sap.deletable       : 'true'
@sap.label           : 'TaskExpenseCollection'
entity byd_khproject.TaskExpenseCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Object ID'
  key ObjectID                           : String(70) not null;

      @sap.creatable : 'true'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Parent Object ID'
      ParentObjectID                     : String(70);

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'Expense Group'
      @sap.text      : 'ExpenseGroupCodeText'
      ExpenseGroupCode                   : String(26);

      @sap.label     : 'Expense Group Text'
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      ExpenseGroupCodeText               : LargeString;

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description                        : LargeString;

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'Planned Cost'
      PlannedCostsAmount                 : Decimal(28, 6);

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'PlannedCostsAmountCurrencyCode'
      @sap.text      : 'PlannedCostsAmountCurrencyCodeText'
      PlannedCostsAmountCurrencyCode     : String(3);

      @sap.label     : 'PlannedCostsAmountCurrencyCodeText'
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      PlannedCostsAmountCurrencyCodeText : LargeString;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'TotalCostAmount'
      TotalCostAmount                    : Decimal(28, 6);

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'TotalCostAmountCurrencyCode'
      @sap.text      : 'TotalCostAmountCurrencyCodeText'
      TotalCostAmountCurrencyCode        : String(3);

      @sap.label     : 'TotalCostAmountCurrencyCodeText'
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      TotalCostAmountCurrencyCodeText    : LargeString;

      @cds.ambiguous : 'missing on condition?'
      Task                               : Association to byd_khproject.TaskCollection {};

      @cds.ambiguous : 'missing on condition?'
      Project                            : Association to byd_khproject.ProjectCollection {};
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'true'
@sap.updatable       : 'true'
@sap.deletable       : 'true'
@sap.label           : 'TaskRevenueCollection'
entity byd_khproject.TaskRevenueCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Object ID'
  key ObjectID                             : String(70) not null;

      @sap.creatable : 'true'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Parent Object ID'
      ParentObjectID                       : String(70);

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'Income Group'
      @sap.text      : 'IncomeGroupCodeText'
      IncomeGroupCode                      : String(26);

      @sap.label     : 'Income Group Text'
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      IncomeGroupCodeText                  : LargeString;

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description                          : LargeString;

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'Planned Revenues'
      PlannedRevenueAmount                 : Decimal(28, 6);

      @sap.creatable : 'true'
      @sap.updatable : 'true'
      @sap.filterable: 'true'
      @sap.label     : 'PlannedRevenueAmountCurrencyCode'
      @sap.text      : 'PlannedRevenueAmountCurrencyCodeText'
      PlannedRevenueAmountCurrencyCode     : String(3);

      @sap.label     : 'PlannedRevenueAmountCurrencyCodeText'
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      PlannedRevenueAmountCurrencyCodeText : LargeString;

      @cds.ambiguous : 'missing on condition?'
      Task                                 : Association to byd_khproject.TaskCollection {};

      @cds.ambiguous : 'missing on condition?'
      Project                              : Association to byd_khproject.ProjectCollection {};
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.label           : 'TaskServiceConfirmationCollection'
entity byd_khproject.TaskServiceConfirmationCollection {
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'Object ID'
  key ObjectID                          : String(70) not null;

      @sap.creatable  : 'true'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'Parent Object ID'
      ParentObjectID                    : String(70);

      @odata.Type     : 'Edm.DateTimeOffset'
      @odata.Precision: 7
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'End Date'
      EndDateTime                       : Timestamp;

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'EndDateTimeZoneCode'
      EndDateTimeZoneCode               : LargeString;

      @odata.Type     : 'Edm.DateTimeOffset'
      @odata.Precision: 7
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'Start Date'
      StartDateTime                     : Timestamp;

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'StartDateTimeZoneCode'
      StartDateTimeZoneCode             : LargeString;

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'Remaining Work'
      RemainingWorkQuantity             : Decimal(31, 14);

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'RemainingWorkQuantityUnitCode'
      @sap.text       : 'RemainingWorkQuantityUnitCodeText'
      RemainingWorkQuantityUnitCode     : String(3);

      @sap.label      : 'RemainingWorkQuantityUnitCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      RemainingWorkQuantityUnitCodeText : LargeString;

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'TeamMemberFormattedName'
      TeamMemberFormattedName           : String(80);

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'Product ID'
      ServiceProductID                  : String(40);

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'Product Description'
      ServiceProductDescription         : String(40);

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'Canceled'
      CancelledIndicator                : Boolean;

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'Completed'
      CompletedIndicator                : Boolean;

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'Actual Work'
      ConfirmedWorkQuantity             : Decimal(31, 14);

      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'ConfirmedWorkQuantityUnitCode'
      @sap.text       : 'ConfirmedWorkQuantityUnitCodeText'
      ConfirmedWorkQuantityUnitCode     : String(3);

      @sap.label      : 'ConfirmedWorkQuantityUnitCodeText'
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      ConfirmedWorkQuantityUnitCodeText : LargeString;

      @odata.Type     : 'Edm.DateTimeOffset'
      @odata.Precision: 7
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'LastChangeDateTime'
      LastChangeDateTime                : Timestamp;

      @odata.Type     : 'Edm.DateTimeOffset'
      @odata.Precision: 7
      @sap.creatable  : 'false'
      @sap.updatable  : 'false'
      @sap.filterable : 'true'
      @sap.label      : 'CreationDateTime'
      CreationDateTime                  : Timestamp;

      @cds.ambiguous  : 'missing on condition?'
      TaskService                       : Association to byd_khproject.TaskServiceCollection {};

      @cds.ambiguous  : 'missing on condition?'
      Project                           : Association to byd_khproject.ProjectCollection {};
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.ProjectBlockingStatusCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.ProjectClosureStatusCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.ProjectFulfilmentProcessingStatusCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.ProjectLifeCycleStatusCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.ProjectPlannedEndDateTimeTimeZoneCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.ProjectPlannedStartDateTimeTimeZoneCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.ProjectProjectLanguageCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.ProjectProjectLifeCycleStatusCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.ProjectProjectStartingStatusCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.ProjectProjectTypeCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.ProjectReleaseStatusCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.ProjectSchedulingUpToDatenessStatusCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.ProjectStoppingStatusCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.ProjectSummaryTaskBlockingStatusCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.ProjectSummaryTaskLifeCycleStatusCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.ProjectSummaryTaskPriorityCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskConstraintEndDateTimeZoneCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskConstraintStartDateTimeZoneCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskExpenseExpenseGroupCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskExpensePlannedCostsAmountCurrencyCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskExpenseTotalCostAmountCurrencyCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskLifeCycleStatusCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskMaterialActualQuantityUnitCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskMaterialPlannedQuantityUnitCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskMaterialRemainingQuantityUnitCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskMaterialTotalCostAmountCurrencyCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskRelationshipDependencyTypeCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskRevenueIncomeGroupCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskRevenuePlannedRevenueAmountCurrencyCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskScheduleActivityEndDateTimeConstraintTypeCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskScheduleActivityStartDateTimeConstraintTypeCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskServiceConfirmationConfirmedWorkQuantityUnitCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskServiceConfirmationRemainingWorkQuantityUnitCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskServicePlannedWorkQuantityUnitCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskServiceRemainingWorkQuantityUnitCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskServiceTotalActualWorkQuantityUnitCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskServiceTotalCostAmountCurrencyCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskServiceValuationPriceAmountCurrencyCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TaskWorkingDayCalendarCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TeamCommittedWorkQuantityUnitCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TeamTotalActualWorkQuantityUnitCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TeamTotalPlannedWorkQuantityUnitCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external        : true
@cds.persistence.skip: true
@sap.creatable       : 'false'
@sap.updatable       : 'false'
@sap.deletable       : 'false'
@sap.semantics       : 'fixed-values'
entity byd_khproject.TeamTotalRemainingWorkQuantityUnitCodeCollection {
      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Code'
  key Code        : LargeString not null;

      @sap.creatable : 'false'
      @sap.updatable : 'false'
      @sap.filterable: 'true'
      @sap.label     : 'Description'
      Description : LargeString not null;
};

@cds.external: true
action   byd_khproject.Schedule(ObjectID : LargeString)                                            returns byd_khproject.ProjectCollection;

@cds.external: true
action   byd_khproject.Start(ObjectID : LargeString)                                               returns byd_khproject.ProjectCollection;

@cds.external: true
action   byd_khproject.Move(ObjectID : LargeString,
                            TargetParentTaskUUID : UUID,
                            TargetRightNeighbourTaskUUID : UUID)                                   returns byd_khproject.TaskCollection;

@cds.external: true
action   byd_khproject.StartAndRelease(ObjectID : LargeString)                                     returns byd_khproject.ProjectCollection;

@cds.external: true
action   byd_khproject.Finish(ObjectID : LargeString)                                              returns byd_khproject.TaskCollection;

@cds.external: true
action   byd_khproject.Close(ObjectID : LargeString)                                               returns byd_khproject.TaskCollection;

@cds.external: true
action   byd_khproject.CreateProjectBaseline(ObjectID : LargeString)                               returns byd_khproject.ProjectCollection;

@cds.external: true
action   byd_khproject.CreateProjectSnapshot(ObjectID : LargeString,
                                             SnapshotID : LargeString)                             returns byd_khproject.ProjectCollection;

@cds.external: true
function byd_khproject.ProjectSummaryTaskQueryAccountableTasksByElements(NumberOfRows : LargeString,
                                                                         StartRow : LargeString,
                                                                         ID : LargeString,
                                                                         ProjectBillableIndicator : LargeString,
                                                                         BuyerPartyID : LargeString,
                                                                         ProjectID : LargeString,
                                                                         CompanyID : LargeString,
                                                                         CostCentreID : LargeString,
                                                                         ProjectTypeCode : LargeString,
                                                                         ProjectTaskName : LargeString,
                                                                         ResponsibleEmployeeFamilyName : LargeString,
                                                                         ResponsibleEmployeeGivenName : LargeString,
                                                                         ResponsibleEmployeeID : LargeString,
                                                                         SearchText : LargeString) returns many byd_khproject.ProjectSummaryTaskCollection;
