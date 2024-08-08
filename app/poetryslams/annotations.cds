using PoetrySlamService as service from '../../srv/poetryslam/poetrySlamService';

annotate service.PoetrySlams with {
  status                       @Common.Text: {
    $value                : status.name,
    ![@UI.TextArrangement]: #TextOnly
  };
  description                  @UI.MultiLineText;
  ID                           @UI.Hidden;
  statusCriticality            @UI.Hidden;
  visitorsFeeCurrency          @UI.Hidden;
  projectObjectID              @UI.Hidden;
  createByDProjectEnabled      @UI.Hidden;
  isByD                        @UI.Hidden;
  createS4HCProjectEnabled     @UI.Hidden;
  isS4HC                       @UI.Hidden;
  purchaseOrderObjectID        @UI.Hidden;
  createB1PurchaseOrderEnabled @UI.Hidden;
  isB1                         @UI.Hidden;
};

annotate service.PoetrySlams with @(
  // Disable Delete Button for PoetrySlams not In Preperation and not canceled
  Capabilities.DeleteRestrictions: {Deletable: {$edmJson: {$Or: [
    {$Eq: [
      {$Path: 'status/code'},
      1
    ]},
    {$Eq: [
      {$Path: 'status/code'},
      4
    ]}
  ]}}},
  Common                         : {
    // Reload target on UI in case source is changed
    SideEffects #maxVisitorsNumber: {
      $Type           : 'Common.SideEffectsType',
      SourceProperties: ['maxVisitorsNumber'],
      TargetProperties: [
        'freeVisitorSeats',
        'status_code',
        'statusCriticality'
      ]
    },
    SideEffects #visits           : {
      $Type           : 'Common.SideEffectsType',
      SourceEntities  : ['visits'],
      TargetProperties: [
        'freeVisitorSeats',
        'status_code',
        'statusCriticality'
      ]
    },
    SemanticKey                   : [number]
  },
  UI                             : {
    // Fields with special visualization or fields shown in the header of the object page
    DataPoint #bookedSeats        : {
      Title        : '{i18n>bookedSeatsTitle}',
      Value        : bookedSeats,
      Visualization: #Progress,
      TargetValue  : maxVisitorsNumber
    },
    DataPoint #dateTime           : {
      $Type: 'UI.DataPointType',
      Value: dateTime,
      Title: '{i18n>dateTime}'
    },
    DataPoint #status_code        : {
      $Type      : 'UI.DataPointType',
      Value      : status_code,
      Title      : '{i18n>status}',
      Criticality: statusCriticality
    },
    DataPoint #visitorsFeeAmount  : {
      $Type: 'UI.DataPointType',
      Value: visitorsFeeAmount,
      Title: '{i18n>visitorsFeeAmount}'
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
        $Type        : 'UI.ReferenceFacet',
        Label        : '{i18n>visitorData}',
        ID           : 'VisitorData',
        Target       : 'visits/@UI.LineItem#VisitorData',
        // Hide facet in case the PoetrySlam is in status In Preparation
        ![@UI.Hidden]: {$edmJson: {$Eq: [
          {$Path: 'status/code'},
          1
        ]}}
      },
      {
        $Type        : 'UI.ReferenceFacet',
        Label        : '{i18n>projectData}',
        ID           : 'ProjectData',
        Target       : @UI.FieldGroup #ProjectData,
        ![@UI.Hidden]: {$edmJson: {$Not: {$Or: [
          {$Path: 'isByD'},
          {$Path: 'isS4HC'}
        ]}}} // Display ProjectData only in case a SAP Business ByDesign or SAP S/4HANA Cloud system is connected
      },
      {
        $Type        : 'UI.ReferenceFacet',
        Label        : '{i18n>purchaseOrderData}',
        ID           : 'PurchaseOrderData',
        Target       : '@UI.FieldGroup#PurchaseOrderData',
        ![@UI.Hidden]: {$edmJson: {$Not: {$Path: 'isB1'}}} // Display PurchaseOrderData only in case a SAP Business One system is connected
      },
      {
        $Type : 'UI.ReferenceFacet',
        Label : '{i18n>administrativeData}',
        ID    : 'AdministrativeData',
        Target: '@UI.FieldGroup#AdministrativeData'
      }
    ],
    // Bundle multiple fields into a group
    FieldGroup #CreatedByAndOn    : {
      $Type: 'UI.FieldGroupType',
      Data : [
        {
          $Type: 'UI.DataField',
          Value: createdBy
        },
        {
          $Type: 'UI.DataField',
          Value: createdAt
        }
      ]
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
    FieldGroup #GeneralData       : {
      $Type: 'UI.FieldGroupType',
      Data : [
        {
          $Type: 'UI.DataField',
          Value: number
        },
        {
          $Type: 'UI.DataField',
          Value: status.code
        },
        {
          $Type: 'UI.DataField',
          Value: title
        },
        {
          $Type: 'UI.DataField',
          Value: description
        },
        {
          $Type: 'UI.DataField',
          Value: dateTime
        },
        {
          $Type: 'UI.DataField',
          Value: visitorsFeeAmount
        },
        {
          $Type: 'UI.DataField',
          Value: visitorsFeeCurrency_code
        },
        {
          $Type: 'UI.DataField',
          Value: maxVisitorsNumber
        },
        {
          $Type: 'UI.DataField',
          Value: freeVisitorSeats
        }
      ]
    },
    FieldGroup #ProjectData       : {Data: [
      // Project system independend fields:
      {
        $Type: 'UI.DataFieldWithUrl',
        Value: projectID,
        Url  : projectURL
      },
      {
        $Type: 'UI.DataField',
        Value: projectSystemName
      },
      {
        $Type: 'UI.DataField',
        Value: projectSystem
      },
      // SAP Business ByDesign specific fields
      {
        $Type                  : 'UI.DataField',
        Label                  : '{i18n>projectTypeCodeText}',
        Value                  : toByDProject.typeCodeText,
        ![@UI.Hidden]          : {$edmJson: {$Not: {$Path: 'isByD'}}},
        ![@Common.FieldControl]: #ReadOnly
      },
      {
        $Type                  : 'UI.DataField',
        Label                  : '{i18n>projectStatusCodeText}',
        Value                  : toByDProject.statusCodeText,
        @UI.Hidden             : {$edmJson: {$Not: {$Path: 'isByD'}}},
        ![@Common.FieldControl]: #ReadOnly
      },
      {
        $Type                  : 'UI.DataField',
        Label                  : '{i18n>projectCostCenter}',
        Value                  : toByDProject.costCenter,
        ![@UI.Hidden]          : {$edmJson: {$Not: {$Path: 'isByD'}}},
        ![@Common.FieldControl]: #ReadOnly
      },
      {
        $Type                  : 'UI.DataField',
        Label                  : '{i18n>projectStartDateTime}',
        Value                  : toByDProject.startDateTime,
        ![@UI.Hidden]          : {$edmJson: {$Not: {$Path: 'isByD'}}},
        ![@Common.FieldControl]: #ReadOnly
      },
      {
        $Type                  : 'UI.DataField',
        Label                  : '{i18n>projectEndDateTime}',
        Value                  : toByDProject.endDateTime,
        ![@UI.Hidden]          : {$edmJson: {$Not: {$Path: 'isByD'}}},
        ![@Common.FieldControl]: #ReadOnly
      },
      // SAP S/4HANA Cloud specific fields
      {
        $Type                  : 'UI.DataField',
        Label                  : '{i18n>projectDescription}',
        Value                  : toS4HCProject.projectDescription,
        ![@UI.Hidden]          : {$edmJson: {$Not: {$Path: 'isS4HC'}}},
        ![@Common.FieldControl]: #ReadOnly
      },
      {
        $Type                  : 'UI.DataField',
        Label                  : '{i18n>projectProfile}',
        Value                  : projectProfileCodeText,
        ![@UI.Hidden]          : {$edmJson: {$Not: {$Path: 'isS4HC'}}},
        ![@Common.FieldControl]: #ReadOnly
      },
      {
        $Type                  : 'UI.DataField',
        Label                  : '{i18n>responsibleCostCenter}',
        Value                  : toS4HCProject.responsibleCostCenter,
        ![@UI.Hidden]          : {$edmJson: {$Not: {$Path: 'isS4HC'}}},
        ![@Common.FieldControl]: #ReadOnly
      },
      {
        $Type                  : 'UI.DataField',
        Label                  : '{i18n>processingStatus}',
        Value                  : processingStatusText,
        ![@UI.Hidden]          : {$edmJson: {$Not: {$Path: 'isS4HC'}}},
        ![@Common.FieldControl]: #ReadOnly
      },
      {
        $Type                  : 'UI.DataField',
        Label                  : '{i18n>projectStartDateTime}',
        Value                  : toS4HCProject.projectStartDate,
        ![@UI.Hidden]          : {$edmJson: {$Not: {$Path: 'isS4HC'}}},
        ![@Common.FieldControl]: #ReadOnly
      },
      {
        $Type                  : 'UI.DataField',
        Label                  : '{i18n>projectEndDateTime}',
        Value                  : toS4HCProject.projectEndDate,
        ![@UI.Hidden]          : {$edmJson: {$Not: {$Path: 'isS4HC'}}},
        ![@Common.FieldControl]: #ReadOnly
      },
    ]},
    FieldGroup #PurchaseOrderData : {Data: [
      // SAP Business One specific fields
      {
        $Type: 'UI.DataFieldWithUrl',
        Label: '{i18n>purchaseOrderID}',
        Value: purchaseOrderID,
        Url  : purchaseOrderURL
      },
      {
        $Type: 'UI.DataField',
        Label: '{i18n>purchaseOrderSystemName}',
        Value: purchaseOrderSystem
      },
      {
        $Type                  : 'UI.DataField',
        Label                  : '{i18n>deliveryDate}',
        Value                  : toB1PurchaseOrder.docDueDate,
        ![@Common.FieldControl]: #ReadOnly
      },
      {
        $Type                  : 'UI.DataField',
        Label                  : '{i18n>creationDate}',
        Value                  : toB1PurchaseOrder.creationDate,
        ![@Common.FieldControl]: #ReadOnly
      },
      {
        $Type                  : 'UI.DataField',
        Label                  : '{i18n>purchaseOrderValue}',
        Value                  : toB1PurchaseOrder.docTotal,
        ![@Common.FieldControl]: #ReadOnly
      },
      {
        $Type                  : 'UI.DataField',
        Label                  : '{i18n>purchaseOrderCurrency}',
        Value                  : toB1PurchaseOrder.docCurrency,
        ![@Common.FieldControl]: #ReadOnly
      },
    ]},
    // Facets shown in the header of an object page
    HeaderFacets                  : [
      {
        $Type : 'UI.ReferenceFacet',
        ID    : 'dateTime',
        Target: '@UI.DataPoint#dateTime'
      },
      {
        $Type : 'UI.ReferenceFacet',
        ID    : 'bookedSeats',
        Target: '@UI.DataPoint#bookedSeats'
      },
      {
        $Type : 'UI.ReferenceFacet',
        ID    : 'visitorsFeeAmount',
        Target: '@UI.DataPoint#visitorsFeeAmount'
      },
      {
        $Type : 'UI.ReferenceFacet',
        ID    : 'status_code',
        Target: '@UI.DataPoint#status_code'
      },
      {
        $Type : 'UI.ReferenceFacet',
        ID    : 'CreatedByAndOn',
        Target: '@UI.FieldGroup#CreatedByAndOn'
      }
    ],
    // Mandatory (and optional) data for the main entity type of the model
    HeaderInfo                    : {
      $Type         : 'UI.HeaderInfoType',
      TypeName      : '{i18n>poetrySlam}',
      TypeNamePlural: '{i18n>poetrySlam-plural}',
      Title         : {
        $Type: 'UI.DataField',
        Value: number
      },
      Description   : {
        $Type: 'UI.DataField',
        Value: description
      }
    },
    // Addition of custom actions to the list page & object page
    Identification                : [
      {
        $Type        : 'UI.DataFieldForAction',
        Action       : 'PoetrySlamService.publish',
        Label        : '{i18n>publish}',
        ![@UI.Hidden]: {$edmJson: {$Not: {$Path: 'IsActiveEntity'}}}
      },
      {
        $Type        : 'UI.DataFieldForAction',
        Action       : 'PoetrySlamService.cancel',
        Label        : '{i18n>cancel}',
        ![@UI.Hidden]: {$edmJson: {$Not: {$Path: 'IsActiveEntity'}}}
      },
      // Create a project in the connected SAP Business ByDesign system
      {
        $Type     : 'UI.DataFieldForAction',
        Label     : '{i18n>createByDProject}',
        Action    : 'PoetrySlamService.createByDProject',
        @UI.Hidden: {$edmJson: {$Not: {$And: [
          {$Path: 'createByDProjectEnabled'},
          {$Path: 'IsActiveEntity'}
        ]}}}
      },
      // Create a project in the connected SAP S/4HANA Cloud system
      {
        $Type        : 'UI.DataFieldForAction',
        Label        : '{i18n>createS4HCProject}',
        Action       : 'PoetrySlamService.createS4HCProject',
        ![@UI.Hidden]: {$edmJson: {$Not: {$And: [
          {$Path: 'createS4HCProjectEnabled'},
          {$Path: 'IsActiveEntity'}
        ]}}}
      },
      // Create a purchase order in the connected SAP Business One system
      {
        $Type        : 'UI.DataFieldForAction',
        Label        : '{i18n>createB1PurchaseOrder}',
        Action       : 'PoetrySlamService.createB1PurchaseOrder',
        ![@UI.Hidden]: {$edmJson: {$Not: {$And: [
          {$Path: 'createB1PurchaseOrderEnabled'},
          {$Path: 'IsActiveEntity'}
        ]}}}
      }
    ],
    // Definition of fields shown on the list page / table
    LineItem                      : [
      {
        $Type : 'UI.DataFieldForAction',
        Action: 'PoetrySlamService.cancel'
      },
      {
        $Type : 'UI.DataFieldForAction',
        Action: 'PoetrySlamService.publish'
      },
      {
        $Type: 'UI.DataField',
        Value: number
      },
      {
        $Type: 'UI.DataField',
        Value: title
      },
      {
        $Type: 'UI.DataField',
        Value: description
      },
      {
        $Type      : 'UI.DataField',
        Value      : status_code,
        Criticality: statusCriticality
      },
      {
        $Type: 'UI.DataField',
        Value: dateTime
      },
      {
        $Type : 'UI.DataFieldForAnnotation',
        Target: '@UI.DataPoint#bookedSeats'
      },
      {
        $Type: 'UI.DataFieldWithUrl',
        Value: projectID,
        Url  : projectURL
      },
      {
        $Type: 'UI.DataFieldWithUrl',
        Value: purchaseOrderID,
        Url  : purchaseOrderURL
      }
    ],
    // Default filters on the list page
    SelectionFields               : [
      number,
      title,
      description,
      status_code,
      dateTime
    ]
  }
);

