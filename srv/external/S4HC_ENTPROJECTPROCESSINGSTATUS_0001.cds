/* checksum : bc26548524d38ba542549cd2abdebf3b */
@cds.external : true
@Aggregation.ApplySupported : { Transformations: [ 'aggregate', 'groupby', 'filter' ], Rollup: #None }
@Common.ApplyMultiUnitBehaviorForSortingAndFiltering : true
@Capabilities.FilterFunctions : [
  'eq',
  'ne',
  'gt',
  'ge',
  'lt',
  'le',
  'and',
  'or',
  'contains',
  'startswith',
  'endswith',
  'any',
  'all'
]
@Capabilities.SupportedFormats : [ 'application/json', 'application/pdf' ]
@PDF.Features : {
  DocumentDescriptionReference: '../../../../default/iwbep/common/0001/$metadata',
  DocumentDescriptionCollection: 'MyDocumentDescriptions',
  ArchiveFormat: true,
  Border: true,
  CoverPage: true,
  FitToPage: true,
  FontName: true,
  FontSize: true,
  Margin: true,
  Padding: true,
  Signature: true,
  HeaderFooter: true,
  ResultSizeDefault: 20000,
  ResultSizeMaximum: 20000,
  IANATimezoneFormat: true,
  Treeview: true
}
@Capabilities.KeyAsSegmentSupported : true
@Capabilities.AsynchronousRequestsSupported : true
service S4HC_ENTPROJECTPROCESSINGSTATUS_0001 {};

@cds.external : true
@cds.persistence.skip : true
@Common.Label : 'Project Processing Status'
@Capabilities.SearchRestrictions.Searchable : true
@Capabilities.SearchRestrictions.UnsupportedExpressions : #phrase
@Capabilities.InsertRestrictions.Insertable : false
@Capabilities.DeleteRestrictions.Deletable : false
@Capabilities.UpdateRestrictions.Updatable : false
@Capabilities.UpdateRestrictions.NonUpdatableNavigationProperties : [ '_ProcessingStatusText' ]
@Capabilities.UpdateRestrictions.QueryOptions.SelectSupported : true
entity S4HC_ENTPROJECTPROCESSINGSTATUS_0001.ProcessingStatus {
  @Common.Text : ProcessingStatusText
  @Common.IsUpperCase : true
  @Common.Label : 'Processing Status'
  key ProcessingStatus : String(2) not null;
  @Common.IsUpperCase : true
  @Common.Label : 'Status'
  @Common.Heading : 'Processing Status Text'
  @Common.QuickInfo : 'Processing Status Text'
  ProcessingStatusText : String(60) not null;
  @Common.Composition : true
  _ProcessingStatusText : Composition of many S4HC_ENTPROJECTPROCESSINGSTATUS_0001.ProcessingStatusText {  };
};

@cds.external : true
@cds.persistence.skip : true
@Common.Label : 'Project Processing Status Description'
@Capabilities.SearchRestrictions.Searchable : true
@Capabilities.SearchRestrictions.UnsupportedExpressions : #phrase
@Capabilities.InsertRestrictions.Insertable : false
@Capabilities.DeleteRestrictions.Deletable : false
@Capabilities.UpdateRestrictions.Updatable : false
@Capabilities.UpdateRestrictions.NonUpdatableNavigationProperties : [ '_ProcessingStatus' ]
@Capabilities.UpdateRestrictions.QueryOptions.SelectSupported : true
entity S4HC_ENTPROJECTPROCESSINGSTATUS_0001.ProcessingStatusText {
  @Common.Label : 'Language Key'
  @Common.Heading : 'Language'
  key Language : String(2) not null;
  @Common.Text : ProcessingStatusText
  @Common.IsUpperCase : true
  @Common.Label : 'Processing Status'
  key ProcessingStatus : String(2) not null;
  @Common.IsUpperCase : true
  @Common.Label : 'Status'
  @Common.Heading : 'Processing Status Text'
  @Common.QuickInfo : 'Processing Status Text'
  ProcessingStatusText : String(60) not null;
  _ProcessingStatus : Association to one S4HC_ENTPROJECTPROCESSINGSTATUS_0001.ProcessingStatus {  };
};

