# Integrate the SAP BTP Application with SAP Business ByDesign

In this section, you enhance Poetry Slam Manager, your SAP BTP solution, to make sure that it supports SAP Business ByDesign as the back end. 

Front-end integration:
1. Navigate from Poetry Slams to related SAP Business ByDesign projects.

Back-channel integration:

2. Create SAP Business ByDesign projects from Poetry Slam Manager and display project information on the object page of a poetry slam using OData APIs with principal propagation.

## How to Enhance the Application Step by Step

To explore the ERP integration with the Poetry Slam Manager, you have two options: 

1. Clone the repository of the Partner Reference Application. Check out the [*main-multi-tenant*](../../../tree/main-multi-tenant) branch and enhance the application step by step. 

2. Alternatively, check out the [*main-multi-tenant-features*](../../../tree/main-multi-tenant-features) branch where the ERP integration is already included. 

The following section describes how to enhance the **main-multi-tenant** branch (option 1).

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

You keep the core of your multi-tenant application, which you developed in the previous tutorials, and add changes for the ERP integration. 

> Note: Your solution is now in a good state to save a version of your implementation in your version control system, which enables you to go back to the multi-tenant application without ERP integration at any time.

### Import SAP Business ByDesign OData Service
The SAP Business ByDesign OData service is consumed by using a destination. SAP Cloud Application Programming Model uses a one-to-one binding of remote services and destinations. To propagate the logged-in business user to SAP Business ByDesign, an OAuth 2.0 SAML Bearer authentication is used. This way, the SAP Business ByDesign OData service for projects considers the user authorizations.

1. Run the $metadata URL of the newly added SAP Business ByDesign OData service in a browser window or Postman: https://{{ByDTenantHostname}}/sap/byd/odata/cust/v1/khproject/$metadata?sap-label=true&sap-language=en. 

2. Save the service response payload with the metadata with file extension *.edmx*:
    - File *byd_khproject.edmx* for user propagation

    > Note: Ensure a unique file name without special characters except "_".

3. In SAP Business Application Studio, to import the SAP Business ByDesign OData service into the SAP Cloud Application Programming Model (CAP) project, create a folder with the name `external_resources` in the root folder of the application.

4. Open the context menu of the *external_resources* folder and upload the *.edmx* file with the OData service.

5. Open a terminal and ensure that you're in the root folder of the application. Import the *.edmx* file using the command `cds import ./external_resources/byd_khproject.edmx --as cds`.

    > Note: Don't use the CDS import command parameter `--keep-namespace` because it would result in the CDS service name *cust*, which would lead to service name clashes if you import multiple SAP Business ByDesign custom OData services.

    After running the command `cds import ...`, the file *package.json* of the root folder is updated with a CDS configuration referring to the remote OData services, and a folder with path *./srv/external* has been created. The folder contains the configuration files for the remote services.
    
    > Note: Typically, remote services don't require any persistency. Make sure the entities in the corresponding CDS files in the folder *./srv/external* are annotated with `@cds.persistence.skip : true`. You may encounter errors during the deployment with the db-deployer service if the persistency-skip-annotation is missing.

### Enhance the Entity Model to Store Key Project Information

In SAP Business Application Studio, enhance the SAP Cloud Application Programming Model entity models in the file [*/db/poetrySlamManagerModel.cds*](../../../tree/main-multi-tenant-features/db/poetrySlamManagerModel.cds) with elements to store project key information, which makes it possible to associate poetry slams to projects in the remote ERP systems.

1. Enhance the entity *PoetrySlams* with the following elements:
    ```javascript
    projectID       : String;
    projectObjectID : String;
    projectURL      : String;
    projectSystem   : String;  
    ```  

