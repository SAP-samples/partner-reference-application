/* checksum : ebe78cc4adcd33fce129ac1bc86a9828 */
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
service S4HC_ENTPROJECTPROFILECODE_0001 {
  @cds.external : true
  @cds.persistence.skip : true
  @Common.Label : 'Project Profile'
  @Capabilities.SearchRestrictions.Searchable : true
  @Capabilities.SearchRestrictions.UnsupportedExpressions : #phrase
  @Capabilities.InsertRestrictions.Insertable : false
  @Capabilities.DeleteRestrictions.Deletable : false
  @Capabilities.UpdateRestrictions.Updatable : false
  @Capabilities.UpdateRestrictions.NonUpdatableNavigationProperties : [ '_ProjectProfileCodeText' ]
  @Capabilities.UpdateRestrictions.QueryOptions.SelectSupported : true
  entity ProjectProfileCode {
    @Common.SAPObjectNodeTypeReference : 'ProjectProfileCode'
    @Common.Text : ProjectProfileCode
    @Common.IsUpperCase : true
    @Common.Label : 'Project Profile'
    @Common.Heading : 'Prj.Prf'
    key ProjectProfileCode : String(7) not null;
    @Common.Label : 'Description'
    @Common.QuickInfo : 'Text for Profile'
    ProjectProfileCodeText : String(40) not null;
    @Common.Composition : true
    _ProjectProfileCodeText : Composition of many ProjectProfileCodeText {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @Common.Label : 'Project Profile Description'
  @Capabilities.SearchRestrictions.Searchable : true
  @Capabilities.SearchRestrictions.UnsupportedExpressions : #phrase
  @Capabilities.InsertRestrictions.Insertable : false
  @Capabilities.DeleteRestrictions.Deletable : false
  @Capabilities.UpdateRestrictions.Updatable : false
  @Capabilities.UpdateRestrictions.NonUpdatableNavigationProperties : [ '_ProjectProfileCode' ]
  @Capabilities.UpdateRestrictions.QueryOptions.SelectSupported : true
  entity ProjectProfileCodeText {
    @Common.Label : 'Language Key'
    @Common.Heading : 'Language'
    key Language : String(2) not null;
    @Common.Text : ProjectProfileCode
    @Common.IsUpperCase : true
    @Common.Label : 'Project Profile'
    @Common.Heading : 'Prj.Prf'
    key ProjectProfileCode : String(7) not null;
    @Common.Label : 'Description'
    @Common.QuickInfo : 'Text for Profile'
    ProjectProfileCodeText : String(40) not null;
    _ProjectProfileCode : Association to one ProjectProfileCode {  };
  };
};

