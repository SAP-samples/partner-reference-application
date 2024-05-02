using PoetrySlamManager as service from '../../srv/poetrySlamManagerService';

annotate service.PoetrySlams with {
    status              @Common.Text: {
        $value                : status.name,
        ![@UI.TextArrangement]: #TextOnly
    };
    description         @UI.MultiLineText;
    ID                  @UI.Hidden;
    statusCriticality   @UI.Hidden;
    visitorsFeeCurrency @UI.Hidden;
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
                Action       : 'PoetrySlamManager.publish',
                Label        : '{i18n>publish}',
                ![@UI.Hidden]: {$edmJson: {$Not: {$Path: 'IsActiveEntity'}}}
            },
            {
                $Type        : 'UI.DataFieldForAction',
                Action       : 'PoetrySlamManager.cancel',
                Label        : '{i18n>cancel}',
                ![@UI.Hidden]: {$edmJson: {$Not: {$Path: 'IsActiveEntity'}}}
            }
        ],
        // Definition of fields shown on the list page / table
        LineItem                      : [
            {
                $Type : 'UI.DataFieldForAction',
                Action: 'PoetrySlamManager.cancel'
            },
            {
                $Type : 'UI.DataFieldForAction',
                Action: 'PoetrySlamManager.publish'
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
        // Shows email and name in the value list
        // Returns corresponding visitor id
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
                    ValueListProperty: 'email'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'name'
                }
            ]
        },
        // Shows the email instead of the id in the UI
        Text           : visitor.email,
        TextArrangement: #TextOnly,
        Label          : '{i18n>email}'
    });
    status  @readonly  @Common.Text: {
        $value                : status.name,
        ![@UI.TextArrangement]: #TextOnly
    };
};

annotate service.Visits with @(
    // Enable Create Button for Visits in case PoetrySlam published
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
        HeaderInfo           : {
            TypeName      : '{i18n>visit}',
            TypeNamePlural: '{i18n>visits}'
        },
        LineItem #VisitorData: [
            {
                $Type: 'UI.DataField',
                Value: visitor_ID
            },
            {
                $Type: 'UI.DataField',
                Value: visitor.name
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
                Action: 'PoetrySlamManager.cancelVisit',
                Label : '{i18n>cancelVisit}'
            },
            {
                $Type : 'UI.DataFieldForAction',
                Action: 'PoetrySlamManager.confirmVisit',
                Label : '{i18n>confirmVisit}'
            }
        ]
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