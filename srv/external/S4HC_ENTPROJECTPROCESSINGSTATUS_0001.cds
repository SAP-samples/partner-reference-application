/* checksum : 1af2d0583c56ec2f4d66134a8bc3c29d */
@cds.external : true
@Aggregation.ApplySupported.Transformations : [ 'aggregate', 'groupby', 'filter' ]
@Aggregation.ApplySupported.Rollup : #None
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
@PDF.Features.DocumentDescriptionReference : '../../../../default/iwbep/common/0001/$metadata'
@PDF.Features.DocumentDescriptionCollection : 'MyDocumentDescriptions'
@PDF.Features.ArchiveFormat : true
@PDF.Features.Border : true
@PDF.Features.CoverPage : true
@PDF.Features.FitToPage : true
@PDF.Features.FontName : true
@PDF.Features.FontSize : true
@PDF.Features.Margin : true
@PDF.Features.Padding : true
@PDF.Features.Signature : true
@PDF.Features.HeaderFooter : true
@PDF.Features.ResultSizeDefault : 20000
@PDF.Features.ResultSizeMaximum : 20000
@PDF.Features.IANATimezoneFormat : true
@PDF.Features.Treeview : true
@Capabilities.KeyAsSegmentSupported : true
@Capabilities.AsynchronousRequestsSupported : true
service S4HC_ENTPROJECTPROCESSINGSTATUS_0001 {
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
  entity ProcessingStatus {
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
    _ProcessingStatusText : Composition of many ProcessingStatusText {  };
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
  entity ProcessingStatusText {
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
    _ProcessingStatus : Association to one ProcessingStatus {  };
  };
};

