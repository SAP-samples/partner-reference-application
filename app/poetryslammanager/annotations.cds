using PoetrySlamManager as service from '../../srv/poetrySlamManagerService';

annotate service.PoetrySlams with {
    status                   @Common.Text: {
        $value                : status.name,
        ![@UI.TextArrangement]: #TextOnly
    };
    description              @UI.MultiLineText;
    ID                       @UI.Hidden;
    statusCriticality        @UI.Hidden;
    visitorsFeeCurrency      @UI.Hidden;
    createByDProjectEnabled  @UI.Hidden;
    createS4HCProjectEnabled @UI.Hidden;
};

annotate service.PoetrySlams with @(
    // Disable Delete Button for PoetrySlams not In Preperation and not canceled
    Capabilities.DeleteRestrictions: {Deletable: {$edmJson: {$If: [
        {$Or: [
            {$Eq: [
                {$Path: 'status/code'},
                1
            ]},
            {$Eq: [
                {$Path: 'status/code'},
                4
            ]}
        ]},
        true,
        false
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
                ![@UI.Hidden]: {$edmJson: {$If: [
                    {$Eq: [
                        {$Path: 'status/code'},
                        1
                    ]},
                    true,
                    false
                ]}}
            },
            {
                $Type : 'UI.ReferenceFacet',
                Label : '{i18n>administativeData}',
                ID    : 'AdministrativeData',
                Target: '@UI.FieldGroup#AdministrativeData'
            },
            {
                $Type : 'UI.CollectionFacet',
                Label : '{i18n>projectData}',
                ID    : 'ProjectData',
                Facets: [{
                    $Type : 'UI.ReferenceFacet',
                    Target: ![@UI.FieldGroup#ProjectData],
                    ID    : 'ProjectData'
                }]
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
                $Type     : 'UI.DataField',
                Label     : '{i18n>projectTypeCodeText}',
                Value     : toByDProject.typeCodeText,
                @UI.Hidden: {$edmJson: {$If: [
                    {$Eq: [
                        {$Path: 'projectSystem'},
                        'ByD'
                    ]},
                    false,
                    true
                ]}},
                ![@Common.FieldControl]: #ReadOnly
            },
            {
                $Type     : 'UI.DataField',
                Label     : '{i18n>projectStatusCodeText}',
                Value     : toByDProject.statusCodeText,
                @UI.Hidden: {$edmJson: {$If: [
                    {$Eq: [
                        {$Path: 'projectSystem'},
                        'ByD'
                    ]},
                    false,
                    true
                ]}},
                ![@Common.FieldControl]: #ReadOnly
            },
            {
                $Type     : 'UI.DataField',
                Label     : '{i18n>projectCostCenter}',
                Value     : toByDProject.costCenter,
                @UI.Hidden: {$edmJson: {$If: [
                    {$Eq: [
                        {$Path: 'projectSystem'},
                        'ByD'
                    ]},
                    false,
                    true
                ]}},
                ![@Common.FieldControl]: #ReadOnly
            },
            {
                $Type     : 'UI.DataField',
                Label     : '{i18n>projectStartDateTime}',
                Value     : toByDProject.startDateTime,
                @UI.Hidden: {$edmJson: {$If: [
                    {$Eq: [
                        {$Path: 'projectSystem'},
                        'ByD'
                    ]},
                    false,
                    true
                ]}},
                ![@Common.FieldControl]: #ReadOnly
            },
            {
                $Type     : 'UI.DataField',
                Label     : '{i18n>projectEndDateTime}',
                Value     : toByDProject.endDateTime,
                @UI.Hidden: {$edmJson: {$If: [
                    {$Eq: [
                        {$Path: 'projectSystem'},
                        'ByD'
                    ]},
                    false,
                    true
                ]}},
                ![@Common.FieldControl]: #ReadOnly
            },
            // S4HC specific fields
            {
                $Type                  : 'UI.DataField',
                Label                  : '{i18n>projectDescription}',
                Value                  : toS4HCProject.ProjectDescription,
                @UI.Hidden             : {$edmJson: {$If: [
                    {$Eq: [
                        {$Path: 'projectSystem'},
                        'S4HC'
                    ]},
                    false,
                    true
                ]}},
                ![@Common.FieldControl]: #ReadOnly
            },
            {
                $Type                  : 'UI.DataField',
                Label                  : '{i18n>projectProfile}',
                Value                  : projectProfileCodeText,
                @UI.Hidden             : {$edmJson: {$If: [
                    {$Eq: [
                        {$Path: 'projectSystem'},
                        'S4HC'
                    ]},
                    false,
                    true
                ]}},
                ![@Common.FieldControl]: #ReadOnly
            },
            {
                $Type                  : 'UI.DataField',
                Label                  : '{i18n>responsibleCostCenter}',
                Value                  : toS4HCProject.ResponsibleCostCenter,
                @UI.Hidden             : {$edmJson: {$If: [
                    {$Eq: [
                        {$Path: 'projectSystem'},
                        'S4HC'
                    ]},
                    false,
                    true
                ]}},
                ![@Common.FieldControl]: #ReadOnly
            },
            {
                $Type                  : 'UI.DataField',
                Label                  : '{i18n>processingStatus}',
                Value                  : processingStatusText,
                @UI.Hidden             : {$edmJson: {$If: [
                    {$Eq: [
                        {$Path: 'projectSystem'},
                        'S4HC'
                    ]},
                    false,
                    true
                ]}},
                ![@Common.FieldControl]: #ReadOnly
            },
            {
                $Type                  : 'UI.DataField',
                Label                  : '{i18n>projectStartDateTime}',
                Value                  : toS4HCProject.ProjectStartDate,
                @UI.Hidden             : {$edmJson: {$If: [
                    {$Eq: [
                        {$Path: 'projectSystem'},
                        'S4HC'
                    ]},
                    false,
                    true
                ]}},
                ![@Common.FieldControl]: #ReadOnly
            },
            {
                $Type                  : 'UI.DataField',
                Label                  : '{i18n>projectEndDateTime}',
                Value                  : toS4HCProject.ProjectEndDate,
                @UI.Hidden             : {$edmJson: {$If: [
                    {$Eq: [
                        {$Path: 'projectSystem'},
                        'S4HC'
                    ]},
                    false,
                    true
                ]}},
                ![@Common.FieldControl]: #ReadOnly
            }
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
                Action       : 'PoetrySlamManager.publish',
                Label        : '{i18n>publish}',
                ![@UI.Hidden]: {$edmJson: {$If: [
                    {$Eq: [
                        {$Path: 'IsActiveEntity'},
                        false
                    ]},
                    true,
                    false
                ]}}
            },
            {
                $Type        : 'UI.DataFieldForAction',
                Action       : 'PoetrySlamManager.cancel',
                Label        : '{i18n>cancel}',
                ![@UI.Hidden]: {$edmJson: {$If: [
                    {$Eq: [
                        {$Path: 'IsActiveEntity'},
                        false
                    ]},
                    true,
                    false
                ]}}
            },
            // Create a project in the connected ByD system
            {
                $Type     : 'UI.DataFieldForAction',
                Label     : '{i18n>createByDProject}',
                Action    : 'PoetrySlamManager.createByDProject',
                @UI.Hidden: {$edmJson: {$If: [
                    {$And: [
                        {$Eq: [
                            {$Path: 'createByDProjectEnabled'},
                            true
                        ]},
                        {$Eq: [
                            {$Path: 'IsActiveEntity'},
                            true
                        ]}
                    ]},
                    false,
                    true
                ]}}
            },
            // Create a project in the connected S4HC system
            {
                $Type        : 'UI.DataFieldForAction',
                Label        : '{i18n>createS4HCProject}',
                Action       : 'PoetrySlamManager.createS4HCProject',
                ![@UI.Hidden]: {$edmJson: {$If: [
                    {$And: [
                        {$Eq: [
                            {$Path: 'createS4HCProjectEnabled'},
                            true
                        ]},
                        {$Eq: [
                            {$Path: 'IsActiveEntity'},
                            true
                        ]}
                    ]},
                    false,
                    true
                ]}}
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
            dateTime,
            projectID,
            projectSystem,
            projectSystemName
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
    // Disable Create Button for Visits in case PoetrySlam is in Preparation
    Capabilities.InsertRestrictions: {Insertable: {$edmJson: {$If: [
        {$Eq: [
            {$Path: 'parent/status_code'},
            2
        ]},
        true,
        false
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
