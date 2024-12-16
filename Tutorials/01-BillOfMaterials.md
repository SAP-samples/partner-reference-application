# Bill of Materials
In the full version of Poetry Slam Manager with multitenancy, SAP ERP integration, and additional features, the Partner Reference Application uses several subaccounts and entitlements. These subaccounts include a provider subaccount, where the application is deployed, and consumer subaccounts that contain customer-specific information and configuration. An overview is provided in the section below.

## Subaccounts
The example setup serves four sample customers: 
-	*Andina Publications*: A well-established publishing house using SAP S/4HANA Cloud enterprise projects to run poetry slam events.
-	*OEC computers*: A company whose employees frequently come together for poetry slams with a great buffet and all-you-can-eat mousse au chocolat. 
-	*Almika Events Cleveland*: An event agency that plans events using SAP Business ByDesign as their ERP solution.
-	*Invictus Live Events*: A small poet startup without any ERP solution yet (but a promising ERP prospect if they stay on their exciting growth journey). 

<p align="center">
    <img src="./images/01_sample_landscape.png" width="100%">
</p>

To develop and run the application for these consumers, the following directory and subaccount structure is proposed.

| Directory Name                   | Subaccount Name                      | Usage                                                                                             |
| --------------------             | --------------------                 | ----------------------------                                                                      |
| Development                      |                                      |                                                                                                   |
|                                  | Development                          | SAP Business Application Studio                                                                   |
| Partner Reference Application    |                                      |                                                                                                   |
|                                  | Provider: Poetry Slam Manager        | Application runtime, the database, other SAP BTP services used to run the application             |
|                                  | Consumer 1: Andina Publications      | Subscription to customer Andina Publications connected to their SAP S/4HANA Cloud tenant          |
|                                  | Consumer 2: OEC Computers            | Subscription to customer OEC Computers connected to their SAP Business One system                 |
|                                  | Consumer 3: Almika Events Cleveland  | Subscription to customer Almika Events Cleveland connected to their SAP Business ByDesign tenant  |
|                                  | Consumer 4: Invictus Live Events     | Subscription to customer Invictus Live Events who uses the application as a stand-alone solution  |


