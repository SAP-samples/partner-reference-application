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

    As a result, the system creates CDS files in the folder *./srv/external* for all remote services and enhanced the file *package.json* with CDS configurations referring to the remote services.

    > Note: Don't use the CDS import command parameter `--keep-namespace` because it would lead to service name clashes if you import multiple SAP S/4HANA Cloud Public Edition OData services.

6. Enhance the file [*package.json*](../../../tree/main-multi-tenant/package.json) with development configurations for local testing and productive configurations. Ensure that the flag *csrf* and *csrfInBatch* is set in the file *package.json* to enable the management of cross-site request forgery tokens (required for POST requests at runtime) using destinations of the type:

    ```json
    "cds": {
        "S4HC_API_ENTERPRISE_PROJECT_SRV_0002": {
            "kind": "odata-v2",
            "model": "srv/external/S4HC_API_ENTERPRISE_PROJECT_SRV_0002",
            "csrf": true,
            "csrfInBatch": true,
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
            "csrf": true,
            "csrfInBatch": true,
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
            "csrf": true,
            "csrfInBatch": true,
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
    }
    ```

    > Note: The *package.json* refers to the destinations *s4hc* and *s4hc-tech-user* that must be created in the consumer SAP BTP subaccount. The destination *s4hc* is used for remote service calls with principal propagation. See the next section for more details.

    > Note: By default, SAP Cloud Application Programming Model does not handle CSRF tokens for POST requests. Remote services may fail if CSRF tokens are required.

    > Note: For local testing, replace `{{S4HC-hostname}}`, `{{test-user}}`, and `{{test-password}}` with a system, user, and password from SAP S/4HANA Cloud Public Edition. However, don't push this information to your GitHub repository.

### Enhance the Entity Model to Store Key Project Information

In SAP Business Application Studio, enhance the SAP Cloud Application Programming Model entity models in the file [*/db/poetrySlamManagerModel.cds*](../../../tree/main-multi-tenant/db/poetrySlamManagerModel.cds) with elements to store project key information, which makes it possible to associate poetry slams with projects in the remote ERP systems.

1. Enhance the entity *PoetrySlams* with the following elements:
    ```javascript
    projectID       : String;
    projectObjectID : String;
    projectURL      : String;
    projectSystem   : String;  
    ```  

2. Enhance the annotations of entity *PoetrySlams* with the following elements:
    ```javascript
    projectID           @title: '{i18n>projectID}';
    projectObjectID     @title: '{i18n>projectObjectID}'    @readonly;
    projectURL          @title: '{i18n>projectURL}'         @readonly;
    projectSystem       @title: '{i18n>projectSystem}'      @readonly;
    ```  

3. Enhance the labels of the entity *PoetrySlams* in the file [*/db/i18n/i18n.properties*](../../../tree/main-multi-tenant/db/i18n/i18n.properties) with the labels: 
    ```javascript
    projectID               = Project
    projectObjectID         = Project UUID
    projectURL              = Project URL
    projectSystem           = Project System Type
    ```
     > In the reference example, the [*/db/i18n/i18n_de.properties*](../../../tree/main-multi-tenant/db/i18n/i18n_de.properties) file with the German texts are available, too. You can take them over accordingly.

### Enhance the Service Model With the Remote Service

1. In SAP Business Application Studio, to extend the SAP Cloud Application Programming Model service model by remote entities, open the service models file [*poetrySlamManagerService.cds*](../../../tree/main-multi-tenant/srv/poetrySlamManagerService.cds).

