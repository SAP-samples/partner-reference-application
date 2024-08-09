# Deploy the Multi-Tenant Application to the Provider SAP BTP Account

This tutorial guides you through the steps to deploy and configure the multi-tenant sample application (Poetry Slam Manager) in a dedicated SAP BTP provider subaccount.

## Build and Deploy the Multi-Tenant Application

1. In SAP Business Application Studio, open a new terminal and log on to SAP BTP Cloud Foundry runtime: 
    1. Run the command `cf login`.
    2. Enter your development user and password, and select the SAP BTP Cloud Foundry *org* and *space* for the application.

2. Navigate to the root folder of the project.

3. Run the command `npm install` on the root folder to install the npm packages. 

4. Run the command `npm install` for the app/router subfolder.

5. Run the command `npm install` for the mtx/sidecar subfolder.

5. Run the command `npm run build` to build the project.

6. To deploy the application, run the command `npm run deploy`. 

> Note: The first deployment of the application creates instances of SAP BTP services in the provider subaccount. Navigate to the SAP BTP provider subaccount and view the created services.

## Configure the Application Subdomain (Custom Domain)
### SAP Custom Domain Service
The [SAP Custom Domain service](https://help.sap.com/docs/custom-domain?version=Cloud&locale=en-US) helps you configure your own custom domain to publicly expose your application. This can be accomplished by configuring subdomains for your application and combining them with your own company-specific domain. 
In this example, you use the default domain provided by SAP and use the SAP Custom Domain service to configure the subdomains used by the multi-tenant application. 

#### Procedure 
1. Create entitlement to the SAP Custom Domain service:
    1. If you haven't created an entitlement yet, create one for Custom Domain Manager in the SAP BTP Control Center (Custom Domain Service | custom-domain-manager).
    2. Select *Custom Domain service* as the application, and *Standard* as a plan.
    
2. Create an instance of SAP Custom Domain service in the provider SAP BTP subaccount:
    1. If not yet done, in the provider SAP BTP subaccount, navigate to *Entitlements*. Press *Edit*, press *Add Service Plans* and select *Custom Domain Service* with plan *Standard (Application)*. Add the service plan and save your changes.
    2. Go to *Services* and *Service Marketplace*. Select *Custom Domain Service* and choose *Create*. Select *Custom Domain Service* and *Standard* as a plan.
    3. Go to *Security* and *Role Collections*. Select the *Custom Domain Administrator* role collection for required users. 

3. Create a Custom Domain:
    1. Go to *Services* and *Instances and Subscriptions*. 
    2. Choose *Subscriptions* and select the *Custom Domain Service* to launch the domain service to create a new custom domain along with a server certificate. 
        > Note: If you get an error message saying that some roles are missing, open the SAP Custom Domain service in an incognito window of your browser.
    3. Launch the *Domains* application. 
        1. To create a custom domain, navigate to *Custom Domains*. 
        2. Select the option *Create Custom Domain* and *for your subaccount’s Cloud Foundry organization*.
        3. Select the default landscape in the *Landscape Info* step and go to the next step.
        4. Select the default reserved domain proposed by the system and go to the next step.
        5. Enter the subdomain name as `{cloud-foundry-org-name}-{cloud-foundry-space-name}-{approuter-module-name}` and choose *Finish*.
            > Note: The system creates a custom domain with the name *{cloud-foundry-org-name}-{cloud-foundry-space-name}-{approuter-module-name}.{reserved domain name}*. 

            > Note: By default, the *_approuter-module-name_* is `poetry-slams`.

            > Note: According to the proposals in this tutorial, the name is *sap-psm-mt-app-poetry-slams.cfapps.eu12.hana.ondemand.com*.

        > Note: TLS Configuration is optional: If you don't create a TLS configuration, *Default_without_Client_Authentication* will be used in the next steps.
    4. Launch the *Server Certificates* application and create a server certificate for multi-tenant application:
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
        
        8. If automation is enabled and the status is inactive, **you must activate the certificate**:

            1. To activate the server certificate, choose *Activate*.

            2. Now, in the first step *Subject Alternative Names*, select the entry with wildcard *.{cloud-foundry-org-name}-{cloud-foundry-space-name}-{approuter-module-name}.{cloud foundry endpoint}, and choose *Next step*.

            3. In the second step *Select TLS Configuration*, no TLS configuration is available, but a default one without client authentication will be created and used. Choose *Next step*.

            4. In the *Summary and confirmation* step, review the configuration and choose *Finish*. The status of the server certificate will be set to *In Progress* and the **process can take a few seconds up to a minutes**.

            5. Once the process is completed, the status of the server certificate changes to *Active*. As a result, an active custom domain is created. 
            
    5. Go to the *Domains* tab and navigate to *CUSTOM DOMAINS*. A custom domain with the name *{cloud-foundry-org-name}-{cloud-foundry-space-name}-{approuter-module-name}.{cloud foundry endpoint}* and with the status *active* is listed.

You have now successfully deployed the application to the provider subaccount and you are ready to [provision tenants of the multi-tenant application to customers](./25-Multi-Tenancy-Provisioning.md).
