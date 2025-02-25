# Deploy Your SAP BTP Multi-Tenant Application

This tutorial guides you through the steps to deploy and configure the multi-tenant sample application (Poetry Slam Manager) in a dedicated SAP BTP provider subaccount.

## Build and Deploy to Cloud Foundry

1. Open a new terminal and log on to SAP BTP Cloud Foundry runtime: 
	1. Run the command `cf login`. 
	2. Enter the SAP BTP Cloud Foundry runtime API of your environment, for example, `https://api.cf.eu10.hana.ondemand.com`.
	3. Enter your development user and password.
	4. Select the org of the SAP BTP provider subaccount for the application. 
	5. Select the SAP BTP Cloud Foundry runtime space (*app*).

2. Navigate to the root folder of the project.

3. Run the command `npm install` on the root folder to install the npm packages. 

4. Run the command `npm install` for the app/poetryslams subfolder.

5. Run the command `npm install` for the app/router subfolder.

6. Run the command `npm install` for the app/visitors subfolder.

7. Run the command `npm install` for the mtx/sidecar subfolder.

8. Run the command `npm run build` to build the project. The *archive.mtar* is added to the folder *mta_archives*. 

9. To deploy the application, run the command `npm run deploy`. 

> Note: The first deployment of the application creates instances of SAP BTP services in the provider subaccount. Navigate to the SAP BTP provider subaccount and view the created services.

> Note: The first deployment of the application creates destinations in the provider subaccount that are required for SAP Build Work Zone. Navigate to the SAP BTP provider subaccount and view the created destinations.

Looking for more details? Go to the [SAP Cloud Application Programming Model documentation on how to deploy to SAP BTP Cloud Foundry runtime](https://cap.cloud.sap/docs/guides/deployment/to-cf)

## Configure the Application Subdomain (Custom Domain)

In the previous chapter [Enhance the Core Application for Multitenancy](./23-Multi-Tenancy-Develop-Sample-Application.md) you adjusted the tenant host pattern from `<subdomain>-<application identifier>.<generic domain>` to `<subdomain>.<application identifier>.<generic domain>` (the difference is a `.` instead of a `-`). This change allows you to route all consumer clients to your application with a generic route `*.<application identifier>.<generic domain>`. Without this adjustment, every new subscription would require an additional route because you cannot define a generic route as `*-<application identifier>.<generic domain>`. Therefore, without this adjustment, automatic provisioning of new subscriptions would be more complicated. With the `.` a sample url for a subscriber looks like `poetryslamsmtsubscriber1.sap-psm-mt-app-poetry-slams.cfapps.eu10-004.hana.ondemand.com`.

Also, SAP provides a generic server certificate for all server urls of the pattern `*.<generic domain>`. This does not (and cannot) include `*.<application identifier>.<generic domain>` because server certificates are not multi-level. Hence, using the generic route `*.<application identifier>.<generic domain>` requires an appropriate server certificate. This is provided with the SAP Custom Domain service. This service also allows you to map your own domain (like `my-application.my-domain.com` instead of the SAP BTP default domain) to your application.

### SAP Custom Domain Service

The [SAP Custom Domain service](https://help.sap.com/docs/custom-domain) helps you configure and expose the subdomains used by your multi-tenant application including the mapping to your own custom domain. The linked documentation explains the [prerequisites](https://help.sap.com/docs/custom-domain/custom-domain-manager/prerequisites) and required steps to [create custom domains](https://help.sap.com/docs/custom-domain/custom-domain-service/creating-custom-domains-with-tls-ssl-server-authentication).

Below is a condensed version using the SAP default domain.

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
        5. Enter the subdomain name as `<cloud-foundry-org-name>-<cloud-foundry-space-name>-<approuter-module-name>` and choose *Finish*.
            > Note: The system creates a custom domain with the name `<cloud-foundry-org-name>-<cloud-foundry-space-name>-<approuter-module-name>.<reserved domain name>`, for example, `sap-psm-mt-app-poetry-slams.cfapps.eu10-004.hana.ondemand.com`. 

            > Note: By default, the *_approuter-module-name_* is `poetry-slams`.

            > Note: According to the proposals in this tutorial, the name is *sap-psm-mt-app-poetry-slams.cfapps.eu12.hana.ondemand.com*.

        > Note: TLS Configuration is optional: If you don't create a TLS configuration, *Default_without_Client_Authentication* will be used in the next steps.
    4. Launch the *Server Certificates* application and create a server certificate for multi-tenant application:
        1. Choose *Create Server Certificate...* and *for your (wildcard) Custom Domains*.
        2. In the *General Information* section, enter an *Alias* and select the *Key Size*. Go to the next step.
        3. In the *Select Landscape* section, select the desired landscape to continue and go to the next step. 
             > Note: The landscape refers to the Cloud Foundry instance.
        4. In the *Select Alternative Names* section, select the entry with wildcard and choose *Next Step*. 
            > Note: the sample entry looks like `*.<cloud-foundry-org-name>-<cloud-foundry-space-name>-<approuter-module-name>.<reserved domain name>`.
        5. In the *Set Subject* section, use the default as the *Common Name (CN)* which is `*.<cloud-foundry-org-name>-<cloud-foundry-space-name>-<approuter-module-name>.<reserved domain name>` and choose *Finish*. Now the creation of Certificate Signing Request (CSR) is initated and the status is *CSR in progress*. 
        6. Once the server certificate status is changed to *CSR created* you can download it and get the certificate signed by an appropriate authority.
            > Note: SAP does not offer the signing of certificates. There are free-of-charge options, such as [https://letsencrypt.org/](https://letsencrypt.org/) that offer (short-lived) signatures.
        7. After you have received the signed certificate, upload and activate it.
            1. To activate the server certificate, choose *Activate*.
            2. In the first step *Subject Alternative Names*, select the entry with wildcard `*.<cloud-foundry-org-name>-<cloud-foundry-space-name>-<approuter-module-name>.<reserved domain name>`, and choose *Next step*.
            3. In the second step *Select TLS Configuration*, no TLS configuration is available, but a default one without client authentication will be created and used. Choose *Next step*.
            4. In the *Summary and confirmation* step, review the configuration and choose *Finish*. The status of the server certificate will be set to *In Progress*.
            5. Once the process is completed, the status of the server certificate changes to *Active*. As a result, an active custom domain is created. 
    5. Go to the *Domains* tab and navigate to *CUSTOM DOMAINS*. A custom domain with the name `*.<cloud-foundry-org-name>-<cloud-foundry-space-name>-<approuter-module-name>.<reserved domain name>` and with the status *active* is listed.

You have now successfully deployed the application to the provider subaccount and you are ready to [provision tenants of the multi-tenant application to customers](./25-Multi-Tenancy-Provisioning.md).
