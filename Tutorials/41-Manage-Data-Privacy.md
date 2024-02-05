# Manage Data Privacy

Put yourself in the shoes of an administrator of a poetry slam management application. Imagine it's your job to handle all legal requirements that must be met to run the application, for example, handling data privacy requirements of the application.

Using the SAP Audit Log service of the SAP Cloud Application Programming Model, you ensure that your application is compliant to data privacy requirements. For more information, go to the [SAP Cloud Application Programming Model documentation on managing data privacy](https://cap.cloud.sap/docs/guides/data-privacy/).

To try this feature with Poetry Slam Manager, you have two options: 
- A. Clone the repository of the Partner Reference Application. Check out the *main-multi-tenant* branch and enhance the application step-by-step. 
- B. Alternatively, check out the *main-multi-tenant-features* branch, in which the feature is already included. 

The following section describes how you enhance the **main-multi-tenant** branch (option A).

## Application Enablement 

1. First, decide which entities and which attributes contain sensitive or personal data. 
2. Create a new file *./srv/poetrySlamManagerDataPrivacy.cds*.
3. Add the annotations for data privacy and the SAP Audit Log service. Refer to the [poetrySlamManagerDataPrivacy.cds file of the sample application](../../../tree/main-multi-tenant-features/srv/poetrySlamManagerDataPrivacy.cds): 
    - Sensitive attributes are annotated with `IsPotentiallySensitive`, 
    - Personal attributes are annotated with `IsPotentiallyPersonal`. 
    
    For example, here's the entity *visitor*:

    ```cds
    // -------------------------------------------------------------------------------
    // Annotations for data privacy

    annotate PoetrySlamManager.Visitors with @PersonalData : {
        // Role of the data subjects in this set
        DataSubjectRole : 'Visitors',
        // Entities describing a data subject (an identified or identifiable natural person), e.g. customer, vendor, employee. These entities are relevant for audit logging. 
        EntitySemantics : 'DataSubject'
    }{
        ID          @PersonalData.FieldSemantics: 'DataSubjectID';
        visits      @PersonalData.FieldSemantics: 'DataSubjectID';   
        // Property contains potentially sensitive personal data; Read and write access is logged for IsPotentiallySensitive
        email       @PersonalData.IsPotentiallySensitive;    
        // Property contains potentially personal data; Personal data is information relating to an identified or identifiable natural person; Only write access is logged 
        name        @PersonalData.IsPotentiallyPersonal;
        createdBy   @PersonalData.IsPotentiallyPersonal;
        modifiedBy  @PersonalData.IsPotentiallyPersonal;
    };
    ```
4. Open a terminal and run the command `npm add @cap-js/audit-logging`. As a result, a dependency to the latest version of the SAP Cloud Application Programming Model (CAP) audit-logging plug-in is added to the *package.json* of your project. 

    Refer to the [package.json file of the sample application](../../../tree/main-multi-tenant-features/package.json).

    ```json
    "dependencies": {
        "@cap-js/audit-logging": "^0.4.0"
    }
    ```

    You can follow the instructions described above in both one-off and multi-tenant solutions.

5. Open the *./mta.yaml* file and add the audit log resource and the module dependencies to the service module. 

    Refer to the [mta file of the sample application](../../../tree/main-multi-tenant-features/mta.yaml).
    ```yaml
    modules:
    - name: poetry-slams-srv
    requires:
    - name: poetry-slams-auditlog

    - name: poetry-slams-mtx-srv
    requires:
    - name: poetry-slams-auditlog
    
    - name: poetry-slams-approuter
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

## SAP BTP Configuration and Deployment

1. Open the SAP BTP cockpit of the provider subaccount and add the required entitlement:
    
     *SAP Audit Log Service* with the *premium* plan to write audit logs.

2. Run the command `npm install` in your project root folder to install the audit log npm module. 

3. Build and deploy the application. As a result, an SAP Audit Log service instance named *poetry-slams-auditlog* has been created.
    > Note: For detailed instructions on how to deploy, refer to the section [Deploy the Multi-Tenant Application to a Provider Subaccount](22-Multi-Tenancy-Deployment.md#build-and-deploy-the-multi-tenant-application).

4. Open the SAP BTP cockpit of the consumer subaccount and add the required entitlement:
    *SAP Audit Log Viewer Service* with the *free (Application)* plan to view audit logs of this subaccount.

5. Open the *Service Marketplace* menu item and create an instance of *SAP Audit Log Viewer Service* with the *free* plan.
      
      A new application called SAP Audit Log Viewer Service has been added. The link to this application can be shared with customers, who can then view the audit logs and add the application to a launchpad.
      
6. To enable customers to view logs, add authorizations:

    1. Open the *Role Collections* menu item and create a new role collection called `AuditLog`.
    2. Edit the role collection. 
    3. Add the *Auditlog_Auditor* roles for the Audit Log Management and Audit Log Viewer application.
    4. Add the *Poetry_Slam_Manager* user group of the previously configured [identity provider](./15-One-Off-Deployment.md#configure-authentication-and-authorization).

## A Guided Tour to Explore the Data Privacy Feature

Now, let us take you on a guided tour through the data privacy feature of Poetry Slam Manager: 

1. Open the SAP BTP cockpit of the customer subaccount.

    > Note: Use the subaccount to which you added the SAP Audit Log Viewer service.

2. Open the Poetry Slam Manager application. As a result, a list with several poetry slams is shown.

3. Open a poetry slam that has the status *Fully Booked*.

     > Note: Several visitors are shown in the *Bookings* list. As the visitor name is annotated with *isPotentiallySensitive*, the read access will be logged.

4. Choose *Edit* and change the description of the poetry slam. Save your changes to publish the changes.

    > Note: As *Changed By* is annotated with *isPotentiallyPersonal*, the write access will be logged.

5. Now, go back to the SAP BTP cockpit and go to the SAP Audit Log Viewer service. 
6. In the SAP Audit Log Viewer service, change the *from-date* to yesterday and choose *Play* in the upper right corner. 
7. Enter your name in the filter to search for your own logs. 
    
    For example, when looking for data-modification events, you can find the log entry of the *modifiedby* as you changed the poetry slam. Additionally, you find an entry of the *email* as you read visitor data in step 4.

    > Note: You can see logs of three categories: Security events refer to log-in and authentication events, data-access events refer to read access to personal data, and data-modification events refer to data changes. 
