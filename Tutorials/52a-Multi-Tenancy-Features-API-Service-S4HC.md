# Enhance the SAP BTP Application to Look Up the Latest Sales Order Information

Imagine enhancing your Poetry Slam Manager application with information from an external system. For instance, you might reference a sales order from SAP S/4HANA Cloud Public Edition that includes the sponsoring of a poetry slam event. 

This section describes how the Poetry Slam Manager application is enhanced to support the "Sponsoring of a Poetry Slam Event" integration scenario with SAP S/4HANA Cloud Public Edition.

As a result, the **Poetry Slam Manager API** service is called, and the *PoetrySlams* entity is updated with the sales order information. In the Poetry Slam Manager application, the poetry slam displays the **Sales Order ID** and **Customer Name** in a new UI section called **Sponsoring Data**. The **Customer Name** is directly read from the SAP S/4HANA Cloud Public Edition application.

This process requires enabling and provisioning the service broker. The tutorials [Enable API Access to SAP BTP Applications Using Service Broker](./42a-Multi-Tenancy-Service-Broker.md), [Configure and Consume the APIs of the SAP BTP Application](./42b-Multi-Tenancy-Provisioning-Service-Broker.md), and [Create an API Service for Remote Integrations without Draft Handling](./42c-Multi-Tenancy-Features-API-Service.md) describe these steps. Follow all enablement steps described there first. 

## Bill of Materials

