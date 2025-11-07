/* checksum : 66c24f99ed159c677017b91d4fc7a222 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
service byd_khproject {
  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'true'
  @sap.updatable : 'true'
  @sap.deletable : 'true'
  @sap.label : 'Project'
  entity ProjectCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Object ID'
    key ObjectID : String(70) not null;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Project ID'
    ProjectID : String(24);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Project Type'
    @sap.text : 'ProjectTypeCodeText'
    ProjectTypeCode : String(15);
    @sap.label : 'Project Type Text'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    ProjectTypeCodeText : String;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Project Language'
    @sap.text : 'ProjectLanguageCodeText'
    ProjectLanguageCode : String(2);
    @sap.label : 'Project Language Text'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    ProjectLanguageCodeText : String;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'BillableIndicator'
    BillableIndicator : Boolean;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'IntercompanySettlementIndicator'
    IntercompanySettlementIndicator : Boolean;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Requesting Unit'
    RequestingCostCentreID : String(20);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Responsible Unit'
    ResponsibleCostCentreID : String(20);
    @odata.Type : 'Edm.DateTimeOffset'
    @odata.Precision : 7
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Start Date'
    PlannedStartDateTime : Timestamp;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'PlannedStartDateTimeTimeZoneCode'
    @sap.text : 'PlannedStartDateTimeTimeZoneCodeText'
    PlannedStartDateTimeTimeZoneCode : String(10);
    @sap.label : 'PlannedStartDateTimeTimeZoneCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    PlannedStartDateTimeTimeZoneCodeText : String;
    @odata.Type : 'Edm.DateTimeOffset'
    @odata.Precision : 7
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Finish Date'
    PlannedEndDateTime : Timestamp;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'PlannedEndDateTimeTimeZoneCode'
    @sap.text : 'PlannedEndDateTimeTimeZoneCodeText'
    PlannedEndDateTimeTimeZoneCode : String(10);
    @sap.label : 'PlannedEndDateTimeTimeZoneCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    PlannedEndDateTimeTimeZoneCodeText : String;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'ActualDuration'
    ActualDuration : String(20);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'EstimatedCompletionPercent'
    EstimatedCompletionPercent : Integer;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'ProjectLifeCycleStatusCode'
    @sap.text : 'ProjectLifeCycleStatusCodeText'
    ProjectLifeCycleStatusCode : String(2);
    @sap.label : 'ProjectLifeCycleStatusCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    ProjectLifeCycleStatusCodeText : String;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'SchedulingUpToDatenessStatusCode'
    @sap.text : 'SchedulingUpToDatenessStatusCodeText'
    SchedulingUpToDatenessStatusCode : String(2);
    @sap.label : 'SchedulingUpToDatenessStatusCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    SchedulingUpToDatenessStatusCodeText : String;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'BlockingStatusCode'
    @sap.text : 'BlockingStatusCodeText'
    BlockingStatusCode : String(2);
    @sap.label : 'BlockingStatusCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    BlockingStatusCodeText : String;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'ClosureStatusCode'
    @sap.text : 'ClosureStatusCodeText'
    ClosureStatusCode : String(2);
    @sap.label : 'ClosureStatusCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    ClosureStatusCodeText : String;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'FulfilmentProcessingStatusCode'
    @sap.text : 'FulfilmentProcessingStatusCodeText'
    FulfilmentProcessingStatusCode : String(2);
    @sap.label : 'FulfilmentProcessingStatusCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    FulfilmentProcessingStatusCodeText : String;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'LifeCycleStatusCode'
    @sap.text : 'LifeCycleStatusCodeText'
    LifeCycleStatusCode : String(2);
    @sap.label : 'LifeCycleStatusCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    LifeCycleStatusCodeText : String;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Status'
    @sap.text : 'ProjectStartingStatusCodeText'
    ProjectStartingStatusCode : String(2);
    @sap.label : 'Status Text'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    ProjectStartingStatusCodeText : String;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'ReleaseStatusCode'
    @sap.text : 'ReleaseStatusCodeText'
    ReleaseStatusCode : String(2);
    @sap.label : 'ReleaseStatusCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    ReleaseStatusCodeText : String;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'StoppingStatusCode'
    @sap.text : 'StoppingStatusCodeText'
    StoppingStatusCode : String(2);
    @sap.label : 'StoppingStatusCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    StoppingStatusCodeText : String;
    Team : Association to many TeamCollection {  };
    ProjectSummaryTask : Association to ProjectSummaryTaskCollection {  };
    Task : Association to many TaskCollection {  };
    ProjectBuyerParty : Association to ProjectBuyerPartyCollection {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'true'
  @sap.updatable : 'true'
  @sap.deletable : 'true'
  @sap.label : 'ProjectSummaryTaskCollection'
  entity ProjectSummaryTaskCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Object ID'
    key ObjectID : String(70) not null;
    @sap.creatable : 'true'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Parent Object ID'
    ParentObjectID : String(70);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'ID'
    ID : String(24);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Task Name'
    ProjectName : String(40);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Person Responsible ID'
    ResponsibleEmployeeID : String(20);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'ResponsibleEmployeeFormattedName'
    ResponsibleEmployeeFormattedName : String(80);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Priority'
    @sap.text : 'PriorityCodeText'
    PriorityCode : String(1);
    @sap.label : 'Priority Text'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    PriorityCodeText : String;
    @odata.Type : 'Edm.DateTimeOffset'
    @odata.Precision : 7
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'CreationDateTime'
    CreationDateTime : Timestamp;
    @odata.Type : 'Edm.DateTimeOffset'
    @odata.Precision : 7
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'LastChangeDateTime'
    LastChangeDateTime : Timestamp;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'BlockingStatusCode'
    @sap.text : 'BlockingStatusCodeText'
    BlockingStatusCode : String(2);
    @sap.label : 'BlockingStatusCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    BlockingStatusCodeText : String;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'LifeCycleStatusCode'
    @sap.text : 'LifeCycleStatusCodeText'
    LifeCycleStatusCode : String(2);
    @sap.label : 'LifeCycleStatusCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    LifeCycleStatusCodeText : String;
    Project : Association to ProjectCollection {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'true'
  @sap.updatable : 'true'
  @sap.deletable : 'true'
  @sap.label : 'TeamCollection'
  entity TeamCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Object ID'
    key ObjectID : String(70) not null;
    @sap.creatable : 'true'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Parent Object ID'
    ParentObjectID : String(70);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Team Member ID'
    EmployeeID : String(20);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'EmployeeFormattedName'
    EmployeeFormattedName : String(80);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Substitute for Project Responsible'
    ProjectResponsibleEmployeeSubstituteIndicator : Boolean;
    @odata.Type : 'Edm.DateTimeOffset'
    @odata.Precision : 7
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Start Date'
    PlannedStartDateTime : Timestamp;
    @odata.Type : 'Edm.DateTimeOffset'
    @odata.Precision : 7
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Finish Date'
    PlannedEndDateTime : Timestamp;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Committed Work'
    CommittedWorkQuantity : Decimal(31, 14);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'CommittedWorkQuantityUnitCode'
    @sap.text : 'CommittedWorkQuantityUnitCodeText'
    CommittedWorkQuantityUnitCode : String(3);
    @sap.label : 'CommittedWorkQuantityUnitCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    CommittedWorkQuantityUnitCodeText : String;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'TotalPlannedWorkQuantity'
    TotalPlannedWorkQuantity : Decimal(31, 14);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'TotalPlannedWorkQuantityUnitCode'
    @sap.text : 'TotalPlannedWorkQuantityUnitCodeText'
    TotalPlannedWorkQuantityUnitCode : String(3);
    @sap.label : 'TotalPlannedWorkQuantityUnitCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    TotalPlannedWorkQuantityUnitCodeText : String;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'TotalActualWorkQuantity'
    TotalActualWorkQuantity : Decimal(31, 14);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'TotalActualWorkQuantityUnitCode'
    @sap.text : 'TotalActualWorkQuantityUnitCodeText'
    TotalActualWorkQuantityUnitCode : String(3);
    @sap.label : 'TotalActualWorkQuantityUnitCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    TotalActualWorkQuantityUnitCodeText : String;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'TotalRemainingWorkQuantity'
    TotalRemainingWorkQuantity : Decimal(31, 14);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'TotalRemainingWorkQuantityUnitCode'
    @sap.text : 'TotalRemainingWorkQuantityUnitCodeText'
    TotalRemainingWorkQuantityUnitCode : String(3);
    @sap.label : 'TotalRemainingWorkQuantityUnitCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    TotalRemainingWorkQuantityUnitCodeText : String;
    Project : Association to ProjectCollection {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'true'
  @sap.updatable : 'true'
  @sap.deletable : 'true'
  @sap.label : 'ProjectBuyerPartyCollection'
  entity ProjectBuyerPartyCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Object ID'
    key ObjectID : String(70) not null;
    @sap.creatable : 'true'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Parent Object ID'
    ParentObjectID : String(70);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Party ID'
    PartyID : String(60);
    Project : Association to ProjectCollection {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'true'
  @sap.updatable : 'true'
  @sap.deletable : 'true'
  @sap.label : 'TaskCollection'
  entity TaskCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Object ID'
    key ObjectID : String(70) not null;
    @sap.creatable : 'true'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Parent Object ID'
    ParentObjectID : String(70);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'TaskUUID'
    TaskUUID : UUID;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'ID'
    TaskID : String(24);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Task Name'
    TaskName : String(40);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Person Responsible ID'
    ResponsibleEmployeeID : String(20);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'ResponsibleEmployeeFormattedName'
    ResponsibleEmployeeFormattedName : String(80);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Summary Task'
    SummaryTaskIndicator : Boolean;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Milestone'
    MilestoneIndicator : Boolean;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Phase'
    PhaseIndicator : Boolean;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'LifeCycleStatusCode'
    @sap.text : 'LifeCycleStatusCodeText'
    LifeCycleStatusCode : String(2);
    @sap.label : 'LifeCycleStatusCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    LifeCycleStatusCodeText : String;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Calendar'
    @sap.text : 'WorkingDayCalendarCodeText'
    WorkingDayCalendarCode : String(6);
    @sap.label : 'Calendar Text'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    WorkingDayCalendarCodeText : String;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'ParentTaskUUID'
    ParentTaskUUID : UUID;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'ID'
    ParentTaskID : String(24);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'RightNeighbourTaskUUID'
    RightNeighbourTaskUUID : UUID;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'ID'
    RightNeighbourTaskID : String(24);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Duration'
    PlannedDuration : String(20);
    @odata.Type : 'Edm.DateTimeOffset'
    @odata.Precision : 7
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Start Constraint Date'
    ConstraintStartDateTime : Timestamp;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'ConstraintStartDateTimeZoneCode'
    @sap.text : 'ConstraintStartDateTimeZoneCodeText'
    ConstraintStartDateTimeZoneCode : String(10);
    @sap.label : 'ConstraintStartDateTimeZoneCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    ConstraintStartDateTimeZoneCodeText : String;
    @odata.Type : 'Edm.DateTimeOffset'
    @odata.Precision : 7
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Finish Constraint Date'
    ConstraintEndDateTime : Timestamp;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'ConstraintEndDateTimeZoneCode'
    @sap.text : 'ConstraintEndDateTimeZoneCodeText'
    ConstraintEndDateTimeZoneCode : String(10);
    @sap.label : 'ConstraintEndDateTimeZoneCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    ConstraintEndDateTimeZoneCodeText : String;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Start Constraint Type'
    @sap.text : 'ScheduleActivityStartDateTimeConstraintTypeCodeText'
    ScheduleActivityStartDateTimeConstraintTypeCode : String(1);
    @sap.label : 'Start Constraint Type Text'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    ScheduleActivityStartDateTimeConstraintTypeCodeText : String;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Finish Constraint Type'
    @sap.text : 'ScheduleActivityEndDateTimeConstraintTypeCodeText'
    ScheduleActivityEndDateTimeConstraintTypeCode : String(1);
    @sap.label : 'Finish Constraint Type Text'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    ScheduleActivityEndDateTimeConstraintTypeCodeText : String;
    TaskService : Association to many TaskServiceCollection {  };
    Project : Association to ProjectCollection {  };
    TaskRelationship : Association to many TaskRelationshipCollection {  };
    TaskMaterial : Association to many TaskMaterialCollection {  };
    TaskExpense : Association to many TaskExpenseCollection {  };
    TaskRevenue : Association to many TaskRevenueCollection {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'true'
  @sap.updatable : 'true'
  @sap.deletable : 'true'
  @sap.label : 'TaskRelationshipCollection'
  entity TaskRelationshipCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Object ID'
    key ObjectID : String(70) not null;
    @sap.creatable : 'true'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Parent Object ID'
    ParentObjectID : String(70);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Dependency Type'
    @sap.text : 'DependencyTypeCodeText'
    DependencyTypeCode : String(2);
    @sap.label : 'Dependency Type Text'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    DependencyTypeCodeText : String;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Successor Task ID'
    SuccessorTaskID : String(24);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Lag'
    LagDuration : String(20);
    Task : Association to TaskCollection {  };
    Project : Association to ProjectCollection {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'true'
  @sap.updatable : 'true'
  @sap.deletable : 'true'
  @sap.label : 'TaskServiceCollection'
  entity TaskServiceCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Object ID'
    key ObjectID : String(70) not null;
    @sap.creatable : 'true'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Parent Object ID'
    ParentObjectID : String(70);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Service ID'
    ProductID : String(60);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Product Description'
    ProductDescription : String(40);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'AssignedEmployeeFormattedName'
    AssignedEmployeeFormattedName : String(80);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Team Member ID'
    AssignedEmployeeID : String(20);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Planned Work'
    PlannedWorkQuantity : Decimal(31, 14);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'PlannedWorkQuantityUnitCode'
    @sap.text : 'PlannedWorkQuantityUnitCodeText'
    PlannedWorkQuantityUnitCode : String(3);
    @sap.label : 'PlannedWorkQuantityUnitCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    PlannedWorkQuantityUnitCodeText : String;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Remaining Work'
    RemainingWorkQuantity : Decimal(31, 14);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'RemainingWorkQuantityUnitCode'
    @sap.text : 'RemainingWorkQuantityUnitCodeText'
    RemainingWorkQuantityUnitCode : String(3);
    @sap.label : 'RemainingWorkQuantityUnitCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    RemainingWorkQuantityUnitCodeText : String;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Actual Work'
    TotalActualWorkQuantity : Decimal(31, 14);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'TotalActualWorkQuantityUnitCode'
    @sap.text : 'TotalActualWorkQuantityUnitCodeText'
    TotalActualWorkQuantityUnitCode : String(3);
    @sap.label : 'TotalActualWorkQuantityUnitCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    TotalActualWorkQuantityUnitCodeText : String;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'TotalCostAmount'
    TotalCostAmount : Decimal(28, 6);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'TotalCostAmountCurrencyCode'
    @sap.text : 'TotalCostAmountCurrencyCodeText'
    TotalCostAmountCurrencyCode : String(3);
    @sap.label : 'TotalCostAmountCurrencyCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    TotalCostAmountCurrencyCodeText : String;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'ValuationPriceAmount'
    ValuationPriceAmount : Decimal(28, 6);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'ValuationPriceAmountCurrencyCode'
    @sap.text : 'ValuationPriceAmountCurrencyCodeText'
    ValuationPriceAmountCurrencyCode : String(3);
    @sap.label : 'ValuationPriceAmountCurrencyCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    ValuationPriceAmountCurrencyCodeText : String;
    Task : Association to TaskCollection {  };
    Project : Association to ProjectCollection {  };
    TaskServiceConfirmation : Association to many TaskServiceConfirmationCollection {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'true'
  @sap.updatable : 'true'
  @sap.deletable : 'true'
  @sap.label : 'TaskMaterialCollection'
  entity TaskMaterialCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Object ID'
    key ObjectID : String(70) not null;
    @sap.creatable : 'true'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Parent Object ID'
    ParentObjectID : String(70);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'ProductID'
    ProductID : String(60);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'StockIndicator'
    StockIndicator : Boolean;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Billable'
    BillableIndicator : Boolean;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'PlannedQuantity'
    PlannedQuantity : Decimal(31, 14);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'PlannedQuantityUnitCode'
    @sap.text : 'PlannedQuantityUnitCodeText'
    PlannedQuantityUnitCode : String(3);
    @sap.label : 'PlannedQuantityUnitCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    PlannedQuantityUnitCodeText : String;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'ActualQuantity'
    ActualQuantity : Decimal(31, 14);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'ActualQuantityUnitCode'
    @sap.text : 'ActualQuantityUnitCodeText'
    ActualQuantityUnitCode : String(3);
    @sap.label : 'ActualQuantityUnitCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    ActualQuantityUnitCodeText : String;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'RemainingQuantity'
    RemainingQuantity : Decimal(31, 14);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'RemainingQuantityUnitCode'
    @sap.text : 'RemainingQuantityUnitCodeText'
    RemainingQuantityUnitCode : String(3);
    @sap.label : 'RemainingQuantityUnitCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    RemainingQuantityUnitCodeText : String;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'TotalCostAmount'
    TotalCostAmount : Decimal(28, 6);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'TotalCostAmountCurrencyCode'
    @sap.text : 'TotalCostAmountCurrencyCodeText'
    TotalCostAmountCurrencyCode : String(3);
    @sap.label : 'TotalCostAmountCurrencyCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    TotalCostAmountCurrencyCodeText : String;
    Task : Association to TaskCollection {  };
    Project : Association to ProjectCollection {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'true'
  @sap.updatable : 'true'
  @sap.deletable : 'true'
  @sap.label : 'TaskExpenseCollection'
  entity TaskExpenseCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Object ID'
    key ObjectID : String(70) not null;
    @sap.creatable : 'true'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Parent Object ID'
    ParentObjectID : String(70);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Expense Group'
    @sap.text : 'ExpenseGroupCodeText'
    ExpenseGroupCode : String(26);
    @sap.label : 'Expense Group Text'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    ExpenseGroupCodeText : String;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Planned Cost'
    PlannedCostsAmount : Decimal(28, 6);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'PlannedCostsAmountCurrencyCode'
    @sap.text : 'PlannedCostsAmountCurrencyCodeText'
    PlannedCostsAmountCurrencyCode : String(3);
    @sap.label : 'PlannedCostsAmountCurrencyCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    PlannedCostsAmountCurrencyCodeText : String;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'TotalCostAmount'
    TotalCostAmount : Decimal(28, 6);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'TotalCostAmountCurrencyCode'
    @sap.text : 'TotalCostAmountCurrencyCodeText'
    TotalCostAmountCurrencyCode : String(3);
    @sap.label : 'TotalCostAmountCurrencyCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    TotalCostAmountCurrencyCodeText : String;
    Task : Association to TaskCollection {  };
    Project : Association to ProjectCollection {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'true'
  @sap.updatable : 'true'
  @sap.deletable : 'true'
  @sap.label : 'TaskRevenueCollection'
  entity TaskRevenueCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Object ID'
    key ObjectID : String(70) not null;
    @sap.creatable : 'true'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Parent Object ID'
    ParentObjectID : String(70);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Income Group'
    @sap.text : 'IncomeGroupCodeText'
    IncomeGroupCode : String(26);
    @sap.label : 'Income Group Text'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    IncomeGroupCodeText : String;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String;
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'Planned Revenues'
    PlannedRevenueAmount : Decimal(28, 6);
    @sap.creatable : 'true'
    @sap.updatable : 'true'
    @sap.filterable : 'true'
    @sap.label : 'PlannedRevenueAmountCurrencyCode'
    @sap.text : 'PlannedRevenueAmountCurrencyCodeText'
    PlannedRevenueAmountCurrencyCode : String(3);
    @sap.label : 'PlannedRevenueAmountCurrencyCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    PlannedRevenueAmountCurrencyCodeText : String;
    Task : Association to TaskCollection {  };
    Project : Association to ProjectCollection {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.label : 'TaskServiceConfirmationCollection'
  entity TaskServiceConfirmationCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Object ID'
    key ObjectID : String(70) not null;
    @sap.creatable : 'true'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Parent Object ID'
    ParentObjectID : String(70);
    @odata.Type : 'Edm.DateTimeOffset'
    @odata.Precision : 7
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'End Date'
    EndDateTime : Timestamp;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'EndDateTimeZoneCode'
    EndDateTimeZoneCode : String;
    @odata.Type : 'Edm.DateTimeOffset'
    @odata.Precision : 7
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Start Date'
    StartDateTime : Timestamp;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'StartDateTimeZoneCode'
    StartDateTimeZoneCode : String;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Remaining Work'
    RemainingWorkQuantity : Decimal(31, 14);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'RemainingWorkQuantityUnitCode'
    @sap.text : 'RemainingWorkQuantityUnitCodeText'
    RemainingWorkQuantityUnitCode : String(3);
    @sap.label : 'RemainingWorkQuantityUnitCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    RemainingWorkQuantityUnitCodeText : String;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'TeamMemberFormattedName'
    TeamMemberFormattedName : String(80);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Product ID'
    ServiceProductID : String(40);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Product Description'
    ServiceProductDescription : String(40);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Canceled'
    CancelledIndicator : Boolean;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Completed'
    CompletedIndicator : Boolean;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Actual Work'
    ConfirmedWorkQuantity : Decimal(31, 14);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'ConfirmedWorkQuantityUnitCode'
    @sap.text : 'ConfirmedWorkQuantityUnitCodeText'
    ConfirmedWorkQuantityUnitCode : String(3);
    @sap.label : 'ConfirmedWorkQuantityUnitCodeText'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    ConfirmedWorkQuantityUnitCodeText : String;
    @odata.Type : 'Edm.DateTimeOffset'
    @odata.Precision : 7
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'LastChangeDateTime'
    LastChangeDateTime : Timestamp;
    @odata.Type : 'Edm.DateTimeOffset'
    @odata.Precision : 7
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'CreationDateTime'
    CreationDateTime : Timestamp;
    TaskService : Association to TaskServiceCollection {  };
    Project : Association to ProjectCollection {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity ProjectBlockingStatusCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity ProjectClosureStatusCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity ProjectFulfilmentProcessingStatusCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity ProjectLifeCycleStatusCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity ProjectPlannedEndDateTimeTimeZoneCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity ProjectPlannedStartDateTimeTimeZoneCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity ProjectProjectLanguageCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity ProjectProjectLifeCycleStatusCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity ProjectProjectStartingStatusCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity ProjectProjectTypeCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity ProjectReleaseStatusCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity ProjectSchedulingUpToDatenessStatusCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity ProjectStoppingStatusCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity ProjectSummaryTaskBlockingStatusCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity ProjectSummaryTaskLifeCycleStatusCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity ProjectSummaryTaskPriorityCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskConstraintEndDateTimeZoneCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskConstraintStartDateTimeZoneCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskExpenseExpenseGroupCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskExpensePlannedCostsAmountCurrencyCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskExpenseTotalCostAmountCurrencyCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskLifeCycleStatusCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskMaterialActualQuantityUnitCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskMaterialPlannedQuantityUnitCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskMaterialRemainingQuantityUnitCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskMaterialTotalCostAmountCurrencyCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskRelationshipDependencyTypeCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskRevenueIncomeGroupCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskRevenuePlannedRevenueAmountCurrencyCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskScheduleActivityEndDateTimeConstraintTypeCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskScheduleActivityStartDateTimeConstraintTypeCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskServiceConfirmationConfirmedWorkQuantityUnitCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskServiceConfirmationRemainingWorkQuantityUnitCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskServicePlannedWorkQuantityUnitCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskServiceRemainingWorkQuantityUnitCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskServiceTotalActualWorkQuantityUnitCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskServiceTotalCostAmountCurrencyCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskServiceValuationPriceAmountCurrencyCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TaskWorkingDayCalendarCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TeamCommittedWorkQuantityUnitCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TeamTotalActualWorkQuantityUnitCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TeamTotalPlannedWorkQuantityUnitCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.semantics : 'fixed-values'
  entity TeamTotalRemainingWorkQuantityUnitCodeCollection {
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Code'
    key Code : String not null;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.filterable : 'true'
    @sap.label : 'Description'
    Description : String not null;
  };

  @cds.external : true
  action Schedule(
    ObjectID : String
  ) returns ProjectCollection;

  @cds.external : true
  action Start(
    ObjectID : String
  ) returns ProjectCollection;

  @cds.external : true
  action Move(
    ObjectID : String,
    TargetParentTaskUUID : UUID,
    TargetRightNeighbourTaskUUID : UUID
  ) returns TaskCollection;

  @cds.external : true
  action StartAndRelease(
    ObjectID : String
  ) returns ProjectCollection;

  @cds.external : true
  action Finish(
    ObjectID : String
  ) returns TaskCollection;

  @cds.external : true
  action Close(
    ObjectID : String
  ) returns TaskCollection;

  @cds.external : true
  action CreateProjectBaseline(
    ObjectID : String
  ) returns ProjectCollection;

  @cds.external : true
  action CreateProjectSnapshot(
    ObjectID : String,
    SnapshotID : String
  ) returns ProjectCollection;

  @cds.external : true
  function ProjectSummaryTaskQueryAccountableTasksByElements(
    NumberOfRows : String,
    StartRow : String,
    ID : String,
    ProjectBillableIndicator : String,
    BuyerPartyID : String,
    ProjectID : String,
    CompanyID : String,
    CostCentreID : String,
    ProjectTypeCode : String,
    ProjectTaskName : String,
    ResponsibleEmployeeFamilyName : String,
    ResponsibleEmployeeGivenName : String,
    ResponsibleEmployeeID : String,
    SearchText : String
  ) returns many ProjectSummaryTaskCollection;
};

