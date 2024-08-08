using VisitorService as service from '../../srv/visitor/visitorService';

annotate service.Visitors with @(

  // Enable Create Button
  Capabilities.InsertRestrictions: {Insertable: true},
  // Enable Edit Button
  Capabilities.UpdateRestrictions: {Updatable: true},
  // Enable Delete Button
  Capabilities.DeleteRestrictions: {Deletable: true},
  UI                             : {
    UpdateHidden                  : false,
    // Mandatory (and optional) data for the main entity type of the model
    HeaderInfo                    : {
      $Type         : 'UI.HeaderInfoType',
      TypeName      : '{i18n>visitor}',
      TypeNamePlural: '{i18n>visitor-plural}',
      Title         : {
        $Type: 'UI.DataField',
        Value: name
      }
    },
    FieldGroup #GeneralData       : {
      $Type: 'UI.FieldGroupType',
      Data : [
        {
          $Type: 'UI.DataField',
          Value: name
        },
        {
          $Type: 'UI.DataField',
          Value: email
        },
      ],
    },
    FieldGroup #AdministrativeData: {
      $Type: 'UI.FieldGroupType',
      Data : [
        {
          $Type: 'UI.DataField',
          Value: createdBy
        },
        {
          $Type: 'UI.DataField',
          Value: createdAt
        },
        {
          $Type: 'UI.DataField',
          Value: modifiedBy
        },
        {
          $Type: 'UI.DataField',
          Value: modifiedAt
        }
      ]
    },
    // Collection of facets shown on the Object Page
    Facets                        : [
      {
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneralData',
        Label : '{i18n>generalData}',
        Target: '@UI.FieldGroup#GeneralData'
      },
      {
        $Type : 'UI.ReferenceFacet',
        Label : '{i18n>poetrySlamsData}',
        ID    : 'PoetrySlamsData',
        Target: 'visits/@UI.LineItem#PoetrySlamData'
      },
      {
        $Type : 'UI.ReferenceFacet',
        Label : '{i18n>administrativeData}',
        ID    : 'AdministrativeData',
        Target: '@UI.FieldGroup#AdministrativeData'
      }
    ],
    LineItem                      : [
      {
        $Type: 'UI.DataField',
        Value: name
      },
      {
        $Type: 'UI.DataField',
        Value: email
      }
    ],
    // Default filters on the list page
    SelectionFields               : [
      name,
      email
    ]
  }
);

annotate service.Visits with @(

UI: {
  HeaderInfo              : {
    TypeName      : '{i18n>booking}',
    TypeNamePlural: '{i18n>booking-plural}'
  },
  LineItem #PoetrySlamData: [
    {
      $Type                  : 'UI.DataField',
      Value                  : parent.title,
      ![@Common.FieldControl]: #Optional
    },
    {
      $Type                  : 'UI.DataField',
      Value                  : parent.dateTime,
      ![@Common.FieldControl]: #Optional
    },
    {
      $Type: 'UI.DataField',
      Value: artistIndicator
    }
  ]
});