2. Expose SAP S/4HANA Cloud Public Edition project data throughout the SAP Cloud Application Programming Model service model for principal propagation:

    ```javascript
    // -------------------------------------------------------------------------------
    // Extend service PoetrySlamManager by SAP S/4HANA Cloud projects (principal propagation)

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

    // Extend service PoetrySlamManager by SAP S/4HANA Cloud Projects ProjectProfileCode
    using { S4HC_ENTPROJECTPROCESSINGSTATUS_0001 as RemoteS4HCProjectProcessingStatus } from './external/S4HC_ENTPROJECTPROCESSINGSTATUS_0001';

    extend service PoetrySlamManager with {
        entity S4HCProjectsProcessingStatus   as
            projection on RemoteS4HCProjectProcessingStatus.ProcessingStatus {
                key ProcessingStatus     as ProcessingStatus,
                    ProcessingStatusText as ProcessingStatusText
            }
    };

    // Extend service PoetrySlamManager by SAP S/4HANA Cloud Projects ProcessingStatus
    using { S4HC_ENTPROJECTPROFILECODE_0001 as RemoteS4HCProjectProjectProfileCode } from './external/S4HC_ENTPROJECTPROFILECODE_0001';

    extend service PoetrySlamManager with {
        entity S4HCProjectsProjectProfileCode as
            projection on RemoteS4HCProjectProjectProfileCode.ProjectProfileCode {
                key ProjectProfileCode     as ProjectProfileCode,
                    ProjectProfileCodeText as ProjectProfileCodeText
            }
    };
    ```

2. Enhance the service model of service *PoetrySlamManager* with an association to the remote project in SAP S/4HANA Cloud:

    ```javascript
    // Poetry Slams (draft enabled)
    @odata.draft.enabled
    entity PoetrySlams as select from poetrySlamManagerModel.PoetrySlams
        mixin {
             // SAP S/4HANA Cloud projects: Mix-in of SAP S/4HANA Cloud project data
            toS4HCProject     : Association to RemoteS4HCProject.A_EnterpriseProject
                                    on toS4HCProject.Project = $projection.projectID;
        } 
    ```

3. Enhance the service model of service *PoetrySlamManager* with virtual elements to control the visualization of actions and the coloring of status information:
    ```javascript
    // Poetry slams (draft enabled)
    @odata.draft.enabled
    entity PoetrySlams                    as
        select from poetrySlamManagerModel.PoetrySlams
        mixin {
            // SAP S/4HANA Cloud projects: Mix-in of SAP S/4HANA Cloud project data
            toS4HCProject : Association to RemoteS4HCProject.A_EnterpriseProject
                                on toS4HCProject.Project = $projection.projectID;
        }
        into {
            // Selects all fields of the PoetrySlams domain model,
            *,
            maxVisitorsNumber - freeVisitorSeats as bookedSeats              : Integer  @title:     '{i18n>bookedSeats}',
            // Relevant for coloring of status in UI to show criticality
            virtual null                         as statusCriticality        : Integer  @title:     '{i18n>statusCriticality}',
            virtual null                         as projectSystemName        : String   @title:     '{i18n>projectSystemName}'         @odata.Type: 'Edm.String',
            // SAP S/4HANA Cloud projects: visibility of button "Create Project in SAP S/4HANA Cloud", code texts
            virtual null                         as createS4HCProjectEnabled : Boolean  @title:     '{i18n>createS4HCProjectEnabled}'  @odata.Type: 'Edm.Boolean',
            virtual null                         as isS4HC                   : Boolean @odata.Type: 'Edm.Boolean',
            toS4HCProject,
            virtual null                         as projectProfileCodeText   : String   @title:     '{i18n>projectProfile}'            @odata.Type: 'Edm.String',
            virtual null                         as processingStatusText     : String   @title:     '{i18n>processingStatus}'          @odata.Type: 'Edm.String'
        }
    ```
    
4. Enhance the service model of service *PoetrySlamManager* with an action to create remote projects:
    ```javascript
    // SAP S/4HANA Cloud projects: action to create a project in SAP S/4HANA Cloud
    @(
        Common.SideEffects             : {TargetEntities: [
            '_poetryslam',
            '_poetryslam/toS4HCProject'
        ]},
        cds.odata.bindingparameter.name: '_poetryslam'
    )
        action createS4HCProject()     returns PoetrySlams;
    ```
    > Note: The side effect annotation refreshes the project data right after executing the action.


### Enhance the Authentication Model to Cover Remote Projects

