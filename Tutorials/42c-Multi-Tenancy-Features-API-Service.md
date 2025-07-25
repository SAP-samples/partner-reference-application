# Create an API Service for Remote Integrations without Draft Handling

The SAP Cloud Application Programming Model (CAP) services created in the section [Develop the Core of the SAP BTP Application](./14-Develop-Core-Application.md) are built for the SAP Fiori elements UI. Therefore, the entities are draft-enabled. when a service is called using an API, draft handling is not required. This can complicate the call sequence. 

In the CAP documentation [Single-Purposed Services](https://cap.cloud.sap/docs/guides/providing-services#single-purposed-services), CAP recommends designing services for single use cases only. As a result, the Poetry Slam Manager application includes a service that users can call through an API. This service is not draft-enabled.

This section describes how an API service can be created and how the service can be accessed using the service broker. The service broker needs to be enabled first. 
         
## Application Enablement 

Defining an API service is similar to a service that is called from the UI. For more detailed information, refer to [SAP Cloud Application Programming Model services](https://cap.cloud.sap/docs/guides/providing-services). Place all service definitions in the */srv* folder. You can use subfolders to structure the different services based on their usage. 

1. Create a *api* in the */srv* folder. This contains all files that are required for the Poetry Slam Manager API service.
2. Create a *poetrySlamManagerAPI.cds* file in the */api* folder, which is the service definition of the Poetry Slam Manager API service.
3. Copy the service definition into the file.

    ```cds
    using {sap.samples.poetryslams as poetrySlamManagerModel} from '../../db/poetrySlamManagerModel';

    //Service for Poetry Slam Applications for role PoetrySlamManager
    service PoetrySlamManagerAPIService @(path: 'poetryslammanagerapi') {

        // ----------------------------------------------------------------------------
        // Entity inclusions

        // Poetry Slams without draft handling
        entity PoetrySlams as
            projection on poetrySlamManagerModel.PoetrySlams {
                // Selects specific fields of the PoetrySlams domain model
                ID,
                number,
                title,
                description,
                dateTime,
                visitorsFeeAmount,
                visitorsFeeCurrency,
                status,
                visits
            };

        // Visitors
        entity Visitors    as
            projection on poetrySlamManagerModel.Visitors {
                * // Selects all fields of the Visitors database model
            };

        // Visits
        entity Visits      as
            projection on poetrySlamManagerModel.Visits {
                *
            };
    }

    ```

    > Note: The existing [PoetrySlamService](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamService.cds) differs in several ways:
    > * The API service definition does not include the draft-enabled annotation at the *PoetrySlams* entity
    > * The domain model fields that are exposed are selected explicitly.
    > * There is no implementation for the service defined.
    >
    > Since no service implementation exists, all fields are directly written to the database without any calculations. In contrast, the *PoetrySlamService*, used by the *poetryslams* SAP Fiori elements UI, performs calculations on some fields. It's important to consider this in the design of the services, as these fields aren't exposed in the API service.

4. Copy the service authorizations definition from [*/srv/api/poetrySlamManagerAPIAuthorizations.cds*](../../../tree/main-multi-tenant-features/srv/api/poetrySlamManagerAPIAuthorizations.cds) into your project.

    > Note: In this example, the same scopes apply to authorizations for both the API service and the user interface service. Generally, these scopes may differ. For the API service, only reading and updating the *PoetrySlams* entity is allowed. Creation and deletion aren't possible through the API service. The *visits* and *visitors* entities are read-only.

5. Enhance the [*/srv/services.cds*](../../../tree/main-multi-tenant-features/srv/services.cds) file that references all the service definitions. Add the reference to the Poetry Slam Manager API service:

    ```cds
    using from './api/poetrySlamManagerAPI';
    using from './api/poetrySlamManagerAPIAuthorizations';
    ```

With these changes, the API service becomes available. To call it from an external system, you need to enable and provision the service broker. This process is described in the tutorials [Enable API Access to SAP BTP Applications Using Service Broker](./42a-Multi-Tenancy-Service-Broker.md) and [Configure and Consume the APIs of the SAP BTP Application](./42b-Multi-Tenancy-Provisioning-Service-Broker.md). Make sure you follow all the enablement steps described in these tutorials first. 

### Unit Tests

Unit tests are available to test this feature:

1. Testing the API service:

    1. Copy the [*test/srv/api/poetrySlamManagerAPI.test.js*](../../../tree/main-multi-tenant-features/test/srv/api/poetrySlamManagerAPI.test.js) file to your project to test the service.

    2. Copy the [*test/srv/api/poetrySlamManagerAPIAuthorizations.test.js*](../../../tree/main-multi-tenant-features/test/srv/api/poetrySlamManagerAPIAuthorizations.test.js) file to your project to test the authorizations.

2. To run the automated SAP CAP tests:

    1. Enter the `npm install` command in a terminal in SAP Business Application Studio.
    2. Enter the `npm run test` command. All tests are carried out and the result is shown afterwards.

### Test Locally

Now, you can start the web application and test the `poetryslammanagerapi` locally in SAP Business Application Studio:

1. Open a terminal in SAP Business Application Studio. 

2. Run the `npm install` command to ensure all modules are loaded and installed.

3. Run the `cds watch` command to start the application. A success message indicates that the runtime is started: *A service is listening to port 4004*.

4. To open the test environment, choose **Open in a New Tab** in the pop-up message or choose the link `http://localhost:4004` in the terminal. As a result, a browser tab opens with the web application and OData service endpoints. 

5. Before testing the service, the data needs to be created:

    1. Choose **/poetryslams/webapp/**, then open the poetryslams application.

    2. A log-on message appears. Use the test users as listed in the **.cdsrc.json** file, for example `peter` / `welcome`.

    3. When starting the application, no data is available. Choose **Generate Sample Data** to create sample data for mutable data, such as poetry slams, visitors, and visits. 

6. Navigate back to the page with the OData service endpoints.    

7. Choose **PoetrySlams** in the */odata/v4/poetryslammanagerapi* section. All poetry slams that are generated as test data are shown. Additionally, the entities *Visits*, *Visitors*, *Currencies* and the codes can be tested.

## Deploy the Application

Update your application in the provider subaccount. For detailed instructions, refer to the section [Deploy the Multi-Tenant Application to a Provider Subaccount](./24-Multi-Tenancy-Deployment.md).

You have now successfully deployed the application to the provider subaccount and you're ready to access the API service.

## Access the API Service through Service Broker

A regular user can consume the APIs of the Poetry Slam Manager application with principal propagation. In this case, you use the logon of a regular user through your IdP with user-specific authorizations.

Technical users are required to consume APIs of the Poetry Slam Manager application from a background process.

Some samples on how to access the API are provided within [ServiceBroker_TechnicalAccessPoetrySlamManagerAPI.http](./api-samples/ServiceBroker_TechnicalAccessPoetrySlamManagerAPI.http). They can be tested with the preinstalled REST Client in the SAP Business Application Studio.