2. Enhance the annotations of entity *PoetrySlams* with the following elements:
    ```javascript
    projectID           @title: '{i18n>projectID}';         @readonly;
    projectObjectID     @title: '{i18n>projectObjectID}'    @readonly;
    projectURL          @title: '{i18n>projectURL}'         @readonly;
    projectSystem       @title: '{i18n>projectSystem}'      @readonly;
    ```  

3. Enhance the labels of the entity *PoetrySlams* in the file [*/db/i18n/i18n.properties*](../../../tree/main-multi-tenant-features/db/i18n/i18n.properties) with the labels:
    ```javascript
    projectID               = Project
    projectObjectID         = Project UUID
    projectURL              = Project URL
    projectSystem           = System Type
    ```
     > In the reference example, the [*/db/i18n/i18n_de.properties*](../../../tree/main-multi-tenant-features/db/i18n/i18n_de.properties) file with the German texts is available too. You can take them over accordingly.
  

### Enhance the Service Model With the Remote Service

1. To extend the SAP Cloud Application Programming Model service model with remote entities, open the file [*/srv/poetryslam/poetrySlamService.cds*](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamService.cds) with the service models.

2. Add a projection of the SAP Business ByDesign project to the service model for consumption in the Fiori Elements UI:
    ```javascript
    // -------------------------------------------------------------------------------
    // Extend service PoetrySlamService by SAP Business ByDesign projects
    using {byd_khproject as RemoteByDProject} from '../external/byd_khproject';

    extend service PoetrySlamService with {
        entity ByDProjects     as
            projection on RemoteByDProject.ProjectCollection {
                key ObjectID                       as ID,
                    ProjectID                      as projectID,
                    ProjectTypeCodeText            as typeCodeText,
                    ProjectLifeCycleStatusCodeText as statusCodeText,
                    ResponsibleCostCentreID        as costCenter,
                    PlannedStartDateTime           as startDateTime,
                    PlannedEndDateTime             as endDateTime
            }
    };
    ```
    
3. Enhance the service model of the service *PoetrySlamService* with virtual elements and an association to the remote project in SAP Business ByDesign. The virtual elements are calculated, non-persisted fields to pass on the name of the ERP system from the destination to the UI, and the visualization of actions.
    ```javascript
    // Poetry Slams (draft enabled)
    @odata.draft.enabled
    @Common.SemanticObject: 'poetryslams'
    @Common.SemanticKey   : [ID]
    entity PoetrySlams as
        select from poetrySlamManagerModel.PoetrySlams {
            // Selects all fields of the PoetrySlams domain model
            *,
            maxVisitorsNumber - freeVisitorSeats as bookedSeats                  : Integer @title     : '{i18n>bookedSeats}',
            // Relevant for coloring of status in UI to show criticality
            virtual null                         as statusCriticality            : Integer @title     : '{i18n>statusCriticality}',
            virtual null                         as projectSystemName            : String  @title     : '{i18n>projectSystemName}'        @odata.Type: 'Edm.String',
            // SAP Business ByDesign projects: visibility of button "Create Project in SAP Business ByDesign"
            virtual null                         as createByDProjectEnabled      : Boolean @odata.Type: 'Edm.Boolean',
            virtual null                         as isByD                        : Boolean @odata.Type: 'Edm.Boolean',
            // Projection of remote service data as required by the UI
            toByDProject                                                         : Association to PoetrySlamService.ByDProjects on toByDProject.projectID = $self.projectID
    }
    ```
    
4. Enhance the service model of the service *PoetrySlamService* with an action to create remote projects:
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

5. In case you want to support an option to clear the connection to the created project, enhance the service model of service *PoetrySlamService* with the action `clearProjectData`.
    ```javascript
    // ERP systems: action to clear the project data
    @(
    Common.SideEffects             : {TargetEntities: [
        '_poetryslam',
        '_poetryslam/toByDProject'
    ]},
    cds.odata.bindingparameter.name: '_poetryslam'
    )
    action clearProjectData();
    ```    

### Enhance the Authentication Model to Cover Remote Projects