## Entitlements
The list shows the entitlements that are required in the different subaccounts to develop and run the Poetry Slam Manager application with a multi-tenant deployment and additional features. You can get more information about the used services in the [SAP Discovery Center](https://discovery-center.cloud.sap/protected/index.html#/viewServices). 

| Subaccount    |  Entitlement Name                                    | Service Plan              | Type          | Quantity                          | 
| -----------   |  -------------------                                 | ---------                 | ---------     | ---------                         |
| Development   |                                                      |                           |               |                                   |
|               | SAP Business Application Studio                      | standard-edition          | Application   | 1 (per developer)                 |
| Provider      |                                                      |                           |               |                                   |
|               | SAP BTP Cloud Foundry runtime                        | standard                  | Environment   | 4 units                           |
|               | SAP Custom Domain service                            | standard                  | Application   | 1                                 |
|               | SAP Audit Log service                                | premium                   | Service       | 1                                 |
|               | SAP Authorization and Trust Management service       | broker                    | Service       | 1                                 | 
|               | SAP Destination service                              | lite                      | Service       | 1                                 | 
|               | SAP HTML5 Application Repository service for SAP BTP | app-host                  | Service       | 1                                 | 
|               | SAP HTML5 Application Repository service for SAP BTP | app-runtime               | Service       | 1                                 | 
|               | SAP Software-as-a-Service Provisioning service       | application               | Service       | 1                                 | 
|               | SAP HANA Cloud                                       | hana-td                   | Service       | 1                                 | 
|               | SAP HANA Cloud                                       | tools                     | Application   | 1                                 | 
|               | SAP HANA Schemas & HDI Containers                    | hdi-shared                | Service       | 1                                 | 
|               | SAP Service Manager service                          | container                 | Service       | 1                                 | 
|               | SAP Cloud Logging service                            | standard                  | Service       | 1                                 | 
|               | SAP Forms service by Adobe                           | default (Application)     | Application   | 1                                 | 
|               | SAP Forms service by Adobe API                       | standard                  | Service       | 1                                 | 
|               | SAP Print service                                    | sender                    | Service       | 1                                 | 
|               | SAP AI Core                                          | extended                  | Service       | 1                                 | 
| Consumer      |                                                      |                           |               |                                   |
|               | SAP Audit Log Viewer service for SAP BTP             | default                   | Application   | 1                                 |
|               | SAP Print service                                    | standard                  | Application   | 1                                 | 
|               | SAP Print service                                    | receiver                  | Service       | 1                                 | 
|               | (optional) SAP Build Work Zone, standard edition     | standard                  | Application   | 1                                 |


## Services Without Entitlements
The list shows services that don't require entitlements.

| Subaccount    |  Entitlement Name                                    | Service Plan              | Type          | Quantity                          | 
| -----------   |  -------------------                                 | ---------                 | ---------     | ---------                         |
| Consumer      |                                                      |                           |               |                                   |
|               | Poetry Slam Manager                                  | default                   | Application   | 1 (partner application)           |
|               | Poetry Slam Service Broker                           | fullaccess                | Instance      | 1 (partner application)           |
|               | Poetry Slam Service Broker                           | readonlyaccess            | Instance      | 1 (partner application)           |

On top of the mentioned entitlements, the connectivity and security services are part of the consumer accounts of the solution.

## Modules

### Running in Cloud Foundry
The application consists of the following modules which are deployed into the SAP BTP Cloud Foundry runtime of the provider subaccount. 

Provided by SAP:
- Application Router                                                           
- Multitenancy Extension Module                                                  
- Service Broker     

Your main development task:                                            
- Partner Application Module  

### Node Modules
Some open-source node modules offered by SAP are used to build the solution. 

Provided by SAP:
- SAP Cloud Application Programming Model on Node.js 
- SAPUI5 with SAP Fiori elements 
- SAP Cloud SDK 

## Applications
SAP offers several applications to build the solution. These applications need to be downloaded and installed on the local machine.

Provided by SAP:
- Adobe LiveCycle Designer                                                 

# Scaling
To get an overview of how the services scale and how many entitlements you require for an application, here's an example based on the projected use of the Partner Reference Application.

Let's assume a typical data volume of two poetry slams per week (or 125 slams per year), with 200 visits per event. After three years, if you assume that one visitor books on average two different poetry slams, for 20 subscriptions (customers), this results in a volume of:
 - 7,500 poetry slam events
 - 750,000 visitors and artists
 - 1,500,000 bookings

> Note: The required quantities of most services are calculated based on memory, storage, or usage counts. The SAP HANA Cloud database is based on capacity units (CU), which consider several factors like memory, CPUs, and storage. You can use the [SAP HANA Cloud Capacity Unit Estimator](https://hcsizingestimator.cfapps.eu10.hana.ondemand.com/) to calculate the capacity units required. The chapter [Estimating the Required Size of the SAP HANA Cloud Database](./27-Hana-DB-Scaling.md) explains how to calculate the required CUs based on the above business volume. However, this requires measurements in a deployed and running (test) version of the application.

The table below shows how the required quantities scale with typical numbers of customers. The scaling is less than linear which is the benefit of resource sharing in multi-tenant application. This means the costs per customer significantly decrease the more customers you serve.

| Service Name                    | Service Plan              | 5 Customers                     | 20 Customers                     | 100 Customers                     | 
| -------------------             | ---------                 | ---------                       | ---------                        | ---------                         |
| SAP BTP Cloud Foundry runtime   | standard                  | 3 GB                            | 6 GB                             | 20 GB                             |
| SAP HANA Cloud                  | hana-td                   | 900 CU                          | 900 CU                           | 1000 CU                           |
| SAP Custom Domain service       | standard                  | 1 Domain                        | 1 Domain                         | 1 Domain                          |
| SAP Audit Log service           | premium                   | 1 GB Storage, 1 GB Writing​      | 1 GB Storage, 1 GB Writing​       | 1 GB Storage, 1 GB Writing        ​|
| SAP Cloud Logging service       | standard                  | 538 CU                          | 538 CU                           | 538 CU                            |
| SAP AI Core service             | extended                  | 1 CU                            | 1 CU                             | 1 CU                              |
| SAP Business Application Studio | standard-edition          | 2 User                          | 2 User                           | 2 User                            |

# Information on Versions and What's New

The SAP Help page ["What's New for SAP Business Technology Platform"](https://help.sap.com/whats-new/cf0cb2cb149647329b5d02aa96303f56?clear=all&locale=en-US) allows you to subscribe for updates. 
