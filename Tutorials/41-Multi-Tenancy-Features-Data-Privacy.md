# Manage Data Privacy

Put yourself in the shoes of an administrator of a poetry slam management application. Imagine it's your job to handle all legal requirements that must be met to run the application, for example, handling data privacy requirements of the application.

Using the SAP Audit Log service of the SAP Cloud Application Programming Model, you ensure that your application is compliant to data privacy requirements. For more information, go to the [SAP Cloud Application Programming Model documentation on managing data privacy](https://cap.cloud.sap/docs/guides/data-privacy/).

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
2. Create a new file *./srv/poetrySlam/poetrySlamServiceDataPrivacy.cds*.
3. Add annotations for data privacy and the SAP Audit Log service. Refer to the file [poetrySlamServiceDataPrivacy.cds](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamServiceDataPrivacy.cds) of the sample application: 
    - Sensitive attributes are annotated with `IsPotentiallySensitive`, 
    - Personal attributes are annotated with `IsPotentiallyPersonal`. 
    
    For example, here's the entity *visitor* of the *PoetrySlams* Service:

    ```cds
    annotate PoetrySlamService.Visitors with @PersonalData: {
        // Role of the data subjects in this set
        DataSubjectRole: 'Visitors',
        // Entities describing a data subject (an identified or identifiable natural person), e.g. customer, vendor, employee. These entities are relevant for audit logging.
        EntitySemantics: 'DataSubject'
    } {
        ID     @PersonalData.FieldSemantics                 : 'DataSubjectID';
        visits @PersonalData.FieldSemantics                 : 'DataSubjectID';
        // Property contains potentially sensitive personal data; Read and write access is logged for IsPotentiallySensitive
        email  @PersonalData.IsPotentiallySensitive;
    };
    ```

4. Copy the file [visitorServiceDataPrivacy.cds](../../../tree/main-multi-tenant-features/srv/visitor/visitorServiceDataPrivacy.cds) of the sample application to your project.

5. Enhance the file */srv/services.cds* with the reference to the Poetry Slam and the Visitor Service Data Privacy files:

    ```cds
    using from './poetryslam/poetrySlamServiceDataPrivacy';

    using from './visitor/visitorServiceDataPrivacy';
    ```

6. Open a terminal and run the command `npm add @cap-js/audit-logging`. As a result, a dependency to the latest version of the SAP Cloud Application Programming Model (CAP) audit-logging plug-in is added to the *package.json* of your project. 

    Refer to the file [package.json](../../../tree/main-multi-tenant-features/package.json) of the sample application.

7. Open the *./mta.yaml* file and add the audit log resource and the module dependencies to the service module. 

    Refer to the [mta file of the sample application](../../../tree/main-multi-tenant-features/mta.yaml).
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
    > Note: For detailed instructions on how to deploy, refer to the section [Deploy the Multi-Tenant Application to a Provider Subaccount](./24-Multi-Tenancy-Deployment.md).

4. Open the SAP BTP cockpit of the consumer subaccount and add the required entitlement:
    *SAP Audit Log Viewer Service* with the *free (Application)* plan to view audit logs of this subaccount.

5. Open the menu item *Service Marketplace* and create an instance of *SAP Audit Log Viewer Service* with the *free* plan.
      
      A new application called SAP Audit Log Viewer Service has been added. The link to this application can be shared with customers, who can then view the audit logs and add the application to a launchpad.
      
6. To enable customers to view logs, add authorizations:

    1. Open the *Role Collections* menu item and create a new role collection called `AuditLog`.
    2. Edit the role collection. 
    3. Add the *Auditlog_Auditor* roles for the Audit Log Management and Audit Log Viewer application.
    4. Add the *Poetry_Slam_Manager* user group of the previously configured [identity provider](25-Multi-Tenancy-Provisioning.md#configure-authentication-and-authorization).

## A Guided Tour to Explore the Data Privacy Feature

Now, let us take you on a guided tour through the data privacy feature of Poetry Slam Manager: 

1. Open the SAP BTP cockpit of the customer subaccount.

    > Note: Use the subaccount to which you added the SAP Audit Log Viewer service.

2. Open the Poetry Slams application. 

3. To create sample data for mutable data, such as poetry slams, visitors, and visits, choose *Generate Sample Data*. As a result, a list with several poetry slams is shown.
    > Note: If you choose *Generate Sample Data* again, the sample data is set to the default values.
 
4. Open a poetry slam that has the status *Fully Booked*.

     > Note: Several visitors are shown in the *Bookings* list. As the *email* is annotated with *isPotentiallySensitive*, the read access will be logged.

5. Choose *Edit* and change the description of the poetry slam. Save your changes.

    > Note: As *Changed By* is annotated with *isPotentiallyPersonal*, the write access will be logged.

6. Return to the SAP BTP cockpit and go to the SAP Audit Log Viewer service. 

7. In the SAP Audit Log Viewer service, change the *from-date* to yesterday and choose *Play* in the upper right corner. 

8. Enter your name in the filter to search for your own logs. 
    
    For example, when looking for data-modification events, you can find the log entry of *modifiedBy* as you changed the poetry slam. Additionally, you find an entry for the *email* as you read visitor data in step 4.

    > Note: You can see logs of three categories: Security events refer to log-in and authentication events, data-access events refer to read access to personal data, and data-modification events refer to data changes. 