1. To extend the authorization annotation of the SAP Cloud Application Programming Model service model by restrictions referring to the remote services, open the file [*/srv/poetryslam/poetrySlamServiceAuthorizations.cds*](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamServiceAuthorizations.cds) with the authorization annotations.

2. Enhance the authorization model for the service entities *ByDProjects*, *ByDProjectSummaryTasks*, and *ByDProjectTasks*.

    ```javascript
    // SAP Business ByDesign projects: Managers can read remote projects (creation is done using the remote service, not the projection in the PoetrySlamService)
    annotate PoetrySlamService.ByDProjects with @(restrict: [{
        grant: ['READ'],
        to   : 'PoetrySlamFull'
    }]);
    ```

### Create Files with Reuse Functions for the Enterprise Resource Planning System Integration

You can define reuse functions that handle the connection for the different Enterprise Resource Planning (ERP) systems in separate files.

1. Create a file to check and get the destinations in path */srv/poetryslam/util/destination.js*. 
2. Add the functions *readDestination*, *getDestinationURL*, and *getDestinationDescription* from the file [*/srv/poetryslam/util/destination.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/util/destination.js).

    > Note: The reuse functions *readDestination*, *getDestinationURL*, and *getDestinationDescription* read the destination from the subscriber subaccount. This system behavior is achieved by passing the JSON Web Token of the logged-in user to the function to get the destination. The JSON Web Token contains the tenant information.

    > Note: The reuse function *getDestinationDescription* returns the destination description from the SAP BTP consumer subaccount.

3. Since the npm module *@sap-cloud-sdk/connectivity* is used in the file *destination.js*, add the corresponding npm modules to your project. To do so, open a terminal and run the commands:

    i. `npm add @sap-cloud-sdk/connectivity` 

    ii. `npm add @sap-cloud-sdk/http-client`

    The dependencies are added to the *dependencies* section in the [*package.json*](../../../tree/main-multi-tenant-features/package.json) file. 

4. Create a new folder *connector* in path */srv/poetryslam*.
5. Create a file with the path */srv/poetryslam/connector/connector.js*. This file is reused for different ERP integrations.
6. Copy the ERP connection reuse functions in the file [*/srv/poetryslam/connector/connector.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/connector/connector.js) into your project. It delegates the OData requests and holds the destinations.

### Create a File with Reuse Functions for SAP Business ByDesign

Reuse functions specific to SAP Business ByDesign are defined in a separate file.

1. Create a file with the path */srv/poetryslam/connector/connectorByD.js*.
2. Copy the SAP Business ByDesign reuse functions in the file [*/srv/poetryslam/connector/connectorByD.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/connector/connectorByD.js) into your project. The file contains functions to delegate OData requests to SAP Business ByDesign, to read SAP Business ByDesign project data, and to assemble an OData payload to create SAP Business ByDesign projects using a project template.

    > Note: This file contains a function ```insertRemoteProjectData()```. This function creates a project purchase order in SAP Business ByDesign by creating an entity directly using the external imported service and the external entity model. It does *not* use the projection as modeled in the *PoetrySlamService*. This is intentional: The projection is used for fields shown in the Fiori Elements UI (read-only) or updates of individual fields. More complex write scenarios, including create scenarios, should directly call the external imported services. This avoids data type validations by CAP, leaving the validations to the external service. It also avoids a remodeling of all fields and compositions required for creation in the projection.

    > Note: This file contains sample data that can vary depending on the system. Check the data set and maintain it accordingly to ensure consistency between the Partner Reference App and SAP Business ByDesign. The sample data is marked with a block comment *Project data for SAP Business ByDesign; needs to be adopted according to SAP Business ByDesign configuration*.

### Enhance the Business Logic to Operate on SAP Business ByDesign Data

Enhance the implementation of the SAP Cloud Application Programming Model services to create and read SAP Business ByDesign project data using the remote SAP Business ByDesign OData service. 

