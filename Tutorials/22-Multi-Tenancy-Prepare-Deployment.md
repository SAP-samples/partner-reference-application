# Prepare your SAP BTP Account for Multi-Tenant Deployment
## Prepare SAP BTP

If you want to deploy your SAP BTP application to a subaccount, you need to prepare a few things first, for example, you need to assign the required services and enable SAP BTP Cloud Foundry runtime. The subaccount *PoetrySlamsProvider* hosts and handles the application, routing, and subscriptions. The consumer subaccount *PoetrySlamsMTSubscriber1* is used to subscribe to and access the application. 

The steps that are required to create a *PoetrySlamsProvider* subaccount for your multitenancy case are described below. The process for setting up *PoetrySlamsMTSubscriber1* is explained in a later step. 

> Note: This description applies to partner SAP BTP accounts of type "Test, Demo, and Development (TDD)". This is the recommended type for proof of concepts and development projects. For more details on partner SAP BTP environments for TDD and productive use, as well as the associated ordering processes, visit the [SAP Partner Portal, SAP PartnerEdge – Build Experience](https://partneredge.sap.com/en/partnership/development/build.html).

## Set Up the SAP BTP Provider Subaccount

1. In the SAP BTP cockpit (global account), create a provider subaccount to host the application runtime (in this example, the name PoetrySlamsProvider and the region *Europe (Frankfurt)* of the data center of *Amazon Web Services (AWS)* are used).

	> Note: In the following steps and descriptions, this subaccount is referred to as *provider subaccount*.

2. Optional: Assign the subaccount to a directory as a parent.

3. Navigate to the newly created provider subaccount and open *Entitlements* and assign quotas for the following entities to your provider subaccount: 

	- *SAP BTP Cloud Foundry runtime* (2 units of application runtime)
    	> Note: If the value help doesn't offer an item referring to *Cloud Foundry*, select *Application runtime*. Save your changes and the name of the list item changes to *Cloud Foundry*. In your SAP BTP environment, this entitlement may already have been added by default.
		- As *Plan*, select *MEMORY*.
	- *SAP HANA Cloud* (1 unit)
		- As *Plan*, select *hana*.
	- *SAP HANA Cloud* (1 unit)
		- As *Plan*, select *tools*.
	- *SAP HANA Schemas & HDI Containers* (min. 5 units: for the provider and four tenants)
		- As *Plan*, select *hdi-shared*.
	- *SAP Authorization and Trust Management service* (1 unit)
		- As *Plan*, select *broker*.
	- *SAP Custom Domain Service*
		- As *Plan*, select *standard (Application)*.

	The relevant entitlements are selected by default when the subaccount is created (no action is required):

	- *Service Manager*, service plan *container*
	- *SaaS Provisioning Service*, service plan *application*
	- *HTML5 Application Repository Service*, service plans *app-runtime* and *app-host*

### Maintain Provider Subaccount Administrators

In the SAP BTP cockpit (provider subaccount), maintain the application administrators:

1. Open the menu item *Security - Users* and enter the users. 
2. Assign the role collection *Subaccount Administrators* to the users that take on the role of subaccount administrators. 

### Enable SAP BTP Cloud Foundry Runtime

In the SAP BTP cockpit (provider subaccount), create an SAP BTP Cloud Foundry runtime space to host the database and the runtime:

1. Go to *Overview* in the subaccount and choose *Enable Cloud Foundry*. Enter the following information:
    - As *Plan*, select *standard*.
	- As *Landscape*, select *cf-eu10*. 
	- As *Instance Name*, enter `psm-mt`.
    - As *Org Name*, enter a name, for example, an abbreviation for you as a partner and the solution you want to host.
	  > Note: When choosing the org name, make sure that it meets the following requirements: 
	  > - It must not exceed 12 characters.
	  > - Use a unique name.
	  > - Include an element that identifies you as a partner.
	  > - Use only lower-case letters. 
	  >
	  > Here’s why: At a later stage, you will use SAP Custom Domain service to create a server certificate for your application. This certificate will be valid for the application URL, which has the value *{org name}-{space name}-poetry-slams.{domain}*. The certificate requires that this URL doesn’t exceed 64 characters. The domain in the eu10 landscape is *cfapps.eu10-004.hana.ondemand.com*. With a 3-letter name for the space (for example, `app`), this leaves only 12 characters for the org name. At the same time, the org name must be unique and must, therefore, include an element that identifies you as a partner. Also, use only lower-case letters in the org name to avoid routing issues.
	  >
	  > For example: For the multi-tenant Poetry Slam Manager delivered by SAP, it could be `sap-psm-mt`.

2. Choose *Create*. 

3. Create a space and enter a name, for example, `app` as *Space Name*.

4. Keep the standard roles and add [Cloud Foundry org members](https://help.sap.com/docs/btp/sap-business-technology-platform/add-org-members-using-cockpit) and [Cloud Foundry space members](https://help.sap.com/docs/btp/sap-business-technology-platform/add-space-members-using-cockpit).

### Create an SAP HANA Cloud Database

1. In the SAP BTP cockpit of the provider subaccount, open *Services - Service Marketplace* and select the service *SAP HANA Cloud*.

2. Create a subscription of *SAP HANA Cloud* with
    - *Service*: *SAP HANA Cloud*
    - *Plan*: *tools*

		> Note: The subscribed application *SAP HANA Cloud* (also called *SAP HANA Cloud Central*) can be used to manage the database configuration, to upgrade the database, to create backups and start a recovery, and to access the stored data.

		> Note: You can find more details about the administration of the SAP HANA Cloud database in the [SAP HANA Cloud Administration Guide](https://help.sap.com/docs/hana-cloud/sap-hana-cloud-administration-guide/sap-hana-cloud-administration-guide).

3. In the left navigation pane, open *Security > Users* and add the role collection *SAP HANA Cloud Administrator* to your user.

4. In the navigation bar, select *Services* and go to *Instances and Subscriptions*. 

5. In the *Subscriptions* section under *Application*, find the subscription of the service *SAP HANA Cloud* and select the *SAP HANA Cloud* hyperlink.

6. On the *SAP HANA Cloud Central* screen, choose the button *Create Instance* to create the new database.

7. Choose *SAP HANA Cloud, SAP HANA Database* as type.

8. In the section *Runtime Environment*, select *Cloud Foundry*. If the *Cloud Foundry* tab is disabled, choose *Sign in to Cloud Foundry*.

9. Select the space you previously created, for example `app`.

10. On the next page *General*, 
	- enter `poetryslams-hana` as *Instance Name*.
	- Enter a password.
		> Note: you will require this password for admin access to the database.

11. On the next page *SAP HANA Database*, you can select the performance class to optimize the performance-cost balance. Use the default for this example.

12. On the next pages *SAP HANA Database Availability Zone and Replicas* and *SAP HANA Database Advanced Settings*, use the default settings.

13. On the right, you get an overview of the used capacity units (CUs) per month. Select *Review and Create* to create the SAP HANA Cloud database instance. 

14. The *poetryslams-hana* is now in state *Creating*. Once the status switches to *Running*, the database can be used.

> Note: For efficient resource usage, you may [share your SAP HANA Cloud Database with other applications](https://help.sap.com/docs/HANA_SERVICE_CF/cc53ad464a57404b8d453bbadbc81ceb/390b47b7c0314d57a1829a0759a71ace.html). This can reduce your development costs in case you are developing several applications or use several test deployments. However, in productive setups, this approach may lead to challenges with lifecycle operations, scaling, and other unwanted interdependencies.

You have now successfully prepared your provider account for deployment. Next, you can [Enhance the core application for deployment](./23-Multi-Tenancy-Develop-Sample-Application.md).
