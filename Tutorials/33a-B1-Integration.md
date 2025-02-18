# Integrate the SAP BTP Application with SAP Business One

In this section, you enhance Poetry Slam Manager, your SAP BTP solution, to make sure that it supports SAP Business One as the back end. 

Front-end integration:
1. Navigate from Poetry Slams to related SAP Business One purchase orders.

Back-channel integration:

2. Create SAP Business One purchase orders from Poetry Slams and display purchase order information on the object page of a poetry slam using OData APIs with principal propagation.

## How to Enhance the Application Step by Step

To explore the ERP integration with the Poetry Slam Manager, you have two options: 

1. Clone the repository of the Partner Reference Application. Check out the [*main-multi-tenant*](../../../tree/main-multi-tenant) branch and enhance the application step by step. 

2. Alternatively, check out the [*main-multi-tenant-features*](../../../tree/main-multi-tenant-features) branch where the ERP integration is already included. 

The following section describes how to enhance the **main-multi-tenant** branch (option 1).

## Enhance the Core Application for ERP Integration

In this section, you learn how to import the SAP Business One OData service as a "remote service" into your SAP Cloud Application Programming Model (CAP) project and how to use the OData service to create SAP Business One purchase orders to allow the procurement of anything required for the organization or staging of your poetry slams.

You keep the core of your multi-tenant application, which you developed in the previous tutorials, and add changes for the ERP integration. 

> Note: Your solution is now in a good state to save a version of your implementation in your version control system, which enables you to go back to the multi-tenant application without ERP integration at any time.

### Import SAP Business One OData Service

The SAP Business One OData service is consumed by using a destination. SAP Cloud Application Programming Model uses a one-to-one binding of remote services and destinations. To propagate the logged-in business user to SAP Business One, an OAuth 2.0 SAML Bearer authentication is used. This way, the SAP Business One OData service for purchase orders considers the user authorizations.

1. Run the $metadata URL of the SAP Business One OData service in a browser window: _https://\<service-layer server\>/b1s/v2/$metadata_

2. Save the service response payload with the metadata with file extension *.edmx*:
    - File *b1_sbs_v2.edmx* for user propagation

    > Note: Ensure a unique file name without special characters except "_".
    
    > Note: The response contains many entities that you don't require for this integration scenario. It's sufficient to use a self-contained excerpt of the complete $metadata file. For the example described here, you can use the file [b1_sbs_v2.edmx](../../../tree/main-multi-tenant-features/external_resources/b1_sbs_v2.edmx).

3. In SAP Business Application Studio, to import the SAP Business One OData service into the SAP Cloud Application Programming Model (CAP) project, create a folder with the name `external_resources` in the root folder of the application.

4. Open the context menu of the *./external_resources* folder and upload the *.edmx* file with the OData service.

5. Open a terminal and ensure that you're in the root folder of the application. Import the *.edmx* file using the command `cds import ./external_resources/b1_sbs_v2.edmx --as cds`.

    > Note: Don't use the CDS import command parameter `--keep-namespace` because it would result in the CDS service name *cust*, which would lead to service name clashes if you import multiple SAP Business One custom OData services.

    After the command is executed, the file *app/poetryslams/package.json* is updated with a CDS configuration referring to the remote OData service, and a folder with path *./srv/external* is created. The folder contains the configuration files for the remote services.
    
    > Note: Typically, remote services don't require any persistency. Make sure the entities in the corresponding CDS files in the folder *./srv/external* are annotated with `@cds.persistence.skip : true`. You may encounter errors during the deployment with the db-deployer service if the persistency-skip-annotation is missing.

### Enhance the Entity Model to Store Key Purchase Order Information

In SAP Business Application Studio, enhance the SAP Cloud Application Programming Model entity models in the file [*/db/poetrySlamManagerModel.cds*](../../../tree/main-multi-tenant-features/db/poetrySlamManagerModel.cds) with elements to store purchase order key information, which makes it possible to associate poetry slams to purchase orders in the remote ERP systems.

1. Enhance the entity *PoetrySlams* with the following elements:
    ```javascript
    purchaseOrderID       : String;
    purchaseOrderObjectID : String;
    purchaseOrderURL      : String;
    purchaseOrderSystem   : String;
    ```  