1. Delegate requests to the remote OData service. 
    1. Create a new file *srv/poetryslam/poetrySlamServiceERPImplementation.js* in your project.

    2. Copy the following code snippet into the newly created file. As a reference you can have a look in the file [poetrySlamServiceERPImplementation.js](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamServiceERPImplementation.js) in the reference application.
        ```javascript
        'strict';

        // Add connector for project management systems
        const ConnectorByD = require('./connector/connectorByD');

        module.exports = async (srv) => {
            // -------------------------------------------------------------------------------------------------
            // Implementation of remote OData services (back-channel integration with SAP Business ByDesign)
            // -------------------------------------------------------------------------------------------------

            // Delegate OData requests to remote project entities
            srv.on('READ', 'ByDProjects', async (req) => {
                const connector = await ConnectorByD.createConnectorInstance(req);
                return await connector.delegateODataRequests(
                    req,
                    ConnectorByD.PROJECT_SERVICE
                );
            });
        }
        ```

        > Note: Without delegation, the remote entities return the error code 500 with the message: *SQLITE_ERROR: no such table* (local testing).

        > Note: In this example, the projection of the remote project in SAP Business ByDesign as modeled in the PoetrySlamService is only used for *READ* access. In case you want to support *UPDATE* as well, you would need to change ```srv.on('READ', ...)``` to ```srv.on(['READ', 'UPDATE'], ...)``` in the above snippet. The *CREATE* is implemented separately as described in the previous section.

2. Enhance the [poetrySlamServiceImplementation.js](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamServiceImplementation.js) to call the ERP implementation.

    1. Import the ERP forward handler.

        ```javascript
        const erpForwardHandler = require('./poetrySlamServiceERPImplementation');
        ```

    2. Call the ERP forward handler.

        ```javascript
        await erpForwardHandler(srv); // Forward handler to the ERP systems
        ```

3. In the file [*/srv/poetryslam/poetrySlamServicePoetrySlamsImplementation.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamServicePoetrySlamsImplementation.js), the poetry slams entity is enriched with SAP Business ByDesign specific data. 

    1. Determine the connected back-end systems and read the project data from the remote system. Set the virtual element `createByDProjectEnabled` to control the visualization of the action to create a project dynamically and pass on the project system name.

        ```javascript
        // Expand poetry slams
        srv.on('READ', ['PoetrySlams.drafts', 'PoetrySlams'], async (req, next) => {
            // Read the PoetrySlams instances
            let poetrySlams = await next();

            // In this method we enrich the data from the database by external data and calculated fields
            // If none of these enriched fields are requested, we do not need to read from the external services
            // So we first check if the requested columns contain any of the enriched columns and return if not
            const requestedColumns = req.query.SELECT.columns?.map((item) =>
                Array.isArray(item.ref) ? item.ref[0] : item.as
            );
            const enrichedFields = [
                'projectSystemName',
                'processingStatusText',
                'projectProfileCodeText',
                'createByDProjectEnabled',
                'isByD',
                'toByDProject',
            ];

            if (
                requestedColumns &&
                !enrichedFields.some((item) => requestedColumns?.includes(item))
            ) {
                return poetrySlams;
            }

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

    2. Add the implementation of the action *createByDProject*: 

        1. Copy the method *createByDProject* into the implementation.

            ```javascript
            // Entity action: Create SAP Business ByDesign Project
            srv.on('createByDProject', async (req) => {
                await createProject(
                    req,
                    srv,
                    ConnectorByD,
                    'ACTION_CREATE_PROJECT_NO_SAP_BUSINESS_BY_DESIGN_SYSTEM'
                );
            });
            ```

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

    4. Copy the implementation of the action `clearProjectData` to clear all project data:
        ```javascript
        srv.on('clearProjectData', async (req) => {
            ...
        });
        ```
        ```