No additional entitlements or modules are required beyond the [multitenancy version](./20-Multi-Tenancy-BillOfMaterials.md) and the [service broker](./42a-Multi-Tenancy-Service-Broker.md#bill-of-materials) enablement.

## Guide on How to Enhance the Application Step by Step

To explore this feature with the Poetry Slam Manager, you have two options: 

1. Clone the repository of the Partner Reference Application. Check out the [*main-multi-tenant*](../../../tree/main-multi-tenant) branch and enhance the application step by step. 

2. Alternatively, check out the [*main-multi-tenant-features*](../../../tree/main-multi-tenant-features) branch where the feature is already included. 

The following describes how to enhance the **main-multi-tenant** branch (option 1).

### Application Enablement 

In this tutorial, the application is enhanced in steps to support the described scenario: 

1. The SAP BTP application is enhanced to store and show the sales order information and to connect the **Sales Order (A2X)** and **Business Partner (A2X)** OData services of SAP S/4HANA Cloud Public Edition.
2. The SAP BTP consumer subaccount and the SAP S/4HANA Cloud Public Edition of the consumer are configured to support the sales order integration scenario.

### Import SAP S/4HANA Cloud Public Edition OData Services

You use the **Sales Order (A2X)** and **Business Partner (A2X)** OData services of SAP S/4HANA Cloud Public Edition to read sales orders and business partners in the context of user interactions. These OData services are available on SAP Business Accelerator Hub.

1. Download the metadata files (*.edmx* files) from the *API Specification* section:
    - [*Sales Order (A2X)*](https://api.sap.com/api/CE_SALESORDER_0001/overview) (OData v4)
    - [*Business Partner (A2X)*](https://api.sap.com/api/API_BUSINESS_PARTNER/overview) (OData v2)

2. Rename the metadata files (*.edmx* files) and add the prefix `S4HC_` to avoid naming conflicts:
    -  `S4HC_CE_SALESORDER_0001.edmx`
    -  `S4HC_API_BUSINESS_PARTNER.edmx`

3. To import the SAP S/4HANA Cloud Public Edition OData service into the SAP CAP project in SAP Business Application Studio, create a folder named `external_resources` in the root folder of the application.

4. Open the context menu of the *external_resources* folder and upload the *.edmx* file with the OData services as remote services.

5. Open a terminal. Navigate to the root folder of the application and import the remote services using these commands:  

    1. `cds import ./external_resources/S4HC_CE_SALESORDER_0001.edmx --as cds` 
    2. `cds import ./external_resources/S4HC_API_BUSINESS_PARTNER.edmx --as cds` 

    As a result, the system creates CDS files in the **./srv/external** folder for all remote services and enhances the [*package.json*](../../../tree/main-multi-tenant-features/package.json) file with CDS configurations referring to the remote services. Additionally, this command also adds the following node modules to your project:

    - @sap-cloud-sdk/connectivity
    - @sap-cloud-sdk/http-client
    - @sap-cloud-sdk/resilience

    > Note: Avoid using the `--keep-namespace` parameter in the CDS import command. It can cause service name clashes when importing multiple SAP S/4HANA Cloud Public Edition OData services.

6. Enhance the [*package.json*](../../../tree/main-multi-tenant-features/package.json) file with development configurations for local testing and productive configurations. Ensure that the **csrf** and **csrfInBatch** flags are set in  **package.json** file. This enables the management of cross-site request forgery tokens, which are required for POST requests at runtime when using destinations.

    ```json
    "cds": {
      "S4HC_CE_SALESORDER_0001": {
        "kind": "odata",
        "model": "srv/external/S4HC_CE_SALESORDER_0001",
        "csrf": true,
        "csrfInBatch": true,
        "[development]": {
          "credentials": {
            "url": "https://{{S4HC-hostname}}/sap/opu/odata4/sap/api_salesorder/srvd_a2x/sap/salesorder/0001",
            "authentication": "BasicAuthentication",
            "username": "{{test-user}}",
            "password": "{{test-password}}"
          }
        },
        "[production]": {
          "credentials": {
            "destination": "s4hc",
            "path": "/sap/opu/odata4/sap/api_salesorder/srvd_a2x/sap/salesorder/0001"
          }
        }
      },
      "S4HC_API_BUSINESS_PARTNER": {
        "kind": "odata-v2",
        "model": "srv/external/S4HC_API_BUSINESS_PARTNER",
        "csrf": true,
        "csrfInBatch": true,
        "[development]": {
          "credentials": {
            "url": "https://{{S4HC-hostname}}/sap/opu/odata/sap/API_BUSINESS_PARTNER",
            "authentication": "BasicAuthentication",
            "username": "{{test-user}}",
            "password": "{{test-password}}"
          }
        },
        "[production]": {
          "credentials": {
            "destination": "s4hc",
            "path": "/sap/opu/odata/sap/API_BUSINESS_PARTNER"
          }
        }
      }
    }
    ```

    > Note: The **package.json** refers to the *s4hc* destination that must be created in the consumer SAP BTP subaccount. It is used for remote service calls with principal propagation. See the next section for more details.

    > Note: For local testing, replace `{{S4HC-hostname}}`, `{{test-user}}`, and `{{test-password}}` with a system, user, and password from SAP S/4HANA Cloud Public Edition. However, don't push this information to your GitHub repository. For more information, see [Test and Troubleshoot an ERP Integration](./32-Test-Trace-Debug-ERP.md).

### Enhance the Entity Model to Store Sales Order Information

In SAP Business Application Studio, enhance the SAP CAP entity models in [*/db/poetrySlamManagerModel.cds*](../../../tree/main-multi-tenant-features/db/poetrySlamManagerModel.cds) file with elements to store sales order information, which makes it possible to associate poetry slams with sales orders in the remote ERP system.

1. Extend the **PoetrySlams** entity:
    ```cds
    extend PoetrySlams with {
        salesOrderID          : String;
    };
    ```  

2. Enhance the annotations of the **PoetrySlams** entity with the following element:
    ```cds
    salesOrderID           @title: '{i18n>salesOrderID}';
    ```  

3. Enhance the labels of **PoetrySlams** entity in the [*/db/i18n/i18n.properties*](../../../tree/main-multi-tenant-features/db/i18n/i18n.properties) file with the following label: 
    ```
    salesOrderID            = Sales Order
    ```
     > In the reference example, the [*/db/i18n/i18n_de.properties*](../../../tree/main-multi-tenant-features/db/i18n/i18n_de.properties) file with the German texts is available, too. You can use these texts as needed.

### Enhance the API Service Model with the Sales Order Information
1. In SAP Business Application Studio, open the [*srv/api/poetrySlamManagerAPI.cds*](../../../tree/main-multi-tenant-features/srv/api/poetrySlamManagerAPI.cds) service models file to extend the SAP CAP API service model by the sales order information.

2. Extend the PoetrySlams entity with the *salesOrderID*.

    ```cds
    // Extend service entity with SalesOrderID for S/4HANA integration scenario
    extend PoetrySlams with columns {
        salesOrderID
    };
    ```

### Enhance the Service Model with the Remote Service

1. In SAP Business Application Studio, open the [*srv/poetryslam/poetrySlamService.cds*](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamService.cds) service models file to extend the SAP CAP service model by remote entities.

2. Add a projection of the SAP S/4HANA Cloud Public Edition sales order partner to the service model for consumption in the SAP Fiori elements UI:

    ```cds
    // -------------------------------------------------------------------------------
    // Extend service PoetrySlamService by SAP S/4HANA Cloud sales order (principal propagation)

    using {S4HC_CE_SALESORDER_0001 as RemoteS4HCSalesOrder} from '../external/S4HC_CE_SALESORDER_0001';

    extend service PoetrySlamService with {
        entity S4HCSalesOrderPartner as
            projection on RemoteS4HCSalesOrder.SalesOrderPartner {
            key SalesOrder as salesOrderUUID,
                Customer   as customer
            }
    };
    ```

3. Enhance the service model of the **PoetrySlamService** service with virtual elements and an association to the remote sales order and business partner in SAP S/4HANA Cloud Public Edition. The virtual elements are calculated in the implementation class of the service. The **customerFullName** is determined from the business partner (role customer) of the sales order. The **salesOrderURL** is a direct URL to the referenced sales order.

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
      // SAP S/4HANA Cloud projects: visibility of button "Create Project in SAP S/4HANA Cloud", code texts
      virtual null                         as customerFullName             : String  @title: '{i18n>customerFullName}'         @odata.Type: 'Edm.String',
      virtual null                         as salesOrderURL                : String  @title: '{i18n>salesOrderURL}'            @odata.Type: 'Edm.String',
      virtual null                         as isS4HC                       : Boolean @odata.Type: 'Edm.Boolean',

      // Projection of remote service data as required by the UI
      toS4HCSalesOrderPartner                                              : Association to PoetrySlamService.S4HCSalesOrderPartner
                                                                               on toS4HCSalesOrderPartner.salesOrderUUID = $self.salesOrderID
    }
    
    ```

##### Create Files with Reuse Functions for the ERP System Integration

You can define reuse functions that handle the connection for the different ERP systems in separate files. 

1. Create a file to check and get the destinations in the **/srv/lib/destination.js** path. 
2. Add the functions *readDestination*, *getDestinationURL*, and *getDestinationDescription* from the [*/srv/lib/destination.js*](../../../tree/main-multi-tenant-features/srv/lib/destination.js) file.

    > Note: The reuse functions *readDestination*, *getDestinationURL*, and *getDestinationDescription* read the destination from the SAP BTP consumer subaccount. This system behavior is achieved by passing the JSON Web Token of the logged-in user to the function to get the destination. The JSON Web Token contains the tenant information.

    > Note: The *getDestinationDescription* reuse function returns the destination description from the SAP BTP consumer subaccount.

3. Create a new folder named **connector** in the */srv/poetryslam* path.
4. Create a file with the path **/srv/poetryslam/connector/connector.js**. This file is reused for different ERP integrations.
5. Copy the ERP connection reuse functions in the [*/srv/poetryslam/connector/connector.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/connector/connector.js) file into your project. It delegates the OData requests and reads the destinations.

##### Create a File with Reuse Functions for SAP S/4HANA Cloud Public Edition

Reuse functions specific to SAP S/4HANA Cloud Public Edition are defined in a separate file. 

1. Create a file with the path **/srv/poetryslam/connector/connectorS4HC.js**. 
2. Copy the general and sales order related constants and functions of the [*connectorS4HC.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/connector/connectorS4HC.js) file into the newly created file. They are grouped with a specific comment. These functions help to read SAP S/4HANA Cloud Public Edition sales order and business partner data, and to determine the navigation URL to the Sales Order application in SAP S/4HANA Cloud Public Edition of the customer.

##### Enhance the Business Logic to Operate on SAP S/4HANA Cloud Public Edition Data

In SAP Business Application Studio, enhance the implementation of the SAP CAP services to create and read SAP S/4HANA Cloud Public Edition sales order data using the remote SAP S/4HANA Cloud Public Edition OData service.

1. Delegate requests to the remote OData service. 

    1. Create a new file named **srv/poetryslam/poetrySlamServiceERPImplementation.js** in your project. 

    2. Copy the following code snippet into the newly created file. As a reference, you can have a look at the [poetrySlamServiceERPImplementation.js](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamServiceERPImplementation.js) file in the reference application.

        ```javascript
        'strict';

        // Add connector for project management systems
        const ConnectorS4HC = require('./connector/connectorS4HC');

        module.exports = async (srv) => {
            // -------------------------------------------------------------------------------------------------
            // Implementation of remote OData services (back-channel integration with SAP S/4HANA Cloud)
            // -------------------------------------------------------------------------------------------------

            // Delegate OData requests to SAP S/4HANA Cloud remote sales order entities
            srv.on('READ', 'S4HCSalesOrderPartner', async (req) => {
                const connector = await ConnectorS4HC.createConnectorInstance(req);
                return await connector.delegateODataRequests(
                    req,
                    ConnectorS4HC.SALES_ORDER_SERVICE
                );
            });
        }
        ```

        > Note: Without delegation, the remote entities return the error code 500 with the message: *SQLITE_ERROR: no such table* (local testing).

2. Enhance the [*/srv/poetryslam/poetrySlamServiceImplementation.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamServiceImplementation.js) file to call the ERP implementation.

    1. Import the ERP forward handler after the **poetrySlamsHandler**.

        ```javascript
        const erpForwardHandler = require('./poetrySlamServiceERPImplementation');
        ```

    2. Call the ERP forward handler after the **poetrySlamsHandler**.

        ```javascript
        await erpForwardHandler(srv); // Forward handler to the ERP systems
        ```

3.  In the [*/srv/poetryslam/poetrySlamServicePoetrySlamsImplementation.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamServicePoetrySlamsImplementation.js) file, the poetry slams entity is enriched with SAP S/4HANA Cloud Public Edition specific data. The connected back-end system is determined and the sales order data is read from the remote system.

    1. Import the SAP S/4HANA Cloud Public Edition connector.

    ```javascript
    const ConnectorS4HC = require('./connector/connectorS4HC');
    ```

    2. Add the on-read event handler.

    ```javascript
    // Expand poetry slams
    srv.on('READ', ['PoetrySlams.drafts', 'PoetrySlams'], async (req, next) => {
        // Read the PoetrySlams instances
        let poetrySlams = await next();

        // In this method, the data from the database is enriched by external data and calculated fields.
        // In case none of these enriched fields are requested, it is not required to read data from the external services.
        // First, check if the requested columns contain any of the enriched columns and return if not
        const requestedColumns = req.query.SELECT.columns?.map((item) =>
            Array.isArray(item.ref) ? item.ref[0] : item.as
        );
        const enrichedFields = [
            'salesOrderURL',
            'isS4HC',
            'toS4HCSalesOrderPartner'
        ];

        if (
            requestedColumns &&
            !enrichedFields.some((item) => requestedColumns?.includes(item))
        ) {
            return poetrySlams;
        }

        // SAP S/4HANA Cloud
        // Check and read SAP S/4HANA Cloud sales order related data
        const connectorS4HC = await ConnectorS4HC.createConnectorInstance(req);
        if (connectorS4HC?.isConnected()) {
            poetrySlams = await connectorS4HC.readSalesOrder(poetrySlams);
        }

        for (const poetrySlam of convertToArray(poetrySlams)) {

            if (poetrySlam.salesOrderID) {
                poetrySlam.salesOrderURL = connectorS4HC.determineSalesOrderURL(
                    poetrySlam.salesOrderID
                );
            }

            // Update the back-end system connected indicator used in UI for controlling visibility of UI elements
            poetrySlam.isS4HC = connectorS4HC.isConnected();
        }

        // Return remote data
        return poetrySlams;
    });
    ```

    > Note: The destinations called *s4hc* and *s4hc-url* connect to the ERP system. You create the destinations later on in the SAP BTP consumer subaccount.

4. In the *srv* folder, edit language-dependent labels in the [*/srv/i18n/i18n.properties*](../../../tree/main-multi-tenant-features/srv/i18n/i18n.properties) file. Add labels for sales order fields:
    ```
    # -------------------------------------------------------------------------------------
    # Remote Sales Order Elements
    customerFullName        = Sponsoring Businesss Partner Name 
    salesOrderURL           = Sales Order URL
    ```        

    > In the reference example, the [*/srv/i18n/i18n_de.properties*](../../../tree/main-multi-tenant-features/srv/i18n/i18n_de.properties) file with the German texts is available, too. You can use these texts as needed.

### Enhance the Authentication Model to Cover Remote Sales Order Partners

1. In SAP Business Application Studio, open the [*srv/poetryslam/poetrySlamServiceAuthorizations.cds*](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamServiceAuthorizations.cds) file with the authorization annotations to extend the authorization annotation of the SAP CAP service model by restrictions referring to the remote services.

2. Enhance the authorization model for the **S4HCSalesOrderPartner** service entity:
    ```javascript
    // S/4 sales order partner: Managers can read remote sales order partners
    annotate PoetrySlamService.S4HCSalesOrderPartner with @(restrict: [{
        grant: ['READ'],
        to   : 'PoetrySlamFull'
    }]);
    ```

### Enhance the Web App to Display SAP S/4HANA Cloud Public Edition Data 

1. Adopt the SAP Fiori elements annotations of the web app in the [*/app/poetryslams/annotations.cds*](../../../tree/main-multi-tenant-features/app/poetryslams/annotations.cds) file.
    
    1. Add project annotations to the **PoetrySlams** entity.
        ```javascript
        isS4HC                       @UI.Hidden;
        ```

    2. Add a facet named **Sales Order Data** to display information from the remote service by following the *toS4HCSalesOrderPartner* association:

        1. Add facet:
            ```javascript
            {
                $Type        : 'UI.ReferenceFacet',
                Label        : '{i18n>salesOrderData}',
                ID           : 'SalesOrderData',
                Target       : @UI.FieldGroup #SalesOrderData,
                // Display SalesOrderData only in case a SAP S/4HANA Cloud system is connected and Sales Order ID is filled
                ![@UI.Hidden]: {$edmJson: {$Or: [
                    {$Eq: [
                        {$Path: 'salesOrderID'},
                        {$Null: null}
                    ]},
                    {$Not: {$Path: 'isS4HC'}}
                ]}}
            },
            ```

        2. Add a field group named **#SalesOrderData** with the SAP S/4HANA Cloud Public Edition project-specific fields:       
            ```javascript
            FieldGroup #SalesOrderData     : {
                $Type: 'UI.FieldGroupType',
                Data : [
                    {
                        $Type                  : 'UI.DataFieldWithUrl',
                        Value                  : salesOrderID,
                        Url                    : salesOrderURL,
                        ![@Common.FieldControl]: #ReadOnly,
                        ![@UI.Hidden]          : {$edmJson: {$Not: {$Path: 'isS4HC'}}}
                    },
                    {
                        $Type                  : 'UI.DataField',
                        Label                  : '{i18n>businessPartnerId}',
                        Value                  : toS4HCSalesOrderPartner.customer,
                        ![@Common.FieldControl]: #ReadOnly,
                        ![@UI.Hidden]          : {$edmJson: {$Not: {$Path: 'isS4HC'}}}
                    },
                    {
                        $Type                  : 'UI.DataField',
                        Value                  : customerFullName,
                        ![@Common.FieldControl]: #ReadOnly,
                        ![@UI.Hidden]          : {$edmJson: {$Not: {$Path: 'isS4HC'}}}
                    }
                ]
            },
            ```

2. In the web app folder, edit language-dependent labels in the [*app/poetryslams/i18n/i18n.properties*](../../../tree/main-multi-tenant-features/app/poetryslams/i18n/i18n.properties) file. Add a label for the facet project data:

    ```
    salesOrderData          = Sponsoring Data

    # ID texts of CDS is overwritten to more specific UI text
    salesOrderID            = Advertising Sales Order   
    businessPartnerId       = Sponsoring Business Partner
    ``` 

    > In the reference example, the [*app/poetryslams/i18n/i18n_de.properties*](../../../tree/main-multi-tenant-features/app/poetryslams/i18n/i18n_de.properties) file with the German texts is available, too. ou can use these texts as needed.

### Unit Tests

Unit tests are available to test this feature:

1. Testing the sales order enhancement:

    1. Copy the [*test/srv/api/poetrySlamManagerSalesOrderAPI.test.js*](../../../tree/main-multi-tenant-features/test/srv/api/poetrySlamManagerAPI.test.js) file to your project.

2. To run the automated SAP CAP tests:

    1. Enter the `npm install` command in a terminal in SAP Business Application Studio.
    2. Enter the `npm run test` command. All tests are carried out and the result is shown afterwards.

### Test Locally

The goal of local tests is to connect to integrated ERP systems without using destinations. Therefore, you need to adjust the code slightly, as shown below:

1. To edit the development credentials in the [*package.json*](../../../tree/main-multi-tenant-features/package.json) file, replace the placeholders such as `{{S4HC-hostname}}`, `{{test-user}}`, and `{{test-password}}` with the information of your ERP test system.

> Note: If you don't have a user, see the next chapter for information on how to provide one.

2. In _connectorS4HC.js_, method _createConnectorInstance_, change the value of **connector.isConnectedIndicator** to **true** after the connector instance is created:

    ```javascript
    const connector = new ConnectorS4HC(data);
    connector.isConnectedIndicator = true;
    ```

    > Note: This change is required as the *isConnectedIndicator* value is dependent on destination setup in the SAP BTP consumer subaccount. These are not available locally.

3. Open a terminal and start the app with the development profile using the `cds watch --profile development` run command. 

4. Use the test users as listed in the [*.cdsrc.json*](../../../tree/main-multi-tenant-features/.cdsrc.json) file. 

5. Test the **S4HCSalesOrderPartner** service endpoint to SAP S/4HANA Cloud Public Edition. The system returns the respective data from SAP S/4HANA Cloud Public Edition.

> Note: If you would like to use a different user, clear the browser cache first.

> Note: The changes to the user interface aren't visible unless a sales order ID is set in the poetry slam. This topic is covered in the next chapter.

## Deploy the Application

Update your application in the provider subaccount. For detailed instructions, refer to [Deploy the Multi-Tenant Application to a Provider Subaccount](./24-Multi-Tenancy-Deployment.md).

> Note: Make sure that any local changes have been reverted before deployment.

You have now successfully deployed the application to the provider subaccount and you're ready to [Configure the Integration Scenario with SAP S/4HANA Cloud Public Edition](./52b-Multi-Tenancy-Features-API-Service-S4HC-Provisioning.md).
 
