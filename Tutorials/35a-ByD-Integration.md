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
The SAP Business ByDesign OData service is consumed by using a destination. SAP Cloud Application Programming Model uses an one-to-one binding of remote services and destinations. To propagate the logged-in business user to SAP Business ByDesign, an OAuth 2.0 SAML Bearer authentication is used. This way, the SAP Business ByDesign OData service for projects considers the user authorizations.

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

In SAP Business Application Studio, enhance the SAP Cloud Application Programming Model entity models in the file [*/db/poetrySlamManagerModel.cds*](../../../tree/main-multi-tenant/db/poetrySlamManagerModel.cds) by elements to store project key information, which makes it possible to associate poetry slams to projects in the remote ERP systems.

1. Enhance the entity *PoetrySlams* by the following elements:
    ```javascript
    projectID               : String;
    projectObjectID         : String;
    projectURL              : String;
    projectSystem           : String;  
    ```  

2. Enhance the annotations of entity *PoetrySlams* by the following elements:
    ```javascript
    projectID           @title: '{i18n>projectID}'          @readonly;
    projectObjectID     @title: '{i18n>projectObjectID}'    @readonly;
    projectURL          @title: '{i18n>projectURL}'         @readonly;
    projectSystem       @title: '{i18n>projectSystem}'      @readonly;
    ```  

3. Enhance the labels of the entity *PoetrySlams* in the file [*/db/i18n/i18n.properties*](../../../tree/main-multi-tenant/db/i18n/i18n.properties) by the labels:
    ```javascript
    projectID               = Project
    projectObjectID         = Project UUID
    projectURL              = Project URL
    projectSystem           = Project System Type
    projectSystemName       = Project System Name
   
    ```
     > In the reference example, the [*/db/i18n/i18n_de.properties](../../../tree/main-multi-tenant/db/i18n/i18n_de.properties) file with the German texts are available, too. You can take them over accordingly.
  

### Enhance the Service Model by the Remote Service

1. To extend the SAP Cloud Application Programming Model service model by remote entities, open the file [*/srv/poetrySlamManagerService.cds*](../../../tree/main-multi-tenant/srv/poetrySlamManagerService.cds) with the service models.

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
    
2. Enhance the service model of service *PoetrySlamManager* by an association to the remote project in SAP Business ByDesign:
    ```javascript
    // Poetry slams (combined with remote project using mixin)
    @odata.draft.enabled
    entity PoetrySlams as select from poetrySlamManagerModel.PoetrySlams
        mixin {
            // SAP Business ByDesign projects: Mix-in of SAP Business ByDesign project data
            toByDProject: Association to RemoteByDProject.ProjectCollection on toByDProject.ProjectID = $projection.projectID
        } 
    ```

3. Enhance the service model of service *PoetrySlamManager* by virtual elements to pass on the name of the ERP system from the destination to the UI, and the visualization of actions:
    ```javascript
    // Poetry slams (combined with remote project using mixin)
    @odata.draft.enabled
    entity PoetrySlams as select from poetrySlamManagerModel.PoetrySlams
        mixin {
            // SAP Business ByDesign projects: Mix-in of SAP Business ByDesign project data
            toByDProject: Association to RemoteByDProject.ProjectCollection on toByDProject.ProjectID = $projection.projectID
        } 
        into  {
            *,
            virtual null as projectSystemName    : String  @title : '{i18n>projectSystemName}' @odata.Type : 'Edm.String',

            // SAP Business ByDesign projects: visibility of button "Create project in SAP Business ByDesign"
            virtual null as createByDProjectEnabled : Boolean  @title : '{i18n>createByDProjectEnabled}'  @odata.Type : 'Edm.Boolean',
            toByDProject,
        }
    ```
    
4. Enhance the service model of service *PoetrySlamManager* by an action to create remote projects:
    ```javascript
    // SAP Business ByDesign projects: action to create a project in SAP Business ByDesign
    @(
        Common.SideEffects              : {TargetEntities: ['_poetryslam','_poetryslam/toByDProject']},
        cds.odata.bindingparameter.name : '_poetryslam'
    )
    action createByDProject() returns PoetrySlams;
    ```
    > Note: The side effect annotation refreshes the project data right after executing the action.

### Enhance the Authentication Model to Cover Remote Projects

1. To extend the authorization annotation of the SAP Cloud Application Programming Model service model by restrictions referring to the remote services, open the file [*/srv/poetrySlamManagerServiceAuthorizations.cds*](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceAuthorizations.cds) with the authorization annotations.