4. Copy the constant `DATE_DAYS_MULTIPLIER` and the functions `createProject` and `subtractDaysFormatRFC3339` from the file [*/srv/poetryslam/util/entityCalculations.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/util/entityCalculations.js) into the implementation and export the functions at the end of the file.

5. Add the system message to the file [*/srv/i18n/messages.properties*](../../../tree/main-multi-tenant-features/srv/i18n/messages.properties).

    > In the reference example, the [*/srv/i18n/messages_de.properties*](../../../tree/main-multi-tenant-features/srv/i18n/messages_de.properties) file with the German texts is available too. You can take them over accordingly.

5. Add the below system messages to the file [*/srv/i18n/messages.properties*](../../../tree/main-multi-tenant-features/srv/i18n/messages.properties).
    ```javascript
    ACTION_CREATE_PROJECT_DRAFT                             = Projects cannot be created for draft Poetry Slams.
    ACTION_CREATE_PROJECT_NO_SAP_BUSINESS_BY_DESIGN_SYSTEM  = No SAP Business ByDesign system connected. Project cannot be created.
    ACTION_CREATE_PROJECT_FAILED                            = Project creation failed. Poetry Slam {0} was not updated.
    ACTION_READ_PROJECT_CONNECTION                          = Project cannot be retrieved.
    ACTION_ERP_REMOVED                                      = The ERP information was removed from poetry slam {0}.
    ```
    > In the reference example, the [*/srv/i18n/messages_de.properties*](../../../tree/main-multi-tenant-features/srv/i18n/messages_de.properties) file with the German texts is available too. You can take them over accordingly.

### Enhance the Web App to Display SAP Business ByDesign Data 

1. Adopt the SAP Fiori elements annotations of the web app in the file [*/app/poetryslams/annotations.cds*](../../../tree/main-multi-tenant-features/app/poetryslams/annotations.cds).

    1. Add project annotations to the PoetrySlams entity: 
    
        ```javascript
        projectObjectID              @UI.Hidden;
        createByDProjectEnabled      @UI.Hidden;
        isByD                        @UI.Hidden;
        ```
    2. Add a facet *Project Data* to display information from the remote service by following the *toByDProject* association:
        1. Add facet:
            ```javascript
            {
                $Type        : 'UI.ReferenceFacet',
                Label        : '{i18n>projectData}',
                ID           : 'ProjectData',
                Target       : @UI.FieldGroup #ProjectData,
                ![@UI.Hidden]: {$edmJson: {$Not: {$Path: 'isByD'}}} // Display ProjectData only in case a SAP Business ByDesign Cloud system is connected
            }
            ```
        2. Add a field group *#ProjectData* with the specific fields to SAP Business ByDesign:         
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

    4. Add two buttons to the identification area:
        ```javascript
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
        // Clear the project data
        {
            $Type        : 'UI.DataFieldForAction',
            Label        : '{i18n>removeProjectData}',
            Action       : 'PoetrySlamService.clearProjectData',
            ![@UI.Hidden]: {$edmJson: {$Or: [
            {$Eq: [
                {$Path: 'projectID'},
                {$Null: null}
            ]},
            {$Not: {$Path: 'IsActiveEntity'}}
            ]}}
        }
        ```
        > Note: The visibility of the *Create Project in SAP Business ByDesign* button is dynamically controlled based on the value of the *createByDProjectEnabled* transient field, which is calculated in the after read-event of the entity *PoetrySlams*.    

