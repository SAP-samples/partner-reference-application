# Bill of Materials
In the one-off version of Poetry Slam Manager, the Partner Reference Application uses two subaccounts and several entitlements. One subaccount is recommended for the development of the application and the other to run the application for a customer. Find an overview in the section below.

## Subaccounts
The example setup serves one consumer.

To develop and run the application for these consumers, the following directory and subaccount structure are proposed.

| Directory Name                   | Subaccount Name                      | Usage                                                                                                       |
| --------------------             | --------------------                 | ----------------------------                                                                                |
| Development                      |                                      |                                                                                                             |
|                                  | Development                          | SAP Business Application Studio                                                                                 |
| Partner Reference Application    |                                      |                                                                                                             |
|                                  | One-Off: Poetry Slam Manager         | Application runtime, the database, other SAP BTP services used to run the application                       |

## Entitlements
The list shows the entitlements that are required in the subaccounts to develop and run the Poetry Slam Manager application as a one-off deployment.

| Subaccount    |  Entitlement Name                                    | Service Plan              | Type          | Quantity                          | 
| -----------   |  -------------------                                 | ---------                 | ---------     | ---------                         |
| Development   |                                                      |                           |               |                                   |
|               | SAP Business Application Studio                      | standard-edition          | Application   | 1 (per developer)                 |
| One-Off       |                                                      |                           |               |                                   |
|               | SAP BTP Cloud Foundry runtime                        | standard                  | Environment   | 3 units                           |
|               | SAP Authorization and Trust Management service       | broker                    | Service       | 1                                 | 
|               | SAP Destination service                              | lite                      | Service       | 1                                 | 
|               | SAP HTML5 Application Repository service for SAP BTP | app-host                  | Service       | 1                                 | 
|               | SAP HTML5 Application Repository service for SAP BTP | app-runtime               | Service       | 1                                 | 
|               | SAP HANA Cloud                                       | hana-td                   | Service       | 1                                 | 
|               | SAP HANA Schemas & HDI Containers                    | hdi-shared                | Service       | 1                                 | 
|               | SAP Build Work Zone, standard edition                | standard                  | Application   | 1                                 |


On top of the mentioned entitlements, the connectivity and security services of the consumer account are part of the solution.

Before you move on with the next section, ensure that the required service assignments are available in your global account.

> Note: Contact SAP if there aren't enough service entitlements available in your global account.

## Modules
The application consists of the following modules, which are deployed into the SAP BTP Cloud Foundry runtime of the provider subaccount. 

Provided by SAP:
- SAP Cloud Application Programming Model on Node.js 
- SAPUI5 with SAP Fiori elements 
- SAP Cloud SDK           

Your main development task:  
- Partner Application Module 

Now that you're familiar with the bill of materials, in the [next section](11-Prepare-BTP-Account.md), you prepare your development subaccount to start developing your application. 
