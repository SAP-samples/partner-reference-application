# Enable Consumer-Specific Extensions
Imagine you're one of your customers, like Gourmet Pages, a renowned food magazine known for its exquisite taste and celebration of culinary arts. Besides publishing their magazine, Gourmet Pages hosts exclusive poetry slam events that blend the art of spoken word with gourmet food experiences. To manage the complexities of coordinating caterers with their poetry slam events, Gourmet Pages needs the Poetry Slam Manager application to be extended for their specific requirements. Based on the capire documentation [Extending SaaS Applications](https://cap.cloud.sap/docs/guides/extensibility/customization), you can extend the Partner Reference Application for a specific consumer while keeping the core application unchanged for others.

## Step-by-Step Guide to Enhance the Application 

To explore this feature with the Poetry Slam Manager, you have two options: 

1. Clone the repository of the Partner Reference Application. Check out the [*main-multi-tenant*](../../../tree/main-multi-tenant) branch and enhance the application step by step. 

2. Alternatively, check out the [*main-multi-tenant-features*](../../../tree/main-multi-tenant-features) branch where the feature is already included. 

The following describes how to enhance the **main-multi-tenant** branch (option 1).

### Application Enablement 

To enable tenant-specific extensions as a SaaS provider follow these steps. For more details, refer to capire documentation [Extending SaaS Applications → As a SaaS Provider](https://cap.cloud.sap/docs/guides/extensibility/customization#prep-as-provider).

1. Run the command `cds add extensibility`. This enhances the following files:
    - The extensibility flag is set to true in [package.json](../../../tree/main-multi-tenant-features/package.json).
    - An MTX route is added to the approuter in [app/router/xs-app.json](../../../tree/main-multi-tenant-features/app/router/xs-app.json). This ensures that tenant-specific information needed for the extensions is provided to the MTX module.
    - The [mta.yaml](../../../tree/main-multi-tenant-features/mta.yaml) is enhanced with a subscription URL.
2. Add restriction points to the [MTX sidecar package.json](../../../tree/main-multi-tenant-features/mtx/sidecar/package.json) to restrict which database and service entities can be extended. Besides this, it defines which annotations are allowed to be used for an extension.

    ```json
    {
        "cds": {
            "requires": {
                "cds.xt.ExtensibilityService": {
                    "element-prefix": [
                        "x_"
                    ],
                    "namespace-blocklist": [],
                    "extension-allowlist": [
                        {
                            "for": [
                                "sap.samples.poetryslams.PoetrySlams",
                                "PoetrySlamService.PoetrySlams"
                            ],
                            "kind": "entity",
                            "annotations": [
                                "@assert.integrity"
                            ]
                        },
                        {
                            "for": [
                                "sap.samples.poetryslams.Visitors"
                            ],
                            "kind": "entity"
                        },
                        {
                            "for": [
                                "PoetrySlamService"
                            ],
                            "kind": "service"
                        }
                    ]
                }
            }
        }
    }
    ```

3. Furthermore enhance the [MTX sidecar package.json](../../../tree/main-multi-tenant-features/mtx/sidecar/package.json) with the assert_integrity configuration as described in the capire documentation [Database Constraints](https://cap.cloud.sap/docs/guides/databases#database-constraints). This checks the integrity of the database schema. When set to "db", it ensures that the database schema matches the model definitions provided in the application.

    ```json
    {
        "cds": {
            "features": {
                "assert_integrity": "db"
            }
        }
    }
    ```

4. Add the following roles to the [xs-security.json](../../../tree/main-multi-tenant-features/xs-security.json) file:

    ```json
    {
        "scopes": [
            ...
            {
            "name": "$XSAPPNAME.cds.ExtensionDeveloper",
            "description": "Access to develop extensions for Poetry Slam Manager"
            }
        ],
        "attributes": [],
        "role-templates": [
            ...
            {
            "name": "PoetrySlamExtensionDeveloperRole",
            "description": "Access to develop extensions for Poetry Slam Manager",
            "scope-references": ["$XSAPPNAME.cds.ExtensionDeveloper"],
            "attribute-references": []
            }
        ],
        "role-collections": [
            ...
            {
            "name": "PoetrySlamExtensionDeveloperRoleCollection",
            "description": "Poetry Slam Manager Extension Developer",
            "role-template-references": ["$XSAPPNAME.PoetrySlamExtensionDeveloperRole"]
            }
        ],
        "authorities": ["$XSAPPNAME.cds.ExtensionDeveloper"],
        ...
    }
    ```

    > Note: The line `"authorities": ["$XSAPPNAME.cds.ExtensionDeveloper"],` allows you to request authorization tokens that include the `cds.ExtensionDeveloper` scope with the credentials (client ID and client secret) of the service binding of the SAP Authorization and Trust Management service (_XSUAA service_). This is necessary if you want to create extensions with technical users, such as from automated processes that cannot use single sign-on of named users. We will provide specific examples of how to use this soon. If you don't need this, you can omit this line.

### SAP BTP Configuration and Deployment
1. Run the command `npm install` in your project root folder to install the required npm modules. 

2. Build and deploy the application.
    > Note: For detailed instructions on deployment, refer to the section [Deploy the Multi-Tenant Application to a Provider Subaccount](./24-Multi-Tenancy-Deployment.md).

## Develop an Extension for a Customer
This tutorial discusses offering extension possibilities in the Partner Reference Application. The [partner-reference-application-extension repository](https://github.com/SAP-samples/partner-reference-application-extension) provides an example and guidance on how you, as an extension developer, can create extensions for specific customers.