4. In the *srv* folder, edit language-dependent labels in the file [*/srv/i18n/i18n.properties*](../../../tree/main-multi-tenant-features/srv/i18n/i18n.properties). Add labels for project fields and the button to create projects:
    ```
    # -------------------------------------------------------------------------------------
    # Transient Service Elements

    projectSystemName       = System Name
    
    # -------------------------------------------------------------------------------------
    # Service Actions

    createByDProject        = Create Project in SAP Business ByDesign
    removeProjectData       = Clear Project Data

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

    > In the reference example, the [*/srv/i18n/i18n_de.properties*](../../../tree/main-multi-tenant-features/srv/i18n/i18n_de.properties) file with the German texts is available too. You can take them over accordingly.

5. In the app folder, edit language-dependent labels in the file [*app/poetryslams/i18n/i18n.properties*](../../../tree/main-multi-tenant-features/app/poetryslams/i18n/i18n.properties). Add a label for facet project data:

    ```
    projectData             = Project Data
    ```      

    > In the reference example, the [*app/poetryslams/i18n/i18n_de.properties*](../../../tree/main-multi-tenant-features/app/poetryslams/i18n/i18n_de.properties) file with the German texts is available too. You can take them over accordingly.
        

### Enhance the Configuration of the SAP Cloud Application Programming Model Project

Enhance the file [*package.json*](../../../tree/main-multi-tenant-features/package.json) with development configurations for local testing and productive configurations. Ensure that the flag *csrf* and *csrfInBatch* is set in the file *package.json* to enable the management of cross-site request forgery tokens (required for POST requests at runtime) using destinations of the type:

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

> Note: For local testing, replace `{{ByD-hostname}}`, `{{test-user}}`, and `{{test-password}}` with a system, user, and password from SAP Business ByDesign. Don't push this information to your GitHub repository.

### Test Locally

1. The *Create Project in SAP Business ByDesign* button is dependent on the setup of the destinations. Once the destinations are correctly configured and the application is deployed to SAP BTP Cloud Foundry runtime, the *Create Project in SAP Business ByDesign* button will be active. To test this button locally, in _connectorByD.js_, method _createConnectorInstance_, change the value of **connector.isConnectedIndicator** to **true**:

    ```javascript
    const connector = new ConnectorByD(data);
    connector.isConnectedIndicator = true;
    ```
        
    > Note: This change is required as the *isConnectedIndicator* value is dependent on the setup of the destinations. Destinations only work on a deployed application and cannot be tested locally.

2. Open a terminal and start the app with the development profile using the run command `cds watch --profile development`. 

3. Enter a test user. The test users are listed in the file [*.cdsrc.json*](../../../tree/main-multi-tenant-features/.cdsrc.json). 

4. Test the service endpoints *ByDProjects*, *ByDProjectSummaryTasks*, and *ByDProjectTasks* to SAP Business ByDesign. The system returns the respective data from SAP Business ByDesign.

5. Open the */poetryslams/webapp* web application. The poetry slams list will be shown. 

6. Choose *Create Project in SAP Business ByDesign*. The system creates a project in SAP Business ByDesign and displays the details in the *Project Details* section.
       > Note: The link to the project won't work in a local application. To test the full integration including navigation to the SAP Business ByDesign system, you will have to test with the deployed application.

7. Test the *Service Endpoints* for *PoetrySlams* of *poetryslamservice* and note down the *ID* of the poetry slam for which you created the SAP Business ByDesign project in step 2 as **poetry-slam-ID**.

8. Append `(ID={{poetry-slam-ID}},IsActiveEntity=true)` to the service endpoint URL, replace the place holder *{{poetry-slam-ID}}* by the **poetry-slam-ID**, and run again.

9. The system returns the record with the project ID and the SAP Business ByDesign project details as sub-node.

> Note: If you would like to use a different user, clear the browser cache first. 

### Deploy the Application

Update your application in the provider subaccount. For detailed instructions, refer to the section [Deploy the Multi-Tenant Application to a Provider Subaccount](./24-Multi-Tenancy-Deployment.md).

> Note: Make sure any local changes have been reverted before deployment.

You have now successfully deployed the application to the provider subaccount and you're ready to [provision tenants of the multi-tenant application to customers and connect with SAP Business ByDesign](./35b-Multi-Tenancy-Provisioning-Connect-ByD.md).
