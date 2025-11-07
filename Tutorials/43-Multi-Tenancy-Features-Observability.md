# Observability: Logging, Metrics, and Tracing

In [Test and Troubleshoot Multitenancy](26-Test-Trace-Debug-Multi-Tenancy.md#check-application-logs), you can find information about out-of-the-box logs provided by SAP BTP Cloud Foundry runtime. These logs are helpful when it comes to ad hoc error analysis. However, they don't allow for sophisticated analyses and are only stored for a specific time.

The [SAP Cloud Logging service](https://help.sap.com/docs/cloud-logging/cloud-logging/what-is-sap-cloud-logging?version=Cloud) provides the big picture of the behavior and health of your application, since it offers more features by collecting logs, traces, and metrics in a central place with a longer storage time. In this way, it helps you ensure and improve efficiency, scalability, resilience, and availability.

> Note: This service is not intended for the users of the application, but rather the application provider.

## Bill of Materials

### Entitlements
In addition to the entitlements listed for the [multitenancy version](./20-Multi-Tenancy-BillOfMaterials.md), the list shows the entitlements that are required in the different subaccounts to add observability. 

| Subaccount    |  Entitlement Name                         | Service Plan          | Type          | Quantity                  | 
| ------------- |  ---------------------------------------- | -----------------     | ------------- | ------------------------- |
| Provider      |                                           |                       |               |                           |
|               | SAP Cloud Logging                         | standard              | Service       | 1                         |

## Guide How to Enhance the Application Step by Step

To explore this feature with the Poetry Slam Manager, you have two options: 

1. Clone the repository of the Partner Reference Application. Check out the [*main-multi-tenant*](../../../tree/main-multi-tenant) branch and enhance the application step by step. 

2. Alternatively, check out the [*main-multi-tenant-features*](../../../tree/main-multi-tenant-features) branch where the feature is already included. 

The following describes how to enhance the **main-multi-tenant** branch (option 1).

### Integrate the SAP Cloud Logging Service 
The SAP Cloud Logging service is an instance-based and environment-agnostic observability service that stores, visualizes, and helps analyze application logs, metrics, and traces from the SAP BTP, Cloud Foundry runtime.
The service builds upon [OpenSearch](https://opensearch.org/), which offers features such as querying, dashboarding, alerting, anomaly detection, and access management.

For more information, refer to the documentation on the [SAP Cloud Logging service](https://help.sap.com/docs/cloud-logging/cloud-logging/what-is-sap-cloud-logging?version=Cloud).  

To use the SAP Cloud Logging service, you have several options: 
1. You can set up the service as a dedicated instance for each application.
2. Alternatively, you can use one central service instance and share it across your applications.

The following sections demonstrate both approaches.

#### Option 1: Use a Dedicated SAP Cloud Logging Instance

For the Partner Reference Application, an SAP Cloud Logging instance is created with [standard](https://help.sap.com/docs/cloud-logging/cloud-logging/service-plans?version=Cloud) service plan using the [*mta.yaml*](../../../tree/main-multi-tenant-features/mta.yaml) file:

1. Enable the SAP Cloud Logging service instance and [OpenTelemetry](https://help.sap.com/docs/cloud-logging/cloud-logging/ingest-via-opentelemetry-api-endpoint?version=Cloud) by adding the following code snippet to the *resources* in the *mta.yaml*:
    ```yml
    resources:
    #...
    # Cloud Logging Service
    - name: poetry-slams-cloud-logging
      type: org.cloudfoundry.managed-service
      parameters:
        service: cloud-logging
        service-plan: standard
        config:
          ingest_otlp:
            enabled: true
          backend:
            api_enabled: true
    #...
    ```

   The parameters `ingest_otlp` and `backend` allow the ingestion of OpenTelemetry data and backend/API access to the SAP Cloud Logging service. They are explained in the [Configuration Parameters](https://help.sap.com/docs/cloud-logging/cloud-logging/configuration-parameters) document of the SAP Cloud Logging service on the SAP Help Portal.

2. Add service bindings to all modules that create logs in the SAP Cloud Logging service. For the Poetry Slam Manager, the SAP Cloud Logging service instance is bound to the service module, MTX module, and approuter.
    ```yml
    # Service module
    - name: poetry-slams-srv
      requires:
      - name: poetry-slams-cloud-logging
    ```
    ```yml
    # MTX module
    - name: poetry-slams-mtx
      requires:
      - name: poetry-slams-cloud-logging
    ```
    ```yml
    # Approuter
    - name: poetry-slams
      requires:
      - name: poetry-slams-cloud-logging
    ```

#### Option 2: Use a Shared SAP Cloud Logging Instance

When you choose to share an existing SAP Cloud Logging instance, your application's mta.yaml file references a pre-existing SAP Cloud Logging instance. In this scenario, the service instance isn't created during the application's deployment. Therefore, the deployment fails if the referenced service instance doesn't already exist in the Cloud Foundry space where the application is deployed. To create a sharable SAP Cloud Logging instance and use it across multiple Cloud Foundry spaces, follow these steps:

1. Create a Cloud Foundry space for your shared resources in your provider subaccount:
    1. Run the `cf login` command.  
    2. Enter the SAP BTP, Cloud Foundry runtime API of your environment, for example, `https://api.cf.eu10.hana.ondemand.com`.  
    3. Enter your development user and password.  
    4. Select the org of the SAP BTP provider subaccount for the application.  
    5. In case a Cloud Foundry space has to be selected, skip the selection.
    6. Create a new Cloud Foundry space: `cf create-space <name>` (for example, *shared-resources*).
    7. Run the `cf target -s <name>` command to access the Cloud Foundry runtime of the newly created shared resources space.

2. Create a SAP Cloud Logging service instance in the shared resources Cloud Foundry space of your provider subaccount:
    1. Create a SAP Cloud Logging service instance with the following command:  
        ```
        cf create-service cloud-logging standard shared-cloud-logging -c '{
          "ingest_otlp": {
            "enabled":  true
          },
          "backend": {
            "api_enabled": true
          }
        }'
        ```   
        This creates a *service instance* named `shared-cloud-logging` with *service offering* as `cloud-logging` and *service plan* as `standard` with the given configuration.  
        > Note: The parameters `ingest_otlp` and `backend` allow the ingestion of OpenTelemetry data and backend/API access to the SAP Cloud Logging service. They are explained in the [Configuration Parameters](https://help.sap.com/docs/cloud-logging/cloud-logging/configuration-parameters) document of the SAP Cloud Logging service on the SAP Help Portal.
    
    2. Check if the SAP Cloud Logging service instance is created by running the `cf service shared-cloud-logging` command.
    
    3. After the service instance is sucessfully created, share it to the spaces within the same subaccount, where the partner-reference-application will be deployed:  
        ```
        cf share-service shared-cloud-logging -s <target-space>
        ```  
    > Note: There are multiple ways to share the SAP Cloud Logging service resources, even across SAP BTP subaccounts. For more details, see [Ingest Observability Data](https://help.sap.com/docs/cloud-logging/cloud-logging/ingest-observability-data?locale=en-US&version=Cloud) on SAP Help Portal.

3. Reference the existing SAP Cloud Logging service instance `shared-cloud-logging-service` in your [*mta.yaml*](../../../tree/main-multi-tenant-features/mta.yaml) file and bind it to your applications:
    1. Add the exisiting resource to the *resources* section in the *mta.yaml*:
        ```yml
        resources:
        #...
        # Cloud Logging Service
        - name: shared-cloud-logging
          type: org.cloudfoundry.existing-service
        #...
        ```
    2. Add service bindings to all modules that create logs in the SAP Cloud Logging service. For the Poetry Slam Manager, the SAP Cloud Logging service instance is bound to the service module, MTX module, and approuter.
    ```yml
    # Service module
    - name: poetry-slams-srv
      requires:
      - name: shared-cloud-logging
    ```
    ```yml
    # MTX module
    - name: poetry-slams-mtx
      requires:
      - name: shared-cloud-logging
    ```
    ```yml
    # Approuter
    - name: poetry-slams
      requires:
      - name: shared-cloud-logging
    ```

### Add Telemetry Plugin, Metrics, and Trace Exporters
By enabling the telemetry plugin in your project, various kinds of telemetry data will be automatically collected and exported to the [SAP Cloud Logging service](https://help.sap.com/docs/cloud-logging).

For more information, refer to the CDS plugin [@cap-js/telemetry](https://github.com/cap-js/telemetry) and [Telemetry](https://cap.cloud.sap/docs/plugins/#telemetry).

1. Add the required dependencies for telemetry to the [*package.json*](../../../tree/main-multi-tenant-features/package.json).

    1. Open a terminal.

    2. Run the command to add the dependency *cap-js/telemetry* which provides observability features enabling collecting tracing and metrics.
    
        ```
        npm add @cap-js/telemetry
        ``` 

    2. Run the command to add the dependency *@grpc/grpc-js* allowing communication between services using the gRPC protocol. 

        ```
        npm add @grpc/grpc-js
        ```

    2. Run the command to add the dependency *@opentelemetry/exporter-metrics-otlp-grpc* which sends collected OpenTelemetry metrics data to an OpenTelemetry Protocol (OTLP) endpoint using gRPC.

        ```
        npm add @opentelemetry/exporter-metrics-otlp-grpc
        ``` 

    3. Run the command to add the dependency *npm add @opentelemetry/exporter-trace-otlp-grpc`* which sends collected OpenTelemetry trace data to an OTLP endpoint using gRPC.
      
        ```
        npm add @opentelemetry/exporter-trace-otlp-grpc
        ```

2. Make CDS write telemetry data to the SAP Cloud Logging service by adding the following code snippet to the profile `[production]` in the [*package.json*](../../../tree/main-multi-tenant-features/package.json):
    ```json
    "telemetry": {
      "kind": "to-cloud-logging"
    }
    ```

> Note: The OpenTelemetry modules that export [metrics](https://www.npmjs.com/package/@opentelemetry/exporter-metrics-otlp-grpc) and [traces](https://www.npmjs.com/package/@opentelemetry/exporter-trace-otlp-grpc), as well as the [CAP Telemetry feature](https://cap.cloud.sap/docs/plugins/#telemetry), are (as of June 2024) still in beta phase. New releases may include breaking changes.

3. Build and deploy the multi-tenant application to the provider SAP BTP subaccount.
> Note: In case a shared SAP Cloud Logging instance is used, make sure to target the correct Cloud Foundry space when deploying the application.

### Access Logs in the SAP Cloud Logging Service

Create a service key for the service instance of the SAP Cloud Logging service:
1. In your provider subaccount, choose *Services* and go to *Instances and Subscriptions*.
2. In the *Instances* section, in the row of the SAP Cloud Logging instance, select *Actions* and choose *Create Service Key*.
3. Enter a service key name and choose *Create*.
4. Open the *Credentials* of the SAP Cloud Logging instance.
5. In the *Credentials* dialog box, select the previously created key and look for the following fields:  
    ```json
    "dashboards-username": "{{dashboards-username}}",
    "dashboards-password": "{{dashboards-password}}",
    ```

To access the OpenSearch Dashboards, click on the link of the SAP Cloud Logging instance in the *Instances* section, and enter the credentials as described above.
You will find a list of pre-built OpenSearch Dashboards by navigating to *Dashboard* in the main menu.
The dashboards for Cloud Foundry distinguish between request logs and application logs. Request logs offer detailed information about web requests, such as response times and statuses. The dashboards enable the monitoring of traffic, errors, latency and request rates, facilitating thorough analysis and troubleshooting. If you feel the dashboards are not sufficient, you may create your own.

In addition to the OpenSearch UI you can also access the SAP Cloud Logging Service using the API. For this, you will find three additional attributes in the *Credentials* section of the service key: `backend-endpoint`, `backend-password` and `backend-username`. For documentation on how to use the OpenSearch APIs, you may start at the [OpenSearch Query DSL documentation](https://opensearch.org/docs/latest/query-dsl/).

For more information, refer to [Access and Analyze Observability Data](https://help.sap.com/docs/cloud-logging/cloud-logging/access-and-analyze-observability-data?version=Cloud) and [OpenSearch Dashbords](https://opensearch.org/).
