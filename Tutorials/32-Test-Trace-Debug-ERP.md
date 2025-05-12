# Test and Troubleshoot an ERP Integration

To test and troubleshoot the ERP Integration of your application, it's beneficial to test the functionality before deploying it. You can test the application in a completely local setup or use the destinations and services in your SAP BTP subaccount to connect to the systems while your application runs locally. A local setup involves running the application within the SAP Business Application Studio, for example, using `cds watch`, without needing to deploy it.

## Local Test

The goal of local tests is to connect to integrated ERP systems without using destinations. Therefore, you need to adjust the code slightly, as shown below:

1. To edit the development credentials in the [*package.json*](../../../tree/main-multi-tenant-features/package.json) file, replace the placeholders such as `{{b1-hostname}}`, `{{test-user}}`, `{{test-password}}`, and so on with the information of your ERP test system:

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

2. The *Create Project* or *Create Purchase Order* buttons depend on the setup of the destinations. Once you configure the destinations correctly and deploy the application to the SAP BTP Cloud Foundry runtime, the button for creating projects becomes active.

    To test this button locally, edit the ERP-specific connector, for example, for SAP S/4HANA Cloud [*connectorS4HC.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/connector/connectorS4HC.js). In method _createConnectorInstance_, change the value of **connector.isConnectedIndicator** to **true** after the connector instance is created:

    ```javascript
    const connector = new ConnectorS4HC(data);
    connector.isConnectedIndicator = true;
    ```

3. Run the command `cds watch --profile development` on the command line interface. This starts the web application with the above development configuration.


## Hybrid Test

In addition to testing the application in a strictly local setup, you can use a *hybrid setup*. In a hybrid setup, the application runs locally (in SAP Business Application Studio) but uses features provided by SAP BTP, such as destination definitions and Cloud Foundry services. This setup behaves more like a productive setup while still offering the flexibility and simplicity of a locally run application. However, testing your application in a hybrid setup requires some configuration in your SAP BTP subaccount and your development environment in SAP Business Application Studio.

### Setup in the Development SAP BTP Subaccount

1. Create or copy existing destinations used for your ERP integration into your SAP BTP subaccount used for development.

2. For development purposes, use a simple authentication type for the destination, like *Basic Authentication*.

3. Set up a [Cloud Connector](https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/cloud-connector) that is used to connect to the on-premise destinations.

4. Enable the Cloud Foundry environment:

    1. Open the *Overview* in your SAP BTP subaccount for development.

    2. Choose *Enable Cloud Foundry*.

    3. In the enablement dialog, choose the following attributes:
        - Environment: *Cloud Foundry Runtime* (Selected by default and cannot be changed)
        - Plan: *standard*
        - Landscape: *cf-eu10*
        - Instance Name: *for example <username>*
        - Org Name: *dev*

    4. Choose *Create*.

5. Check the entitlements of the subaccount for the *SAP Destination Service* and for the *SAP Connectivity Service*. In case they are missing, you need to add them.

> Note: You do not have to assign any quota/memory to this Cloud Foundry environment.

### Setup in the SAP Business Application Studio

1. Open your local project in your SAP Business Application Studio instance.

2. Login to your Cloud Foundry space in your development SAP BTP subaccount by using `cf login`.

3. Set up your local application to connect to the destinations configured in your SAP BTP subaccount:

    - **Cloud Destinations**:
        1. Create a service instance and a service key of the SAP Destination service:

            ```cf create-service destination lite <service-name>```  
            ```cf create-service-key <service-name> <key-name>```

        2. Bind the SAP Destination service to your local application:

            ```cds bind -2 <service-name>:<key-name>```

    - **On-premise Destinations**:

        1. Create a service instance and a service key of the SAP Destination service:  

            ```cf create-service destination lite <service-name>```  
            ```cf create-service-key <service-name> <key-name>```

        2. Bind the SAP Destination service to your local application:

            ```cds bind -2 <service-name>:<key-name>```

        3. Create a service instance and a service key of the SAP Connectivity service:
        
            ```cf create-service connectivity lite <service-name>```  
            ```cf create-service-key <service-name> <key-name>```

        4. Bind the SAP Connectivity service to your local application with an additional configuration to use the HTTP-Proxy of the SAP Business Application Studio instead of the default HTTP-Proxy (CAP documentation: [Hybrid Testing > Overwrite Cloud Service Credentials](https://cap.cloud.sap/docs/advanced/hybrid-testing#overwriting-service-credentials)):

            ```cds bind -2 <service-name>:<key-name> --credentials '{ "onpremise_proxy_host": "127.0.0.1", "onpremise_proxy_http_port": "8887" }'```  
    
            The command ```cds bind``` automatically creates the file *cdsrc-private.json* if it does not already exist. In the file, the local bindings of the services are created in the *hybrid* profile per default. An example of a *cdsrc-private.json* can look like this:

            ```json
            {
                "requires": {
                    "[hybrid]": {
                        "destinations": {
                            "binding": {
                                "type": "cf",
                                "apiEndpoint": "<your api endpoint>",
                                "org": "<your org>",
                                "space": "<your space>",
                                "instance": "poetry-slams-destination",
                                "key": "poetry-slams-destination-key",
                                "resolved": false
                            },
                            "kind": "destinations",
                            "vcap": {
                                "name": "destinations"
                            }
                        },
                        "connectivity": {
                            "binding": {
                                "type": "cf",
                                "apiEndpoint": "<your api endpoint>",
                                "org": "<your org>",
                                "space": "<your space>",
                                "instance": "poetry-slams-connectivity",
                                "key": "poetry-slams-connectivity-key",
                                "resolved": false,
                                "credentials": {
                                    "onpremise_proxy_host": "127.0.0.1",
                                    "onpremise_proxy_http_port":"8887"
                                }
                            },
                            "kind": "connectivity",
                            "vcap": {
                                "name": "connectivity"
                            }
                        }
                    }
                }
            }
            ```

4. Set up *hybrid*-mode in your local application:

    - Usage of credentials of the remote services in your cds configuration (Example: Remote service to SAP Business One in the [*package.json*](../../../tree/main-multi-tenant-features/package.json) file):

        ```json
        "requires": {
            "cds": {
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
                    "[hybrid]": {
                        "credentials": {
                            "destination": "b1",
                            "path": "/b1s/v2"
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

    - Change the default behavior of services, in case they do not need to be tested in *hybrid*-mode (Example: SAP Audit Log service):
          
        Per default, the SAP Audit Log service is configured to be of kind *"audit-log-to-restv2"* in a *hybrid* setup (See [CAP Audit Logging Guide](https://cap.cloud.sap/docs/guides/data-privacy/audit-logging#setup)). To overwrite this configuration, you can set the following attribute in your cds configuration:

        ```json
        "requires": {
            "cds": {
                "[hybrid]": {
                    "audit-log": {
                        "kind": "audit-log-to-console"
                    }
                }
            }
        }
        ```

5. Start your local application in *hybrid*-mode:
    
    ```cds watch --profile hybrid```

# Additional Information

The information above is specific to the ERP integration. Find additional hints in the tutorials [Test and Troubleshoot](16-Test-Trace-Debug.md) and [Test and Troubleshoot Multitenancy](26-Test-Trace-Debug-Multi-Tenancy.md).

For more information about hybrid testing, check out the chapter [Hybrid Testing](https://cap.cloud.sap/docs/advanced/hybrid-testing) in the official CAP documentation.
