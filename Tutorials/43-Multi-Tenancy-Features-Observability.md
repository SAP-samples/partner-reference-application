# Observability

In [Test and Troubleshoot](16-Test-Trace-Debug.md#check-application-logs), you can find information about out-of-the-box logs provided by SAP BTP Cloud Foundry runtime. These logs are helpful when it comes to ad hoc error analysis. However, they don't allow for sophisticated analyses and are only stored for a specific time.

The [SAP Cloud Logging service](https://help.sap.com/docs/cloud-logging/cloud-logging/what-is-sap-cloud-logging?version=Cloud) provides the big picture of the behavior and health of your application, since it offers more features by collecting logs, traces, and metrics in a central place with a longer storage time. In this way, it helps you ensure and improve efficiency, scalability, resilience, and availability.

Note that this service is not aimed at the users of the app, but at the app provider.

This tutorial describes how to connect the SAP Cloud Logging service to your SAP BTP application.

## Integrate the SAP Cloud Logging Service 
The SAP Cloud Logging service is an instance-based and environment-agnostic observability service that stores, visualizes, and helps analyze application logs, metrics, and traces from the SAP BTP Cloud Foundry.
The service builds upon [OpenSearch](https://opensearch.org/), which offers features such as querying, dashboarding, alerting, anomaly detection, and access management.

For more information, refer to the documentation on the [SAP Cloud Logging service](https://help.sap.com/docs/cloud-logging/cloud-logging/what-is-sap-cloud-logging?version=Cloud).

For the Partner Reference Application, an SAP Cloud Logging instance is created with service plan [standard](https://help.sap.com/docs/cloud-logging/cloud-logging/service-plans?version=Cloud) using the [*mta.yaml*](../../../tree/main-multi-tenant-features/mta.yaml) file:

1. Enable the SAP Cloud Logging service instance and [OpenTelemetry](https://help.sap.com/docs/cloud-logging/cloud-logging/ingest-via-opentelemetry-api-endpoint?version=Cloud) by adding the following code snippet to the *resources* in the *mta.yaml*:
    ```yml
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
    ```

   The parameters `ingest_otlp` and `backend` are explained in the [SAP Cloud Logging configuration documentation](https://pages.github.tools.sap/perfx/cloud-logging-service/documentation/configuration/). They allow the ingestion of OpenTelemetry data and backend/API access to the SAP Cloud Logging Service.

2. Add service bindings to all modules that create logs in the SAP Cloud Logging service. For the Poetry Slam Manager, the SAP Cloud Logging service instance is bound to the application service, multitenancy and extensibility tool (mtx-tool), and approuter modules.
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

## Add Telemetry Plugin, Metrics, and Trace Exporters
By enabling the telemetry plugin in your project, various kinds of telemetry data will be automatically collected and exported to the [SAP Cloud Logging service](https://help.sap.com/docs/cloud-logging).

For more information, refer to the CDS plugin [@cap-js/telemetry](https://github.com/cap-js/telemetry) and [Telemetry](https://cap.cloud.sap/docs/plugins/#telemetry).

1. Open a terminal and run the command `npm add @cap-js/telemetry`. As a result, a dependency to the latest version of the @cap-js/telemetry is added to the *package.json* of your project.

2. Add the two dependencies for the [OpenTelemetry Collector Metrics Exporter](https://www.npmjs.com/package/@opentelemetry/exporter-metrics-otlp-grpc) and the [OpenTelemetry Collector Traces Exporter](https://www.npmjs.com/package/@opentelemetry/exporter-trace-otlp-grpc) to the *package.json* by executing the commands `npm add @opentelemetry/exporter-metrics-otlp-grpc` and `@opentelemetry/exporter-trace-otlp-grpc`.
    ```

3. Make CDS write telemetry data to the SAP Cloud Logging service by adding the following code snippet to the profile `[production]` in the [*package.json*](../../../tree/main-multi-tenant-features/package.json):
    ```json
    "telemetry": {
      "kind": "to-cloud-logging"
    }
    ```

> Note: The OpenTelemetry modules that export [metrics](https://www.npmjs.com/package/@opentelemetry/exporter-metrics-otlp-grpc) and [traces](https://www.npmjs.com/package/@opentelemetry/exporter-trace-otlp-grpc), as well as the [CAP Telemetry feature](https://cap.cloud.sap/docs/plugins/#telemetry), are (as of June 2024) still in beta phase. New releases may include breaking changes.

4. Build and deploy the multi-tenant application to the provider SAP BTP subaccount.

## Access Logs in the SAP Cloud Logging Service

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

To access the OpenSearch Dashboards, click on the link *poetry-slams-cloud-logging* in the *Instances* section, and enter the credentials as described above.
You will find a list of pre-built OpenSearch Dashboards by navigating to *Dashboard* in the main menu.
The dashboards for Cloud Foundry distinguish between request logs and application logs. Request logs offer detailed information about web requests, such as response times and statuses. The dashboards enable the monitoring of traffic, errors, latency and request rates, facilitating thorough analysis and troubleshooting. If you feel the dashboards are not sufficient, you may create your own.

In addition to the OpenSearch UI you can also access the SAP Cloud Logging Service via API. For this, you will find three additional attributes in the *Credentials* section of the service key: `backend-endpoint`, `backend-password` and `backend-username`. For documentation on how to use the OpenSearch APIs, you may start at the [OpenSearch Query DSL documentation](https://opensearch.org/docs/latest/query-dsl/).

For more information, refer to [Access and Analyze Observability Data](https://help.sap.com/docs/cloud-logging/cloud-logging/access-and-analyze-observability-data?version=Cloud) and [OpenSearch Dashbords](https://opensearch.org/).
