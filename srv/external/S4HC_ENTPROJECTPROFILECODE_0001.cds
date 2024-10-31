/* checksum : 75bfd0aab06c500ca8f445d460b420fb */
@cds.external                                       : true
@Aggregation.ApplySupported                         : {
  Transformations: [
    'aggregate',
    'groupby',
    'filter'
  ],
  Rollup         : #None
}
@Common.ApplyMultiUnitBehaviorForSortingAndFiltering: true
@Capabilities.FilterFunctions                       : [
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
@Capabilities.SupportedFormats                      : [
  'application/json',
  'application/pdf'
]
@PDF.Features                                       : {
  DocumentDescriptionReference : '../../../../default/iwbep/common/0001/$metadata',
  DocumentDescriptionCollection: 'MyDocumentDescriptions',
  ArchiveFormat                : true,
  Border                       : true,
  CoverPage                    : true,
  FitToPage                    : true,
  FontName                     : true,
  FontSize                     : true,
  Margin                       : true,
  Padding                      : true,
  Signature                    : true,
  HeaderFooter                 : true,
  ResultSizeDefault            : 20000,
  ResultSizeMaximum            : 20000,
  IANATimezoneFormat           : true,
  Treeview                     : true
}
@Capabilities.KeyAsSegmentSupported                 : true
@Capabilities.AsynchronousRequestsSupported         : true
service S4HC_ENTPROJECTPROFILECODE_0001 {};

@cds.external                                                    : true
@cds.persistence.skip                                            : true
@Common.Label                                                    : 'Project Profile'
@Capabilities.SearchRestrictions.Searchable                      : true
@Capabilities.SearchRestrictions.UnsupportedExpressions          : #phrase
@Capabilities.InsertRestrictions.Insertable                      : false
@Capabilities.DeleteRestrictions.Deletable                       : false
@Capabilities.UpdateRestrictions.Updatable                       : false
@Capabilities.UpdateRestrictions.NonUpdatableNavigationProperties: ['_ProjectProfileCodeText']
@Capabilities.UpdateRestrictions.QueryOptions.SelectSupported    : true
entity S4HC_ENTPROJECTPROFILECODE_0001.ProjectProfileCode {
      @Common.SAPObjectNodeTypeReference: 'ProjectProfileCode'
      @Common.Text                      : ProjectProfileCode
      @Common.IsUpperCase               : true
      @Common.Label                     : 'Project Profile'
      @Common.Heading                   : 'Prj.Prf'
  key ProjectProfileCode      : String(7) not null;

      @Common.Label                     : 'Description'
      @Common.QuickInfo                 : 'Text for Profile'
      ProjectProfileCodeText  : String(40) not null;

      @Common.Composition               : true
      _ProjectProfileCodeText : Composition of many S4HC_ENTPROJECTPROFILECODE_0001.ProjectProfileCodeText {};
};

@cds.external                                                    : true
@cds.persistence.skip                                            : true
@Common.Label                                                    : 'Project Profile Description'
@Capabilities.SearchRestrictions.Searchable                      : true
@Capabilities.SearchRestrictions.UnsupportedExpressions          : #phrase
@Capabilities.InsertRestrictions.Insertable                      : false
@Capabilities.DeleteRestrictions.Deletable                       : false
@Capabilities.UpdateRestrictions.Updatable                       : false
@Capabilities.UpdateRestrictions.NonUpdatableNavigationProperties: ['_ProjectProfileCode']
@Capabilities.UpdateRestrictions.QueryOptions.SelectSupported    : true
entity S4HC_ENTPROJECTPROFILECODE_0001.ProjectProfileCodeText {
      @Common.Label      : 'Language Key'
      @Common.Heading    : 'Language'
  key Language               : String(2) not null;

      @Common.Text       : ProjectProfileCode
      @Common.IsUpperCase: true
      @Common.Label      : 'Project Profile'
      @Common.Heading    : 'Prj.Prf'
  key ProjectProfileCode     : String(7) not null;

      @Common.Label      : 'Description'
      @Common.QuickInfo  : 'Text for Profile'
      ProjectProfileCodeText : String(40) not null;
      _ProjectProfileCode    : Association to one S4HC_ENTPROJECTPROFILECODE_0001.ProjectProfileCode {};
};
