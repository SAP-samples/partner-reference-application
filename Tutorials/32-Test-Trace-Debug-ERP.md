# Test and Troubleshoot an ERP Integration

## Manual Test

You can manually test the application from SAP Business Application Studio. 

1. To edit the development credentials in the [*package.json*](../../../tree/main-multi-tenant/package.json) file, replace the placeholders such as `{{b1-hostname}}`, `{{test-user}}`, `{{test-password}}`, and so on with the information of your ERP test system:

    ```json
    "cds": {
        "requires": {
            "b1_sbs_v2": {
                "kind": "odata",
                "model": "srv/external/b1_sbs_v2",
                "csrf": true,
                "csrfInBatch": true,
                "[development]": {
                    "credentials": {
                        "url": "https://{{b1-hostname}}/b1s/v2",
                        "authentication": "BasicAuthentication",
                        "username": "{{test-user}}",
                        "password": "{{test-password}}"
                    }
                },
                "[production]": {
                    "credentials": {
                        "destination": "b1",
                        "path": "/b1s/v2"
                    }
                }
            }
        }
    }
    ```

2. Run the command `cds watch --profile development` on the command line interface. This will start the web application with the above development configuration.

## ERP Connection
There are some points to consider in regards of the connection to the ERP system. In case of issues, the following sections may help.

### Create Action
The *Create Project* buttons are dependent on the setup of the destinations. Once the destinations are correctly configured and the application is deployed to SAP BTP Cloud Foundry runtime, the button to create projects will be active. 

To test this button locally, edit a specific connector, for example, for SAP Business ByDesign [*connectorS4HC.js*](../../../tree/main-multi-tenant/srv/poetryslam/connector/connectorS4HC.js). In method _createConnectorInstance_, change the value of **connector.isConnectedIndicator** to **true** after the connector instance is created:

```javascript
const connector = new ConnectorS4HC(data);
connector.isConnectedIndicator = true;
```

> Note: Change this value because the *Indicator* value is dependent on the setup of destinations. Destinations only work on a deployed app and cannot be tested locally.

1. Open the web application and open one of the poetry slams. 
2. Choose *Create Project*. The system creates a project in the desired ERP and displays the details in the *Project Details* section. 
3. Click on the project link and the system opens a browser window with the project overview.

> Note: The same behaviour is for the SAP Business One destination and the *Create Purchase Order* button.

### Object Creation
In case, the project or purchase order cannot be created in the ERP system, check the hard-coded business data in the connector classes with the configuration in the connected customer system. Therefore, search for the block comment *needs to be adopted* in the corresponding connector class.

- [*/srv/poetryslam/connector/connectorS4HC.js*](../../../tree/main-multi-tenant/srv/poetryslam/connector/connectorS4HC.js)
- [*/srv/poetryslam/connector/connectorB1.js*](../../../tree/main-multi-tenant/srv/poetryslam/connector/connectorB1.js)
- [*/srv/poetryslam/connector/connectorByD.js*](../../../tree/main-multi-tenant/srv/poetryslam/connector/connectorByD.js)


# Additional Information

The information above is specific to the ERP integration. Find additional hints in the tutorials [Test and Troubleshoot](16-Test-Trace-Debug.md) and [Test and Troubleshoot Multitenancy](26-Test-Trace-Debug-Multi-Tenancy.md).