2. Enhance the annotations of entity *PoetrySlams* with the following elements:
    ```javascript
    purchaseOrderID       @title: '{i18n>purchaseOrderID}';      @readonly;
    purchaseOrderObjectID @title: '{i18n>purchaseOrderObjectID}' @readonly;
    purchaseOrderURL      @title: '{i18n>purchaseOrderURL}'      @readonly;
    purchaseOrderSystem   @title: '{i18n>purchaseOrderSystem}'   @readonly;
    ```

3. Enhance the labels of the entity *PoetrySlams* in the file [*/db/i18n/i18n.properties*](../../../tree/main-multi-tenant-features/db/i18n/i18n.properties) with the labels:
    ```javascript
    purchaseOrderID       = Purchase Order
    purchaseOrderObjectID = Purchase Order Internal ID
    purchaseOrderURL      = Purchase Order URL
    purchaseOrderSystem   = Purchase Order System Type
    ```
     > In the reference example, the [*/db/i18n/i18n_de.properties*](../../../tree/main-multi-tenant-features/db/i18n/i18n_de.properties) file with the German texts is available, too. You can take them over accordingly.
  

### Enhance the Service Model With the Remote Service

1. To extend the SAP Cloud Application Programming Model service model by remote entities, open the file [*/srv/poetryslam/poetrySlamService.cds*](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamService.cds) with the service models.

2. Add a projection of the SAP Business One purchase order to the service model for consumption in the Fiori Elements UI:
    ```javascript
    // -------------------------------------------------------------------------------
    // Extend service PoetrySlamService by SAP Business One Purchase Orders

    using {b1_sbs_v2 as RemoteB1} from '../external/b1_sbs_v2';

    extend service PoetrySlamService with {
        entity B1PurchaseOrder as
            projection on RemoteB1.PurchaseOrders {
                key DocEntry     as docEntry,
                    DocNum       as docNum,
                    DocDueDate   as docDueDate,
                    CreationDate as creationDate,
                    DocTotal     as docTotal,
                    DocCurrency  as docCurrency
            }
    }
    ```

