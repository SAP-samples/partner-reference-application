# Prerequisites and Purpose of SAP Business ByDesign Integration

## Purpose

In the last sections, you learned how to create the Poetry Slam Manager solution and how to enable it for multitenancy. In this section, Poetry Slam Manager is connected with the customer's SAP Business ByDesign system to allow additional planning steps in a project.

The following features are handled:
- Create projects for poetry slam events with one click and preview project information on the Poetry Slams UI.

- As an SAP Business ByDesign user, start Poetry Slams and Visitors applications from your SAP Business ByDesign launchpad and navigate from Poetry Slams to the associated project in the system.

## Prerequisites
Make sure that you fulfill the following prerequisites to implement this section
- You need an SAP Business ByDesign subscription.
- You need a user with the Project Management work center.
- You need a user with access to the Application and User Management work center:
    - to set up single sign-on,
    - to create users and to assign authorizations, 
    - to create customer-defined OData services, and
    - to create mashups.

## API Overview
As Poetry Slam Manager will use customer-defined OData services of SAP Business ByDesign to create and read project data, make yourself familiar with the interfaces:

1.	[SAP Business ByDesign API Overview](https://community.sap.com/t5/enterprise-resource-planning-blogs-by-sap/sap-business-bydesign-api-overview/ba-p/13415251)
2.	[SAP Business ByDesign OData API Usage Samples](https://community.sap.com/t5/enterprise-resource-planning-blogs-by-sap/sap-business-bydesign-odata-api-examples/ba-p/13400614) 

## Links to SAP Business ByDesign Help
As the integration of Poetry Slam Manager and SAP Business ByDesign is supposed to work without any further authentification steps, you configure single sign-on in the tutorial. Besides this, URL mashups are created. User maintenance and authorizations are, of course, important, too.

If you need more information about the topics, you can have a look at the following links as a reference:

1. [Single Sign-On (SSO) with SAP Business ByDesign](https://community.sap.com/t5/enterprise-resource-planning-blogs-by-sap/single-sign-on-sso-with-sap-business-bydesign/bc-p/13337099/highlight/true)

2. [Configure OAuth 2.0 for SAP Business ByDesign OData Services](https://community.sap.com/t5/enterprise-resource-planning-blogs-by-sap/configure-oauth-2-0-for-sap-bydesign-odata-services/ba-p/13355322)

3. [Work Quick Guide (in User and Access Management)](https://help.sap.com/docs/SAP_BUSINESS_BYDESIGN/2754875d2d2a403f95e58a41a9c7d6de/2dd4a17b722d10148deffc01caa1c49b.html)

4. [Service Agents Quick Guide](https://help.sap.com/docs/SAP_BUSINESS_BYDESIGN/2754875d2d2a403f95e58a41a9c7d6de/fa1b263da6274a2d864fb75c4f7fc182.html)

5. [Quick Guide for Employees in Business Partner Data](https://help.sap.com/docs/SAP_BUSINESS_BYDESIGN/2754875d2d2a403f95e58a41a9c7d6de/2dd59e78722d1014b6eee1e49ba6383c.html)

6. [Create a URL Mashup](https://help.sap.com/docs/SAP_BUSINESS_BYDESIGN/2754875d2d2a403f95e58a41a9c7d6de/2be269a4722d1014a96d9a0ba09c255a.html)


## Next Steps
Now that you have an overview of the aim and the prerequisites of the SAP Business ByDesign integration, the next step is to [integrate the SAP BTP application with SAP Business ByDesign](./35a-ByD-Integration.md).