# Test and Troubleshoot an ERP Integration

## Manual Test

You can manually test the application from SAP Business Application Studio. 

1. To edit the development credentials in the [*package.json*](../../../tree/main-multi-tenant/package.json) file, replace the placeholders such as `{{b1-hostname}}`, `{{test-user}}`, `{{test-password}}`, and so on with the information of your ERP test systems:
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

## Create Action
The *Create Project* button is dependent on the setup of the destinations. Once the destinations are correctly configured and the application is deployed to SAP BTP Cloud Foundry runtime, the button to create projects will be active. 

To test this button locally, edit a specific connector, for example, for SAP Business ByDesign [*connectorByD.js*](../../../tree/main-multi-tenant/srv/connector/connectorByD.js). In method _createConnectorInstance_, change the value of **connector.isConnectedIndicator** to **true** after the connector instance is created:

```javascript
const connector = new ConnectorS4HC(data);
connector.isConnectedIndicator = true;
```

> Note: Change this value because the *Indicator* value is dependent on the setup of destinations. Destinations only work on a deployed app and cannot be tested locally.

1. Open the web application and open one of the poetry slams. 
2. Choose *Create Project*. The system creates a project in the desired ERP and displays the details in the *Project Details* section. 
3. Click on the project link and the system opens a browser window with the project overview.

# Additional Information

The information above is specific to the ERP integration. Find additional hints in the tutorials [Test and Troubleshoot](16-Test-Trace-Debug.md) and [Test and Troubleshoot Multitenancy](26-Test-Trace-Debug-Multi-Tenancy.md).
