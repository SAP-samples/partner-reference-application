# Bill of Materials
In the full version of Poetry Slam Manager with multitenancy, SAP ERP integration, and additional features, the Partner Reference Application uses a number of subaccounts and entitlements on top of the [multitenancy version](./20-Multi-Tenancy-BillOfMaterials.md).

## Subaccounts
The same subaccounts are proposed as in the [multitenancy version](./20-Multi-Tenancy-BillOfMaterials.md).

## Entitlements
In addition to the entitlements listed for the [multitenancy version](./20-Multi-Tenancy-BillOfMaterials.md), the list shows the *additional* entitlements that are required in the different subaccounts to develop and run Poetry Slam Manager application with a multi-tenant deployment and additional features. 

Check if the SAP BTP Cloud Foundry runtime entitlement includes 4 units to account for the additional runtime required for the service broker module.

| Subaccount    |  Entitlement Name                         | Service Plan      | Type          | Quantity                  | 
| ------------- |  ---------------------------------------- | ----------------- | ------------- | ------------------------- |
| Provider      |                                           |                   |               |                           |
|               | SAP Audit Log service                     | premium           | Service       | 1                         |
|               | SAP Cloud Logging                         | standard          | Service       | 1                         |
| Consumer      |                                           |                   |               |                           |
|               | SAP Audit Log Viewer service for SAP BTP  | default           | Application   | 1                         |


## Services Without Entitlements
The list shows services that don't require entitlements.

| Subaccount    |  Entitlement Name                         | Service Plan      | Type          | Quantity                  | 
| ------------- |  ---------------------------------------- | ----------------- | ------------- | ------------------------- |
| Consumer      |                                           |                   |               |                           |
|               | Poetry Slam Service Broker                | fullaccess        | Instance      | 1 (partner application)   |
|               | Poetry Slam Service Broker                | readonlyaccess    | Instance      | 1 (partner application)   |

## Modules
The application with all features comes with the following modules, which are deployed into the SAP BTP Cloud Foundry runtime of the provider subaccount. 

Provided by SAP:         
- Service Broker                                                
                                              
Now that you're familiar with the bill of materials, in the [next section](41-Manage-Data-Privacy.md), you enhance the application with the data privacy feature. 
