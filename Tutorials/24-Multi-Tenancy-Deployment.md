# Deploy the Multi-tenant Application to the Provider SAP BTP Account

This tutorial guides you through the steps to deploy and configure the multi-tenant sample application (Poetry Slam Manager) in a dedicated SAP BTP provider subaccount.

## Build and Deploy the Multi-Tenant Application

1. In SAP Business Application Studio, open a new terminal and log on to SAP BTP Cloud Foundry runtime: 
    1. Run the command `cf login`.
    2. Enter your development user and password, and select the SAP BTP Cloud Foundry *org* and *space* for the application.

2. Navigate to the root folder of the project.

3. Run the command `npm install` on the root folder to install the npm packages. Also run this command for the app and mtx/sidecar subfolders.

4. Run the command `npm run build` to build the project.

5. To deploy the application, run the command `npm run deploy`. 

> Note: The first deployment of the application creates instances of SAP BTP services in the provider subaccount. Navigate to the SAP BTP provider subaccount and view the created services.

## Configure the Application Subdomain (Custom Domain)
### SAP Custom Domain Service
The [SAP Custom Domain service](https://help.sap.com/docs/custom-domain?version=Cloud&locale=en-US) helps you configure your own custom domain to publicly expose your application. This can be accomplished by configuring subdomains for your application and combining them with your own company-specific domain. 
In this example, you use the default domain provided by SAP and use the SAP Custom Domain service to configure the subdomains used by the multi-tenant application. 

#### Procedure 
1. Create entitlement to the SAP Custom Domain service:
    1. If you haven't created an entitlement yet, create one for Custom Domain Manager in the SAP BTP Control Center (Custom Domain Service | custom-domain-manager).
    2. Select *SAP Custom Domain service* as application, select *Standard* as a plan.
    
2. Create an instance of SAP Custom Domain service in the provider SAP BTP subaccount:
    1. If not yet done, in the provider SAP BTP subaccount, navigate to  *Entitlements*. Go to *Entity Assignments* and select *Standard (Application)*. Save your changes.
    2. Go to *Service* and *Service Market Place*. Select *SAP Custom Domain service* and choose *Create*. Select *SAP Custom Domain service* and *Standard* as a plan.
    3. Go to *Security* and *Role Collections*. Select the *Custom Domain Administrator* role collection for required users. 

3. Create a Custom Domain:
    1. Go to *Services* and *Instances and Subscriptions*. 
    2. Choose *Subscriptions* and select the *SAP Custom Domain service* to launch the domain service to create a new custom domain along with a server certificate. 
        > Note: If you get an error message saying that some roles are missing, open the SAP Custom Domain service in an incognito window of your browser.
    3. Launch the Domains application. 
        1. To create a custom domain, navigate to *Custom Domains*. 
        2. Select the option *Create Custom Domain* and *for your subaccount’s Cloud Foundry organization*.
        3. Select the default landscape in the *Landscape Info* step and go to the next step.
        4. Select the default reserved domain proposed by the system and go to the next step.
        5. Enter the subdomain name as `{cloud-foundry-org-name}-{cloud-foundry-space-name}-{approuter-module-name}` and choose *Finish*.
            > Note: The system creates a custom domain with the name *{cloud-foundry-org-name}-{cloud-foundry-space-name}-{approuter-module-name}.{reserved domain name}*.

            > Note: By default, the *_approuter-module-name_* is `poetry-slams`.

        > Note: TLS Configuration is optional: If you don't create a TLS configuration, *Default_without_Client_Authentication* will be used in the next steps.
    4. To launch the *Server Certificates* application and create a server certificate for multi-tenant application:
        1. Choose *Create Server Certificate...* and *for your (wildcard) Custom Domains*.
        2. In the *General Information* section, enter an *Alias* and select the *Key Size*. Go to the next step.
        3. In the *Select Landscape* section, select the desired landscape to continue and go to the next step. 
             > Note: The landscape refers to the Cloud Foundry instance.
        4. In the *Select Alternative Names* section, select the entry with wildcard and choose *Next Step*. 
            > Note: Here's what the sample entry looks like *.{cloud-foundry-org-name}-{cloud-foundry-space-name}-{approuter-module-name}.{cloud foundry endpoint}.
        5. In the *Set Subject* section, use the default as the *Common Name (CN)*, which is *.{cloud-foundry-org-name}-{cloud-foundry-space-name}-{approuter-module-name}.{cloud foundry endpoint} and choose *Finish*. Now the creation of Certificate Signing Request (CSR) is initated and the status is *CSR in progress*. 
        6. Once the server certificate status is changed to *CSR created* (the status change can take a few seconds up to a minute), open the server certificate. *Automation* is set to *disabled*, however, we recommend that you set the Automated Certificate Lifecycle Management to *Automated*. To do so, choose *Automate*. 
           > Note: Automation will enable the certificate to be created using DigiCert as certificate provider. As long as automation is enabled, the certificate will be automatically renewed before the expiration date.
        7. In the *Enable Automation* message, choose *Enable*. 
           > Note: The automation process starts and the system tells you that the automation process in progress, which may take a few hours. However, ideally, automation takes only few minutes.
        
        8. Go to the *Domains* tab and navigate to *CUSTOM DOMAINS*. A custom domain with the name *.{cloud-foundry-org-name}-{cloud-foundry-space-name}-{approuter-module-name}.{cloud foundry endpoint}* and with the status *active* is listed.

        9. If automation is enabled and the status is inactive, **you must activate the certificate**:

            1. To activate the server certificate, choose *Activate*.

            2. Now, in the first step *Subject Alternative Names*, select the entry with wildcard *.{cloud-foundry-org-name}-{cloud-foundry-space-name}-{approuter-module-name}.{cloud foundry endpoint}, and choose *Next step*.

            3. In the second step *Select TLS Configuration*, no TLS configuration is available, but a default one without client authentication will be created and used. Choose *Next step*.

            4. In the *Summary and confirmation* step, review the configuration and choose *Finish*. The status of the server certificate will be set to *In Progress* and the **process can take a few seconds up to a minutes**.

            5. Once the process is completed, the status of the server certificate changes to *Active*. As a result, an active custom domain is created. 


## Set Up the Subscription Management Dashboard

The *Subscription Management Dashboard* supports the lifecycle management of multi-tenant applications. 

To open the *Subscription Management Dashboard*, choose the *SaaS Provisioning Service* instance, for example, *poetry-slams-registry* in your provider subaccount (*SAP BTP cockpit - Instances and Subscriptions*) after the multi-tenant application has been deployed. Assign the role collection *Subscription Management Dashboard Administrator* to the required users to get access to the dashboard.

> Note: In case of authorization issues, open it in an incognito window of your browser.

Capabilities of the *Subscription Management Dashboard*: 
- The dashboard enables application providers to review the deployment of multi-tenant applications including the application and subscription status and the change history/subscription history.
- Application providers can perform subscription actions such as *Unsubscribe* and *Update*, and track the status of subscriptions in progress.
- In the *Overview* section of the subscribed application, application owners can review information such as *Subscription Status*, *Global Accounts*, *Consumer Subaccounts*, *Application Name*, *Application URL*, *License Type* (productive, test tenant), *Changed On*, and *Created On*.
- In the *Dependencies* section, application providers can review the service dependencies of the application. There is a tree view and a table view of dependencies. The information helps users view the full list of dependencies among various services used in the application. It outlines, for example, the dependencies between the application service module and modules for destinations, 
SAP HTML5 Application Repository service for SAP BTP, and connectivity services. 

> Note: At this stage of the tutorial, no subscription has been created yet and, therefore, no subscription is shown.

You have now successfully deployed the application to the provider subaccount and you are ready to [provision tenants of the multi-tenant application to customers](./25-Multi-Tenancy-Provisioning.md).
