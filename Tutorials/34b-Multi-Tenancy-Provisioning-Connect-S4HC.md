# Configure the Integration with SAP S/4HANA Cloud Public Edition

In this section, you connect a SAP S/4HANA Cloud tenant, the Identity Authentication service tenant of the SAP S/4HANA Cloud Public Edition system (acting as a corporate identity provider), and the SAP BTP consumer subaccount with the customer subscription of Poetry Slam Manager.

1. Front-end integration:  

    1. Launch the Manage Poetry Slams app and the Manage Visitors app from the SAP Fiori launchpad in the SAP S/4HANA Cloud Public Edition system.  
    2. Launch applications to manage SAP BTP, such as the Identity Authentication service admin application, from the SAP Fiori launchpad in the SAP S/4HANA Cloud Public Edition system.
    3. Navigate from the Manage Poetry Slams app to the related enterprise projects in SAP S/4HANA Cloud Public Edition.  
    4. Configure single sign-on for the Manage Poetry Slams app and Manage Visitors app in the SAP S/4HANA Cloud Public Edition system, and all SAP BTP admin apps using the same Identity Authentication service tenant as corporate identity provider (IdP).  

2. Back-channel integration: Create and read enterprise projects in SAP S/4HANA Cloud Public Edition from the Poetry Slam Manager using OData APIs with principal propagation.

<p align="center">
  <img src="./images/34_mt_s4hc_integration.png" width="60%">
</p>

## Set Up SAP BTP Consumer Subaccount

To start the provisioning procedure, create a SAP BTP consumer subaccount for a specific customer:

1. Open the SAP BTP cockpit. Use the same global account that hosts the provider subaccount of the SAP BTP application.
2. Create a new *Multi-Environment* subaccount with a name that refers to the tenant number or the customer.  
3. As a provider, choose *Amazon Web Services (AWS)*. In the Poetry Slam Manager example, the subaccount is called *Consumer 2: Andina Publications (S4HC)*. 

### Subscribe To the SAP BTP Multi-Tenant Application

1. In the SAP BTP cockpit of the newly created consumer subaccount, navigate to *Instances and Subscriptions*. 
2. Create a subscription to *Poetry Slam Manager* with the *default* service plan. This is the multi-tenant SAP BTP application you just created.

## Set Up Single Sign-On for the SAP BTP Application Subscription
In this tutorial, the Identity Authentication service tenant that is used by the SAP S/4HANA Cloud Public Edition tenant for authentication is reused.  

