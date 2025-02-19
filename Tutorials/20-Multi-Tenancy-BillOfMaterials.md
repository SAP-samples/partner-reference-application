# Learn about Multitenancy and Get an Overview of the Bill of Materials
Multitenancy is the ability to serve multiple tenants from a single deployment while strictly isolating the tenants' data. This significantly reduces costs and efforts.

In the version of Poetry Slam Manager with multitenancy, the Partner Reference Application uses a single deployment to a provider subaccount and subscription to this deployment in subscriber or consumer subaccounts. While the actual runtime of the application resides in the provider account, the subscriber accounts are used for the tenant-specific configuration, such as desinations or authorization and authentication. Find an overview of the accounts in the section below.

## Subaccounts
The example setup serves four sample customers: 
-	*Andina Publications*: A well-established publishing house using SAP S/4HANA Cloud enterprise projects to run poetry slam events.
-	*OEC computers*: A company whose employees frequently come together for poetry slams with a great buffet and all-you-can-eat mousse au chocolat. 
-	*Almika Events Cleveland*: An event agency that plans events using SAP Business ByDesign as their ERP solution.
-	*Invictus Live Events*: A small poet startup without any ERP solution yet (but a promising ERP prospect if they stay on their exciting growth journey). 

> Note: The ERP integration will be done in a later step.

To develop and run the application for these consumers, the following directory and subaccount structure is proposed.

| Directory Name                   | Subaccount Name                      | Usage                                                                                                       |
| --------------------             | --------------------                 | ----------------------------                                                                                |
| Development                      |                                      |                                                                                                             |
|                                  | Development                          | SAP Business Application Studio                                                                             |
| Partner Reference Application    |                                      |                                                                                                             |
|                                  | Provider: Poetry Slam Manager        | Application runtime, the database, other SAP BTP services used to run the application                       |
|                                  | Consumer 1: Andina Publications      | Subscription to customer Andina Publications (to be connected to their SAP S/4HANA Cloud tenant)            |
|                                  | Consumer 2: OEC Computers            | Subscription to customer OEC Computers (to be connected to their SAP Business One system)                   |
|                                  | Consumer 3: Almika Events Cleveland  | Subscription to customer Almika Events Cleveland (to be connected to their SAP Business ByDesign tenant)    |
|                                  | Consumer 4: Invictus Live Events     | Subscription to customer Invictus Live Events who uses the application as a stand-alone solution            |

## Entitlements
The list shows the entitlements that are required in the different subaccounts to develop and run the Poetry Slam Manager application with a multi-tenant deployment and additional features. While some entitlements are included by default, you'll learn which ones to add manually.

| Subaccount    |  Entitlement Name                                    | Service Plan              | Type          | Quantity                          | 
| -----------   |  -------------------                                 | ---------                 | ---------     | ---------                         |
| Development   |                                                      |                           |               |                                   |
|               | SAP Business Application Studio                      | standard-edition          | Application   | 1 (per developer)                 |
| Provider      |                                                      |                           |               |                                   |
|               | SAP BTP Cloud Foundry runtime                        | standard                  | Environment   | 3 units                           |
|               | SAP Custom Domain service                            | standard                  | Application   | 1                                 |
|               | SAP Authorization and Trust Management service       | broker                    | Service       | 1                                 | 
|               | SAP Destination service                              | lite                      | Service       | 1                                 | 
|               | SAP HTML5 Application Repository service for SAP BTP | app-host                  | Service       | 1                                 | 
|               | SAP HTML5 Application Repository service for SAP BTP | app-runtime               | Service       | 1                                 | 
|               | SAP Software-as-a-Service Provisioning service       | application               | Service       | 1                                 | 
|               | SAP HANA Cloud                                       | hana-td                   | Service       | 1                                 | 
|               | SAP HANA Cloud                                       | tools                     | Application   | 1                                 | 
|               | SAP HANA Schemas & HDI Containers                    | hdi-shared                | Service       | 1                                 | 
|               | SAP Service Manager service                          | container                 | Service       | 1                                 | 
| Consumer      |                                                      |                           |               |                                   |
|               | SAP Build Work Zone, standard edition                | standard (Application)    | Application   | 1                                 |


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