1. In SAP Business Application Studio, to extend the authorization annotation of the SAP Cloud Application Programming Model service model by restrictions referring to the remote services, open the file [*poetrySlamManagerServiceAuthorizations.cds*](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceAuthorizations.cds) with the authorization annotations.

2. Enhance the authorization model for the service entities *S4HCProjects*, *S4HCEnterpriseProjectElement*, *S4HCEntProjTeamMember*, *S4HCEntProjEntitlement*, *S4HCProjectsProjectProfileCode*, *S4HCProjectsProcessingStatus*:
    ```javascript
    // SAP S/4HANA Cloud projects: Managers can read and create remote projects
    annotate PoetrySlamManager.S4HCProjects with @(restrict: [{
        grant: ['*'],
        to   : 'PoetrySlamFull'
    }]);

    annotate PoetrySlamManager.S4HCEnterpriseProjectElement with @(restrict: [{
        grant: ['*'],
        to   : 'PoetrySlamFull'
    }]);

    annotate PoetrySlamManager.S4HCEntProjTeamMember with @(restrict: [{
        grant: ['*'],
        to   : 'PoetrySlamFull'
    }]);

    annotate PoetrySlamManager.S4HCEntProjEntitlement with @(restrict: [{
        grant: ['*'],
        to   : 'PoetrySlamFull'
    }]);

    annotate PoetrySlamManager.S4HCProjectsProjectProfileCode with @(restrict: [{
        grant: ['*'],
        to   : 'PoetrySlamFull'
    }]);

    annotate PoetrySlamManager.S4HCProjectsProcessingStatus with @(restrict: [{
        grant: ['*'],
        to   : 'PoetrySlamFull'
    }]);
    ```

### Create Files with Reuse Functions for the ERP System Integration

You can define reuse functions that handle the connection for the different Enterprise Resource Planning (ERP) systems in separate files. 

1. Create a file to check and get the destinations in path */srv/util/destination.js*. 
2. Add the functions *readDestination*, *getDestinationURL*, and *getDestinationDescription* from the file [*/srv/util/destination.js*](../../../tree/main-multi-tenant/srv/util/destination.js).

    > Note: The reuse functions *readDestination*, *getDestinationURL*, and *getDestinationDescription* are designed to work for single-tenant and for multi-tenant deployments. For single-tenant deployments, they read the destination from the SAP BTP subaccount that hosts the app, and for multi-tenant deployments, they read the destination from the subscriber subaccount. This system behavior is achieved by passing the JSON Web Token of the logged-in user to the function to get the destination. The JSON Web Token contains the tenant information.

    > Note: The reuse function *getDestinationDescription* returns the destination description from the SAP BTP consumer subaccount.

3. Since the npm module *@sap-cloud-sdk/connectivity* is used in the file *destination.js*, add the corresponding npm modules to your project. To do so, open a terminal and run the commands:

    i. `npm add @sap-cloud-sdk/connectivity` 

    ii. `npm add @sap-cloud-sdk/http-client`

    The dependencies are added to the *dependencies* section in the [*package.json*](../../../tree/main-multi-tenant/package.json) file. 

4. Create a file with the path */srv/connector/connector.js*. This file is reused for different ERP integrations.
5. Copy the ERP connection reuse functions in the file [*/srv/connector/connector.js*](../../../tree/main-multi-tenant/srv/connector/connector.js) into your project. It delegates the OData requests and holds the destinations.
    
### Create a File with Reuse Functions for SAP S/4HANA Cloud Public Edition

Reuse functions specific to SAP S/4HANA Cloud Public Edition are defined in a separate file. 

1. Create a file with the path */srv/connector/connectorS4HC.js*. 
2. Copy the SAP S/4HANA Cloud Public Edition related functions in the file [*connectorS4HC.js*](../../../tree/main-multi-tenant/srv/connector/connectorS4HC.js) into your project. The file contains functions to delegate OData requests to SAP S/4HANA Cloud Public Edition, to read SAP S/4HANA Cloud Public Edition project data, and to assemble an OData payload to create SAP S/4HANA Cloud Public Edition projects.

