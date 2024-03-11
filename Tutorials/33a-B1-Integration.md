# Integrate the SAP BTP Application with SAP Business One

In this section, you enhance Poetry Slam Manager, your SAP BTP application, to make sure that it supports SAP Business One as back end. 

Front-end integration:
1. Navigate from Poetry Slam Manager to related SAP Business One purchase orders.

Back-channel integration:

2. Create SAP Business One purchase orders from Poetry Slam Manager and display purchase order information on the object page of a poetry slam using OData APIs with principal propagation.

## Consume SAP Business One OData APIs

In this section, you learn how to import the SAP Business One OData service as a "remote service" into your SAP Cloud Application Programming Model (CAP) project and how to use the OData service to create SAP Business One purchase orders to allow the procurement of anything required for the organization or staging of your poetry slams.

### Import SAP Business One OData Service

The SAP Business One OData service is consumed by using a destination. SAP Cloud Application Programming Model uses a one-to-one binding of remote services and destinations. To propagate the logged-in business user to SAP Business One, an OAuth 2.0 SAML Bearer authentication is used. This way, the SAP Business One OData service for purchase orders considers the user authorizations.

1. Run the $metadata URL of the SAP Business One OData service in a browser window: _https://\<service-layer server\>/b1s/v2/$metadata_