2. Enhance the authorization model for the service entities *ByDProjects*, *ByDProjectSummaryTasks*, and *ByDProjectTasks*.

    ```javascript
    // SAP Business ByDesign projects: Managers and Administrators can read and create remote projects
    annotate PoetrySlamManager.ByDProjects with @(restrict : [
        {
            grant : ['*'],
            to    : 'PoetrySlamFull',
        },
    ]);
    annotate PoetrySlamManager.ByDProjectSummaryTasks with @(restrict : [
        {
            grant : ['*'],
            to    : 'PoetrySlamFull',
        },
    ]);
    annotate PoetrySlamManager.ByDProjectTasks with @(restrict : [
        {
            grant : ['*'],
            to    : 'PoetrySlamFull',
        },
    ]);
    ```

### Create a File with Reuse Functions for SAP Business ByDesign

Some reuse functions specific to SAP Business ByDesign are defined in a separate file. 
1. Create a file with the path */srv/connector-byd.js*.
2. Copy the SAP Business ByDesign reuse functions in the file [*/srv/connector-byd.js*](../../../tree/main-multi-tenant/srv/connector-byd.js) into your project. The file contains functions to delegate OData requests to SAP Business ByDesign, to read SAP Business ByDesign project data, and to assemble an OData payload to create SAP Business ByDesign projects using a project template.

### Enhance the Business Logic to Operate on SAP Business ByDesign Data

Enhance the implementation of the SAP Cloud Application Programming Model services in the file [*/srv/poetrySlamManagerServiceImplementation.js*](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceImplementation.js) to create and read SAP Business ByDesign project data using the remote SAP Business ByDesign OData service. 

1. Delegate requests to the remote OData service. Therefore, copy the on-READ, on-CREATE, on-UPDATE, and on-DELETE methods of the *ByDProjects*, *ByDProjectSummaryTasks*, and *ByDProjectTasks* from the [service implementations (refer to the end of the file)](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceImplementation.js).

    > Note: Without delegation, the remote entities return the error code 500 with the message: *SQLITE_ERROR: no such table* (local testing).

2. Determine the connected back-end systems.
    ```javascript
    // Check connected backend systems
    srv.before('READ', 'PoetrySlams', async (req) => {

        // ByD
        ByDIsConnectedIndicator = await destinationUtil.checkDestination(req,'byd'); 
        ByDSystemName           = await destinationUtil.getDestinationDescription(req,'byd-url');
    });
    ```

    > Note: The destinations called *byd* and *byd-url* connect to the ERP system. You create the destinations later on in the consumer subaccount in SAP BTP.

3. Set the virtual element `createByDProjectEnabled` to control the visualization of the action to create projects dynamically in the for loop of the after-read event of poetry slams and pass on the project system name:

    ```javascript
    // Update project system name and visibility of the "Create Project in SAP Business ByDesign"-button
    poetrySlam.projectSystemName = poetrySlam.projectSystemName ?? '';
    if (poetrySlam.projectID) {
        poetrySlam.createByDProjectEnabled = false;
        if(poetrySlam.projectSystem == 'ByD')  poetrySlam.projectSystemName = ByDSystemName;
    }else{            
        poetrySlam.createByDProjectEnabled = ByDIsConnectedIndicator;
    }
    ```

4. Add the implementation of the action *createByDProject* by the following steps: 

    1. Copy the method *createByDProject* from the file [*/srv/poetrySlamManagerServiceImplementation.js*](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceImplementation.js) into the implementation.

    2. Add two lines to import the destination functions at the beginning of the file:
    ```javascript
     const destinationUtil = require('./util/destination');
     const connectorByD = require('./connector-byd');
    ```

    3. Add two local variables to buffer the status and the name of the remote project management systems at the beginning of the file:

    ```javascript
    // Buffer status and name of project management systems
    let ByDIsConnectedIndicator;  
    let ByDSystemName;
    ```

5. Create a file to check and get the destinations in path */srv/util/destination.js*. Add the functions *getDestinationURL*, *checkDestination*, and *getDestinationDescription* from the file [*/srv/util/destination.js*](../../../tree/main-multi-tenant/srv/util/destination.js). 

    > Note: The reuse functions *getDestinationURL*, *checkDestination*, and *getDestinationDescription* are designed to work for single-tenant and for multi-tenant deployments. For single-tenant deployments, they read the destination from the SAP BTP subaccount that hosts the app, and for multi-tenant deployments, they read the destination from the subscriber subaccount. This system behavior is achieved by passing the JSON Web Token of the logged-in user to the function to get the destination. The JSON Web Token contains the tenant information.