For this tutorial, the *Responsible Cost Center* used in *connectorS4HC.js* is *10101101* and the *Company Code* is *1010*. 

> Note: This file contains sample data, which can vary depending on the system. Check the data set and maintain it accordingly to ensure consistency between the Partner Reference App and SAP S/4HANA Cloud Public Edition.

### Enhance the Business Logic to Operate on SAP S/4HANA Cloud Public Edition Data

In SAP Business Application Studio, enhance the implementation of the SAP Cloud Application Programming Model services to create and read SAP S/4HANA Cloud Public Edition enterprise project data using the remote SAP S/4HANA Cloud Public Edition OData service.

1. Delegate requests to the remote OData service. To do so, copy the on-READ, on-CREATE, on-UPDATE, and on-DELETE methods of *S4HCProjects*, *S4HCEnterpriseProjectElement*, *S4HCEntProjEntitlement*, *S4HCEntProjTeamMember*, *S4HCProjectsProcessingStatus*, and *S4HCProjectsProjectProfileCode* from the [poetrySlamManagerServiceERPImplementation.js](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceERPImplementation.js) into a file with the same name and path into your project.

    > Note: Without delegation, the remote entities return the error code 500 with message: *SQLITE_ERROR: no such table* (local testing).

2. Enhance the [poetrySlamManagerServiceImplementation.js](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceImplementation.js) to call the ERP implementation.

    i. Import the ERP forward handler.

    ```javascript
    const erpForwardHandler = require('./poetrySlamManagerServiceERPImplementation');
    ```

    ii. Call the ERP forward handler.

    ```javascript
    erpForwardHandler(srv); // Forward handler to the ERP systems
    ```

3.  In the file [*/srv/poetrySlamManagerServicePoetrySlamsImplementation.js*](../../../tree/main-multi-tenant/srv/poetrySlamManagerServicePoetrySlamsImplementation.js), the poetry slams entity is enriched with SAP S/4HANA Cloud Public Edition specific data. 

    i. Determine the connected back-end systems and read the project data from the remote system. Set the virtual element `createS4HCProjectEnabled` to control the visualization of the action to create project dynamically and pass on the project system name.

    ```javascript
    // Expand poetry slams
    srv.on('READ', ['PoetrySlams.drafts', 'PoetrySlams'], async (req, next) => {
        // Read the PoetrySlams instances
        let poetrySlams = await next();

        // SAP S/4HANA Cloud
        // Check and read SAP S/4HANA Cloud project related data
        const connectorS4HC = await ConnectorS4HC.createConnectorInstance(req);
        if (connectorS4HC?.isConnected()) {
            poetrySlams = await connectorS4HC.readProject(poetrySlams);
        }

        for (const poetrySlam of convertToArray(poetrySlams)) {
            [
                'projectSystemName',
                'processingStatusText',
                'projectProfileCodeText'
            ].forEach((item) => {
                poetrySlam[item] = poetrySlam[item] || '';
            });

            // Update project system name and visibility of the "Create Project"-buttons
            if (poetrySlam.projectID) {
                const systemNames = {
                    S4HC: connectorS4HC.getSystemName()
                };
                poetrySlam.createS4HCProjectEnabled = false;
                poetrySlam.projectSystemName = systemNames[poetrySlam.projectSystem];
            } else {
                poetrySlam.createS4HCProjectEnabled = connectorS4HC.isConnected();
            }

            // Update the backend system connected indicator used in UI for controlling visibility of UI elements
            poetrySlam.isS4HC = connectorS4HC.isConnected();
        }

        // Return remote data
        return poetrySlams;
    });
    ```

    > Note: The destinations called *s4hc* and *s4hc-url* connect to the ERP system. You create the destinations later on in the consumer subaccount in SAP BTP.

    > Note: OData features such as *$expand*, *$filter*, *$orderby*, and so on need to be implemented in the service implementation.

    iii. Add the implementation of the action *createS4HCProjectEnabled*:

    1. Copy the method *createS4HCProject* from the file [*/srv/poetrySlamManagerServicePoetrySlamsImplementation.js*](../../../tree/main-multi-tenant/srv/poetrySlamManagerServicePoetrySlamsImplementation.js) into the implementation.

    2. Add the import of the connector at the beginning of the file:

        ```javascript
        const ConnectorS4HC = require('./connector/connectorS4HC');
        ```

    3. Import the `createProject`-function from the `entityCalculations`.

        ```javascript
        const {
            calculatePoetrySlamData,
            updatePoetrySlam,
            convertToArray,
            createProject
        } = require('./util/entityCalculations');
        ```
    4. Add the system message to the file [*/srv/i18n/messages.properties*](../../../tree/main-multi-tenant/srv/i18n/messages.properties).

    ```javascript
    ACTION_CREATE_PROJECT_DRAFT = Projects cannot be created for draft Poetry Slams.
    ```

