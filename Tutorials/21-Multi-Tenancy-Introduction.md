# Multitenancy

## Overview of Multitenancy

Multitenancy is the ability to serve multiple tenants through single clusters of microservice instances, while serving the tenants from a single deployment and strictly isolating the tenants' data. This significantly reduces costs and efforts.

Multitenancy is part of the [multitenancy, toggles, extensibility package](https://cap.cloud.sap/docs/guides/multitenancy/mtxs). SAP Cloud Application Programming Model has built-in support for multitenancy and requires only minimum setup. You can find further information in the [SAP Cloud Application Programming Model documentation on multitenancy](https://cap.cloud.sap/docs/guides/multitenancy).

This features a single deplyoment to the provider subaccount and subscription to this deployment in subscriber or consumer subaccounts. While the actual runtime of the application resides in the provider account, the subscriber accounts are used for the tenant-specific configuration such desinations or authorization and authentication.

## Overview of Application Router

The application router acts as a single point-of-entry gateway to route requests to. In particular, it captures the tenant identification from the accessed route so that it ensures a tenant-specific user login and authentication (in combination with SAP Authorization and Trust Management service) and it ensures that the CAP application can access that specific tenant's isolated data. More information on the application router can be found [here](https://help.sap.com/docs/btp/sap-business-technology-platform/application-router).

## Overview of the Procedure
In this approach of progressive development from a customer-specific single-tenant application to a multi-customer application, you keep the core of your single-tenant application (as contained in the branch [*main-single-tenant*](../../../tree/main-single-tenant)) and add changes to enable the deployment as a multi-tenant application (as contained in the branch [*main-multi-tenant*](../../../tree/main-multi-tenant)). You can easily compare both branches using [GitHub comparison](https://github.tools.sap/erp4sme/partner-reference-application/compare/main-single-tenant..main-multi-tenant).  

> Note: The comparison contains both the multi-tenant enablement and the enhancement for the integration with different ERP back ends.

In the [*main-single-tenant*](../../../tree/main-single-tenant) branch and associated tutorials, you find an application that was only single-tenant aware. That means that the deployed application had no data isolation or customization for different clients or tenants. The [*main-multi-tenant*](../../../tree/main-multi-tenant) application, however, will offer shared resources with logical separation to serve multiple clients. This all comes without the need to create multiple instances of the application or multiple instances of associated services.  

The enablement of multitenancy requires the following general steps:
1. Add the [multitenancy](https://cap.cloud.sap/docs/guides/multitenancy/) and [app router](https://help.sap.com/docs/btp/sap-business-technology-platform/application-router) features to the project.
2. Add the SAP BTP resource [HTML5 application runtime](https://help.sap.com/docs/btp/sap-business-technology-platform/consuming-content).
3. Define [tenant URL patterns](https://help.sap.com/docs/btp/sap-business-technology-platform/app-router-multitenancy) and reconfigure [routes](https://help.sap.com/docs/btp/sap-business-technology-platform/routing-configuration-file) and destinations accordingly.
4. Adapt the web app entry point to run independently from SAP Build Work Zone.

   > Note: SAP Build Work Zone contains a managed application router that was used in the [*main-single-tenant*](../../../tree/main-single-tenant). It's currently not multi-tenant aware so you need to use the implemented [application router](https://help.sap.com/docs/btp/sap-business-technology-platform/application-router).

As a result, the application has three separate major modules running on separated workloads:
- the **application services module**, which processes the application services and the web app (the web app can be outsourced in a separate module later as well),
- the **mtxs module**, which processes tenant onboarding and other lifecycle operations, and
- the **application router** as a single entry point and to manage access to all modules and used services in a way that allows strict tenant separation.

After the successful deployment of the above to the provider subaccount, you configure the SAP Custom Domain service, and 
SAP Authorization and Trust Management service. Following this, you can subscribe to the application from the subscriber subaccount and access the application via the app router. The data accessed from this subscriber subaccount is isolated from other subscribed subaccounts even though they share the same cluster of microservices.  

In the [next section](./22-Multi-Tenancy-Prepare-Deployment.md), you prepare your provider subaccount for the deployment of the multi-tenant application. 


