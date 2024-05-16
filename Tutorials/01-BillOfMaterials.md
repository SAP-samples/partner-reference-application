# Bill of Materials
In the full version of Poetry Slam Manager with multitenancy, SAP ERP integration, and additional features, the Partner Reference Application uses a number of subaccounts and entitlements. These subaccounts include a provider subaccount (to which the application is deployed) and consumer subaccounts (which include customer-specific information and configuration). Find an overview in the section below.

## Subaccounts
The example setup serves four sample customers: 
-	*Andina Publications*: A well-established publishing house using SAP S/4HANA Cloud enterprise projects to run poetry slam events.
-	*OEC computers*: A company whose employees frequently come together for poetry slams with a great buffet and all-you-can-eat mousse au chocolat. 
-	*Almika Events Cleveland*: An event agency that plans events using SAP Business ByDesign as their ERP solution.
-	*Invictus Live Events*: A small poet startup without any ERP solution yet (but a promising ERP prospect if they stay on their exciting growth journey). 

To develop and run the application for these consumers, the following directory and subaccount structure is proposed.

| Directory Name                   | Subaccount Name                      | Usage                                                                                             |
| --------------------             | --------------------                 | ----------------------------                                                                      |
| Development                      |                                      |                                                                                                   |
|                                  | Development                          | SAP Business Application Studio                                                                       |
| Partner Reference Application    |                                      |                                                                                                   |
|                                  | Provider: Poetry Slam Manager        | Application runtime, the database, other SAP BTP services used to run the application             |
|                                  | Consumer 1: Andina Publications      | Subscription to customer Andina Publications connected to their SAP S/4HANA Cloud tenant          |
|                                  | Consumer 2: OEC Computers            | Subscription to customer OEC Computers connected to their SAP Business One system                 |
|                                  | Consumer 3: Almika Events Cleveland  | Subscription to customer Almika Events Cleveland connected to their SAP Business ByDesign tenant  |
|                                  | Consumer 4: Invictus Live Events     | Subscription to customer Invictus Live Events who uses the application as a stand-alone solution |


## Entitlements
The list shows the entitlements that are required in the different subaccounts to develop and run the Poetry Slam Manager application with a multi-tenant deployment and additional features. The listed service plans refer to SAP BTP accounts for Test, Demo, and Development (TDD). 

| Subaccount    |  Entitlement Name                                    | Service Plan (TDD)        | Type          | Quantity                          | 
| -----------   |  -------------------                                 | ---------                 | ---------     | ---------                         |
| Development   |                                                      |                           |               |                                   |
|               | SAP Business Application Studio                      | standard-edition          | Application   | 1 (per developer)                 |
| Provider      |                                                      |                           |               |                                   |
|               | SAP BTP Cloud Foundry runtime                                | standard                  | Environment   | 4 units                           |
|               | SAP Custom Domain service                            | standard                  | Application   | 1                                 |
|               | SAP Audit Log service                                | premium                   | Service       | 1                                 |
|               | SAP Authorization and Trust Management service       | broker                    | Service       | 1                                 | 
|               | SAP Destination service                              | lite                      | Service       | 1                                 | 
|               | SAP HTML5 Application Repository service for SAP BTP | repo-host                 | Service       | 1                                 | 
|               | SAP HTML5 Application Repository service for SAP BTP | app-runtime               | Service       | 1                                 | 
|               | SAP Software-as-a-Service Provisioning service       | application               | Service       | 1                                 | 
|               | SAP HANA Cloud                                       | hana-td                   | Service       | 1                                 | 
|               | SAP HANA Schemas & HDI Containers                    | hdi-shared                | Service       | 1                                 | 
|               | SAP Service Manager service                          | container                 | Service       | 1                                 | 
| Consumer      |                                                      |                           |               |                                   |
|               | Poetry Slam Manager                                  | default                   | Application   | 1 (partner application)           |
|               | Poetry Slam Service Broker                           | fullaccess                | Instance      | 1 (partner application)           |
|               | Poetry Slam Service Broker                           | readonlyaccess            | Instance      | 1 (partner application)           |
|               | SAP Audit Log Viewer service for SAP BTP             | default                   | Application   | 1                                 |
|               | SAP Build Work Zone, standard edition                | standard                  | Application   | 1                                 |


## Services Without Entitlements
The list shows services that don't require entitlements.

| Subaccount    |  Entitlement Name                                    | Service Plan (TDD)        | Type          | Quantity                          | 
| -----------   |  -------------------                                 | ---------                 | ---------     | ---------                         |
| Consumer      |                                                      |                           |               |                                   |
|               | Poetry Slam Manager                                  | default                   | Application   | 1 (partner application)           |
|               | Poetry Slam Service Broker                           | fullaccess                | Instance      | 1 (partner application)           |
|               | Poetry Slam Service Broker                           | readonlyaccess            | Instance      | 1 (partner application)           |

On top of the mentioned entitlements, the connectivity and security services are part of the consumer accounts of the solution.

## Modules
The application consists of the following modules, which are deployed into the SAP BTP Cloud Foundry runtime of the provider subaccount. 

- SAP Cloud Application Programming Model on Node.js (provided by SAP)
- SAPUI5 with SAP Fiori elements (provided by SAP)
- SAP Cloud SDK (provided by SAP)
- Application Router (provided by SAP)                                                          
- Multitenancy Extension Module (provided by SAP)                                                 
- Service Broker (provided by SAP)                                                   
- Partner Application Module (your main development task)                                                   

# Scaling
To get an overview of how the services scale and how many entitlements you require for an application, here's an example based on the projected use of the Partner Reference Application:

Let's assume a typical data volume of two poetry slams per week (or 125 slams per year), each poetry slam records 200 visits. After three years, if you assume that a visitor books on average two different poetry slams, for 20 subscriptions (customers), this results in a volume of:
 - 7,500 poetry slam events
 - 750,000 visitors and artists
 - 1,500,000 bookings

| Service Name                  | Service Plan (TDD)        | Quantity Required (5 Customers) | Quantity Required (20 Customers) | Quantity Required (100 Customers) | 
| -------------------           | ---------                 | ---------                       | ---------                        | ---------                         |
| SAP BTP Cloud Foundry runtime | standard                  | 3 GB                            | 6 GB                             | 20 GB                             |
| SAP HANA Cloud                | standard                  | 900 CU                          | 900 CU                           | 1000 CU                           |
| SAP Custom Domain service     | premium                   | 1 Domain                        | 1 Domain                         | 1 Domain                          |
| SAP Audit Log service         | hana-td                   | 1 GB Storage, 1 GB Writing​      | 1 GB Storage, 1 GB Writing​       | 1 GB Storage, 1 GB Writing        ​|