4. Extend the on-update event of the `PoetrySlams` entity with an implementation to clear all project data if the `projectID` is deleted:
    ```javascript
    srv.on('UPDATE', ['PoetrySlams.drafts', 'PoetrySlams'], async (req, next) => {
        ...

        // Remove all project data if the project id is cleared
        if (req.data.projectID === '') {
            req.data.projectID = null;
            req.data.projectObjectID = null;
            req.data.projectURL = null;
            req.data.projectSystem = null;
            req.data.projectSystemName = null;
        }

        ...
    });
    ```

### Enhance the Web App to Display SAP S/4HANA Cloud Public Edition Data 

1. To edit the SAP Fiori elements annotations of the web app in the file [*/app/poetryslammanager/annotations.cds*](../../../tree/main-multi-tenant/app/poetryslammanager/annotations.cds), add project elements to different areas of the Poetry Slam Manager floorplan. Afterward, here's what it looks like:
    
    - Enhance annotation of PoetrySlams: 
        ```javascript
        projectObjectID              @UI.Hidden;
        createS4HCProjectEnabled     @UI.Hidden;
        isS4HC                       @UI.Hidden;
        ```

2. Add a facet *Project Data* to display information from the remote service by following the *toS4HCProject* association:

    - Add facet:
        ```javascript
        {
            $Type        : 'UI.ReferenceFacet',
            Label        : '{i18n>projectData}',
            ID           : 'ProjectData',
            Target       : @UI.FieldGroup #ProjectData,
            ![@UI.Hidden]: {$edmJson: {$Not: {$Path: 'isS4HC'}}} // Display ProjectData only in case a SAP S/4HANA Cloud system is connected
        },
        ```

    - Add a field group *#ProjectData* with the SAP S/4HANA Cloud Public Edition project-specific fields:       
        ```javascript
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
            // SAP S/4HANA Cloud specific fields
            {
                $Type                  : 'UI.DataField',
                Label                  : '{i18n>projectDescription}',
                Value                  : toS4HCProject.ProjectDescription,
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
                Value                  : toS4HCProject.ResponsibleCostCenter,
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
                Value                  : toS4HCProject.ProjectStartDate,
                ![@UI.Hidden]          : {$edmJson: {$Not: {$Path: 'isS4HC'}}},
                ![@Common.FieldControl]: #ReadOnly
            },
            {
                $Type                  : 'UI.DataField',
                Label                  : '{i18n>projectEndDateTime}',
                Value                  : toS4HCProject.ProjectEndDate,
                ![@UI.Hidden]          : {$edmJson: {$Not: {$Path: 'isS4HC'}}},
                ![@Common.FieldControl]: #ReadOnly
            }
        ]}
        ```

3. Extend the list page with a link to the project:
    ```javascript
    // Definition of fields shown on the list page / table
    LineItem                      : [
        ...,
        {
            $Type: 'UI.DataFieldWithUrl',
            Value: projectID,
            Url  : projectURL
        }
    ]
    ```

