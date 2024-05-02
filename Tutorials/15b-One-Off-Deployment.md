# Deploy Your SAP BTP Application

After you developed your application, this tutorial shows you how to deploy your application in a dedicated SAP BTP subaccount, representing an end-to-end provisioning process of a single-tenant partner application in a customer SAP BTP account.

## Deploy to Cloud Foundry

1. Open a new terminal and log on to SAP BTP Cloud Foundry runtime: 
	1. Run the command `cf login`. 
	2. Enter the SAP BTP Cloud Foundry runtime API of your environment (for example, `https://api.cf.eu10.hana.ondemand.com`).
	3. Enter your development user and password.
	4. Select org of the SAP BTP provider subaccount for the application. 
	5. Select the SAP BTP Cloud Foundry runtime space (*app*).

2. Run the command `npm install` to install the messaging npm packages.

3. Run the command `npm run build` to build the project. The *archive.mtar* is added to the folder *mta_archives*. 

4. To deploy the application, run the command `npm run deploy`.

Looking for more details? Go to the [SAP Cloud Application Programming Model documentation on how to deploy to SAP BTP Cloud Foundry runtime](https://cap.cloud.sap/docs/guides/deployment/to-cf)

## Test the HTML5 Application

1. To test your application, navigate to *HTML5 Applications* in the SAP BTP cockpit and choose *poetryslammanager*. 
2. The application opens and the launchpad is displayed with one tile. 
3. As you have not yet set up any authorizations, the application will tell you that you're not authorized to use it when you click on the tile.

## Configure SAP Build Work Zone

Since the web application is now available as an HTML5 application, it's ready to be added to SAP Build Work Zone.

To open the *Site Manager*, launch the application *SAP Build Work Zone, standard edition* *Instance and Subscriptions* in your SAP BTP subaccount.

### Fetch the Latest Version of Your Web Application

1. Open the *Channel Manager*. The *HTML5 Apps* content channel is created automatically and all web applications that you deployed to the SAP BTP subaccount are automatically added as content to this content provider.

2. In the *HTML5 Apps* content channel, choose *Update content* to fetch any updates of your web application. The *HTML5 Apps* content channel now exposes the latest version of the web application. 

   > Note: You must update the content channel every time you made changes to the web application.

### Add the Web Application to Your Content

1. Open the *Content Manager*.
2. Go to the *Content Explorer* sheet.
3. Select the content provider *HTML5 Apps*.
4. To add your web application to your content, choose *Add*. 

### Create a Group and Add Your App 

1. Open the *Content Manager*.
2. Create a new group and enter a title and description.
3. On the *Apps* tab, you see a list of available apps. Move the red slider in the *Assignment Status* column of your app to assign your app to the group. The color of the slider changes to green.
4. Save your changes.

### Assign the Web Application to the Default Role

In this step, you assign your app to the *Everyone* role, which is a default role. The content assigned to this role is visible to all users.

1. Open the *Content Manager*.
2. To open the *Role Editor*, choose *Everyone*.
3. Choose *Edit*.  
4. On the *Apps* tab, you can see a list of available apps. Move the red slider in the *Assignment Status* column of your app to assign your app to the group. The color of the slider changes to green.
5. Save your changes.

### Create and/or Update a Site

In this step, you create and review a launchpad site. If you already have a site, just add your web application.

1. Open the *Site Directory*. 
2. Create a site and enter a site name.
3. To launch the site, open the *URL* provided in the *Properties* of the *Site Settings*.
4. Test your web application. 

> Note: Note down the site URL as **SAP BTP Application Launchpad URL**. On the launchpad, open the context menu of the *Poetry Slam Manager* tile and note down the URL as **SAP BTP Application URL**.

## Configure Authentication and Authorization 

You use the Identity Authentication service as a corporate identity provider (IdP) and establish a trust relationship between the service provider (the SAP BTP subaccount to which you deployed the application) and the Identity Authentication service tenant. As a result, the SAP BTP subaccount and the application delegate user authentications to the Identity Authentication service tenant including single sign-on. Furthermore, you use the Identity Authentication service tenant to assign authorization roles to users via user groups.

However, as a prerequisite, you must have admin access to an Identity Authentication service tenant. 

### Configure Single Sign-On Using the Identity Authentication Service

As a preferred approach, you configure trust between the SAP BTP subaccount and the Identity Authentication service using OpenID Connect (OIDC). As a fallback option, a SAML 2.0 trust configuration is described as well.

#### OpenID Connect Configuration

Set up the trust relationship between the SAP BTP subaccount to the Identity Authentication service using OpenID Connect (OIDC). For more information, refer to the [SAP help about OpenID Connect](https://help.sap.com/docs/identity-authentication/identity-authentication/openid-connect). 

> Note: As a prerequisite for this setup, the SAP BTP subaccount and the Identity Authentication service tenant must be assigned to the same customer ID.

1. Within your SAP BTP subaccount, open the menu item *Security* and go to *Trust Configuration*. 
2. Choose *Establish Trust* and select the Identity Authentication service tenant to set up the OIDC trust configuration.
3. On the Identity Authentication service admin UI, log on to the Identity Authentication service admin UI (URL: [IAS]/admin/). 
4. Open the menu item *Applications* and search for the application that refers to your SAP BTP subaccount
   > Note that the name typically follows the pattern: *XSUAA_[subaccount-name]*.
5. Edit the application and change the following fields:
    - The display name appears on the user log-on screen and the login applies to all applications linked to the Identity Authentication service tenant (following the single-sign-on principle). Change the *Display Name* to something meaningful from an end-user perspective representing the scope of the Identity Authentication service.
    - Enter the *Home URL*, for example, the link to the SAP Build Work Zone launchpad or the application.
	
#### SAML 2.0 Configuration (Fallback)

Set up the trust relationship between the SAP BTP subaccount to the Identity Authentication service using SAML 2.0. For more information, refer to the [SAP help about SAP Cloud Identity Services](https://help.sap.com/docs/identity-authentication/identity-authentication/saml-2-0). This approach is the fallback trust configuration if the OpenID Connect configuration is not possible. 
	
> Note: This fallback applies only if the SAP BTP subscriber subaccount and the Identity Authentication service tenant are not assigned to the same customer ID. This setup comes with limitations regarding remote access to the OData services of the SAP BTP app with principal propagation.

1. Within your SAP BTP subaccount, to download the *Service provider SAML metadata* file, open the menu item *Security* and go to *Trust Configuration*. 
2. Choose *Download SAML Metadata*.
3. On the Identity Authentication service Admin UI, open the menu item *Applications* and create a new application of the type *SAP BTP solution*:
	1. Enter the required information such as application display name, application URL, and so on. The display name appears on the user log-on screen and the login applies to all applications linked to the Identity Authentication service tenant (following the single-sign-on principle). Choose something meaningful from an end-user perspective representing the scope of the Identity Authentication service.
	2. Open the *SAML 2.0 Configuration* section and upload the *Service provider SAML metadata* file from the SAP BTP subaccount.
	3. Open the *Subject Name identifier* section and select *E-Mail* as basic attribute.
	4. Open the *Default Name ID Format* section and select *E-Mail*.
4. To download the *IDP SAML metadata file*: 
	1. Open the menu item *Tenant Settings* and go to *SAML 2.0 Configuration*.
	2. Choose *Download Metadata File*.
5. Within your SAP BTP subaccount, open the menu item *Security* and go to *Trust Configuration*.
6. Choose *New SAML Trust Configuration*. 
7. Upload the *IDP SAML metadata* file and enter a meaningful name and description for the Identity Authentication service (for example, `Corporate IDP` or `Custom IAS (SAML2.0)`).

Looking for more information on the SAP Authorization and Trust Management service? Go to the [Building Side-By-Side Extensions Using SAP BTP tutorial](https://learning.sap.com/learning-journeys/build-side-by-side-extensions-on-sap-btp/describing-authorization-and-trust-management-xsuaa-_cbf0d0c5-29ec-4685-9cf4-487156b41284).
	
### Set Up Users and User Groups

In this example, you use Identity Authentication service user groups to assign authorizaton roles to users. The user groups will be passed as *assertion attribute* to the SAP BTP subaccount and will be mapped to the respective role collections in the SAP BTP subaccount. 

1. On the Identity Authentication service Admin UI, open the menu item *User Management* and add the users that should have access to the SAP BTP application. Enter user details such as name and e-mail. But take into account that the e-mail is used as the identifying attribute. As a recommendation, use the e-mail address that is used in the ERP system that you'll integrate later.
2. Open the menu item *Groups* and add user groups that represent typical user roles. Enter a unique (technical) *Name* and a meaningful *Display Name*, for example:

    | Name                      | Display Name              |
    | :------------------------ | :------------------------ |
    | `Poetry_Slam_Manager`     | `Poetry Slam Manager`     |
    | `Poetry_Slam_Visitor`     | `Poetry Slam Visitor`     |

3. Open the menu item *Applications*, open the application referring to the SAP BTP subaccount with your application, and navigate to *Attributes*.
4. Check if there is an attribute with the name *Groups* and value *Groups*. If not, add the attribute mapping accordingly.
	> Note: Capital letters are required to ensure a correct mapping.
5. Within your SAP BTP subaccount, open the menu item *Role Collections* and add the user groups (using the unique technical name of the user group) to the role collections that you want to assign to the respective users with the user group:

    | Role Collection                    | User Groups            |
	  | :--------------------------------- | :--------------------- |
	  | `PoetrySlamManagerRoleCollection`  | `Poetry_Slam_Manager`  |
	  | `PoetrySlamVisitorRoleCollection`  | `Poetry_Slam_Visitor`  |

### Log On to the SAP BTP Application and Test Single Sign-On

Launch your SAP BTP application and select the Identity Authentication service tenant as IdP. 

> Note: If the user has not yet been replicated from the Identity Authentication service tenant to the SAP BTP subaccount, the first attempt to open the app may fail with an authorization error message (at the very latest, the replication is triggered and executed automatically at this point). The second login attempt to open the app will be successful.

You may deactivate the *Default Identity Provider* (which refers to the SAP ID Service) in the trust center of your SAP BTP subaccount.

Looking for more information on the functionality of Poetry Slam Manager, the sample application? Go to the [guided tour](17-Guided-Tour.md).