6. Since the npm module *@sap-cloud-sdk/connectivity* is used in the file *destination.js*, add the corresponding npm modules to the *dependencies* section in the [*package.json*](../../../tree/main-multi-tenant/package.json) file:
    ```json
    "dependencies": {
        "@sap-cloud-sdk/connectivity": "^3.9.0",
        "@sap-cloud-sdk/http-client": "^3.9.0"
    },
    ```

7. Add the system message to the file [*/srv/i18n/messages.properties*](../../../tree/main-multi-tenant/srv/i18n/messages.properties).
    ```javascript
    ACTION_CREATE_PROJECT_DRAFT=Projects cannot be created for draft poetry slams
    ```

8. Expand poetry slams to remote projects in [*/srv/poetrySlamManagerServiceImplementation.js*](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceImplementation.js) by filling OData parameter `/PoetrySlams?$expand=toByDProject` in the on-read of the `PoetrySlams` entity:
    ```javascript
    // Expand poetry slams to remote projects
    srv.on('READ', ['PoetrySlams.drafts', 'PoetrySlams'], async (req, next) => {
    // Read the PoetrySlams instances
    let poetrySlams = await next();

    // Check and Read SAP Business ByDesign project related data
    if (ByDIsConnectedIndicator) {
      poetrySlams = await connectorByD.readProject(poetrySlams);
    }

    // Return remote project data
    return poetrySlams;
    });
    ```
    > Note: OData features such as *$expand*, *$filter*, *$orderby*, and so on need to be implemented in the service implementation.

### Enhance the Web App to Display SAP Business ByDesign Data 

1. To edit the SAP Fiori elements annotations of the web app in the file [*/app/poetryslammanager/annotations.cds*](../../../tree/main-multi-tenant/app/poetryslammanager/annotations.cds), add project elements to different areas of the Poetry Slam Manager floorplan. Afterward, here's what it looks like:
    
    - Annotation of PoetrySlams:
        ```javascript
            createByDProjectEnabled  @UI.Hidden;
        ```
    
    - Selection fields:
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
        ``` 

2. Add a facet *Project Data* to display information from the remote service by following the *toByDProject* association:
    - Add facet:
        ```javascript
        {
            $Type  : 'UI.CollectionFacet',
            Label  : '{i18n>projectData}',
            ID     : 'ProjectData',
            Facets : [{
                $Type  : 'UI.ReferenceFacet',
                Target : ![@UI.FieldGroup#ProjectData],
                ID     : 'ProjectData'
            }],
        },         
        ```
    - Add a field group *#ProjectData*:         
        ```javascript
        FieldGroup #ProjectData : {Data : [
            // Project system independend fields:
            {
                $Type : 'UI.DataFieldWithUrl',
                Value : projectID,
                Url   : projectURL,
            },
                    {
                $Type : 'UI.DataField',
                Value : projectSystemName,
            },
            {
                $Type : 'UI.DataField',
                Value : projectSystem,
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
                ]}}
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
                ]}}
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
                ]}}
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
                ]}}
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
                ]}}
            },
        ]},
        ```

3. Add a button to the identification area:
    ```javascript
    {
        $Type  : 'UI.DataFieldForAction',
        Label  : '{i18n>createByDProject}',
        Action : 'PoetrySlamManager.createByDProject',            
        @UI.Hidden : { $edmJson : 
            { $If : 
                [
                    { $Eq : [ {$Path : 'createByDProjectEnabled'}, true ] },
                    false,
                    true
                ]
            }   
        }
    }
    ```
    > Note: The visibility of the *Create Project in SAP Business ByDesign* button is dynamically controlled based on the value of the *createByDProjectEnabled* transient field, which is calculated in the after read-event of the entity *PoetrySlam*.    

4. To edit language-dependent labels in the file [*/db/i18n/i18n.properties*](../../../tree/main-multi-tenant/db/i18n/i18n.properties), add labels for project fields and the button to create projects:
    ```
    # -------------------------------------------------------------------------------------
    # Remote Project Elements

    projectTypeCodeText     = Project Type
    projectStatusCodeText   = Project Status
    projectCostCenter       = Cost Center
    projectStartDateTime    = Start Date
    projectEndDateTime      = End Date

    ```   

5. In the *srv* folder, edit language-dependent labels in the file [*i18n.properties*](../../../tree/main-multi-tenant/srv/i18n/i18n.properties). Add labels for project fields and the button to create projects:
    ```
    # -------------------------------------------------------------------------------------
    # Service Actions

    createByDProject         = Create Project in SAP Business ByDesign

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