4. Add a button to the identification area:
    ```javascript
    // Create a project in the connected SAP S/4HANA Cloud system
    {
        $Type        : 'UI.DataFieldForAction',
        Label        : '{i18n>createS4HCProject}',
        Action       : 'PoetrySlamManager.createS4HCProject',
        ![@UI.Hidden]: {$edmJson: {$Not: {$And: [
            {$Path: 'createS4HCProjectEnabled'},
            {$Path: 'IsActiveEntity'}
        ]}}}
    }
    ```
    > Note: You dynamically control the visibility of the *Create Project in SAP S/4HANA Cloud* button based on the value of the *createS4HCProjectEnabled* transient field.    

4. In the *srv* folder, edit language-dependent labels in the file [*i18n.properties*](../../../tree/main-multi-tenant/srv/i18n/i18n.properties). Add labels for project fields and the button to create projects:
    ```
    # -------------------------------------------------------------------------------------
    # Service Actions

    createS4HCProject       = Create Project in SAP S/4HANA Cloud

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

5. In the web app folder, edit language-dependent labels in the file [*app/poetryslammanager/i18n/i18n.properties*](../../../tree/main-multi-tenant/app/poetryslammanager/i18n/i18n.properties). Add a label for facet project data:

    ```
    projectData             = Project Data
    ``` 

### Test Locally

1. Open a terminal and start the app with the development profile using the run command `cds watch --profile development`. 
2. Use the test users as listed in the file [*.cdsrc.json*](../../../tree/main-multi-tenant/.cdsrc.json). 
3. Test the critical connection points to SAP S/4HANA Cloud Public Edition: 

    1. Test the *Service Endpoints* for *S4HCProjects*, *S4HCEnterpriseProjectElement*, *S4HCEntProjTeamMember*, *S4HCEntProjEntitlement*, *S4HCProjectsProcessingStatus*, and *S4HCProjectsProjectProfileCode*: The system returns the respective data from SAP S/4HANA Cloud Public Edition (without filtering).

    2. The *Create Project in SAP S/4HANA Cloud* button is dependent on the setup of the destinations. Once the destinations are correctly configured and the application is deployed to SAP BTP Cloud Foundry runtime, the *Create Project in SAP S/4HANA Cloud* button will be active.
    To test this button locally, in _connectorS4HC.js_, method _createConnectorInstance_, change the value of **connector.isConnectedIndicator** to **true** after the connector instance is created:

        ```javascript
        const connector = new ConnectorS4HC(data);
        connector.isConnectedIndicator = true;
        ```

        > Note: This change is required as the *isConnectedIndicator* value is dependent on the setup of destinations. Destinations only work on a deployed application and cannot be tested locally.

4. Open the */poetryslammanager/webapp/index.html* web application and open one of the poetry slams. 
5. Choose *Create Project in SAP S/4HANA Cloud*. The system creates a project in SAP S/4HANA Cloud Public Edition and displays the details in the *Project Details* section.

6. After clicking on the project link, the system opens a browser window with the SAP S/4HANA Cloud Public Edition project overview.

7. Test the *Service Endpoints* for *PoetrySlams* and note down the ID of the poetry slam for which you created the SAP S/4HANA Cloud Public Edition project in step 2 as **poetry-slam-ID**.
8. Append `(ID={{poetry-slam-ID}},IsActiveEntity=true)?$select=toS4HCProject&$expand=toS4HCProject($select=ID,costCenter,endDateTime,startDateTime,statusCodeText,typeCodeText)` to the service endpoint URL, replace the place holder *{{poetry-slam-ID}}* by the **poetry-slam-ID**, and run again.
9. The system returns the record with the project ID and the SAP S/4HANA Cloud Public Edition project details as sub-node.

> Note: If you would like to use a different user, clear the browser cache first.

### Deploy the Application

Update your application in the provider subaccount. For detailed instructions, refer to the section [Deploy the Multi-Tenant Application to a Provider Subaccount](./24-Multi-Tenancy-Deployment.md).

> Note: Make sure any local changes have been reverted before deployment.

You have now successfully deployed the application to the provider subaccount and you're ready to [provision tenants of the multi-tenant application to customers and connect with SAP S/4HANA Cloud](./34b-Multi-Tenancy-Provisioning-Connect-S4HC.md).