3. Enhance the service model of the service *PoetrySlamService* with virtual elements and an association to the projection of the remote purchase order in SAP Business One. The virtual elements are calculated, non-persisted fields to pass on the name of the ERP system from the destination to the UI, and the visualization of actions.
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
            // SAP Business One purchase order: visibility of button "Create Purchase Order in SAP Business One"
            virtual null                         as createB1PurchaseOrderEnabled : Boolean @odata.Type: 'Edm.Boolean',
            virtual null                         as purchaseOrderSystemName      : String  @title     : '{i18n>purchaseOrderSystemName}'  @odata.Type: 'Edm.String',
            virtual null                         as isB1                         : Boolean @odata.Type: 'Edm.Boolean',
            // Projection of remote service data as required by the UI
            toB1PurchaseOrder                                                    : Association to PoetrySlamService.B1PurchaseOrder on toB1PurchaseOrder.docNum = $self.purchaseOrderID
 
    ```
    
4. Enhance the service model of the service *PoetrySlamService* with an action to create remote purchase orders:
    ```javascript
    // SAP Business One purchase order: action to create a purchase order in SAP Business One
    @(
        Common.SideEffects             : {TargetEntities: [
            '_poetryslam',
            '_poetryslam/toB1PurchaseOrder'
        ]},
        cds.odata.bindingparameter.name: '_poetryslam'
    )
    action createB1PurchaseOrder() returns PoetrySlams;
    ```
    > Note: The side effect annotation refreshes the purchase order data right after executing the action.

5. In case you want to support an option to clear the connection to the created purchase order, enhance the service model of service *PoetrySlamService* with the action `clearPurchaseOrderData`. 
    ```javascript
      // SAP Business One purchase order: action to clear the purchase order data
      @(
        Common.SideEffects             : {TargetEntities: [
          '_poetryslam',
          '_poetryslam/toB1PurchaseOrder'
        ]},
        cds.odata.bindingparameter.name: '_poetryslam'
      )
      action clearPurchaseOrderData();
    ```

### Enhance the Authentication Model to Cover Remote Purchase Orders

1. To extend the authorization annotation of the SAP Cloud Application Programming Model service model by restrictions referring to the remote services, open the file [*/srv/poetryslam/poetrySlamServiceAuthorizations.cds*](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamServiceAuthorizations.cds) with the authorization annotations.

2. Enhance the authorization model for the service entity *B1PurchaseOrder*.

    ```javascript
    // SAP Business One purchase orders: Managers can read remote purchase orders (creation is done using the remote service, not the projection in the PoetrySlamService)
    annotate PoetrySlamService.B1PurchaseOrder with @(restrict: [{
        grant: ['READ'],
        to   : 'PoetrySlamFull'
    }]);
    ```

### Create Files with Reuse Functions for the ERP System Integration

You can define reuse functions that handle the connection for the different Enterprise Resource Planning (ERP) systems in separate files. 

1. Create a file to check and get the destinations in path */srv/poetryslam/util/destination.js*. 
2. Add the functions *readDestination*, *getDestinationURL*, and *getDestinationDescription* from the file [*/srv/poetryslam/util/destination.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/util/destination.js).

    > Note: The reuse functions *readDestination*, *getDestinationURL*, and *getDestinationDescription* read the destination from the subscriber subaccount. This system behavior is achieved by passing the JSON Web Token of the logged-in user to the function to get the destination. The JSON Web Token contains the tenant information.

    > Note: The reuse function *getDestinationDescription* returns the destination description from the SAP BTP consumer subaccount.

3. Since the npm module *@sap-cloud-sdk/connectivity* is used in the file *destination.js*, add the corresponding npm modules to your project. To do so, open a terminal and run the commands:

    1. `npm add @sap-cloud-sdk/connectivity` 

    2. `npm add @sap-cloud-sdk/http-client`

    The dependencies are added to the *dependencies* section in the [*package.json*](../../../tree/main-multi-tenant-features/package.json) file. 

4. Create a file with the path */srv/poetryslam/connector/connector.js*. This file is reused for different ERP integrations.
5. Copy the ERP connection reuse functions in the file [*/srv/poetryslam/connector/connector.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/connector/connector.js) into your project. It delegates the OData requests and holds the destinations.

### Create a File with Functions for SAP Business One

Reuse functions specific to SAP Business One are defined in a separate file. 

1. Create a file with the path */srv/poetryslam/connector/connectorB1.js*. 
2. Copy the SAP Business One-related functions in the file [*/srv/poetryslam/connector/connectorB1.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/connector/connectorB1.js) into your project. The file contains functions to delegate OData requests to SAP Business One, to read SAP Business One purchase order data, and to assemble an OData payload to create SAP Business One purchase orders.

    > Note: This file contains a function ```insertRemotePurchaseOrderData()```. This function creates a purchase order in SAP Business One by creating an entity directly using the external imported service and the external entity model. It does *not* use the projection as modelled in the *PoetrySlamService*. This is intentional: The projection is used for fields shown in the Fiori Elements UI (read-only) or updates of individual fields. More complex write scenarios, including create scenarios, should directly call the external imported services. This avoids data type validations by CAP, leaving the validations to the external service. It also avoids a remodeling of all fields and compositions required for creation in the projection.
    
    > Note: This file contains sample data that can vary depending on the system. Check the data set and maintain it accordingly to ensure consistency between the Partner Reference App and SAP Business One. The sample data is marked with a block comment *Purchase order data for SAP Business One; needs to be adopted according to SAP Business One configuration of the customer system*.

### Enhance the Business Logic to Operate on SAP Business One Data

Enhance the implementation of the SAP Cloud Application Programming Model services to create and read SAP Business One purchase order data using the remote SAP Business One OData service. 

1. Delegate requests to the remote OData service. 
    1. Create a new file *srv/poetryslam/poetrySlamServiceERPImplementation.js* in your project.

    2. Copy the following code snippet into the newly created file. As a reference you can have a look at the file [poetrySlamServiceERPImplementation.js](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamServiceERPImplementation.js) in the reference application.
        ```javascript
        'strict';

        // Add connector for project management systems
        const ConnectorB1 = require('./connector/connectorB1');

        module.exports = async (srv) => {
            // -------------------------------------------------------------------------------------------------
            // Implementation of remote OData services (back-channel integration with SAP Business One)
            // -------------------------------------------------------------------------------------------------

            // Delegate OData requests to SAP Business One remote purchase order entities
            srv.on('READ', 'B1PurchaseOrder', async (req) => {
                const connector = await ConnectorB1.createConnectorInstance(req);
                return await connector.delegateODataRequests(
                    req,
                    ConnectorB1.PURCHASE_ORDER_SERVICE
                );
            });
        }
        ```

        > Note: In this example, the projection of the remote purchase order in SAP Business One as modeled in the PoetrySlamService is only used for *READ* access. In case you want to support *UPDATE* as well, you would need to change ```srv.on('READ', ...)``` to ```srv.on(['READ', 'UPDATE'], ...)``` in the above snippet. The *CREATE* is implemented separately as described in the previous section.

    > Note: Without delegation, the remote entities return the error code 500 with the message: *SQLITE_ERROR: no such table* (local testing).

2. Enhance the [*/srv/poetryslam/poetrySlamServiceImplementation.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamServiceImplementation.js) to call the ERP implementation.

    1. Import the ERP forward handler.

    ```javascript
    const erpForwardHandler = require('./poetrySlamServiceERPImplementation');
    ```

    2. Call the ERP forward handler.

    ```javascript
    await erpForwardHandler(srv); // Forward handler to the ERP systems
    ```

3. In the file [*/srv/poetryslam/poetrySlamServicePoetrySlamsImplementation.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamServicePoetrySlamsImplementation.js), the poetry slams entity is enriched with SAP Business One-specific data. 
    
    1. Determine the connected back-end systems and read the purchase order data from the remote system. Set the virtual element `createB1PurchaseOrderEnabled` to control the visualization of the action to create purchase orders dynamically and pass on the purchase order system name.

        ```javascript
        // Expand poetry slams
        srv.on('READ', ['PoetrySlams.drafts', 'PoetrySlams'], async (req, next) => {
            // Read the PoetrySlams instances
            let poetrySlams = await next();

            // In case none of these enriched fields are requested, we do not need to read from the external services
            // So we first check if the requested columns contain any of the enriched columns and return if not
            const requestedColumns = req.query.SELECT.columns?.map((item) =>
                Array.isArray(item.ref) ? item.ref[0] : item.as
            );

            const enrichedFields = [
                'purchaseOrderSystemName',
                'createB1PurchaseOrderEnabled',
                'isB1',
                'toB1PurchaseOrder'
            ];

            if (
                requestedColumns &&
                !enrichedFields.some((item) => requestedColumns?.includes(item))
            ) {
                return poetrySlams;
            }

            // The requested columns include some of the enriched fields, so we do add the corresponding data

            // SAP Business One
            // Check and read SAP Business One purchase order data
            const connectorB1 = await ConnectorB1.createConnectorInstance(req);
            if (connectorB1?.isConnected()) {
                poetrySlams = await connectorB1.readPurchaseOrder(poetrySlams);
            }

            for (const poetrySlam of convertToArray(poetrySlams)) {
                [
                    'purchaseOrderSystemName'
                ].forEach((item) => {
                    poetrySlam[item] = poetrySlam[item] || '';
                });

                // Update PO system name and visibility of the "Create Purchase Order"-button
                if (poetrySlam.purchaseOrderID) {
                    poetrySlam.createB1PurchaseOrderEnabled = false;
                    poetrySlam.purchaseOrderSystemName = connectorB1.getSystemName();
                } else {
                    poetrySlam.createB1PurchaseOrderEnabled = connectorB1.isConnected();
                }

                // Update the backend system connected indicator used in the UI for controlling the visibility of UI elements
                poetrySlam.isB1 = connectorB1.isConnected();
            }

            // Return remote data
            return poetrySlams;
        });
        ```

        > Note: The connector creates destinations called *b1* and *b1-url*, which connect to the ERP system. You create the destinations later on in the consumer subaccount in SAP BTP.

    2. Add the implementation of the action *createB1PurchaseOrder*:

        1. Copy the method *createB1PurchaseOrder* into the implementation.

            ```javascript
            //---------------------------------------------------------------------------
            // Implementation of entity events (entity PoetrySlams)
            // with impact on remote services of SAP Business One
            //---------------------------------------------------------------------------

            // Entity action: Create SAP Business One Purchase Order
            srv.on('createB1PurchaseOrder', async (req) => {
                await createPurchaseOrder(
                    req,
                    srv,
                    ConnectorB1,
                    'ACTION_CREATE_PURCHASE_ORDER_NO_B1_SYSTEM'
                );
            });
            ```

        2. Add the import of the connector at the beginning of the file:

            ```javascript
            const ConnectorB1 = require('./connector/connectorB1');
            ```

        3. Import the `createPurchaseOrder` function from the `entityCalculations`.

            ```javascript
            const {
                calculatePoetrySlamData,
                updatePoetrySlam,
                convertToArray,
                createPurchaseOrder
            } = require('./util/entityCalculations');
            ```

        4. Copy the implementation of the action `clearPurchaseOrderData` to clear all project data:
        ```javascript
        srv.on('clearPurchaseOrderData', async (req) => {
            ...
        });
        ```

4. Copy the function `createPurchaseOrder` from the file [*/srv/poetryslam/util/entityCalculations.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/util/entityCalculations.js) into the implementation and export the function at the end of the file.

5. Add the system messages to the file [*/srv/i18n/messages.properties*](../../../tree/main-multi-tenant-features/srv/i18n/messages.properties).    

    > In the reference example, the [*/srv/i18n/messages_de.properties*](../../../tree/main-multi-tenant-features/srv/i18n/messages_de.properties) file with the German texts is available too. You can take them over accordingly.

    ```javascript
    ACTION_CREATE_PURCHASE_ORDER_DRAFT                      = Purchase orders cannot be created for draft Poetry Slams.
    ACTION_CREATE_PURCHASE_ORDER_NO_B1_SYSTEM               = No SAP Business One system connected. Purchase order cannot be created.
    ACTION_CREATE_PURCHASE_ORDER_FAILED                     = Purchase order creation failed. Poetry Slam {0} was not updated.
    ACTION_READ_PURCHASE_ORDER_CONNECTION                   = Purchase order cannot be retrieved.
    ACTION_ERP_REMOVED                                      = The ERP information was removed from poetry slam {0}.
    ```

### Enhance the Web App to Display SAP Business One Data 

1. Adopt the SAP Fiori elements annotations of the web app in the file [*/app/poetryslams/annotations.cds*](../../../tree/main-multi-tenant-features/app/poetryslams/annotations.cds).

    1. Add purchase order annotations to the PoetrySlams entity:
           
        ```javascript
        purchaseOrderObjectID        @UI.Hidden;
        createB1PurchaseOrderEnabled @UI.Hidden;
        isB1                         @UI.Hidden;
        ```
            
    2. Add a facet *Purchase Order Data* to display information from the remote service by following the *toB1PurchaseOrder* association:

        1. Add facet:
            ```javascript
            {
                $Type        : 'UI.ReferenceFacet',
                Label        : '{i18n>purchaseOrderData}',
                ID           : 'PurchaseOrderData',
                Target       : '@UI.FieldGroup#PurchaseOrderData',
                ![@UI.Hidden]: {$edmJson: {$Not: {$Path: 'isB1'}}} // Display PurchaseOrderData only in case a SAP Business One system is connected
            }
            ```
        2. Add a field group *#PurchaseOrderData*:         
            ```javascript
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
            ]}
            ```

    3. Extend the list page with a link to the purchase order:
        ```javascript
        // Definition of fields shown on the list page / table
        LineItem                      : [
            ...,
            {
                $Type: 'UI.DataFieldWithUrl',
                Value: purchaseOrderID,
                Url  : purchaseOrderURL
            }
        ]
        ```

    4. Add two buttons to the identification area:
        ```javascript
        // Create a purchase order in the connected SAP Business One system
        {
            $Type        : 'UI.DataFieldForAction',
            Label        : '{i18n>createB1PurchaseOrder}',
            Action       : 'PoetrySlamService.createB1PurchaseOrder',
            ![@UI.Hidden]: {$edmJson: {$Not: {$And: [
                {$Path: 'createB1PurchaseOrderEnabled'},
                {$Path: 'IsActiveEntity'}
            ]}}}
        },
        // Clear the purchase order data
        {
            $Type        : 'UI.DataFieldForAction',
            Label        : '{i18n>removePurchaseOrderData}',
            Action       : 'PoetrySlamService.clearPurchaseOrderData',
            ![@UI.Hidden]: {$edmJson: {$Or: [
            {$Eq: [
                {$Path: 'purchaseOrderID'},
                {$Null: null}
            ]},
            {$Not: {$Path: 'IsActiveEntity'}}
            ]}}
        }
        ```
        > Note: The visibility of the *Create Purchase Order in SAP Business One* button is dynamically controlled based on the value of the transient field *createB1PurchaseOrderEnabled*, which is calculated in the after read-event of the entity *PoetrySlam*.     

2. In the *srv* folder, edit language-dependent labels in the file [*i18n.properties*](../../../tree/main-multi-tenant-features/srv/i18n/i18n.properties). Add labels for purchase order fields and the button to create purchase orders:
    ```
    # -------------------------------------------------------------------------------------
    # Transient Service Elements

    purchaseOrderSystemName = System Name

    # -------------------------------------------------------------------------------------
    # Service Actions

    createB1PurchaseOrder   = Create Purchase Order in SAP Business One
    removePurchaseOrderData = Clear Purchase Order Data
    ```        

    > In the reference example, the [*/srv/i18n/i18n_de.properties*](../../../tree/main-multi-tenant-features/srv/i18n/i18n_de.properties) file with the German texts is available too. You can take them over accordingly.

3. Edit the language-dependent labels of the poetryslams app in the file [*app/poetryslams/i18n.properties*](../../../tree/main-multi-tenant-features/app/poetryslams/i18n/i18n.properties). Add a label for the facet and the added fields:

    ```
    purchaseOrderData       = Purchase Order Data

    deliveryDate            = Delivery Date
    creationDate            = Creation Date
    purchaseOrderValue      = Value
    purchaseOrderCurrency   = Currency
    ```

    > In the reference example, the [*app/poetryslams/i18n/i18n_de.properties*](../../../tree/main-multi-tenant-features/app/poetryslams/i18n/i18n_de.properties) file with the German texts is available too. You can take them over accordingly.

### Enhance the Configuration of the SAP Cloud Application Programming Model Project

Enhance the file [*package.json*](../../../tree/main-multi-tenant-features/package.json) with development configurations for local testing and productive configurations. Ensure that the flag *csrf* and *csrfInBatch* is set in the file *package.json* to enable the management of cross-site request forgery tokens (required for POST requests at runtime) using destinations of the type:

```json
"b1_sbs_v2": {
    "kind": "odata",
    "model": "srv/external/b1_sbs_v2",
    "csrf": true,
    "csrfInBatch": true,
    "[development]": {
        "credentials": {
            "url": "https://{{b1-hostname}}/b1s/v2",
            "authentication": "BasicAuthentication",
            "username": "{{test-user}}",
            "password": "{{test-password}}"
        }
    },
    "[production]": {
        "credentials": {
            "destination": "b1",
            "path": "/b1s/v2"
        }
    }
}
```
> Note: The *package.json* refers to the destinations *b1* that needs to be created in the consumer SAP BTP subaccount. The destination *b1* refers to business users with principal propagation.

> Note: For local testing, replace `{{b1-hostname}}`, `{{test-user}}`, and `{{test-password}}` with a system, user, and password from SAP Business One. The test-user is an object with company and username, for example, User name = {"UserName": "{{user}}", "CompanyDB": "{{company}}"}. Don't push this information to your GitHub repository.

### Test Locally

1. Open a terminal and start the app with the development profile using the run command `cds watch --profile development`. 

2. Use the test users as listed in the file [*.cdsrc.json*](../../../tree/main-multi-tenant-features/.cdsrc.json).
   > Note: If you would like to test with different users, clear the browser cache first.

3. Test the critical connection points to SAP Business One: 

    1. Test the *Service Endpoint* for *B1PurchaseOrder*: The system returns the respective data of SAP Business One (without filtering).

    2. The *Create Purchase Order in SAP Business One* button is dependent on the setup of the destinations. Once the destinations are correctly configured and the application is deployed to SAP BTP Cloud Foundry runtime, the *Create Purchase Order in SAP Business One* button will be active.
    To test this button locally, in _connectorB1.js_, method _createConnectorInstance_, change the value of **connector.isConnectedIndicator** to **true** after the connector instance is created:

        ```javascript
        const connector = new ConnectorB1(data);
        connector.isConnectedIndicator = true;
        ```
        > Note: This change is required as the *isConnectedIndicator* value is dependent on the setup of destinations. Destinations only work on a deployed application and cannot be tested locally.

4. Open the */poetryslams/webapp/index.html* web application and open one of the poetry slams. 

5. Choose *Create Purchase Order in SAP Business One*. The system creates a purchase order in SAP Business One and displays the details in the *Purchase Order Data* section.
   > Note: The link to the purchase order won't work in a local application. To test the full integration including navigation to the SAP Business One system, you will have to test with the deployed application.

## Deploy the Application

Update your application in the provider subaccount. For detailed instructions, refer to the section [Deploy the Multi-Tenant Application to a Provider Subaccount](24-Multi-Tenancy-Deployment.md#build-and-deploy-to-cloud-foundry).

> Note: Make sure any local changes have been reverted before deployment.

You have now successfully deployed the application to the provider subaccount and you're ready to [provision tenants of the multi-tenant application to customers and connect with SAP Business One](./33b-Multi-Tenancy-Provisioning-Connect-B1.md).
