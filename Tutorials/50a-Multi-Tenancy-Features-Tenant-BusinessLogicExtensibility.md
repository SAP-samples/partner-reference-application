# Enable Business Logic Extensions

In addition to caterer coordination, Gourmet Pages requires further tasks in the created project within the SAP S/4HANA Cloud Public Edition. Therefore, a business logic extension in the Poetry Slam Manager application is necessary. This extension enables customers to enhance the logic for creating project tasks.

Based on the capire documentation [Extending SaaS Applications](https://cap.cloud.sap/docs/guides/extensibility/customization) and the [SAP Oyster SDK](https://www.npmjs.com/package/@sap/cds-oyster), you can extend the Partner Reference Application for a specific consumer while keeping the core application unchanged for others.

## Step-by-Step Guide to Enhance the Application 

To explore this feature with the Poetry Slam Manager, you have two options: 

1. Clone the repository of the Partner Reference Application. Check out the [*main-multi-tenant*](../../../tree/main-multi-tenant) branch and enhance the application step by step. 

2. Alternatively, check out the [*main-multi-tenant-features*](../../../tree/main-multi-tenant-features) branch where the feature is already included. 

The following describes how to enhance the **main-multi-tenant** branch (option 1).

### Application Enablement 

1. As you enhance the logic to create projects in SAP S/4HANA Cloud Public Edition, follow all the enablement steps of the [Integrate the SAP BTP Application with SAP S/4HANA Cloud Public Edition](34a-S4HC-Integration.md) and the [Configure the Integration with SAP S/4HANA Cloud Public Edition](34b-Multi-Tenancy-Provisioning-Connect-S4HC.md) chapters first.  

2. To enable tenant-specific extensions as a SaaS provider, follow the steps described in the previous chapter: [Enable Consumer-Specific Extensions](50-Multi-Tenancy-Features-Tenant-Extensibility.md).

3. Add the [SAP Oyster SDK](https://www.npmjs.com/package/@sap/cds-oyster) to extend the runtime. This addition provides the capability to execute tenant-specific custom code securely in a sandbox environment.

    1. Open a terminal. Ensure you're in the project's root folder.

    2. Run the command to add the SAP Oyster SDK npm package. 

        ```
        npm add @sap/cds-oyster
        ```
    
    3. Navigate to the `mtx/sidecar` folder.

        ```
        cd mtx/sidecar
        ```
    
    4. Run the command to add the SAP Oyster SDK npm package to the mtx sidecar. 

        ```
        npm add @sap/cds-oyster
        ```

        > Note: The *@sap/cds-oyster* package is an alpha release.

4. Enable code-extensibility in the application by enhancing the cds-requires-section of the [package.json](../../../tree/main-multi-tenant-features/package.json) file in the root directory of the project.

```json
    "code-extensibility":  {
        "runtime": "oyster",
        "maxTime": 1000,
        "maxMemory": 4
    }​
```

> Note: The *maxTime* property specifies the maximum execution time, in milliseconds, allowed for the extension's code. The *maxMemory* property sets the maximum memory, in megabytes, that the extension can utilize.

5. Configure code-extensibility and allow extensions for CRUD, function and action by enhancing the cds-requires-section in the [package.json](../../../tree/main-multi-tenant-features/mtx/sidecar/package.json) file of the mtx sidecar.

```json
    "cds.xt.ExtensibilityService": {
        "element-prefix": [
            "x_"
        ],
        "namespace-blocklist": [],
        "extension-allowlist": [
        {
            "for": [
                "*"
            ],
            "kind": "entity",
            "annotations": [
                "*"
            ],
            "code": [
                "CREATE",
                "READ",
                "UPDATE",
                "DELETE",
                "action",
                "function"
            ]
        },
        {
            "for": [
                "sap.samples.poetryslams.Visitors"
            ],
            "kind": "entity",
            "code": [
                "CREATE",
                "READ",
                "UPDATE",
                "DELETE",
                "action",
                "function"
            ]
        },
        {
            "for": [
                "PoetrySlamService"
            ],
            "kind": "service",
            "code": [
                "CREATE",
                "READ",
                "UPDATE",
                "DELETE",
                "action",
                "function"
            ]
        }
        ]
    }
```

6. Extend the [Poetry Slam service](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamService.cds) with a function used for business logic extensibility.

    1. Define data types for the project data that is set as parameter for the function.

        ```cds
        type s4HCProjectDataElements {
            ProjectElement            : String(24);
            ProjectElementDescription : String(60);
            PlannedStartDate          : String(20);
            PlannedEndDate            : String(20);
        };

        type s4HCProjectData {
            Project                     : PoetrySlamService.S4HCProjects:project;
            ProjectDescription          : PoetrySlamService.S4HCProjects:projectDescription;
            ProjectStartDate            : String(20);
            ProjectEndDate              : String(20);
            EntProjectIsConfidential    : Boolean;
            ResponsibleCostCenter       : PoetrySlamService.S4HCProjects:responsibleCostCenter;
            ProfitCenter                : String(10);
            ProjectProfileCode          : PoetrySlamService.S4HCProjects:projectProfileCode;
            ProjectCurrency             : String(5);
            to_EnterpriseProjectElement : array of s4HCProjectDataElements;
        };
        ```

    2. Add a new function called `extendProjectData`. This function can be implemented in a customer-specific extension with business logic to enhance the project data.

        ```cds
        // -------------------------------------------------------------------------------
        // Extend service PoetrySlamService with extension points for business logic extensibility:
        // Function to extend the project data
        extend service PoetrySlamService with {
            function extendProjectData(ProjectID: s4HCProjectData) returns s4HCProjectData;
        }
        ```

7. Enhance the `getRemoteProjectData` method of the [*connectorS4HC.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/connector/connectorS4HC.js) to call the extension point for the business logic extensibility. The `extendProjectData` extension point takes the project record as parameter. A customer-specific extension can enhance the project data with business logic and returns the enhanced project record. The Poetry Slam Manager then uses the enhanced project record to create the project in SAP S/4HANA Cloud Public Edition.

    ```javascript
    try {
      // Call extension point for business logic extensibility
      let projectData = await cds.services.PoetrySlamService.extendProjectData(
        this.projectRecord
      );
      if (projectData) {
        this.projectRecord = projectData;
      }
    } catch (e) {
      // Move on with application although there is an issue with business logic
      console.error(
        `Action getRemoteProjectData: Error while processing business logic extensibility: ${e.message}`
      );
    }
    ```

### SAP BTP Configuration and Deployment
1. Run the command in your project root folder to install the required npm modules. 

    ```
    npm install 
    ```

2. Build and deploy the application.
    > Note: For detailed instructions on deployment, refer to [Deploy Your SAP BTP Multi-Tenant Application](./24-Multi-Tenancy-Deployment.md).

## Develop a Business Logic Extension for a Customer
This tutorial covers extension possibilities in the Partner Reference Application. The [partner-reference-application-extension](https://github.com/SAP-samples/partner-reference-application-extension) repository provides examples and guidance on creating extensions for specific customers.
