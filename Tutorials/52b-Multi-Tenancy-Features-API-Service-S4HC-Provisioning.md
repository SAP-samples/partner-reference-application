# Configure the Connection with SAP S/4HANA Cloud Public Edition

This section describes how the consumer subaccount is configured to support the **Sponsoring of a Poetry Slam Event** integration scenario with the SAP S/4HANA Cloud tenant of your customer.

## Prerequisites
It is already described in previous chapters how to [provision your multi-tenant application to consumer subaccounts](./25-Multi-Tenancy-Provisioning.md) and how to [configure and consume the APIs of the SAP BTP application](./42b-Multi-Tenancy-Provisioning-Service-Broker.md). They are listed below, but are not described in detail.

1. Set up the SAP BTP consumer subaccount.
2. Subscribe to your created SAP SAP BTP application in the consumer subaccount.
3. Set up single sign-on for the SAP BTP application subscription as described in the [Configure Trust Using SAML 2.0](./25-Multi-Tenancy-Provisioning.md#configure-trust-using-saml-20) integration scenario [Provision Your Multi-Tenant Application to Consumer Subaccounts](./25-Multi-Tenancy-Provisioning.md). Reuse the Identity Authentication service that is used by the SAP S/4HANA Cloud tenant for authentication.   

## Configure SAP S/4HANA Cloud OData Services to Read Sales Order and Business Partner Data 

1. Search for the following OData APIs on the [SAP Business Accelerator Hub](https://api.sap.com/package/SAPS4HANACloud/all) and take note of the communication scenarios per API:
    - [*Sales Order (A2X)*](https://api.sap.com/api/CE_SALESORDER_0001/overview) (OData v4): Communication scenario: *Sales Order Integration* (SAP_COM_0109)
    - [*Business Partner (A2X)*](https://api.sap.com/api/API_BUSINESS_PARTNER/overview) (OData v2): *Business Partner, Customer and Supplier Integration* (SAP_COM_0008)

2. In the SAP S/4HANA Cloud Public Edition system, open the **Communcation Systems** application and create a new *Communication System* that represents the SAP BTP consumer subaccount.
    > Note: If you aready configured the communication system for the project integration, you can use this instead.

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

3. Add/Create a **Communication User** for inbound communication to the **Communication System** in the *Users for Inbound Communication* section:

    > Note: If you already configured the communication user for the project integration, you can use this instead.

    | Parameter Name    | Value                                         |
    | :---------------- | :-------------------------------------------- |
    | *User Name*:      | `PSM-USER`                                    |
    | *Description*:    | `Poetry Slam Manager - Communication User`    |
    | *Password*:       | Choose a secure password.                     |

    > Note: Save the **User Name** and **Password** as they are used for the SAP BTP destination configuration later.

4. Create a new **Communication Arrangement**: Open the *SAP_COM_0109* communication scenario and choose **Create Comm. Arrangement** to start the configuration.

    | Parameter Name         | Value                                                                            |
    | :---------------------- | :---------------------------------------------------------------------------    |
    | *Arrangement Name*:     | Choose a meaningful name, for example, `Poetry Slam Manager - Sales Order`.     |
    | *Communication System*: | Choose the communication system created above.                                  |
    | *Inbound Communication - User Name*: | Choose the user for inbound communication created above.           |
    | *Inbound Communication - Authentication Method*: | `User ID and Password`                                 |

5. Create further communication arrangements for the other OData services using the same communication system and communication user:
    - Communication arrangement *Poetry Slam Manager - Business Partner* for communication scenario *SAP_COM_0008*. Only the inbound communication is required, the outbound services can be set to inactive.

You can now consume the OData service using the technical user and basic authentication (user/password).

## Configure OAuth Authentication for OData Services

OAuth 2.0 SAML Bearer authentication is used to access the SAP S/4HANA Cloud OData service to read the data with the user context initiated by a user on the Poetry Slam Manager UI. As a result, SAP S/4HANA Cloud user authorizations apply to the Poetry Slam Manager app as well. Users without the permission to read sales orders and business partners in SAP S/4HANA Cloud Public Edition can still open the Poetry Slam Manager app, but SAP S/4HANA Cloud sales orders and business partners data is not retrieved.

### Configure Authentication by Business Users
Configure SAP S/4HANA Cloud for OAuth 2.0 SAML Bearer authentications.

1. Download the X.509 certificate of the SAP BTP consumer subaccount:  
    1. In the SAP BTP consumer subaccount, choose *Connectivity* and go to *Destinations*.  
    2. Choose *Download Trust* and save the file with the signing certificate.  

2. Create the OAuth 2.0 identity provider for the **Communication System** in SAP S/4HANA Cloud Public Edition:  
    1. Open and edit the previously created **Communication System** named **Poetry Slam Manager** in SAP S/4HANA Cloud Public Edition.  
    2. In the *Identity Provider* section, activate **OAuth 2.0 Identity Provider**.  
    3. Upload the signing certificate of the SAP BTP consumer subaccount.  
    4. Set the following values:  
        - *User ID Mapping Mode*: `User Name`
        - *OAuth 2.0 SAML Issuer*: `Common Name of the Signing Certificate Issuer`  
          > Note: Value behind `CN=` of the `Signing Certificate Issuer`

3. Change the authentication method of the **Poetry Slam Manager - Sales Order** communication arrangement to OAuth 2.0:
    1. Open and edit the previously created **Communication Arrangement** named **Poetry Slam Manager - Sales Order**.
    2. Under *Inbound Communication*, select the user for inbound services with the **OAuth 2.0** authentication method.  

5. Change the authentication method of the **Poetry Slam Manager - Business Partner** communication arrangement to OAuth 2.0:
    1. Open and edit the previously created **Communication Arrangement** named **Poetry Slam Manager - Business Partner**.
    2. Under *Inbound Communication*, select the user for inbound services with the **OAuth 2.0** authentication method.  

6. After saving the **Communication Arrangement**, you need the following values to configure the destinations in the SAP BTP consumer account to connect to the SAP S/4HANA Cloud OData services:
    1. From the *Common Data* section, note down the **API-URL** of the *Communication Arrangement*.
    2. In the *Inbound Communication* section, open the **OAuth 2.0 Details** and note down the following values:
        - **Client ID**
        - **Token Service URL**
        - **SAML2 Audience**

    > Note: In a previous step, other values for the destination configuration were already saved:
    >-  **User Name** of the *Communication User*
    >-  **Password** of the *Communication User*

## Set Up Destinations to Connect the SAP BTP App to SAP S/4HANA Cloud Public Edition

In this section, destinations are created to access SAP S/4HANA Cloud OData services:
- **s4hc** to consume SAP S/4HANA Cloud OData services with principal propagation,
- **s4hc-url** to provide the SAP S/4HANA Cloud hostname of UI navigations and the name of the SAP S/4HANA Cloud Public Edition system as used by business users.

1.  In the SAP BTP consumer subaccount, go to **Connectivity** to create the destination *s4hc* to consume SAP S/4HANA Cloud OData services with principal propagation.

    > Note: If you already configured the destination for the project integration, you can use this instead.

    1. Choose **Destinations** and create a *New Destination* with the following field values:

        > Note: If you already configured the project scenario, you can reuse the destination and just add the scopes to the additional properties.

        | Parameter Name           | Value                                                                                    |
        | :------------------------ | :---------------------------------------------------------------------------------------- |
        | *Name*:                   | *s4hc*                                                                                    |
        | *Type*:                   | *HTTP*                                                                                    |
        | *Description*:            | Destination description, for example, `SAP S/4HANA Cloud XXXXXX with principal propagation`    |
        | *URL*:                    | API endpoint of your SAP S/4HANA Cloud Public Edition system, for example, `https://myXXXXXX-api.s4hana.ondemand.com` |
        | *Proxy Type*:             | *Internet*                                                                                |
        | *Authentication*:         | *OAuth2SAMLBearerAssertion*                                                               |
        | *Audience*:               | Enter the **SAP S/4HANA Cloud OAuth SAML2 Audience**, for example, ``https://myXXXXXX.s4hana.ondemand.com``. |
        | *AuthnContextClassRef*:   | *urn:oasis:names:tc:SAML:2.0:ac:classes:X509*                                             |
        | *Client Key*:             | Enter the **SAP S/4HANA Cloud OAuth Client ID**.                                                         |
        | *Token Service URL*:      | Enter the **SAP S/4HANA Cloud OAuth Token Service URL**, for example, ``https://myXXXXXX-api.s4hana.ondemand.com/sap/bc/sec/oauth2/token``. |
        | *Token Service User*:     | Enter the **SAP S/4HANA Cloud OAuth Client ID**.                                                         |
        | *Token Service Password*: | Enter the **SAP S/4HANA Cloud OAuth Client Secret**.                                                    |

    2. Enter the *Additional Properties*:
        
        | Property Name  | Value                                                          |
        | :-------------- | :-------------------------------------------------------------- |
        | *nameIdFormat*: | *urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress*        |

        > Note: For testing, you may configure a basic authentication using the **SAP S/4HANA Cloud Communication User** and **SAP S/4HANA Cloud Communication User Password** of the  *s4hc* destination.

2. Create the *s4hc-url* destination to launch SAP S/4HANA Cloud Public Edition apps and to store the name of the SAP S/4HANA Cloud Public Edition system used by business users. 

    > Note: If the project scenario is already configured, you can reuse the destination and therefore skip the creation.

    1.  In the SAP BTP consumer subaccount, go to **Connectivity**, choose **Destinations**, and create a *New Destination* with the following field values:

        | Parameter Name   | Value                                                                                    |
        | :---------------- | :-------------------------------------------------------------------------------------- |
        | *Name*:           | *s4hc-url*                                                                              |
        | *Type*:           | *HTTP*                                                                                  |
        | *Description*:    | Enter the name of your *SAP S/4HANA Cloud Public Edition* system used by your business users, for example, ``My Productive SAP System``. |
        | *URL*:            | UI endpoint of your SAP S/4HANA Cloud Public Edition system, for example, ``https://myXXXXXX.s4hana.ondemand.com`` |
        | *Proxy Type*:     | *Internet*                                                                              |
        | *Authentication*: | *NoAuthentication*                                                                      |

        > Note: The destination URL stores the hostname of the SAP S/4HANA Cloud Public Edition system. By storing the base URL in a destination, you ensure that connecting the SAP BTP web application to the SAP S/4HANA Cloud Public Edition system is a pure configuration task and doesn't require any code changes. 
        
        At runtime, you dynamically assemble the parameterized URL to launch the sales order view of SAP S/4HANA Cloud Public Edition by concatenating this base URL with the floorplan-specific path and the object-specific parameters, for example the sales order ID. The authentication method is not relevant in this destination. Therefore, choose **NoAuthentication** to keep things simple (of course, this destination cannot be used to use any SAP S/4HANA Cloud service directly).

        > Note: The destination description is used to store the name of the SAP S/4HANA Cloud Public Edition system used by business users. At runtime, you use this description to refer to the SAP S/4HANA Cloud Public Edition system on the UI of the SAP BTP application.

## Create Users and Assign Authorizations

The SAP BTP application design relies on business users and authorizations being created and managed in the Cloud ERP solution (in this case, SAP S/4HANA Cloud Public Edition) and the customer identity provider (in this case, Identity Authentication service connected to SAP S/4HANA Cloud Public Edition).
As a general approach, users are created in the ERP solution and the IdP, and then assigned to the user group that includes the authorization of the partner application users.

To create a user in  SAP S/4HANA Cloud Public Edition, see [Identity and Access Management](https://help.sap.com/docs/SAP_S4HANA_CLOUD/a630d57fc5004c6383e7a81efee7a8bb/f25f9108740442c3804370f2d88a9bdd.html?q=Maintain%20Business%20Users).

> Note: Make sure that you maintain the same email address for users in the Cloud ERP and the Identity Authentication service tenant. Otherwise, single sign-on and the API-led integration using OAuth SAML bearer won't work.

### Launch the SAP BTP Multi-Tenant Application

1. To launch the **Poetry Slam Manager** application, choose **Go to Application**. Copy the link address of the **Poetry Slam Manager** application and note it down as **SAP BTP Application Poetry Slams Tenant URL** for later reference.

2. From there, open a fully booked poetry slam and choose **Maintain Visitors**. Copy the link address of the **Visitors** application and note it down as **SAP BTP Application Visitors Tenant URL** for later reference.

> Note: If you're directed to an SAP HANA XS Advanced Login screen after launching the application, check the naming of your SAP BTP Cloud Foundry runtime organization. The organization name must be in lowercase.

## A Guided Tour to Explore the Feature

Let's do a walk-through. First, a poetry slam needs to be updated with a sales order ID that is available in the connected SAP S/4HANA Cloud tenant.

Therefore, open the [ServiceBroker_TechnicalAccessPoetrySlamManagerAPI.http](./api-samples/ServiceBroker_TechnicalAccessPoetrySlamManagerAPI.http) sample in your SAP Business Application Studio and do the following steps:

1. Enter the required data, for example <endpoints-psm-servicebroker> on top of the file.  

2. Get the access token by sending the request.

3. Send the **Get all poetry slams** request and replace the @newid variable with a published poetry slam.

4. Change `salesOrderID` in the *Update the Sales Order ID of a PoetrySlam* request to a sales order ID that exists in the SAP S/4HANA Cloud tenant.

5. Send the *Get all poetry slams* request and check that the poetry slam was updated with the sales order ID.

This simulates an update of the Poetry Slam Manager application through the API service from an external system. Now, let`s check how this looks in the system:

1. Launch your SAP Build Work Zone site.

2. On the SAP Build Work Zone site, you find the partner applications **Poetry Slam Manager** and **Visitors**. Start the **Poetry Slam Manager** app.

3. A list with the poetry slams is shown.

4. Select the poetry slam you updated with the sales order ID.

5. On the object page of the poetry slam, the sponsoring data section is shown. It displays the advertising sales order and the sponsoring business partner.

    > Note: The business partner ID and name are read from the SAP S/4HANA Cloud tenant on the fly.

## Remarks and Troubleshooting

If you need more information on how to trace and debug your application with ERP integration, go to the section on [testing and troubleshooting](32-Test-Trace-Debug-ERP.md).
