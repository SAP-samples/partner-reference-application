# Learn about Multitenancy and Get an Overview of the Bill of Materials
Multitenancy is the ability to serve multiple tenants from a single deployment while strictly isolating the tenants' data. This significantly reduces costs and efforts.

In the version of Poetry Slam Manager with multitenancy, the Partner Reference Application uses a single deployment to a provider subaccount and subscription to this deployment in subscriber or consumer subaccounts. While the actual runtime of the application resides in the provider account, the subscriber accounts are used for the tenant-specific configuration, such as desinations or authorization and authentication. Find an overview of the accounts in the section below.

## Subaccounts
The example setup serves four sample customers: 
-	*Gourmet Poetry*: A renowned food magazine known for its exquisite taste and celebration of culinary arts using SAP Cloud ERP enterprise projects to run poetry slam events that blend the art of spoken word with gourmet food experiences.
-	*OEC computers*: A company whose employees frequently come together for poetry slams with a great buffet and all-you-can-eat mousse au chocolat. 
-	*Almika Events Cleveland*: An event agency that plans events using SAP Business ByDesign as their ERP solution.
-	*Andina Live Events*: A small poet startup without any ERP solution yet (but a promising ERP prospect if they stay on their exciting growth journey). 

> Note: The ERP integration will be done in a later step.

To develop and run the application for these consumers, the following directory and subaccount structure is proposed.

| Directory Name                   | Subaccount Name                      | Usage                                                                                                       |
| --------------------             | --------------------                 | ----------------------------                                                                                |
| Development                      |                                      |                                                                                                             |
|                                  | Development                          | SAP Business Application Studio                                                                             |
| Partner Reference Application    |                                      |                                                                                                             |
|                                  | Provider: Poetry Slam Manager        | Application runtime, the database, other SAP BTP services used to run the application                        |
|                                  | Consumer 1: Gourmet Poetry           | Subscription to customer Gourmet Poetry (to be connected to their SAP S/4HANA Cloud tenant)            |
|                                  | Consumer 2: OEC Computers            | Subscription to customer OEC Computers (to be connected to their SAP Business One system)                   |
|                                  | Consumer 3: Almika Events Cleveland  | Subscription to customer Almika Events Cleveland (to be connected to their SAP Business ByDesign tenant)    |
|                                  | Consumer 4: Andina Live Events       | Subscription to customer Andina Live Events who uses the application as a stand-alone solution            |

## Entitlements
The list shows the entitlements that are required in the different subaccounts to develop and run the Poetry Slam Manager application with a multi-tenant deployment and additional features. While some entitlements are included by default, you'll learn which ones to add manually.

| Subaccount    |  Service Display Name                          																								| Service Technical Name | Service Plan     | Type          | Quantity           | 
| -----------   |  -------------------                           																							    | ---------              | ---------------  | ---------     | ---------          |             
| Development     |                                                																		    					|                          |      |                  |               |
|               | [SAP Business Application Studio](https://discovery-center.cloud.sap/serviceCatalog/sap-build)  												| sapappstudio           | build-default    | Application   | 1 (per developer)  |
| Provider        |                                                      																							|                      |      |                  |               |
|               | [Cloud Foundry Environment](https://discovery-center.cloud.sap/serviceCatalog/sap-build)  													| cloudfoundry           | build-runtime    | Environment   | 3 units            |
|               | [Custom Domain service](https://discovery-center.cloud.sap/serviceCatalog/custom-domain)  							  						| custom-domain-manager  | standard         | Application   | 1                  |
|               | [Authorization and Trust Management service](https://discovery-center.cloud.sap/serviceCatalog/authorization-and-trust-management-service)   	| xsuaa       		     | broker           | Service       | 1                  | 
|               | [Destination service](https://discovery-center.cloud.sap/serviceCatalog/destination-service)       											| destination            | lite             | Service       | 1                  | 
|               | [Connectivity service](https://discovery-center.cloud.sap/serviceCatalog/connectivity-service)   												| connectivity           | lite             | Service       | 1                  | 
|               | [HTML5 Application Repository service](https://discovery-center.cloud.sap/serviceCatalog/html5-application-repository-service)  				| html-apps-repo         | app-host         | Service       | 1                  | 
|               | [HTML5 Application Repository service](https://discovery-center.cloud.sap/serviceCatalog/html5-application-repository-service)   				| html-apps-repo         | app-runtime      | Service       | 1                  | 
|               | [SaaS Provisioning service](https://discovery-center.cloud.sap/serviceCatalog/saas-provisioning-service)   									| saas-registry          | application      | Service       | 1                  | 
|               | [SAP HANA Cloud*](https://discovery-center.cloud.sap/serviceCatalog/sap-hana-cloud) 															| hana-cloud             | hana-td          | Service       | 1                  | 
|               | [SAP HANA Cloud](https://discovery-center.cloud.sap/serviceCatalog/sap-hana-cloud) 															| hana-cloud-tools       | tools            | Application   | 1                  | 
|               | [SAP HANA Schemas & HDI Containers](https://discovery-center.cloud.sap/serviceCatalog/sap-hana-cloud) 										| hana     				 | hdi-shared       | Service       | 1                  | 
|               | [Service Manager](https://discovery-center.cloud.sap/serviceCatalog/service-manager)  														| service-manager        | container        | Service       | 1                  |  
| Consumer        |                                                     																							|                      |      |                  |               |
|               | [SAP Build Work Zone, Standard Edition](https://discovery-center.cloud.sap/serviceCatalog/sap-build)  										| SAPLaunchpad           | build-default    | Application   | 1                  |    

> Note: The table outlines SAP BTP service plans used in SAP BTP environments for test, demo, and development. In productive environments, use the SAP HANA Cloud service plan 'hana'.

## Services Without Entitlements
The list shows services that don't require entitlements.

| Subaccount    |  Entitlement Name                                    | Service Plan              | Type          | Quantity                          | 
| -----------   |  -------------------                                 | ---------                 | ---------     | ---------                         |
| Consumer      |                                                      |                           |               |                                   |
|               | Poetry Slam Manager                                  | default                   | Application   | 1 (partner application)           |

## Modules
The application consists of the following modules, which are deployed into the SAP BTP Cloud Foundry runtime of the provider subaccount. 

Provided by SAP:
- SAP Cloud Application Programming Model on Node.js 
- SAPUI5 with SAP Fiori elements 
- SAP Cloud SDK   
- Application Router                                                           
- Multitenancy Extension Module   

Your main development task:  
- Partner Application Module                                                   

Before you move on with the next section, ensure that the required service assignments are available in your global account.

> Note: Contact SAP if there aren't enough service entitlements available in your global account.

Now that you're familiar with multitenancy and the bill of materials, in the [next section](22-Multi-Tenancy-Prepare-Deployment.md), you'll start preparing the multitenancy version of the Poetry Slam Manager.
