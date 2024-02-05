# Integrate the SAP BTP Application with SAP S/4HANA Cloud Public Edition

In this section, you enhance Poetry Slam Manager, your SAP BTP application, to make sure that it supports SAP S/4HANA Cloud Public Edition as back end. 

Front-end integration:
1. Navigate from Poetry Slam Manager to related SAP S/4HANA Cloud Public Edition enterprise projects.

Back-channel integration:

2. Create SAP S/4HANA Cloud Public Edition enterprise projects from Poetry Slam Manager and display SAP S/4HANA Cloud Public Edition project information on the Poetry Slam Manager UI using OData APIs with principal propagation.

## Consume SAP S/4HANA Cloud Public Edition OData APIs

In this section, you learn how to import the SAP S/4HANA Cloud Public Edition OData service as a "remote service" into the SAP Cloud Application Programming Model project and how to use the OData service to create SAP S/4HANA Cloud Public Edition enterprise projects to plan and run poetry slam events.

### Import SAP S/4HANA Cloud Public Edition OData Services

You use the SAP S/4HANA Cloud Public Edition OData services for enterprise projects to read and write SAP S/4HANA Cloud Public Edition projects in the context of a user interaction. 

1. In SAP S/4HANA Cloud Public Edition, to create an *.edmx* file from SAP S/4HANA Cloud Public Edition OData services, search for the following OData APIs on the [SAP API Business Hub](https://api.sap.com/package/SAPS4HANACloud/all).

2. Download the metadata files (*.edmx* files) from the *API Specification* section:
    - [*Enterprise Project*](https://api.sap.com/api/API_ENTERPRISE_PROJECT_SRV_0002/overview) (OData v2)
    - [*Enterprise Project - Read Project Processing Status*](https://api.sap.com/api/ENTPROJECTPROCESSINGSTATUS_0001/overview) (OData v4)
    - [*Enterprise Project - Read Project Profile*](https://api.sap.com/api/ENTPROJECTPROFILECODE_0001/overview) (OData v4)
2. Rename the metadata files (*.edmx* files) and add the prefix `S4HC_` to avoid naming conflicts:
    -  `S4HC_API_ENTERPRISE_PROJECT_SRV_0002.edmx`
    -  `S4HC_ENTPROJECTPROCESSINGSTATUS_0001.edmx`
    -  `S4HC_ENTPROJECTPROFILECODE_0001.edmx`

3. In SAP Business Application Studio, to import the SAP S/4HANA Cloud Public Edition OData service into the SAP Cloud Application Programming Model (CAP) project, create a folder with the name `external_resources` in the root folder of the application.

4. Open the context menu of the *./external_resources* folder and upload the *.edmx* file with the OData services as remote services.

5. Open a terminal. Navigate to the root folder of the application (normally, by default), and import the remote service using the command:  

    `cds import ./external_resources/S4HC_API_ENTERPRISE_PROJECT_SRV_0002.edmx --as cds`. 

    Repeat the `cds import` command for the other two services:
    - `cds import ./external_resources/S4HC_ENTPROJECTPROCESSINGSTATUS_0001.edmx --as cds` 
    - `cds import ./external_resources/S4HC_ENTPROJECTPROFILECODE_0001.edmx --as cds` 

    As a result, the system creates CDS files in the folder *./srv/external* for all remote services and enhanced the file *package.json* by CDS configurations referring to the remote services.

    > Note: Don't use the CDS import command parameter `--keep-namespace` because it would lead to service name clashes if you import multiple SAP S/4HANA Cloud Public Edition OData services.

6. Enhance the file [*package.json*](../../../tree/main-multi-tenant/package.json) by development configurations for local testing and to refer to the destinations used for productive setups:  

    ```json
        "cds": {
            "S4HC_API_ENTERPRISE_PROJECT_SRV_0002": {
                "kind": "odata-v2",
                "model": "srv/external/S4HC_API_ENTERPRISE_PROJECT_SRV_0002",
                "[development]": {
                "credentials": {
                    "url": "https://{{S4HC-hostname}}/sap/opu/odata/sap/API_ENTERPRISE_PROJECT_SRV;v=0002",
                    "authentication": "BasicAuthentication",
                    "username": "{{test-user}}",
                    "password": "{{test-password}}"
                }
                },
                "[production]": {
                "credentials": {
                    "destination": "s4hc",
                    "path": "/sap/opu/odata/sap/API_ENTERPRISE_PROJECT_SRV;v=0002"
                }
                }
            },
            "S4HC_ENTPROJECTPROCESSINGSTATUS_0001": {
                "kind": "odata",
                "model": "srv/external/S4HC_ENTPROJECTPROCESSINGSTATUS_0001",
                "[development]": {
                "credentials": {
                    "url": "https://{{S4HC-hostname}}/sap/opu/odata4/sap/api_entprojprocessingstat/srvd_a2x/sap/entprojectprocessingstatus/0001",
                    "authentication": "BasicAuthentication",
                    "username": "{{test-user}}",
                    "password": "{{test-password}}"
                }
                },
                "[production]": {
                "credentials": {
                    "destination": "s4hc-tech-user",
                    "path": "/sap/opu/odata4/sap/api_entprojprocessingstat/srvd_a2x/sap/entprojectprocessingstatus/0001"
                }
                }
            },
            "S4HC_ENTPROJECTPROFILECODE_0001": {
                "kind": "odata",
                "model": "srv/external/S4HC_ENTPROJECTPROFILECODE_0001",
                "[development]": {
                "credentials": {
                    "url": "https://{{S4HC-hostname}}/sap/opu/odata4/sap/api_entprojectprofilecode/srvd_a2x/sap/entprojectprofilecode/0001",
                    "authentication": "BasicAuthentication",
                    "username": "{{test-user}}",
                    "password": "{{test-password}}"
                }
                },
                "[production]": {
                "credentials": {
                    "destination": "s4hc-tech-user",
                    "path": "/sap/opu/odata4/sap/api_entprojectprofilecode/srvd_a2x/sap/entprojectprofilecode/0001"
                }
                }
            }
        },
    ```

    > Note: The *package.json* refers to the destinations *s4hc* and *s4hc-tech-user* that must be created in the consumer SAP BTP subaccount. The destination *s4hc* is used for remote service calls with principal propagation. See the next section for more details.

    > Note: For local testing, replace `{{S4HC-hostname}}`, `{{test-user}}`, and `{{test-password}}` with a system, user, and password from SAP S/4HANA Cloud Public Edition. However, don't push this information to your GitHub repository.

### Enhance the Service Model by the Remote Service

1. In SAP Business Application Studio, to extend the SAP Cloud Application Programming Model service model by remote entities, open the service models file [*poetrySlamManagerService.cds*](../../../tree/main-multi-tenant/srv/poetrySlamManagerService.cds).

2. Expose SAP S/4HANA Cloud Public Edition project data throughout the SAP Cloud Application Programming Model service model for principal propagation:

    ```javascript
        // -------------------------------------------------------------------------------
        // Extend service PoetrySlamManager by S/4 projects (principal propagation)

        using { S4HC_API_ENTERPRISE_PROJECT_SRV_0002 as RemoteS4HCProject } from './external/S4HC_API_ENTERPRISE_PROJECT_SRV_0002';

        extend service PoetrySlamManager with {
            entity S4HCProjects                   as
                projection on RemoteS4HCProject.A_EnterpriseProject {
                    key ProjectUUID                 as ProjectUUID,
                        ProjectInternalID           as ProjectInternalID,
                        Project                     as Project,
                        ProjectDescription          as ProjectDescription,
                        EnterpriseProjectType       as EnterpriseProjectType,
                        ProjectStartDate            as ProjectStartDate,
                        ProjectEndDate              as ProjectEndDate,
                        ProcessingStatus            as ProcessingStatus,
                        ResponsibleCostCenter       as ResponsibleCostCenter,
                        ProfitCenter                as ProfitCenter,
                        ProjectProfileCode          as ProjectProfileCode,
                        CompanyCode                 as CompanyCode,
                        ProjectCurrency             as ProjectCurrency,
                        EntProjectIsConfidential    as EntProjectIsConfidential,
                        to_EnterpriseProjectElement as to_EnterpriseProjectElement : redirected to S4HCEnterpriseProjectElement,
                        to_EntProjTeamMember        as to_EntProjTeamMember        : redirected to S4HCEntProjTeamMember
            }

            entity S4HCEnterpriseProjectElement   as
                projection on RemoteS4HCProject.A_EnterpriseProjectElement {
                    key ProjectElementUUID        as ProjectElementUUID,
                        ProjectUUID               as ProjectUUID,
                        ProjectElement            as ProjectElement,
                        ProjectElementDescription as ProjectElementDescription,
                        PlannedStartDate          as PlannedStartDate,
                        PlannedEndDate            as PlannedEndDate
                }

            entity S4HCEntProjTeamMember          as
                projection on RemoteS4HCProject.A_EnterpriseProjectTeamMember {
                    key TeamMemberUUID        as TeamMemberUUID,
                        ProjectUUID           as ProjectUUID,
                        BusinessPartnerUUID   as BusinessPartnerUUID,
                        to_EntProjEntitlement as to_EntProjEntitlement : redirected to S4HCEntProjEntitlement
                }

            entity S4HCEntProjEntitlement         as
                projection on RemoteS4HCProject.A_EntTeamMemberEntitlement {
                    key ProjectEntitlementUUID as ProjectEntitlementUUID,
                        TeamMemberUUID         as TeamMemberUUID,
                        ProjectRoleType        as ProjectRoleType
                }
        };

        // Extend service PoetrySlamManager by S4HC Projects ProjectProfileCode
        using { S4HC_ENTPROJECTPROCESSINGSTATUS_0001 as RemoteS4HCProjectProcessingStatus } from './external/S4HC_ENTPROJECTPROCESSINGSTATUS_0001';

        extend service PoetrySlamManager with {
            entity S4HCProjectsProcessingStatus   as
                projection on RemoteS4HCProjectProcessingStatus.ProcessingStatus {
                    key ProcessingStatus     as ProcessingStatus,
                        ProcessingStatusText as ProcessingStatusText
                }
        };

        // Extend service PoetrySlamManager by S4HC Projects ProcessingStatus
        using { S4HC_ENTPROJECTPROFILECODE_0001 as RemoteS4HCProjectProjectProfileCode } from './external/S4HC_ENTPROJECTPROFILECODE_0001';

        extend service PoetrySlamManager with {
            entity S4HCProjectsProjectProfileCode as
                projection on RemoteS4HCProjectProjectProfileCode.ProjectProfileCode {
                    key ProjectProfileCode     as ProjectProfileCode,
                        ProjectProfileCodeText as ProjectProfileCodeText
                }
        };

    ```

2. Enhance the service model of service *PoetrySlamManager* by an association to the remote project in SAP S/4HANA Cloud:

    ```javascript
    // Poetry Slams (combined with remote project using mixin)
    @odata.draft.enabled
    entity PoetrySlams as select from poetrySlamManagerModel.PoetrySlams
        mixin {
            // S4HC projects: Mix-in of S4HC project data
            toS4HCProject: Association to RemoteS4HCProject.A_EnterpriseProject on toS4HCProject.Project = $projection.projectID
        } 
    ```

3. Enhance the service model of service *PoetrySlamManager* by virtual elements to control the visualization of actions and the coloring of status information:
    ```javascript
    // Poetry slams (combined with remote project using mixin)
    @odata.draft.enabled
    entity PoetrySlams as select from poetrySlamManagerModel.PoetrySlams
        mixin {
            // S4HC projects: Mix-in of S4HC project data
            toS4HCProject: Association to RemoteS4HCProject.A_EnterpriseProject on toS4HCProject.Project = $projection.projectID
        } 
        into  {
            *,
            virtual null as statusCriticality    : Integer @title : '{i18n>statusCriticality}',
            virtual null as projectSystemName    : String  @title : '{i18n>projectSystemName}' @odata.Type : 'Edm.String',

            // S4HC projects: visibility of button "Create project in S4HC", code texts
            virtual null as createS4HCProjectEnabled : Boolean  @title : '{i18n>createS4HCProjectEnabled}'  @odata.Type : 'Edm.Boolean',
            toS4HCProject,
            virtual null as projectProfileCodeText : String @title : '{i18n>projectProfile}' @odata.Type : 'Edm.String',
            virtual null as processingStatusText   : String @title : '{i18n>processingStatus}' @odata.Type : 'Edm.String',
        }
    ```
    
4. Enhance the service model of service *PoetrySlamManager* by an action to create remote projects:
    ```javascript
    // S4HC projects: action to create a project in S4HC
    @(
        Common.SideEffects              : {TargetEntities: ['_poetryslam','_poetryslam/toS4HCProject']},
        cds.odata.bindingparameter.name : '_poetryslam'
    )
    action createS4HCProject() returns PoetrySlams;
    ```
    > Note: The side effect annotation refreshes the project data right after executing the action.


### Enhance the Authentication Model to Cover Remote Projects

1. In SAP Business Application Studio, to extend the authorization annotation of the SAP Cloud Application Programming Model service model by restrictions referring to the remote services, open the file [*poetrySlamManagerServiceAuthorizations.cds*](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceAuthorizations.cds) with the authorization annotations.

2. Enhance the authorization model for the service entities *S4HCProjects*, *S4HCEnterpriseProjectElement*, *S4HCEntProjTeamMember*, and *S4HCEntProjEntitlement*:
    ```javascript
    // S/4 projects: Managers and Administrators can read and create remote projects
    annotate PoetrySlamManager.S4HCProjects with @(restrict : [
        {
            grant : ['*'],
            to    : 'PoetrySlamFull',
        }
    ]);
    annotate PoetrySlamManager.S4HCEnterpriseProjectElement with @(restrict : [
        {
            grant : ['*'],
            to    : 'PoetrySlamFull',
        }
    ]);
    annotate PoetrySlamManager.S4HCEntProjTeamMember with @(restrict : [
        {
            grant : ['*'],
            to    : 'PoetrySlamFull',
        }
    ]);
    annotate PoetrySlamManager.S4HCEntProjEntitlement with @(restrict : [
        {
            grant : ['*'],
            to    : 'PoetrySlamFull',
        }
    ]);
    annotate PoetrySlamManager.S4HCProjectsProjectProfileCode with @(restrict : [
        {
            grant : ['*'],
            to    : 'PoetrySlamFull',
        }
    ]);
    annotate PoetrySlamManager.S4HCProjectsProcessingStatus with @(restrict : [
        {
            grant : ['*'],
            to    : 'PoetrySlamFull',
        }
    ]);
    ```
    
### Create a File with Reuse Functions for SAP S/4HANA Cloud Public Edition

Reuse functions specific to SAP S/4HANA Cloud Public Edition are defined in a separate file. 


Copy the SAP S/4HANA Cloud Public Edition reuse functions in the file [*connector-s4hc.js*](../../../tree/main-multi-tenant/srv/connector-s4hc.js) into your project.

For this tutorial, the *Responsible Cost Center* used in *connector-s4hc.js* is *10101101* and the *Company Code* is *1010*. 

> Note: Sample data can vary depending on the system. Check the data set and maintain it accordingly to ensure consistency between the Partner Reference App and SAP S/4HANA Cloud Public Edition.

### Enhance the Business Logic to Operate on SAP S/4HANA Cloud Public Edition Data

In SAP Business Application Studio, enhance the implementation of the SAP Cloud Application Programming Model services in the file [*poetrySlamManagerServiceImplementation.js*](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceImplementation.js) to create and read SAP S/4HANA Cloud Public Edition enterprise project data using the remote SAP S/4HANA Cloud Public Edition OData service.

1. Delegate requests to the remote OData service. Therefore, copy the on-READ, on-CREATE, on-UPDATE, and on-DELETE methods of the *S4HCProjects*, *S4HCEnterpriseProjectElement*, *S4HCEntProjEntitlement*, *S4HCEntProjTeamMember*, *S4HCProjectsProcessingStatus*, and *S4HCProjectsProjectProfileCode* from the [service implementations (refer to the end of the file)](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceImplementation.js).

    > Note: Without delegation, the remote entities return the error code 500 with message: *SQLITE_ERROR: no such table* (local testing).

2.  Determine the connected back-end systems.

    ```javascript
    // Check connected backend systems
    srv.before("READ", "PoetrySlams", async (req) => {
        // S4HC
        S4HCIsConnectedIndicator = await destinationUtil.checkDestination(req,"s4hc");  
        S4HCSystemName           = await destinationUtil.getDestinationDescription(req,"s4hc-url");
    });
    ```
    > Note: The reuse function *getDestinationDescription* in the file [*destination.js*](../../../tree/main-multi-tenant/srv/util/destination.js) returns the destination description from the SAP BTP consumer subaccount.

    > Note: The destinations called *s4hc* and *s4hc-url* connect to the ERP system. You create the destinations later on in the consumer subaccount in SAP BTP.

3.  Set the virtual element *createS4HCProjectEnabled* to control the visualization of the action to create projects dynamically in the for loop of the after-read event of poetry slams and pass on the project system name:
    ```javascript
    // Update project system name and visibility of the "Create Project in S4HC"-button
    poetrySlam.projectSystemName = poetrySlam.projectSystemName ?? '';
    poetrySlam.processingStatusText = poetrySlam.processingStatusText ?? '';
    poetrySlam.projectProfileCodeText = poetrySlam.projectProfileCodeText ?? '';
    if (poetrySlam.projectID) {
        poetrySlam.createS4HCProjectEnabled = false;   
        if(poetrySlam.projectSystem == 'S4HC') poetrySlam.projectSystemName = S4HCSystemName;        
    }else{            
        poetrySlam.createS4HCProjectEnabled = S4HCIsConnectedIndicator;
    }
    ```

4. Add the implementation of the action *createS4HCProject* as outlined in the code block: 
    1. Copy the method *createS4HCProject* from file [*/srv/poetrySlamManagerServiceImplementation.js*](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceImplementation.js) into the implementation.

    2. Add two lines to import the reuse functions at the beginning of the file:
    ```javascript
        const destinationUtil = require("./util/destination");
        const connectorS4HC = require("./connector-s4hc");
    ```
    3. Add two global variables to buffer the status and the name of remote project management systems at the beginning of the file:
    ```javascript
    // Buffer status and name of project management systems
    let S4HCIsConnectedIndicator;
    let S4HCSystemName;
    ```

5. Create a file to check and get the destinations in path */srv/util/destination.js* and add the functions *getDestinationURL*, *checkDestination*, and *getDestinationDescription* from the file [*/srv/util/destination.js*](../../../tree/main-multi-tenant/srv/util/destination.js). 

    > Note: The reuse functions *getDestinationURL*, *checkDestination*, and *getDestinationDescription* are designed to work for single-tenant and for multi-tenant deployments. For single-tenant deployments, they read the destination from the SAP BTP subaccount that hosts the app, and for multi-tenant deployments, they read the destination from the subscriber subaccount. This system behavior is achieved by passing the JSON Web Token of the logged-in user to the function to get the destination. The JSON Web Token contains the tenant information.

6. Since the npm module *@sap-cloud-sdk/connectivity* is used in the file *destination.js*, add the corresponding npm modules to the *dependencies* section in the [*package.json*](../../../tree/main-multi-tenant/package.json) file:
    ```json
    "dependencies": {
        "@sap-cloud-sdk/connectivity": "^3.9.0",
        "@sap-cloud-sdk/http-client": "^3.9.0"
    },
    ```

7. Add system message to the file [*/srv/i18n/messages.properties*](../../../tree/main-multi-tenant/srv/i18n/messages.properties).
    ```javascript
    ACTION_CREATE_PROJECT_DRAFT=Projects cannot be created for draft poetry slams

8. Expand poetry slams to remote projects in [*/srv/poetrySlamManagerServiceImplementation.js*](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceImplementation.js) by filling OData parameter `/PoetrySlams?$expand=toS4HCProject` in the on-read of the *PoetrySlams* entity:

    ```javascript
    // Expand poetry slams to remote projects
    srv.on('READ', ['PoetrySlams.drafts', 'PoetrySlams'], async (req, next) => {

        // Read the PoetrySlams instances
        let poetrySlams = await next();
    
        // Check and Read S4HC project related data 
        if ( S4HCIsConnectedIndicator ){
            poetrySlams = await connectorS4HC.readProject(poetrySlams);  
        };

        // Return remote project data
        return poetrySlams;
    });
    ```
    > Note: OData features such as *$expand*, *$filter*, *$orderby*, and so on need to be implemented in the service implementation.

### Enhance the Web App to Display SAP S/4HANA Cloud Public Edition Data 

1. To edit the SAP Fiori elements annotations of the web app in the file [*/app/poetryslammanager/annotations.cds*](../../../tree/main-multi-tenant/app/poetryslammanager/annotations.cds), add project elements to different areas of the Poetry Slam Manager floorplan. Afterward, here's what it looks like:
    
    - Enhance annotation of PoetrySlams: 
        ```javascript
            createS4HCProjectEnabled   @UI.Hidden;
        ```
    
    - Enhance selection fields:
        ```javascript
        SelectionFields : [
            number,
            title,
            description,
            dateTime,
            status_code,
            dateTime,
            projectID,
            projectSystem,
            projectSystemName      
        ],

2. Add a facet *Project Data* to display information from the remote service by following the *toS4HCProject* association:

    - Add SAP S/4HANA Cloud Public Edition project-specific fields to the field group *#ProjectData*:         
        ```javascript
        FieldGroup #ProjectData : {Data : [
            // Project system independend fields:
            {
                $Type : 'UI.DataFieldWithUrl',
                Value : projectID,
                Url   : projectURL
            },
            {
                $Type : 'UI.DataField',
                Value : projectSystemName
            },
            {
                $Type : 'UI.DataField',
                Value : projectSystem
            },
            
            // S4HC specific fields
            {
                $Type : 'UI.DataField',
                Label : '{i18n>projectDescription}',
                Value : toS4HCProject.ProjectDescription,
                @UI.Hidden : { $edmJson : { $If : [ { $Eq : [ {$Path : 'projectSystem'}, 'S4HC' ] }, false, true ] } }
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>projectProfile}',
                Value : projectProfileCodeText,
                @UI.Hidden : { $edmJson : { $If : [ { $Eq : [ {$Path : 'projectSystem'}, 'S4HC' ] }, false, true ] } }
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>responsibleCostCenter}',
                Value : toS4HCProject.ResponsibleCostCenter,
                @UI.Hidden : { $edmJson : { $If : [ { $Eq : [ {$Path : 'projectSystem'}, 'S4HC' ] }, false, true ] } }
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>processingStatus}',
                Value : processingStatusText,
                @UI.Hidden : { $edmJson : { $If : [ { $Eq : [ {$Path : 'projectSystem'}, 'S4HC' ] }, false, true ] } }
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>projectStartDateTime}',
                Value : toS4HCProject.ProjectStartDate,
                @UI.Hidden : { $edmJson : { $If : [ { $Eq : [ {$Path : 'projectSystem'}, 'S4HC' ] }, false, true ] } }
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>projectEndDateTime}',
                Value : toS4HCProject.ProjectEndDate,
                @UI.Hidden : { $edmJson : { $If : [ { $Eq : [ {$Path : 'projectSystem'}, 'S4HC' ] }, false, true ] } }
            }
        ]}
        ```

3. Add a button to the identification area:
    ```javascript
    {
        $Type  : 'UI.DataFieldForAction',
        Label  : '{i18n>createS4HCProject}',
        Action : 'PoetrySlamManager.createS4HCProject',            
        @UI.Hidden : { $edmJson : 
            { $If : 
                [
                    { $Eq : [ {$Path : 'createS4HCProjectEnabled'}, false ] },
                    true,
                    false
                ]
            }   
        }
    }
    ```
    > Note: You dynamically control the visibility of the *Create Project in S4HC* button based on the value of the *createS4HCProjectEnabled* transient field.    

4. To edit language-dependent labels in the file [i18n.properties](../../../tree/main-multi-tenant/db/i18n/i18n.properties), in the *db* folder, add labels for project fields:

    ```
    # -------------------------------------------------------------------------------------
    # Labels for entity PoetrySlams
    
    projectID               = Project
    projectObjectID         = Project UUID
    projectURL              = Project URL
    projectSystem           = Project System Type
    projectSystemName       = Project System Name
    ```

5. In the *srv* folder, edit language-dependent labels in the file [*i18n.properties*](../../../tree/main-multi-tenant/srv/i18n/i18n.properties). Add labels for project fields and the button to create projects:
    ```
    # -------------------------------------------------------------------------------------
    # Service Actions

    createS4HCProject        = Create Project in S4HC

    # -------------------------------------------------------------------------------------
    # Remote Project Elements

    projectTypeCodeText     = Project Type
    projectStatusCodeText   = Project Status
    projectCostCenter       = Cost Center
    projectStartDateTime    = Start Date
    projectEndDateTime      = End Date
    projectDescription      = Project Description
    projectProfile          = Project Profile
    responsibleCostCenter   = Responsible Cost Center
    processingStatus        = Processing Status
    ```        

6. In the web app folder, edit language-dependent labels in the file [*app/poetryslammanger/i18n.properties*](../../../tree/main-multi-tenant/app/poetryslammanger/i18n/i18n.properties). Add a label for facet project data:

    ```
    projectData             = Project Data
    ``` 

### Test Locally

1. Open a terminal and start the app with the development profile using the run command `cds watch --profile development`. 
2. Use the test users as listed in the file [*.cdsrc.json*](../../../tree/main-multi-tenant/.cdsrc.json). 
3. Test the critical connection points to SAP S/4HANA Cloud Public Edition: 

    1. Test the *Service Endpoints* for *S4HCProjects*, *S4HCEnterpriseProjectElement*, *S4HCEntProjTeamMember*, *S4HCEntProjEntitlement*, *S4HCProjectsProcessingStatus*, and *S4HCProjectsProjectProfileCode*: The system returns the respective data from SAP S/4HANA Cloud Public Edition (without filtering).

    2. The *Create Project in S4HC* button is dependent on the setup of the destinations. Once the destinations are correctly configured and the application is deployed to SAP BTP Cloud Foundry runtime, the *Create Project in S4HC* button will be active.
    To test this button locally, in _poetrySlamManagerServiceImplementation.js_, change **_poetrySlam.createByDProjectEnabled = ByDIsConnectedIndicator;_** to  **_poetrySlam.createS4HCProjectEnabled = true;_**. 

            ``javascript
                poetrySlam.projectSystemName = poetrySlam.projectSystemName ?? '';
                if (poetrySlam.projectID) {
                    poetrySlam.createS4HCProjectEnabled = false;
                    if (poetrySlam.projectSystem == 'S4HC')
                    poetrySlam.projectSystemName = S4HCSystemName;
                } else {
                    poetrySlam.createS4HCProjectEnabled = S4HCIsConnectedIndicator;
                }
            ``

    > Note: This change is required as the *S4HCIsConnectedIndicator* value is dependent on the setup of destinations. Destinations only work on a deployed application and cannot be tested locally.

4. Open the */poetryslammanager/webapp/index.html* web application and open one of the poetry slams. 
5. Choose *Create Project in S4HC*. The system creates a project in SAP S/4HANA Cloud Public Edition and displays the details in the *Project Details* section.

6. After clicking on the project link, the system opens a browser window with the SAP S/4HANA Cloud Public Edition project overview.

7. Test the *Service Endpoints* for *PoetrySlams* and note down the ID of the poetry slam for which you created the SAP S/4HANA Cloud Public Edition project in step 2 as **poetry-slam-ID**.
8. Append `(ID={{poetry-slam-ID}},IsActiveEntity=true)?$select=toS4HCProject&$expand=toS4HCProject($select=ID,costCenter,endDateTime,startDateTime,statusCodeText,typeCodeText)` to the service endpoint URL, replace the place holder *{{poetry-slam-ID}}* by the **poetry-slam-ID**, and run again.
9. The system returns the record with the project ID and the SAP S/4HANA Cloud Public Edition project details as sub-node.

> Note: If you would like to use a different user, clear the browser cache first.

### Deploy the Application

Update your application in the provider subaccount. For detailed instructions, refer to the section [Deploy the Multi-Tenant Application to a Provider Subaccount](22-Multi-Tenancy-Deployment.md#build-and-deploy-the-multi-tenant-application).

> Note: Make sure any local changes have been reverted before deployment.
