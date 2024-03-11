# Bill of Materials
 In the full version of Poetry Slam Manager with multitenancy, SAP ERP integration, and additional features, the Partner Reference Application uses a number of subaccounts and entitlements. These subaccounts include a provider subaccount (to which the application is deployed) and consumer subaccounts (which hold customer-specific information and configuration). Find an overview in the section below.

## Subaccounts
The example setup serves four sample customers: 
-	*Andina Publications*: A well-established publishing house using SAP S/4HANA Cloud enterprise projects to run poetry slam events.
-	*OEC computers*: A company whose employees frequently come together for poetry slams with a great buffet and all-you-can-eat mousse au chocolat. 
-	*Almika Events Cleveland*: An event agency that plans events using SAP Business ByDesign as their ERP solution.
-	*Invictus Live Events*: A small poet startup without any ERP solution yet (but a promising ERP prospect if they stay on their exciting growth journey). 

To develop and run the application for these consumers, the following directory and subaccount structure is proposed.

| Directory Name                   | Subaccount Name                      | Usage                                                                                                       |
| --------------------             | --------------------                 | ----------------------------                                                                                |
| Development                      |                                      |                                                                                                             |
|                                  | Development                          | Business Application Studio                                                                                 |
| Partner Reference Application    |                                      |                                                                                                             |
|                                  | Provider: Poetry Slam Manager        | Application runtime, the database, other SAP BTP services used to run the application                       |
|                                  | Consumer 1: Andina Publications      | Subscription to customer Andina Publications connected to their SAP S/4HANA Cloud tenant          |
|                                  | Consumer 2: OEC Computers            | Subscription to customer OEC Computers connected to their SAP Business One system                 |
|                                  | Consumer 3: Almika Events Cleveland  | Subscription to customer Almika Events Cleveland connected to their SAP Business ByDesign tenant  |
|                                  | Consumer 4: Invictus Live Events     | Subscription to customer Invictus Live Events who uses the application as a  stand-alone solution                      |


## Entitlements
The list shows the entitlements that are required in the different subaccounts to develop and run the Poetry Slam Manager application with a multi-tenant deployment and additional features. The listed services refer to SAP BTP accounts for Test, Demo and Development (TDD). 

| Subaccount    |  Entitlement Name                                    | Service Plan (TDD)        | Type          | Quanity                           | 
| -----------   |  -------------------                                 | ---------                 | ---------     | ---------                         |
| Development   |                                                      |                           |               |                                   |
|               | SAP Business Application Studio                      | standard-edition          | Application   | 1 (per developer)                 |
| Provider      |                                                      |                           |               |                                   |
|               | Cloud Foundry runtime                                | standard                  | Environment   | 3 Units                           |
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


On top of the mentioned entitlements, the connectivity and security services of the consumer accounts are part of the solution.

## Modules
The application consists of the following modules, which are deployed into the Cloud Foundry runtime of the provider subaccount. 

- Application Router (provided by SAP)                                                          
- Multitenancy Extension Module (provided by SAP)                                                 
- Service Broker (provided by SAP)                                                   
- Partner Application Module (your main development task)                                                   