annotate service.Visits with {
  visitor @(Common: {
    // Visualization of a value list
    // Shows name and email in the value list
    // Returns corresponding visitor ID
    ValueList      : {
      CollectionPath: 'Visitors',
      Parameters    : [
        {
          $Type            : 'Common.ValueListParameterOut',
          LocalDataProperty: 'visitor_ID',
          ValueListProperty: 'ID'
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'name'
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'email'
        }
      ]
    },
    // Shows the name instead of the ID in the UI
    Text           : visitor.name,
    TextArrangement: #TextOnly,
    Label          : '{i18n>name}'
  });
  status  @readonly  @Common.Text: {
    $value                : status.name,
    ![@UI.TextArrangement]: #TextOnly
  };
};

annotate service.Visits with @(
  // Enable Create Button for Visits in case PoetrySlam is published
  Capabilities.InsertRestrictions: {Insertable: {$edmJson: {$Eq: [
    {$Path: 'parent/status_code'},
    2
  ]}}},
  Common                         : {SideEffects #VisitorData: {
    $Type           : 'Common.SideEffectsType',
    SourceProperties: ['visitor_ID'],
    TargetProperties: [
      'status_code',
      'statusCriticality',
      'parent/status_code',
      'parent/statusCriticality',
      'parent/freeVisitorSeats'
    ],
    TargetEntities  : ['visitor']
  }},
  UI                             : {
    UpdateHidden                  : true,
    HeaderInfo                    : {
      TypeName      : '{i18n>visits}',
      TypeNamePlural: '{i18n>visits-plural}',
      Title         : {
        $Type: 'UI.DataField',
        Value: parent.title,
      }
    },
    LineItem #VisitorData         : [
      {
        $Type: 'UI.DataField',
        Value: visitor_ID
      },
      {
        $Type: 'UI.DataField',
        Value: visitor.email
      },
      {
        $Type: 'UI.DataField',
        Value: artistIndicator
      },
      {
        $Type      : 'UI.DataField',
        Value      : status_code,
        Criticality: statusCriticality,
        Label      : '{i18n>status}'
      },
      {
        $Type : 'UI.DataFieldForAction',
        Action: 'PoetrySlamService.cancelVisit',
        Label : '{i18n>cancelVisit}'
      },
      {
        $Type : 'UI.DataFieldForAction',
        Action: 'PoetrySlamService.confirmVisit',
        Label : '{i18n>confirmVisit}'
      }
    ],
    Facets                        : [
      {
        $Type : 'UI.ReferenceFacet',
        Label : '{i18n>visitor}',
        ID    : 'Visitor',
        Target: '@UI.FieldGroup#VisitorData'
      },
      {
        $Type : 'UI.ReferenceFacet',
        Label : '{i18n>administrativeData}',
        ID    : 'AdministrativeData',
        Target: '@UI.FieldGroup#AdministrativeData'
      }
    ],
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
    FieldGroup #VisitorData       : {
      $Type: 'UI.FieldGroupType',
      Data : [
        {
          $Type: 'UI.DataField',
          Value: visitor.name
        },
        {
          $Type: 'UI.DataField',
          Value: visitor.email
        },
        {
          $Type: 'UI.DataField',
          Value: artistIndicator
        },
        {
          $Type      : 'UI.DataField',
          Value      : status.code,
          Criticality: statusCriticality
        }
      ]
    }
  }
);

annotate service.Visitors with {
  ID   @(Common: {
    Text           : email,
    TextArrangement: #TextOnly,
    Label          : '{i18n>email}'
  });
  name @readonly;
};