### Add Required Node Module for Date Calculation
Poetry Slam Manager uses the node module [*moment*](https://www.npmjs.com/package/moment) for date calculations during the project creation. In this step, you add the node module to the project.

1. Open a terminal.
2. Ensure that the project root is open.
3. Run the command `_npm add moment_`. By this statement, the package.json is enhanced with the dependency *moment*.
4. Run the command `_npm install_`. All node modules are installed in the *node_modules* folder including *moment*.


### Enhance the Configuration of the SAP Cloud Application Programming Model Project

Enhance the file [*package.json*](../../../tree/main-multi-tenant/package.json) by development configurations for local testing and productive configurations:
```json
"byd_khproject": {
    "kind": "odata-v2",
    "model": "srv/external/byd_khproject",
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

Ensure that the CDS feature *fetch_csrf* is set in the file *package.json* to enable the management of cross-site request forgery tokens (required for POST requests at runtime using destinations of the type *BasicAuthentication*):
```json
"cds": {
    "features": {
        "fetch_csrf": true
    },
}      
```
> Note: By default, SAP Cloud Application Programming Model does not handle CSRF tokens for POST requests. Remote services may fail if CSRF tokens are required.

> Note: For local testing, replace `{{ByD-hostname}}`, `{{test-user}}`, and `{{test-password}}` with a system, user, and password from SAP Business ByDesign. Don't push this information to your GitHub repository.

### Test Locally

1. Open a terminal and start the app with the development profile using the run command `cds watch --profile development`. 
2. Use the test users as listed in the file [*.cdsrc.json*](../../../tree/main-multi-tenant/.cdsrc.json). 
3. Test the critical connection points to SAP Business ByDesign: 

    1. Test the *Service Endpoints* for *ByDProjects*, *ByDProjectSummaryTasks*, and *ByDProjectTasks*: The system returns the respective data from SAP Business ByDesign (without filtering).

    2. The *Create Project in SAP Business ByDesign* button is dependent on the setup of the destinations. Once the destinations are correctly configured and the application is deployed to SAP BTP Cloud Foundry runtime, the *Create Project in SAP Business ByDesign* button will be active.
    To test this button locally, in _poetrySlamManagerServiceImplementation.js_, change **_poetrySlam.createByDProjectEnabled = ByDIsConnectedIndicator;_** to  **_poetrySlam.createByDProjectEnabled = true;_**:

    ```javascript 

  ```javascript
      poetrySlam.projectSystemName = poetrySlam.projectSystemName ?? '';
      if (poetrySlam.projectID) {
          poetrySlam.createByDProjectEnabled = false;
          if (poetrySlam.projectSystem == 'ByD')
            poetrySlam.projectSystemName = ByDSystemName;
      } else {
          poetrySlam.createByDProjectEnabled = ByDIsConnectedIndicator;
      }
      ```
    > Note: This change is required as the *ByDIsConnectedIndicator* value is dependent on the setup of destinations. Destinations only work on a deployed application and cannot be tested locally.

4. Open the */poetryslammanager/webapp/index.html* web application and open one of the poetry slams. 
5. Choose *Create Project in SAP Business ByDesign*. The system creates a project in SAP Business ByDesign displays the details in the *Project Details* section.
6. After clicking on the project link, the system opens a browser window with the SAP Business ByDesign project overview.

7. Test the *Service Endpoints* for *PoetrySlams* and note down the ID of the poetry slam for which you created the SAP Business ByDesign project in step 2 as **poetry-slam-ID**.
8. Append `(ID={{poetry-slam-ID}},IsActiveEntity=true)?$select=toByDProject&$expand=toByDProject($select=ID,costCenter,endDateTime,startDateTime,statusCodeText,typeCodeText)` to the service endpoint URL, replace the place holder *{{poetry-slam-ID}}* by the **poetry-slam-ID**, and run again.
9. The system returns the record with the project ID and the SAP Business ByDesign project details as sub-node.

> Note: If you would like to use a different user, clear the browser cache first. 

### Deploy the Application

Update your application in the provider subaccount. For detailed instructions, refer to the section [Deploy the Multi-Tenant Application to a Provider Subaccount](22-Multi-Tenancy-Deployment.md#build-and-deploy-the-multi-tenant-application).

> Note: Make sure any local changes have been reverted before deployment.
