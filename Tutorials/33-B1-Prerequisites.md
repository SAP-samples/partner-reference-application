# Learn More About the Prerequisites and the Purpose of SAP Business One Integration

## Purpose
In the last sections, you learned how to create the Poetry Slam Manager solution and how to enable it for multitenancy. In this section, Poetry Slam Manager is connected with the customer's SAP Business One system to allow the procurement of anything that is required for organizing or staging of poetry slams.

The following features are handled:
- Create purchase orders for poetry slam events with one click and preview purchase order information on the Poetry Slams UI.

- As an SAP Business One user, start Poetry Slams and Visitors applications from your SAP Business One launchpad and navigate from the Poetry Slams application to the associated purchase order in the system.

## Prerequisites
Make sure that you fulfill the following prerequisites to implement this section:
- You need an SAP Business One system with purchase orders in use.
- You need a user with access to the configuration of the SAP Business One system:
    - to set up identity and authentication management,
    - to create users and to assign authorizations, and
    - to add web client extensions.

## API Overview
As Poetry Slam Manager will use OData services of SAP Business One to create and read purchase order data, make yourself familiar with the interfaces: [Working with SAP Business One Service Layer](https://help.sap.com/doc/0d2533ad95ba4ad7a702e83570a21c32/9.3/en-US/Working_with_SAP_Business_One_Service_Layer.pdf)

## Links to SAP Business One Help
As the integration of Poetry Slam Manager and SAP Business One is supposed to work without any further authentification steps, you configure single sign-on in the tutorial. Besides this, URL mashups are created. User maintenance and authorizations are, of course, important, too. 

If you need more information about these topics, you can have a look at the following links as a reference:

1. [Identity and Authentication Management in SAP Business One](https://help.sap.com/docs/SAP_BUSINESS_ONE_IAM/548d6202b2b6491b824a488cfc447343/7f94c5836fad44e6a02322d39e229cc3.html)

2. [Setting Up SAP BTP Destination for Service Layer](https://help.sap.com/docs/SAP_BUSINESS_ONE_WEB_CLIENT/e6ac71d18c7543828bd4463f77d67ff7/bfeaccb8b53348318970f8bbbc3d5f0a.html?q=Business%20One%20extension)

3. Visual Studio Code Wizard for SAP Business One, Web client extensions

    i. [Yeoman-ui - graphical user interface for running Yeoman generators](https://github.com/SAP/yeoman-ui)

    ii. [Development Environment Setup](https://help.sap.com/docs/SAP_BUSINESS_ONE_WEB_CLIENT/e6ac71d18c7543828bd4463f77d67ff7/b121ab221f4044baaf6051bba14cc160.html)

    iii. [Packaging Your Apps Using VS Code Wizard for SAP Business One, Web Client Extensions](https://help.sap.com/docs/SAP_BUSINESS_ONE_WEB_CLIENT/e6ac71d18c7543828bd4463f77d67ff7/581b9433bb92442eb24b86b34041766e.html?q=Business%20One%20extension)
    
    iv. [Create a URL mashup](https://help.sap.com/docs/SAP_BUSINESS_ONE_WEB_CLIENT/e6ac71d18c7543828bd4463f77d67ff7/28461b436583429b9d17c2db43567323.html?q=Business%20One%20extension)

4. [User Accounts and Authorizations](https://help.sap.com/doc/saphelpiis_hc_b1_image_repository_consultant_training_basic_b1_90_tb1200_02_03_pdf/9.0/en-US/B1_90_TB1200_02_03.pdf)

## Next Steps
Now that you have an overview of the aim and the prerequisites of the SAP Business One integration, the next step is to [integrate the SAP BTP application with SAP Business One](./33a-B1-Integration.md).
