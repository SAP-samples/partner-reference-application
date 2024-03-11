# Test, Trace, and Debug the ERP Integration

When developing a productive application, quality assurance and the detection of issues are essential.

To keep things simple, here's a high-level summary of what it's all about: 

## Manual Test

You can manually test the application on your local machine. 

1. Edit the development credentials in the file *package.json*:

    ```json
    "byd_khproject": {
        "kind": "odata-v2",
        "model": "srv/external/byd_khproject",
        "[development]": {
            "credentials": {
                "url": "https://{{byd-hostname}}/sap/byd/odata/cust/v1/khproject/",
                "authentication": "BasicAuthentication",
                "username": "{{user}}",
                "password": "{{password}}"
            }
        }
    },
    "byd_khproject_tech_user": {
        "kind": "odata-v2",
        "model": "srv/external/byd_khproject_tech_user",
        "[development]": {
            "credentials": {
                "url": "https://{{byd-hostname}}/sap/byd/odata/cust/v1/khproject/",
                "authentication": "BasicAuthentication",
                "username": "{{user}}",
                "password": "{{password}}"
            }
        }
    },
    ```

2. Run the command `cds watch` or `cds watch profile --development` on the command line interface. This will start a Node.js server including the web application.

## Create Action
The *Create Project* button is dependent on the setup of the destinations. Once the destinations are correctly configured and the app is deployed to SAP BTP Cloud Foundry runtime, the button will be active. 

To test the button locally, make sure that the visibility of the button is independent from the destination in [*poetrySlamManagerServiceImplementation.js*](../../../tree/main-multi-tenant/srv/poetrySlamManagerServiceImplementation.js).

Change the *IsConnectedIndicator* value of the ERP system you want to test to *true*, for example, by adding the following line before the return statement in the *on-READ* event of the *PoetrySlams* entity: **ByDIsConnectedIndicator = true;**

> Note: Change this value because the *Indicator* value is dependent on the setup of destinations. Destinations only work on a deployed app and cannot be tested locally.

1. Open the [*/poetryslammanager/webapp/index.html*](../../../tree/main-multi-tenant/app/poetryslammanager/webapp/index.html) web application. 
2. Open one of the poetry slams. 
3. Choose *Create Project*. 
4. The system creates a project in the desired ERP and displays the details in the *Project Details* section. 
5. Click on the project link and the system opens a browser window with the project overview.

## Trace and Debug

See the section [Test, Trace, Debug the Core Application](./16-Test-Trace-Debug.md).
