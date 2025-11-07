# Manage Data Privacy

Put yourself in the shoes of an administrator of a poetry slam management application. Imagine it's your job to handle all legal requirements that must be met to run the application, for example, handling data privacy requirements of the application.

Using the SAP Audit Log service of the SAP Cloud Application Programming Model, you ensure that your application is compliant to data privacy requirements. For more information, go to the SAP Cloud Application Programming Model documentation on [managing data privacy](https://cap.cloud.sap/docs/guides/data-privacy/).

## Bill of Materials

### Entitlements
In addition to the entitlements listed for the [multitenancy version](./20-Multi-Tenancy-BillOfMaterials.md), the list shows the entitlements that are required in the different subaccounts to add data privacy. 

| Subaccount    |  Entitlement Name                         | Service Plan          | Type          | Quantity                  | 
| ------------- |  ---------------------------------------- | -----------------     | ------------- | ------------------------- |
| Provider      |                                           |                       |               |                           |
|               | SAP Audit Log service                     | premium               | Service       | 1                         |
| Consumer      |                                           |                       |               |                           |
|               | SAP Audit Log Viewer service for SAP BTP  | default               | Application   | 1                         |

## Guide How to Enhance the Application Step by Step

To explore this feature with the Poetry Slam Manager, you have two options: 

1. Clone the repository of the Partner Reference Application. Check out the [*main-multi-tenant*](../../../tree/main-multi-tenant) branch and enhance the application step-by-step. 

2. Alternatively, check out the [*main-multi-tenant-features*](../../../tree/main-multi-tenant-features) branch where the feature is already included. 

The following section describes how to enhance the **main-multi-tenant** branch (option 1).

### Application Enablement 

1. First, decide which entities and which attributes contain sensitive or personal data. 
2. Create a new file *./srv/visitor/visitorServiceDataPrivacy.cds*.
3. Add annotations for data privacy and the SAP Audit Log service. Refer to the [visitorServiceDataPrivacy.cds](../../../tree/main-multi-tenant-features/srv/visitor/visitorServiceDataPrivacy.cds) file of the sample application: 
    - Sensitive attributes are annotated with `IsPotentiallySensitive`, 
    - Personal attributes are annotated with `IsPotentiallyPersonal`. 
    
    For example, here's the entity *visitor* of the *VisitorService* Service:

    ```cds
    using {VisitorService} from './visitorService';

    // -------------------------------------------------------------------------------
    // Annotations for data privacy of entity Visitors
    // -------------------------------------------------------------------------------
    annotate VisitorService.Visitors with @PersonalData: {
    // Entities describing a data subject (an identified or identifiable natural person), e.g. customer, vendor, employee. These entities are relevant for audit logging.
        EntitySemantics: 'DataSubject'
    } {
        ID         @PersonalData.FieldSemantics          : 'DataSubjectID';
        // Property contains potentially sensitive personal data; Read and write access is logged for IsPotentiallySensitive
        email      @PersonalData.IsPotentiallySensitive;
        name       @PersonalData.IsPotentiallyPersonal;
    };
    ```
    > Note: The data subsject role is not explicitly required. If it is not set like in the example, the entity name is used.

4. Copy the [poetrySlamServiceDataPrivacy.cds](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamServiceDataPrivacy.cds) file of the sample application to your project.

5. Enhance the file */srv/services.cds* with the reference to the Poetry Slam and the Visitor Service Data Privacy files:

    ```cds
    using from './poetryslam/poetrySlamServiceDataPrivacy';

    using from './visitor/visitorServiceDataPrivacy';
    ```

6. Open a terminal and run the command `npm add @cap-js/audit-logging`. As a result, a dependency to the latest version of the SAP Cloud Application Programming Model (CAP) audit-logging plug-in is added to the *package.json* of your project. 

    Refer to the [package.json](../../../tree/main-multi-tenant-features/package.json) file of the sample application.

7. Open the *./mta.yaml* file and add the audit log resource and the module dependencies to the service module. 

    Refer to the [mta file] (../../../tree/main-multi-tenant-features/mta.yaml) of the sample application.
    ```yaml
    modules:
    - name: poetry-slams-srv
      requires:
        - name: poetry-slams-auditlog
    
    - name: poetry-slams
      requires:
        - name: poetry-slams-auditlog

     # Audit Log Service 
     # For automatic audit logging
    - name: poetry-slams-auditlog
      type: org.cloudfoundry.managed-service
      parameters:
        service: auditlog
        service-plan: premium
    ```

### SAP BTP Configuration and Deployment

1. Open the SAP BTP cockpit of the provider subaccount and add the required entitlement:
    
     *SAP Audit Log Service* with the *premium* plan to write audit logs.

2. Run the command `npm install` in your project root folder to install the required npm modules for the application. 

3. Build and deploy the application. As a result, an SAP Audit Log service instance named *poetry-slams-auditlog* has been created.
    > Note: For detailed instructions on how to deploy, refer to [Deploy Your SAP BTP Multi-Tenant Application](./24-Multi-Tenancy-Deployment.md).

4. Open the SAP BTP cockpit of the consumer subaccount and add the required entitlement:
    *SAP Audit Log Viewer Service* with the *free (Application)* plan to view audit logs of this subaccount.

5. Open the menu item *Service Marketplace* and create an instance of *SAP Audit Log Viewer Service* with the *free* plan.
      
    > Note: A new application called SAP Audit Log Viewer Service has been added. The link to this application can be shared with customers, who can then view the audit logs or the application can be directly added to the customer-specific SAP Build Work Zone launchpad refering to *Add Audit Log Viewer Service to SAP Build Work Zone* below.
      
6. To enable customers to view logs, add authorizations:

    1. Open the *Role Collections* menu item and create a new role collection called `AuditLog`.
    2. Edit the role collection. 
    3. Add the *Auditlog_Auditor* roles for the Audit Log Management and Audit Log Viewer application.
    4. Add the *Poetry_Slam_Manager* user group of the previously configured [identity provider](25-Multi-Tenancy-Provisioning.md#configure-authentication-and-authorization).

#### Add Audit Log Viewer Service to SAP Build Work Zone

It is possible to also add the *Audit Log Viewer Service* application directly into the SAP Build Work Zone launchpad. This can be achieved by the following steps.

1. In the Business Application Studio, copy the [*cdm.json*](../../../tree/main-multi-tenant-features/workzone/cdm.json) file into the *./workzone* folder. This includes a *businessapp* schema for the *Audit Log Viewer Service* application as described in [About the Common Data Model - Business App Schema](https://help.sap.com/docs/build-work-zone-standard-edition/sap-build-work-zone-standard-edition-on-china-shanghai-region/creating-cdm-json-file-for-multi-tenancy-html5-app?locale=en-US) on SAP Help Portal. 

    ```json
    {
        "_version": "3.2",
        "identification": {
        "id": "auditlog",
        "title": "{{title}}",
        "entityType": "businessapp"
        },
        "payload": {
        "visualizations": {
            "auditlog-display": {
            "vizType": "sap.ushell.StaticAppLauncher",
            "vizConfig": {
                "sap.ui": {
                "icons": {
                    "icon": "sap-icon://commission-check"
                }
                },
                "sap.app": {
                "id": "auditlog",
                "info": "",
                "subTitle": "Review Audit Data"
                },
                "sap.flp": {
                "target": {
                    "type": "IBN",
                    "inboundId": "auditlog-display",
                    "parameters": {}
                }
                }
            }
            }
        },
        "targetAppConfig": {
            "sap.app": {
            "crossNavigation": {
                "inbounds": {
                "auditlog-display": {
                    "signature": {
                    "parameters": {},
                    "additionalParameters": "ignored"
                    },
                    "semanticObject": "auditlog",
                    "action": "display"
                }
                }
            },
            "destination": "audit-log-viewer-service"
            },
            "sap.integration": {
            "urlTemplateId": "urltemplate.url-dynamic",
            "urlTemplateParams": {
                "enableSapParams": false
            }
            }
        }
        },
        "texts": [
        {
            "locale": "",
            "textDictionary": {
            "title": "Audit Log Viewer"
            }
        },
        {
            "locale": "en",
            "textDictionary": {
            "title": "Audit Log Viewer"
            }
        },
        {
            "locale": "de",
            "textDictionary": {
            "title": "Audit Log Viewer"
            }
        }
        ]
    }
    ```

    - The *destination* under *sap.app* defines the respective destination for the application.
    - Under *sap.integration* a dynamic URL template must be provided which will be replaced with the *Audit Log Viewer Service* application URL at runtime and is taken from the defined *destination* for the *businessapp*. The destination must be configured in the consumer-specific subaccount which is mentioned in the next steps.
    - The parameter *"enableSapParams": false* disables the default set SAP parameter for URLs. 

2. Build and deploy the application. As a result, the *Audit Log Viewer* tile is visible in the SAP Build Work Zone launchpad.
    > Note: For detailed instructions on how to deploy, refer to [Deploy Your SAP BTP Multi-Tenant Application](./24-Multi-Tenancy-Deployment.md).

3. Define the *audit-log-viewer-service* destination for the *Audit Log Viewer Service* application in the consumer-specific subaccount.
    1. Open the SAP BTP cockpit of the consumer subaccount.
    2. Navigate to the *Destinations* view.
    3. Click on *Create* and on *From Scratch* to create a new destination.
    4. Enter *audit-log-viewer-service* as destination *name* and for the *URL* the *Audit Log Viewer Service* application URL.
    5. *Save* the destination.

4. Create an alias mapping refering to [Map App Aliases to Destinations](https://help.sap.com/docs/build-work-zone-standard-edition/sap-build-work-zone-standard-edition-on-china-shanghai-region/map-app-aliases-to-destinations?locale=en-US) on SAP Help Portal.
    1. Open the *SAP Build Work Zone, standard edition* application.
    2. In the Channel Manager, click *Map aliases* in the *Status* column of the *Poetry Slam Manager* content provider.
    3. In the *Alias Mapping* dialog box, select the *App Aliases* tab.
    4. Click on *Select aliases to map* and select the *audit-log-viewer-service* alias as defined in the *cdm.json* previously.
    5. For the next dropdown list, called *runtime destination*, select the *audit-log-viewer-service* destination as defined in the SAP BTP Cockpit under *Destinations* previously.
    6. *Save* it.

5. Go back to the *Site Directoy* and open the application. The SAP Build Work Zone launchpad of the deployed application opens.
6. Click on the *Audit Log Viewer* tile, the *Audit Log Viewer Service* application is opened in a new tab.

## A Guided Tour to Explore the Data Privacy Feature

Now, let us take you on a guided tour through the data privacy feature of Poetry Slam Manager: 

1. Open the SAP BTP cockpit of the customer subaccount.

    > Note: Use the subaccount to which you added the SAP Audit Log Viewer service.

2. Open the Poetry Slams application. 

3. To create sample data for mutable data, such as poetry slams, visitors, and visits, choose *Generate Sample Data*. As a result, a list with several poetry slams is shown.
    > Note: If you choose *Generate Sample Data* again, the sample data is set to the default values.
 
4. Navigate to the Visitors application by navigating to back and selecting the *Visitors and Artists* tile.

5. Open a visitor.

     > Note: As the *email* is annotated with *isPotentiallySensitive*, the read access will be logged.

6. Choose *Edit* and change the name of the visitor. Save your changes.

    > Note: As the *name* is annotated with *isPotentiallyPersonal*, the read and write access will be logged. The write access is logged when the draft gets activated.

7. Return to the SAP BTP cockpit and go to the SAP Audit Log Viewer service. 

8. In the SAP Audit Log Viewer service, change the *from-date* to yesterday and choose *Play* in the upper right corner. 

9. Enter your name in the filter to search for your own logs. 
    
    For example, when looking for data-modification events, you can find the log entry of *name* as you changed the visitor`s name. Additionally, you find an entry for the *email* and the *name* as you read visitor data in step 5.

    > Note: You can see logs of the categories: Security events refer to log-in and authentication events, data-access events refer to read access to personal data, and data-modification events refer to data changes. 
