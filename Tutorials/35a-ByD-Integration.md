# Integrate the SAP BTP Application with SAP Business ByDesign

In this section, you enhance Poetry Slam Manager, your SAP BTP application, to make sure that it supports SAP Business ByDesign as back end. 

Front-end integration:
1. Navigate from Poetry Slam Manager to related SAP Business ByDesign projects.

Back-channel integration:

2. Create SAP Business ByDesign projects from Poetry Slam Manager and display project information on the object page of a poetry slam using OData APIs with principal propagation.

## Expose SAP Business ByDesign Projects as OData Service

In Poetry Slam Manager, SAP Business ByDesign projects are read and written by using the custom OData service called *khproject*.

In SAP Business ByDesign, create the *khproject* custom OData service:
1. To download the sample *khproject* custom OData service from the GitHub repository, go to [SAP Business ByDesign - API Samples](https://github.com/SAP-samples/byd-api-samples). Navigate to *Custom OData Services* and *khproject.xml*. 
2. Open the SAP Business ByDesign *Application and User Management - OData Services* work center view, select *Custom OData Services* from the dropdown menu and upload *khproject.xml*.
3. Refresh the table of the custom OData services and open the *khproject* OData service by choosing *Edit*.
4. Take a note of the *Service URL*, which provides the service metadata as **SAP Business ByDesign khproject metadata** for later reference. 

> Note: The GitHub repository mentioned above offers a Postman collection with examples to explore and test other SAP Business ByDesign OData services as well.

## Consume SAP Business ByDesign OData APIs

In this section, you learn how to import the SAP Business ByDesign OData service as a "remote service" into your SAP Cloud Application Programming Model (CAP) project and how to use the OData service to create SAP Business ByDesign projects to plan and run poetry slam events.

### Import SAP Business ByDesign OData Service
The SAP Business ByDesign OData service is consumed by using a destination. SAP Cloud Application Programming Model uses a one-to-one binding of remote services and destinations. To propagate the logged-in business user to SAP Business ByDesign, an OAuth 2.0 SAML Bearer authentication is used. This way, the SAP Business ByDesign OData service for projects considers the user authorizations.

1. Run the $metadata URL of the newly added SAP Business ByDesign OData service in a browser window or Postman: https://{{ByDTenantHostname}}/sap/byd/odata/cust/v1/khproject/$metadata?sap-label=true&sap-language=en. 

2. Save the service response payload with the metadata with file extension *.edmx*:
    - File *byd_khproject.edmx* for user propagation

    > Note: Ensure a unique file name without special characters except "_".

3. In SAP Business Application Studio, to import the SAP Business ByDesign OData service into the SAP Cloud Application Programming Model (CAP) project, create a folder with the name `external_resources` in the root folder of the application.

4. Open the context menu of the *./external_resources* folder and upload the *.edmx* file with the OData service.

5. Open a terminal and ensure that you're in the root folder of the application. Import the *.edmx* file using the command `cds import ./external_resources/byd_khproject.edmx --as cds`.

    > Note: Don't use the CDS import command parameter `--keep-namespace` because it would result in the CDS service name *cust*, which would lead to service name clashes if you import multiple SAP Business ByDesign custom OData services.

    After running the command `cds import ...`, the file *app/poetryslammanager/package.json* is updated with a CDS configuration referring to the remote OData services, and a folder with path *./srv/external* has been created. The folder contains the configuration files for the remote services.
    
    > Note: Typically, remote services don't require any persistency. Make sure the entities in the corresponding CDS files in the folder *./srv/external* are annotated with `@cds.persistence.skip : true`. You may encounter errors during the deployment with the db-deployer service if the persistency-skip-annotation is missing.

### Enhance the Entity Model to Store Key Project Information

In SAP Business Application Studio, enhance the SAP Cloud Application Programming Model entity models in the file [*/db/poetrySlamManagerModel.cds*](../../../tree/main-multi-tenant/db/poetrySlamManagerModel.cds) with elements to store project key information, which makes it possible to associate poetry slams to projects in the remote ERP systems.

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

1. To extend the SAP Cloud Application Programming Model service model with remote entities, open the file [*/srv/poetrySlamManagerService.cds*](../../../tree/main-multi-tenant/srv/poetrySlamManagerService.cds) with the service models.

2. Expose SAP Business ByDesign project data throughout the SAP Cloud Application Programming Model service model for principal propagation:
    ```javascript
    // -------------------------------------------------------------------------------
    // Extend service PoetrySlamManager by SAP Business ByDesign projects (principal propagation)

    using { byd_khproject as RemoteByDProject } from './external/byd_khproject';

    extend service PoetrySlamManager with {
        entity ByDProjects as projection on RemoteByDProject.ProjectCollection {
            key ObjectID as ID,
            ProjectID as projectID,
            ResponsibleCostCentreID as costCenter,
            ProjectTypeCode as typeCode,
            ProjectTypeCodeText as typeCodeText,
            ProjectLifeCycleStatusCode as statusCode,
            ProjectLifeCycleStatusCodeText as statusCodeText,
            BlockingStatusCode as blockingStatusCode,
            PlannedStartDateTime as startDateTime,
            PlannedEndDateTime as endDateTime,
            ProjectSummaryTask as summaryTask : redirected to ByDProjectSummaryTasks,
            Task as task : redirected to ByDProjectTasks                     
        }
        entity ByDProjectSummaryTasks as projection on RemoteByDProject.ProjectSummaryTaskCollection {
            key ObjectID as ID,
            ParentObjectID as parentID,
            ID as taskID,
            ProjectName as projectName,
            ResponsibleEmployeeID as responsibleEmployee,
            ResponsibleEmployeeFormattedName as responsibleEmployeeName
        }
        entity ByDProjectTasks as projection on RemoteByDProject.TaskCollection {
            key ObjectID as ID,
            ParentObjectID as parentID,
            TaskID as taskID,
            TaskName as taskName,
            PlannedDuration as duration,
            ResponsibleEmployeeID as responsibleEmployee,
            ResponsibleEmployeeFormattedName as responsibleEmployeeName
        }
    };
    ```
    
2. Enhance the service model of the service *PoetrySlamManager* with an association to the remote project in SAP Business ByDesign:
    ```javascript
    // Poetry Slams (draft enabled)
    @odata.draft.enabled
    entity PoetrySlams as select from poetrySlamManagerModel.PoetrySlams
        mixin {
            // SAP Business ByDesign projects: Mix-in of SAP Business ByDesign project data
            toByDProject      : Association to RemoteByDProject.ProjectCollection
                                    on toByDProject.ProjectID = $projection.projectID;
        } 
    ```

3. Enhance the service model of the service *PoetrySlamManager* with virtual elements to pass on the name of the ERP system from the destination to the UI, and the visualization of actions:
    ```javascript
    // Poetry Slams (draft enabled)
    @odata.draft.enabled
    entity PoetrySlams                    as
        select from poetrySlamManagerModel.PoetrySlams
        mixin {
            // SAP Business ByDesign projects: Mix-in of SAP Business ByDesign project data
            toByDProject : Association to RemoteByDProject.ProjectCollection
                               on toByDProject.ProjectID = $projection.projectID;
        }
        into {
            // Selects all fields of the PoetrySlams domain model,
            *,
            maxVisitorsNumber - freeVisitorSeats as bookedSeats             : Integer  @title:      '{i18n>bookedSeats}',
            // Relevant for coloring of status in UI to show criticality
            virtual null                         as statusCriticality       : Integer  @title:      '{i18n>statusCriticality}',
            virtual null                         as projectSystemName       : String   @title:      '{i18n>projectSystemName}'        @odata.Type: 'Edm.String',
            // SAP Business ByDesign projects: visibility of button "Create Project in SAP Business ByDesign"
            virtual null                         as createByDProjectEnabled : Boolean  @title:      '{i18n>createByDProjectEnabled}'  @odata.Type: 'Edm.Boolean',
            virtual null                         as isByD                   : Boolean  @odata.Type: 'Edm.Boolean',
            toByDProject
        }
    ```
    
4. Enhance the service model of the service *PoetrySlamManager* with an action to create remote projects:
    ```javascript
    // SAP Business ByDesign projects: action to create a project in SAP Business ByDesign
    @(
        // Defines that poetryslam entity is affected and targeted by the action
        Common.SideEffects             : {TargetEntities: [
            '_poetryslam',
            '_poetryslam/toByDProject'
        ]},
        // Determines that poetryslam entity is used when the action is performed
        cds.odata.bindingparameter.name: '_poetryslam'
    )
    action createByDProject()      returns PoetrySlams;
    ```
    > Note: The side effect annotation refreshes the project data right after executing the action.

### Enhance the Authentication Model to Cover Remote Projects

1. To extend the authorization annotation of the SAP Cloud Application Programming Model service model by restrictions referring to the remote services, open the file [*/srv/poetrySlamManagerServiceAuthorizations.cds*](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceAuthorizations.cds) with the authorization annotations.

2. Enhance the authorization model for the service entities *ByDProjects*, *ByDProjectSummaryTasks*, and *ByDProjectTasks*.

    ```javascript
    // SAP Business ByDesign projects: Managers can read and create remote projects
    annotate PoetrySlamManager.ByDProjects with @(restrict: [{
        grant: ['*'],
        to   : 'PoetrySlamFull'
    }]);

    annotate PoetrySlamManager.ByDProjectSummaryTasks with @(restrict: [{
        grant: ['*'],
        to   : 'PoetrySlamFull'
    }]);

    annotate PoetrySlamManager.ByDProjectTasks with @(restrict: [{
        grant: ['*'],
        to   : 'PoetrySlamFull'
    }]);
    ```

### Create Files with Reuse Functions for the Enterprise Resource Planning System Integration

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

### Create a File with Reuse Functions for SAP Business ByDesign

Reuse functions specific to SAP Business ByDesign are defined in a separate file.

1. Create a file with the path */srv/connector/connectorByD.js*.
2. Copy the SAP Business ByDesign reuse functions in the file [*/srv/connector/connectorByD.js*](../../../tree/main-multi-tenant/srv/connector/connectorByD.js) into your project. The file contains functions to delegate OData requests to SAP Business ByDesign, to read SAP Business ByDesign project data, and to assemble an OData payload to create SAP Business ByDesign projects using a project template.

> Note: This file contains sample data, which can vary depending on the system. Check the data set and maintain it accordingly to ensure consistency between the Partner Reference App and SAP Business ByDesign.

### Enhance the Business Logic to Operate on SAP Business ByDesign Data

Enhance the implementation of the SAP Cloud Application Programming Model services to create and read SAP Business ByDesign project data using the remote SAP Business ByDesign OData service. 

1. Delegate requests to the remote OData service. To do so, copy the on-READ, on-CREATE, on-UPDATE, and on-DELETE methods of *ByDProjects*, *ByDProjectSummaryTasks*, and *ByDProjectTasks* from the [poetrySlamManagerServiceERPImplementation.js](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceERPImplementation.js) into a file with the same name and path into your project.

    > Note: Without delegation, the remote entities return the error code 500 with the message: *SQLITE_ERROR: no such table* (local testing).

2. Enhance the [poetrySlamManagerServiceImplementation.js](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceImplementation.js) to call the ERP implementation.

    i. Import the ERP forward handler.

    ```javascript
    const erpForwardHandler = require('./poetrySlamManagerServiceERPImplementation');
    ```

    ii. Call the ERP forward handler.

    ```javascript
    erpForwardHandler(srv); // Forward handler to the ERP systems
    ```

3. In the file [*/srv/poetrySlamManagerServicePoetrySlamsImplementation.js*](../../../tree/main-multi-tenant/srv/poetrySlamManagerServicePoetrySlamsImplementation.js), the poetry slams entity is enriched with SAP Business ByDesign specific data. 

    i. Determine the connected back-end systems and read the project data from the remote system. Set the virtual element `createByDProjectEnabled` to control the visualization of the action to create project dynamically and pass on the project system name.

    ```javascript
    // Expand poetry slams
    srv.on('READ', ['PoetrySlams.drafts', 'PoetrySlams'], async (req, next) => {
        // Read the PoetrySlams instances
        let poetrySlams = await next();

        // SAP Business ByDesign
        // Check and read SAP Business ByDesign project related data
        const connectorByD = await ConnectorByD.createConnectorInstance(req);
        if (connectorByD?.isConnected()) {
            poetrySlams = await connectorByD.readProject(poetrySlams);
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
                    ByD: connectorByD.getSystemName()
                };
                poetrySlam.createByDProjectEnabled = false;
                poetrySlam.projectSystemName = systemNames[poetrySlam.projectSystem];
            } else {
                poetrySlam.createByDProjectEnabled = connectorByD.isConnected();
            }

            // Update the backend system connected indicator used in UI for controlling visibility of UI elements
            poetrySlam.isByD = connectorByD.isConnected();
        }

        // Return remote data
        return poetrySlams;
    });
    ```

    > Note: The destinations called *byd* and *byd-url* connect to the ERP system. You create the destinations later on in the consumer subaccount in SAP BTP.

    > Note: OData features such as *$expand*, *$filter*, *$orderby*, and so on need to be implemented in the service implementation.


    iii. Add the implementation of the action *createByDProject*: 

    1. Copy the method *createByDProject* from the file [*/srv/poetrySlamManagerServicePoetrySlamsImplementation.js*](../../../tree/main-multi-tenant/srv/poetrySlamManagerServicePoetrySlamsImplementation.js) into the implementation.

    2. Add the import of the connector at the beginning of the file:

        ```javascript
        const ConnectorByD = require('./connector/connectorByD');
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

### Enhance the Web App to Display SAP Business ByDesign Data 

1. To edit the SAP Fiori elements annotations of the web app in the file [*/app/poetryslammanager/annotations.cds*](../../../tree/main-multi-tenant/app/poetryslammanager/annotations.cds), add project elements to different areas of the Poetry Slam Manager floorplan. Afterward, here's what it looks like:
    
    - Annotation of PoetrySlams:
        ```javascript
        projectObjectID              @UI.Hidden;
        createByDProjectEnabled      @UI.Hidden;
        isByD                        @UI.Hidden;
        ```
2. Add a facet *Project Data* to display information from the remote service by following the *toByDProject* association:
    - Add facet:
        ```javascript
        {
            $Type        : 'UI.ReferenceFacet',
            Label        : '{i18n>projectData}',
            ID           : 'ProjectData',
            Target       : @UI.FieldGroup #ProjectData,
            ![@UI.Hidden]: {$edmJson: {$Not: {$Path: 'isByD'}}} // Display ProjectData only in case a SAP Business ByDesign Cloud system is connected
        }
        ```
    - Add a field group *#ProjectData* with the SAP Business ByDesign specific fields:         
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
    // Create a project in the connected SAP Business ByDesign system
    {
        $Type     : 'UI.DataFieldForAction',
        Label     : '{i18n>createByDProject}',
        Action    : 'PoetrySlamManager.createByDProject',
        @UI.Hidden: {$edmJson: {$Not: {$And: [
            {$Path: 'createByDProjectEnabled'},
            {$Path: 'IsActiveEntity'}
        ]}}}
    }
    ```
    > Note: The visibility of the *Create Project in SAP Business ByDesign* button is dynamically controlled based on the value of the *createByDProjectEnabled* transient field, which is calculated in the after read-event of the entity *PoetrySlam*.    

4. In the *srv* folder, edit language-dependent labels in the file [*i18n.properties*](../../../tree/main-multi-tenant/srv/i18n/i18n.properties). Add labels for project fields and the button to create projects:
    ```
    # -------------------------------------------------------------------------------------
    # Service Actions

    createByDProject        = Create Project in SAP Business ByDesign

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

5. In the app folder, edit language-dependent labels in the file [*app/poetryslammanager/i18n/i18n.properties*](../../../tree/main-multi-tenant/app/poetryslammanager/i18n/i18n.properties). Add a label for facet project data:

    ```
    projectData             = Project Data
    ```      

### Enhance the Configuration of the SAP Cloud Application Programming Model Project

Enhance the file [*package.json*](../../../tree/main-multi-tenant/package.json) with development configurations for local testing and productive configurations. Ensure that the flag *csrf* and *csrfInBatch* is set in the file *package.json* to enable the management of cross-site request forgery tokens (required for POST requests at runtime) using destinations of the type:

```json
"byd_khproject": {
    "kind": "odata-v2",
    "model": "srv/external/byd_khproject",
    "csrf": true,
    "csrfInBatch": true,
    "[development]": {
        "credentials": {
            "url": "https://{{ByD-hostname}}/sap/byd/odata/cust/v1/khproject/",
            "authentication": "BasicAuthentication",
            "username": "{{test-user}}",
            "password": "{{test-password}}"
        }
    },
    "[production]": {
        "credentials": {
            "destination": "byd",
            "path": "/sap/byd/odata/cust/v1/khproject"
        }
    }        
}
```
> Note: The *package.json* refers to the destinations *byd* that needs to be created in the consumer SAP BTP subaccount. The destination *byd* refers to business users with principal propagation.

> Note: By default, SAP Cloud Application Programming Model does not handle CSRF tokens for POST requests. Remote services may fail if CSRF tokens are required.

> Note: For local testing, replace `{{ByD-hostname}}`, `{{test-user}}`, and `{{test-password}}` with a system, user, and password from SAP Business ByDesign. Don't push this information to your GitHub repository.

### Test Locally

1. Open a terminal and start the app with the development profile using the run command `cds watch --profile development`. 
2. Enter a test user. The test users are listed in the file [*.cdsrc.json*](../../../tree/main-multi-tenant/.cdsrc.json). 
3. Test the critical connection points to SAP Business ByDesign: 

    1. Test the *Service Endpoints* for *ByDProjects*, *ByDProjectSummaryTasks*, and *ByDProjectTasks*: The system returns the respective data from SAP Business ByDesign (without filtering).

    2. The *Create Project in SAP Business ByDesign* button is dependent on the setup of the destinations. Once the destinations are correctly configured and the application is deployed to SAP BTP Cloud Foundry runtime, the *Create Project in SAP Business ByDesign* button will be active.
    To test this button locally, in _connectorByD.js_, method _createConnectorInstance_, change the value of **connector.isConnectedIndicator** to **true**:

        ```javascript
        const connector = new ConnectorByD(data);
        connector.isConnectedIndicator = true;
        ```
        > Note: This change is required as the *isConnectedIndicator* value is dependent on the setup of destinations. Destinations only work on a deployed application and cannot be tested locally.

4. Open the */poetryslammanager/webapp/index.html* web application and open one of the poetry slams. 
5. Choose *Create Project in SAP Business ByDesign*. The system creates a project in SAP Business ByDesign displays the details in the *Project Details* section.
6. After clicking on the project link, the system opens a browser window with the SAP Business ByDesign project overview.
7. Test the *Service Endpoints* for *PoetrySlams* and note down the ID of the poetry slam for which you created the SAP Business ByDesign project in step 2 as **poetry-slam-ID**.
8. Append `(ID={{poetry-slam-ID}},IsActiveEntity=true)?$select=toByDProject&$expand=toByDProject($select=ID,costCenter,endDateTime,startDateTime,statusCodeText,typeCodeText)` to the service endpoint URL, replace the place holder *{{poetry-slam-ID}}* by the **poetry-slam-ID**, and run again.
9. The system returns the record with the project ID and the SAP Business ByDesign project details as sub-node.

> Note: If you would like to use a different user, clear the browser cache first. 

### Deploy the Application

Update your application in the provider subaccount. For detailed instructions, refer to the section [Deploy the Multi-Tenant Application to a Provider Subaccount](./24-Multi-Tenancy-Deployment.md).

> Note: Make sure any local changes have been reverted before deployment.

You have now successfully deployed the application to the provider subaccount and you're ready to [provision tenants of the multi-tenant application to customers and connect with SAP Business ByDesign](./35b-Multi-Tenancy-Provisioning-Connect-ByD.md).