2. Save the service response payload with the metadata with file extension *.edmx*:
    - File *b1_sbs_v2.edmx* for user propagation

    > Note: Ensure a unique file name without special characters except "_".
    
    > Note: The response contains many entities, which you don't require for this integration scenario. It's sufficient to use a self-contained excerpt of the complete $metadata file. For the example described here, you can use the file [b1_sbs_v2.edmx](../../../tree/main-multi-tenant//external_resources/b1_sbs_v2.edmx).

3. In SAP Business Application Studio, to import the SAP Business One OData service into the SAP Cloud Application Programming Model (CAP) project, create a folder with the name `external_resources` in the root folder of the application.

4. Open the context menu of the *./external_resources* folder and upload the *.edmx* file with the OData service.

5. Open a terminal and ensure that you're in the root folder of the application. Import the *.edmx* file using the command `cds import ./external_resources/b1_sbs_v2.edmx --as cds`.

    > Note: Don't use the CDS import command parameter `--keep-namespace` because it would result in the CDS service name *cust*, which would lead to service name clashes if you import multiple SAP Business One custom OData services.

    After running the command `cds import ...`, the file *app/poetryslammanager/package.json* is updated with a CDS configuration referring to the remote OData services, and a folder with path *./srv/external* has been created. The folder contains the configuration files for the remote services.
    
    > Note: Typically, remote services don't require any persistency. Make sure the entities in the corresponding CDS files in the folder *./srv/external* are annotated with `@cds.persistence.skip : true`. You may encounter errors during the deployment with the db-deployer service if the persistency-skip-annotation is missing.

### Enhance the Entity Model to Store Key Purchase Order Information

In SAP Business Application Studio, enhance the SAP Cloud Application Programming Model entity models in the file [*/db/poetrySlamManagerModel.cds*](../../../tree/main-multi-tenant/db/poetrySlamManagerModel.cds) by elements to store purchase order key information, which makes it possible to associate poetry slams to purchase orders in the remote ERP systems.

1. Enhance the entity *PoetrySlams* by the following elements:
    ```javascript
    purchaseOrderID       : String;
    purchaseOrderObjectID : String;
    purchaseOrderURL      : String;
    purchaseOrderSystem   : String;
    ```  

2. Enhance the annotations of entity *PoetrySlams* by the following elements:
    ```javascript
    purchaseOrderID       @title: '{i18n>purchaseOrderID}';
    purchaseOrderObjectID @title: '{i18n>purchaseOrderObjectID}' @readonly;
    purchaseOrderURL      @title: '{i18n>purchaseOrderURL}'      @readonly;
    purchaseOrderSystem   @title: '{i18n>purchaseOrderSystem}'   @readonly;
    ```

3. Enhance the labels of the entity *PoetrySlams* in the file [*/db/i18n/i18n.properties*](../../../tree/main-multi-tenant/db/i18n/i18n.properties) by the labels:
    ```javascript
    purchaseOrderID       = Purchase Order
    purchaseOrderObjectID = Purchase Order Internal ID
    purchaseOrderURL      = Purchase Order URL
    purchaseOrderSystem   = Purchase Order System Type
    ```
     > In the reference example, the [*/db/i18n/i18n_de.properties*](../../../tree/main-multi-tenant/db/i18n/i18n_de.properties) file with the German texts are available, too. You can take them over accordingly.
  

### Enhance the Service Model by the Remote Service

1. To extend the SAP Cloud Application Programming Model service model by remote entities, open the file [*/srv/poetrySlamManagerService.cds*](../../../tree/main-multi-tenant/srv/poetrySlamManagerService.cds) with the service models.

2. Expose SAP Business One purchase order data throughout the SAP Cloud Application Programming Model service model for principal propagation:
    ```javascript
    // -------------------------------------------------------------------------------
    // Extend service PoetrySlamManager by SAP Business One Purchase Orders

    using {b1_sbs_v2 as RemoteB1} from './external/b1_sbs_v2';

    extend service PoetrySlamManager with {
        entity B1PurchaseOrder                as
            projection on RemoteB1.PurchaseOrders {
                key DocEntry     as DocEntry,
                    DocNum       as DocNum,
                    DocType      as DocType,
                    DocDate      as DocDate,
                    DocDueDate   as DocDueDate,
                    CreationDate as CreationDate,
                    CardCode     as CardCode,
                    CardName     as CardName,
                    DocTotal     as DocTotal,
                    DocCurrency  as DocCurrency
            }
    }
    ```
    
2. Enhance the service model of the service *PoetrySlamManager* by an association to the remote purchase order in SAP Business One:
    ```javascript
    // Poetry Slams (draft enabled)
    @odata.draft.enabled
    entity PoetrySlams as select from poetrySlamManagerModel.PoetrySlams
        mixin {
            // SAP Business One purchase orders: Mix-in of SAP Business One Purchase Order Data
            toB1PurchaseOrder : Association to RemoteB1.PurchaseOrders
                                    on toB1PurchaseOrder.DocNum = $projection.purchaseOrderID;
        } 
    ```

3. Enhance the service model of the service *PoetrySlamManager* by virtual elements to pass on the name of the ERP system from the destination to the UI, and the visualization of actions:
    ```javascript
    // Poetry Slams (draft enabled)
    @odata.draft.enabled
    entity PoetrySlams                    as
        select from poetrySlamManagerModel.PoetrySlams
        mixin {
            // SAP Business One purchase orders: Mix-in of SAP Business One Purchase Order Data
            toB1PurchaseOrder : Association to RemoteB1.PurchaseOrders
                                    on toB1PurchaseOrder.DocNum = $projection.purchaseOrderID;
        }
        into {
            // Selects all fields of the PoetrySlams domain model,
            *,
            maxVisitorsNumber - freeVisitorSeats as bookedSeats                  : Integer @title     : '{i18n>bookedSeats}',
            // Relevant for coloring of status in UI to show criticality
            virtual null                         as statusCriticality            : Integer @title     : '{i18n>statusCriticality}',
            // SAP Business One purchase order: visibility of button "Create Purchase Order in SAP Business One"
            virtual null                         as createB1PurchaseOrderEnabled : Boolean @odata.Type: 'Edm.Boolean',
            virtual null                         as purchaseOrderSystemName      : String  @title     : '{i18n>purchaseOrderSystemName}'  @odata.Type: 'Edm.String',
            virtual null                         as isB1                         : Boolean @odata.Type: 'Edm.Boolean',
            toB1PurchaseOrder
        }
    ```
    
4. Enhance the service model of the service *PoetrySlamManager* by an action to create remote purchase orders:
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

### Enhance the Authentication Model to Cover Remote Purchase Orders

1. To extend the authorization annotation of the SAP Cloud Application Programming Model service model by restrictions referring to the remote services, open the file [*/srv/poetrySlamManagerServiceAuthorizations.cds*](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceAuthorizations.cds) with the authorization annotations.

2. Enhance the authorization model for the service entity *B1PurchaseOrder*.

    ```javascript
    // SAP Business One purchase orders: Managers can read and create remote purchase orders
    annotate PoetrySlamManager.B1PurchaseOrder with @(restrict: [{
        grant: ['*'],
        to   : 'PoetrySlamFull',
    }]);
    ```

### Create a File with Reuse Functions for SAP Business One

Some reuse functions specific to SAP Business One are defined in a separate file. 
1. Create a file with the path */srv/connector-b1.js*.
2. Copy the SAP Business One reuse functions in the file [*/srv/connector-byd.js*](../../../tree/main-multi-tenant/srv/connector-b1.js) into your project. The file contains functions to delegate OData requests to SAP Business One, to read SAP Business One purchase order data, and to assemble an OData payload to create SAP Business One purchase orders.

### Enhance the Business Logic to Operate on SAP Business One Data

Enhance the implementation of the SAP Cloud Application Programming Model services in the file [*/srv/poetrySlamManagerServiceImplementation.js*](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceImplementation.js) to create and read SAP Business One purchase order data using the remote SAP Business One OData service. 

1. Delegate requests to the remote OData service. Therefore, copy the on-READ, on-CREATE, on-UPDATE, and on-DELETE methods of *B1PurchaseOrder* from the [service implementations (refer to the end of the file)](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceImplementation.js).

    > Note: Without delegation, the remote entities return the error code 500 with the message: *SQLITE_ERROR: no such table* (local testing).

2. Determine the connected back-end systems.
    ```javascript
    // Check connected back-end systems
    srv.before('READ', ['PoetrySlams.drafts', 'PoetrySlams'], async (req) => {
        // SAP Business One
        B1IsConnectedIndicator = await destinationUtil.checkDestination(
            req,
            connectorB1.B1_DESTINATION
        );
        if (B1IsConnectedIndicator) {
            B1SystemName = await destinationUtil.getDestinationDescription(
            req,
            connectorB1.B1_DESTINATION_URL
            );
        }
    });
    ```

    > Note: The destinations called *b1* and *b1-url* connect to the ERP system. You create the destinations later on in the consumer subaccount in SAP BTP.

3. Set the virtual element `createB1PurchaseOrderEnabled` to control the visualization of the action to create purchase orders dynamically in the for loop of the after-read event of poetry slams and pass on the purchase order system name:

    ```javascript
    // Update PO system name and visibility of the "Create Purchase Order" button
    if (poetrySlam.purchaseOrderID) {
        poetrySlam.createB1PurchaseOrderEnabled = false;
        poetrySlam.purchaseOrderSystemName = B1SystemName;
    } else {
        poetrySlam.createB1PurchaseOrderEnabled = B1IsConnectedIndicator;
    }

    // Update the back-end system connected indicator used in UI for controlling visibility of UI elements
    poetrySlam.isB1 = B1IsConnectedIndicator;
    ```

4. Add the implementation of the action *createB1PurchaseOrder*:

    1. Copy the method *createB1PurchaseOrder* from the file [*/srv/poetrySlamManagerServiceImplementation.js*](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceImplementation.js) into the implementation.

    2. Add two lines to import the destination functions at the beginning of the file:
    ```javascript
    const destinationUtil = require('./util/destination');
    const connectorB1 = require('./connector-b1');
    ```

    3. Add two local variables to buffer the status and the name of the remote systems at the beginning of the file:

    ```javascript
    // Buffer status and name of purchase order systems
    let B1IsConnectedIndicator, B1SystemName;
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
    ACTION_CREATE_PURCHASE_ORDER_DRAFT = Purchase orders cannot be created for draft Poetry Slams.
    ```

8. Expand poetry slams to remote purchase orders in [*/srv/poetrySlamManagerServiceImplementation.js*](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceImplementation.js) by filling OData parameter `/PoetrySlams?$expand=toB1PurchaseOrder` in the on-read of the `PoetrySlams` entity:
    ```javascript
    // Expand poetry slams
    srv.on('READ', ['PoetrySlams.drafts', 'PoetrySlams'], async (req, next) => {
        // Read the PoetrySlams instances
        let poetrySlams = await next();

        // Check and read SAP Business One purchase order data
        if (B1IsConnectedIndicator) {
            poetrySlams = await connectorB1.readPurchaseOrder(poetrySlams);
        }

        // Return remote data
        return poetrySlams;
    });
    ```
    > Note: OData features such as *$expand*, *$filter*, *$orderby*, and so on need to be implemented in the service implementation.

9. Extend the on-update event of the `PoetrySlams` entity with an implementation to clear all purchase order data if the `purchaseOrderID` is deleted:
    ```javascript
    srv.on('UPDATE', ['PoetrySlams.drafts', 'PoetrySlams'], async (req, next) => {
        ...

        // Remove all purchase order data if the purchase order id is cleared
        if (req.data.purchaseOrderID === '') {
            req.data.purchaseOrderID = null;
            req.data.purchaseOrderObjectID = null;
            req.data.purchaseOrderURL = null;
            req.data.purchaseOrderSystem = null;
            req.data.purchaseOrderSystemName = null;
        }

        ...
    });
    ```

### Enhance the Web App to Display SAP Business One Data 

1. To edit the SAP Fiori elements annotations of the web app in the file [*/app/poetryslammanager/annotations.cds*](../../../tree/main-multi-tenant/app/poetryslammanager/annotations.cds), add purchase order elements to different areas of the Poetry Slam Manager floorplan. Afterward, here's what it looks like:
    
    - Annotation of PoetrySlams:
        ```javascript
        purchaseOrderObjectID        @UI.Hidden;
        createB1PurchaseOrderEnabled @UI.Hidden;
        isB1                         @UI.Hidden;
        ```
        
2. Add a facet *Purchase Order Data* to display information from the remote service by following the *toB1PurchaseOrder* association:
    - Add facet:
        ```javascript
        {
            $Type        : 'UI.ReferenceFacet',
            Label        : '{i18n>purchaseOrderData}',
            ID           : 'PurchaseOrderData',
            Target       : '@UI.FieldGroup#PurchaseOrderData',
            ![@UI.Hidden]: {$edmJson: {$Not: {$Path: 'isB1'}}} // Display PurchaseOrderData only in case a SAP Business One system is connected
        }
        ```
    - Add a field group *#PurchaseOrderData*:         
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
                Value                  : toB1PurchaseOrder.DocDueDate,
                ![@Common.FieldControl]: #ReadOnly
            },
            {
                $Type                  : 'UI.DataField',
                Label                  : '{i18n>creationDate}',
                Value                  : toB1PurchaseOrder.CreationDate,
                ![@Common.FieldControl]: #ReadOnly
            },
            {
                $Type                  : 'UI.DataField',
                Label                  : '{i18n>purchaseOrderValue}',
                Value                  : toB1PurchaseOrder.DocTotal,
                ![@Common.FieldControl]: #ReadOnly
            },
            {
                $Type                  : 'UI.DataField',
                Label                  : '{i18n>purchaseOrderCurrency}',
                Value                  : toB1PurchaseOrder.DocCurrency,
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

4. Add a button to the identification area:
    ```javascript
    // Create a purchase order in the connected SAP Business One system
    {
        $Type        : 'UI.DataFieldForAction',
        Label        : '{i18n>createB1PurchaseOrder}',
        Action       : 'PoetrySlamManager.createB1PurchaseOrder',
        ![@UI.Hidden]: {$edmJson: {$Not: {$And: [
            {$Path: 'createB1PurchaseOrderEnabled'},
            {$Path: 'IsActiveEntity'}
        ]}}}
    }
    ```
    > Note: The visibility of the *Create Purchase Order in SAP Business One* button is dynamically controlled based on the value of the transient field *createB1PurchaseOrderEnabled*, which is calculated in the after read-event of the entity *PoetrySlam*.     

4. In the *srv* folder, edit language-dependent labels in the file [*i18n.properties*](../../../tree/main-multi-tenant/srv/i18n/i18n.properties). Add labels for purchase order fields and the button to create purchase orders:
    ```
    # -------------------------------------------------------------------------------------
    # Transient Service Elements

    purchaseOrderSystemName = Purchase Order System

    # -------------------------------------------------------------------------------------
    # Service Actions

    createB1PurchaseOrder   = Create Purchase Order in SAP Business One
    ```        

5. In the web app folder, edit language-dependent labels in the file [*app/poetryslammanager/i18n/i18n.properties*](../../../tree/main-multi-tenant/app/poetryslammanager/i18n/i18n.properties). Add a label for facet *PurchaseOrderData*:

    ```
    purchaseOrderData       = Purchase Order Data
    ```

### Enhance the Configuration of the SAP Cloud Application Programming Model Project

Enhance the file [*package.json*](../../../tree/main-multi-tenant/package.json) by development configurations for local testing and productive configurations:
```json
"b1_sbs_v2": {
    "kind": "odata",
    "model": "srv/external/b1_sbs_v2",
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
> Note: The *package.json* refers to the destinations *b1* that need to be created in the consumer SAP BTP subaccount. The destination *b1* refers to business users with principal propagation.

Ensure that the CDS feature *fetch_csrf* is set in the file *package.json* to enable the management of cross-site request forgery tokens (required for POST requests at runtime using destinations of the type *BasicAuthentication*):
```json
"cds": {
    "features": {
        "fetch_csrf": true
    },
}      
```
> Note: By default, SAP Cloud Application Programming Model does not handle CSRF tokens for POST requests. Remote services may fail if CSRF tokens are required.

> Note: For local testing, replace `{{b1-hostname}}`, `{{test-user}}`, and `{{test-password}}` with a system, user, and password from SAP Business One. Don't push this information to your GitHub repository.

### Test Locally

1. Open a terminal and start the app with the development profile using the run command `cds watch --profile development`. 

2. Use the test users as listed in the file [*.cdsrc.json*](../../../tree/main-multi-tenant/.cdsrc.json).
   > Note: If you would like to test with different users, clear the browser cache first.

3. Test the critical connection points to SAP Business One: 

    1. Test the *Service Endpoint* for *B1PurchaseOrder*: The system returns the respective data of SAP Business One (without filtering).

    2. The *Create Purchase Order in SAP Business One* button is dependent on the setup of the destinations. Once the destinations are correctly configured and the application is deployed to SAP BTP Cloud Foundry runtime, the *Create Purchase Order in SAP Business One* button will be active.
    To test this button locally, in _poetrySlamManagerServiceImplementation.js_, change the value of **B1IsConnectedIndicator** to **true**:

        ```javascript
        B1IsConnectedIndicator = await destinationUtil.checkDestination(
            req,
            'b1'
        );
        ```
        > Note: This change is required as the *B1IsConnectedIndicator* value is dependent on the setup of destinations. Destinations only work on a deployed application and cannot be tested locally.

4. Open the */poetryslammanager/webapp/index.html* web application and open one of the poetry slams. 

5. Choose *Create Purchase Order in SAP Business One*. The system creates a purchase order in SAP Business One and displays the details in the *Purchase Order Data* section.
   > Note: The link to the purchase order won't work in a local application. To test the full integration including navigation to the SAP Business One system, you will have to test with the deployed application.

### Deploy the Application

Update your application in the provider subaccount. For detailed instructions, refer to the section [Deploy the Multi-Tenant Application to a Provider Subaccount](22-Multi-Tenancy-Deployment.md#build-and-deploy-the-multi-tenant-application).

> Note: Make sure any local changes have been reverted before deployment.