### Configure Single Sign-On for the SAP BTP Application
Configure a trust relationship between the SAP BTP consumer subaccount and the Identity Authentication service tenant of SAP S/4HANA Cloud Public Edition as described in the section [Configure Trust Using SAML 2.0](./25-Multi-Tenancy-Provisioning.md#configure-trust-using-saml-20).

### Launch the SAP BTP Multi-Tenant Application

1. To launch the Manage Poetry Slams app, choose *Go to Application*. Copy the link address of the Manage Poetry Slams app and note it down as **SAP BTP Application Poetry Slams Tenant URL** for later reference.

2. From there, open a fully booked poetry slam and choose *Maintain Visitors*. Copy the link address of the Manage Visitors app and note it down as **SAP BTP Application Visitors Tenant URL** for later reference.

> Note: If you're directed to a SAP HANA XS Advanced Login screen after launching the application, check the naming of your SAP BTP Cloud Foundry runtime organization. The organization name must be in lowercase.

## Configure Single Sign-On for SAP S/4HANA Cloud Public Edition

In this tutorial, you reuse the Identity Authentication service tenant that the SAP S/4HANA Cloud Public Edition tenant uses for authentication.

The trust relationship between the SAP S/4HANA Cloud Public Edition tenant and the Identity Authentication service tenant is already established, so no further activities are required.

## Configure SAP S/4HANA Cloud OData Services to Create and Read Enterprise Projects

1. Search for the following OData APIs on the [SAP Business Accelerator Hub](https://api.sap.com/package/SAPS4HANACloud/all) and note down communication scenarios per API:
    - [*Enterprise Project*](https://api.sap.com/api/API_ENTERPRISE_PROJECT_SRV_0002/overview) (OData v2): Communication scenario: *Enterprise Project Integration* (SAP_COM_0308)
    - [*Enterprise Project - Read Project Processing Status*](https://api.sap.com/api/ENTPROJECTPROCESSINGSTATUS_0001/overview) (OData v4): Communication scenario: *Enterprise Project - Project Processing Status Integration* (SAP_COM_0725)
    - [*Enterprise Project - Read Project Profile*](https://api.sap.com/api/ENTPROJECTPROFILECODE_0001/overview) (OData v4): Communication scenario: *Enterprise Project - Project Profile Integration* (SAP_COM_0724)

2. In the SAP S/4HANA Cloud Public Edition system, open the *Communcation System application* and create a new *Communication System* that represents the SAP BTP consumer subaccount:
    - General Data:  
        | Parameter Name    | Value                                                               |
        | :---------------- | :------------------------------------------------------------------ |
        | *System ID*:      | `PSM-<SAP_BTP_CONSUMER_SUBACCOUNT_INFORMATION>`                     |
        | *System Name*:    | `Poetry Slam Manager - <SAP BTP Consumer Subaccount Information>`   |
    - Technical Data:  
        | Parameter Name        | Value                                                         |
        | :-------------------- | :------------------------------------------------------------ |
        | *Host Name*:          | `Hostname of the SAP BTP Application Poetry Slams Tenant URL`   |
        | *Logical System*:     | `DUMMY`                                                       |
        | *Business System*:    | `Hostname of the SAP BTP Application Poetry Slams Tenant URL`   |
        > Note: The values in the *Technical Data* section are only required to add communication scenarios to the communication system, which include outbound communication services.  
        > Outbound communication is not needed to integrate SAP S/4HANA Cloud Public Edition with SAP BTP. The outbound communication services can be deactivated later.  
        > While the **Logical System** can be set to `DUMMY`, the **Business System** is set to the `Hostname of the SAP BTP Application Poetry Slams Tenant URL` because it needs to be distinct for the SAP S/4HANA Cloud Public Edition system.

3. Add/Create a *Communication User* for inbound communication to the *Communication System* in the *Users for Inbound Communication* section:

    | Parameter Name    | Value                                         |
    | :---------------- | :-------------------------------------------- |
    | *User Name*:      | `PSM-USER`                                    |
    | *Description*:    | `Poetry Slam Manager - Communication User`    |
    | *Password*:       | Choose a secure password.                     |

    > Note: Save the **User Name** and **Password** since they are used for the SAP BTP destination configuration later.

4. Open the *Communication Arrangement application* and create a new *Communication Arrangement* for each *Communication Scenario* listed above:

    | Parameter Name                                    | Value                                                                                 |
    | :------------------------------------------------ | :------------------------------------------------------------------------------------ |
    | *Arrangement Name*:                               | Arrangement name (For example, `Poetry Slam Manager - Project` for **SAP_COM_0308**.)|
    | *Communication System*:                           | *Communication System* (For example, `Poetry Slam Manager`, which was created before.)|                                     |
    | *Inbound Communication - User Name*:              | *User for Inbound Communication* (For example, `PSM-USER`, which was created before.) |
    | *Inbound Communication - Authentication Method*:  | `User ID and Password`                                                                |
    > Note: You need to create the following *Communication Arrangements* for the *Communication System* above:  
    >-  *Communication Arrangement* **Poetry Slam Manager - Project** for *Communication Scenario* **SAP_COM_0308**  
    >-  *Communication Arrangement* **Poetry Slam Manager - Project Profile** for *Communication Scenario* **SAP_COM_0724**  
    >-  *Communication Arrangement* **Poetry Slam Manager - Project Status** for *Communication Scenario* **SAP_COM_0725**  

You can now consume the OData service using the technical user and basic authentication (user/password).

## Configure OAuth Authentication for OData Services

OAuth 2.0 SAML Bearer authentication is used to access the SAP S/4HANA Cloud OData service to read and write projects with the user context initiated by a user on the Poetry Slam Manager UI. As a result, SAP S/4HANA Cloud user authorizations apply to Poetry Slam Manager as well. Users without the permission to manage projects in SAP S/4HANA Cloud can still open Poetry Slam Manager, but SAP S/4HANA Cloud enterprise project data is not retrieved and projects cannot be created.

### Configure Authentication by Business Users
Configure SAP S/4HANA Cloud for OAuth 2.0 SAML Bearer authentications.

1. Download the X.509 certificate of the SAP BTP consumer subaccount:  
    1. In the SAP BTP consumer subaccount, choose *Connectivity* and go to *Destinations*.  
    2. Choose *Download Trust* and save the file with the signing certificate.  

2. Create the OAuth 2.0 identity provider for the *Communication System* in SAP S/4HANA Cloud Public Edition:  
    1. Open and edit the previously created *Communication System* **Poetry Slam Manager** in SAP S/4HANA Cloud Public Edition.  
    2. In the *Identity Provider* section, activate **OAuth 2.0 Identity Provider**.  
    3. Upload the signing certificate of the SAP BTP consumer subaccount.  
    4. Set the following values:  
        - *User ID Mapping Mode*: `User Name`
        - *OAuth 2.0 SAML Issuer*: `Common Name of the Signing Certificate Issuer`  
          > Note: Value behind `CN=` of the `Signing Certificate Issuer`

3. Change the authentication method of the *Poetry Slam Manager - Project* communication arrangement to OAuth 2.0:
    1. Open and edit the previously created *Communication Arrangement* **Poetry Slam Manager - Project**.
    2. Under *Inbound Communication*, select the user for inbound services with the **OAuth 2.0** authentication method.  

    	> Note: The following communication arrangements do not support the authentication method OAuth 2.0 and therefore will be using basic authentication:  
    	>-  *Communication Arrangement* **Poetry Slam Manager - Project Profile** for *Communication Scenario* **SAP_COM_0724**  
    	>-  *Communication Arrangement* **Poetry Slam Manager - Project Status** for *Communication Scenario* **SAP_COM_0725**  

4. After saving the *Communication Arrangement*, you need the following values to configure the destinations in the SAP BTP consumer account to connect to the SAP S/4HANA Cloud OData services:
    1. From the *Common Data* section, note down the **API-URL** of the *Communication Arrangement*.
    2. In the *Inbound Communication* section, open the **OAuth 2.0 Details** and note down the following values:
        - **Client ID**
        - **Token Service URL**
        - **SAML2 Audience**

    > Note: In a previous step, other values for the destination configuration were already saved:
    >-  **User Name** of the *Communication User*
    >-  **Password** of the *Communication User*

## Set Up Destinations to Connect the SAP BTP Application to SAP S/4HANA Cloud Public Edition

In this section, three destinations are created to access SAP S/4HANA Cloud OData services:
- Destination **s4hc** to consume SAP S/4HANA Cloud OData services with principal propagation.
- Destination **s4hc-tech-user** to consume SAP S/4HANA Cloud OData services using a technical basic authentication.
- Destination **s4hc-url** to provide the SAP S/4HANA Cloud hostname of UI navigations and the name of the SAP S/4HANA Cloud Public Edition system as used by business users.

1. In the SAP BTP consumer subaccount, you can create the destination *s4hc* to consume SAP S/4HANA Cloud OData services with principal propagation. To do this, go to *Connectivity* in the SAP BTP consumer subaccount.

2. Choose *Destinations* and create a *New Destination* with the following field values:

    | Parameter Name            | Value                                                                                         |
    | :------------------------ | :-------------------------------------------------------------------------------------------- |
    | *Name*:                   | *s4hc*                                                                                        |
    | *Type*:                   | *HTTP*                                                                                        |
    | *Description*:            | Destination description (For example, `SAP S/4HANA Cloud XXXXXX with principal propagation`)  |
    | *URL*:                    | **API-URL** of the *Communication Arrangement*                                                |
    | *Proxy Type*:             | *Internet*                                                                                    |
    | *Authentication*:         | *OAuth2SAMLBearerAssertion*                                                                   |
    | *Audience*:               | **SAML2 Audience** from the *OAuth 2.0 Details*                                               |
    | *AuthnContextClassRef*:   | *urn:oasis:names:tc:SAML:2.0:ac:classes:X509*                                                 |
    | *Client Key*:             | **Client ID** from the *OAuth 2.0 Details*                                                    |
    | *Token Service URL*:      | **Token Service URL** from the *OAuth 2.0 Details*                                            |
    | *Token Service User*:     | **User Name** of the *Communication User*                                                     |
    | *Token Service Password*: | **Password** of the *Communication User*                                                      |

3. Enter the *Additional Properties*:
    
    | Property Name   	| Value                                                           |
    | :---------------- | :-------------------------------------------------------------- |
    | *nameIdFormat*	| *urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress*        |

    > Note: For testing, you may configure a basic authentication using the **SAP S/4HANA Cloud Communication User** and **SAP S/4HANA Cloud Communication User Password** of the *s4hc* destination.

4. Create the *s4hc-tech-user* destination to consume SAP S/4HANA Cloud OData services using a technical communication user.

    In the SAP BTP consumer subaccount, go to *Connectivity* and choose *Destinations* to create a *New Destination* with the following field values:

    | Parameter Name    | Value                                                                                 |
    | :---------------- | :------------------------------------------------------------------------------------ |
    | *Name*:           | *s4hc-tech-user*                                                                      |
    | *Type*:           | *HTTP*                                                                                |
    | *Description*:    | Destination description (For example, `SAP S/4HANA Cloud XXXXXX with technical user`) |
    | *URL*:            | **API-URL** of the *Communication Arrangement*                                        |
    | *Proxy Type*:     | *Internet*                                                                            |
    | *Authentication*: | *BasicAuthentication*                                                                 |
    | *User*:           | **User Name** of the *Communication User*                                             |
    | *Password*:       | **Password** of the *Communication User*                                              |

6. Create the *s4hc-url* destination to launch SAP S/4HANA Cloud Public Edition apps and to store the name of the SAP S/4HANA Cloud Public Edition system used by business users. 

   In the SAP BTP consumer subaccount, go to *Connectivity* and choose *Destinations* to create a *New Destination* with the following field values:

    | Parameter Name    | Value                                                                                             |
    | :---------------- | :------------------------------------------------------------------------------------------------ |
    | *Name*:           | *s4hc-url*                                                                                        |
    | *Type*:           | *HTTP*                                                                                            |
    | *Description*:    | Destination description (For example, `SAP S/4HANA Cloud XXXXXX`)                                 |
    | *URL*:            | UI endpoint of the SAP S/4HANA Cloud Public Edition system (For example, `https://myXXXXXX.s4hana.ondemand.com`) |
    | *Proxy Type*:     | *Internet*                                                                                        |
    | *Authentication*: | *NoAuthentication*                                                                                |

    > Note: The destination URL stores the hostname of the SAP S/4HANA Cloud Public Edition system. By storing the base URL in a destination, you ensure that connecting the SAP BTP web application to the SAP S/4HANA Cloud Public Edition system is a pure configuration task and does not require any code changes. 
    
   At runtime, you dynamically assemble the parameterized URL to launch the project planning view of SAP S/4HANA Cloud enterprise projects. You do this by concatenating the base URL with the floorplan-specific path and the object-specific parameters, such as the project ID. The authentication method isn't relevant in this destination, so you choose *NoAuthentication* to keep things simple. Note that this destination can't be used to access any SAP S/4HANA Cloud service directly.
   
    > Note: The destination description is used to store the name of the SAP S/4HANA Cloud Public Edition system used by business users. At runtime, this description is used to refer to the SAP S/4HANA Cloud Public Edition system on the UI of the SAP BTP application.

## Add SAP BTP Applications to SAP Fiori Launchpad

As a last step, the Poetry Slam Manager apps and SAP BTP admin apps are added to SAP Fiori launchpad enable poetry slam managers and system administrators to launch all relevant applications from a single launchpad.

1.  In the SAP S/4HANA Cloud tenant, to create a custom tile, open the **Custom Tiles** app and add a new tile with the following field values:
			
    | Field        | Value                                                                                          |
    | :----------- | :--------------------------------------------------------------------------------------------- |
    | *Title*:     | `Poetry Slams`                                                                                 |
    | *ID*:        | `POETRYSLAMS`                                                                                  |
    | *Subtitle*:  | `Manage Poetry Slams`                                                                          |
    | *URL*:       | Enter the **SAP BTP Application Poetry Slams Tenant URL**, you noted down in a previous step.  |
    | *Icon*:      | Choose an icon, for example, *sap-icon://microphone*.                                          |
            
2. Choose *Assign Catalogs* and add a *Business Catalog*, for example, *Enterprise Projects - Project Control Management*.
	
3. Choose *Publish*.

4. Open the *App Finder* in your user profile and search for the *Enterprise Projects - Project Control Management* catalog. 

    > Note: Optionally, you can assign the app to a different or to a new app group. 

    > Note: Refresh your browser window if the app is not listed.

5. Repeat the previous steps for the **Manage Visitors** app. Use the **SAP BTP Application Visitors Tenant URL** as URL.

You can now see the **Manage Poetry Slams** and **Manage Visitors** apps on SAP Fiori launchpad in the *Project Control Management* group.

Repeat the same steps with suitable business catalogs to create custom tiles for the Identity Authentication service admin application.

> Note: Typically, customers have SAP S/4HANA Cloud tenants for customizing, test, and productive use. In such a setup, the custom tile is created in the customizing tenant and transported to the test and productive tenants using the software collections. 

## Create Users and Assign Authorizations

The SAP BTP application design relies on business users and authorizations being created and managed in the Cloud ERP solution (in this case, SAP S/4HANA Cloud Public Edition) and the customer identity provider (in this case, Identity Authentication service connected to SAP S/4HANA Cloud Public Edition).
As a general approach, users are created in the ERP solution and the IdP, and then assigned to the user group that includes the authorization of the partner application users.

To create a user in SAP S/4HANA Cloud Public Edition, follow the documentation about [Identity and Access Management](https://help.sap.com/docs/SAP_S4HANA_CLOUD/53e36b5493804bcdb3f6f14de8b487dd/f25f9108740442c3804370f2d88a9bdd.html?locale=en-US).

> Note: Make sure that you maintain the same email address for users in the Cloud ERP and the Identity Authentication service tenant. Otherwise, single sign-on and the API-led integration using OAuth SAML bearer won't work.

## Test

1. To test the integration and single sign-on authentication, open SAP Fiori launchpad and log on using your SAP S/4HANA Cloud user.  

2. Launch the Manage Poetry Slams app using the the custom tile.  

3. The Manage Poetry Slams app opens in a new browser tab without any additional authentication prompt.  

    1. Open a poetry slam that is *published* or *fully booked* and create a project in SAP S/4HANA Cloud Public Edition.  
    2. Check that the navigation to the project in SAP S/4HANA Cloud Public Edition works.  

4. Launch the Manage Visitors app using the the custom tile.  

5. The Manage Visitors app opens in a new browser tab without any additional authentication prompt.  

<img src="./images/34_mt_s4hc_launchpad.png">

## Remarks and Troubleshooting

If you need more information on how to trace and debug your application with ERP integration, go to the section on [testing and troubleshooting](32-Test-Trace-Debug-ERP.md). If you're looking for more information on the ERP integration of Poetry Slam Manager, take the [guided tour about the ERP integration](31-Guided-Tour-ERP-Integration.md).
