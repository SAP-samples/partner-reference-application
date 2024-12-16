# Prepare Your SAP BTP Subaccount for Deployment

When you want to deploy your SAP BTP application to a subaccount, first, you need to prepare a few things, for example, you need to assign the required services and enable SAP BTP Cloud Foundry runtime.

## Set Up the SAP BTP Subaccount

1. In the SAP BTP cockpit (global account), create a subaccount to host the application runtime (in this example, the data center of *Amazon Web Services (AWS)* and *Europe (Frankfurt)* as region are used).

2. Optional: Assign the subaccount to a directory as a parent.

3. Go to *Entitlements* in the subaccount, choose *Edit* and *Add Service Plans*. Assign quotas for the following entities to your subaccount you want to deploy the application to:
	- *SAP BTP Cloud Foundry runtime* (3 units of application runtime)
		- As *Plan*, select *standard-edition (Application)*.
		> Note: If the value help doesn't offer an item referring to *Cloud Foundry*, select *Application runtime*.	

		> Note: In your SAP BTP environment, this entitlement may already have been added by default.  	
	- *SAP HANA Cloud* (1 unit)
		- As *Plan*, select *hana-td*.
	- *SAP HANA Cloud* (1 unit)
		- As *Plan*, select *tools*.		
	- *SAP HANA Schemas & HDI Containers*
		- As *Plan*, select *hdi-shared*.
	- *SAP Authorization and Trust Management service* (1 unit)
		- As *Plan*, select *broker*.
	- *SAP Build Work Zone*
		- As *Plan*, select *standard (Application)*. 

	The relevant entitlements are selected by default when the subaccount is created (no action is required):

	- *Service Manager*, service plan *container*
	- *HTML5 Application Repository Service*, service plans *app-runtime* and *app-host*

### Maintain Provider Subaccount Administrators

In the SAP BTP cockpit, maintain the application administrators:

1. Open the menu item *Security - Users* and enter the users. 
2. Assign the role collection *Subaccount Administrators* to the users that take on the role of subaccount administrators. 

## Enable SAP BTP Cloud Foundry Runtime

In the SAP BTP cockpit (provider subaccount), create an SAP BTP Cloud Foundry runtime space to host the database and the runtime:

1. Go to *Overview* in the subaccount and choose *Enable Cloud Foundry*. Enter the following information:
	- As *Plan*, select *standard*.
	- As *Landscape*, select *cf-eu10*. 
	- As *Instance Name*, enter `poetryslams`.
	- As *Org Name*, enter a name, for example, an abbreviation for you as a partner and the solution you want to host.
	  > Note: When choosing the org name, make sure that it meets the following requirements: 
	  > - It must not exceed 12 characters.
	  > - Use a unique name.
	  > - Include an element that identifies you as a partner.
	  > - Use only lower-case letters. 
	  >
	  > Here’s why: At a later stage, you will use SAP Custom Domain service to create a server certificate for your application. This certificate will be valid for the application URL, which has the value *{org name}-{space name}-poetry-slams.{domain}*. The certificate requires that this URL doesn’t exceed 64 characters. The domain in the eu10 landscape is *cfapps.eu10-004.hana.ondemand.com*. With a 3-letter name for the space (for example, `app`), this leaves only 12 characters for the org name. At the same time, the org name must be unique and must, therefore, include an element that identifies you as a partner. Also, use only lower-case letters in the org name to avoid routing issues.
	  >
	  > For example: For Poetry Slam Manager delivered by SAP, it could be `sap-psm`.

2. Choose *Create*. 

3. Choose *Create Space* and enter a name, for example, `app` as *Space Name*.

4. Keep the standard roles and add [Cloud Foundry org members](https://help.sap.com/docs/btp/sap-business-technology-platform/add-org-members-using-cockpit) and [Cloud Foundry space members](https://help.sap.com/docs/btp/sap-business-technology-platform/add-space-members-using-cockpit).

## Create an SAP HANA Cloud Database

1. In the SAP BTP cockpit (subaccount), open the *Service Marketplace* and select the service *SAP HANA Cloud*.

2. Create a subscription of *SAP HANA Cloud* with
    - *Service*: *SAP HANA Cloud, standard edition*
    -  *Plan*: *tools*

		> Note: The subscribed tool SAP HANA Cloud Central can be used to manage the database configuration, to upgrade the database, to create backups, to start a recovery, and to access the stored data.
		
		> Note: More details about the administration of the SAP HANA Cloud database, you can find in the [SAP HANA Cloud Administration Guide](https://help.sap.com/docs/hana-cloud/sap-hana-cloud-administration-guide/sap-hana-cloud-administration-guide).

3. In the left navigation pane, open *Security > Users* and add the role collection *SAP HANA Cloud Administrator* to your user.

4. In the navigation bar of the SAP BTP subaccount cockpit, select *Services* and go to *Instances and Subscriptions*. 

5. In the *Subscriptions* section, find the subscription of the service *SAP HANA Cloud* and choose the *SAP HANA Cloud* hyperlink.

6. On the *SAP HANA Cloud Central* page, choose the button *Create Instance* to create the new database.

7. Choose *SAP HANA Cloud, SAP HANA Database* as type.

8. In the section *Runtime Environment*, select *Cloud Foundry*. In case the *Cloud Foundry* tab is disabled, login to *Cloud Foundry*.

9. Select the space you created before, for instance `app`.

10. On the next page *General*: 
	- Enter `poetryslams-db` as *Instance Name*.
	- Enter a password.

11. On the next page *SAP HANA Database*, the performance class can be selected to optimize the performance-cost balance. Use the default for this example.

12. On the next pages *SAP HANA Database Availability Zone and Replicas* and *SAP HANA Database Advanced Settings*, use the default settings.

13. On the right side, you get an overview of the used capacity units (CUs) per month. Select *Review and Create* to create the SAP HANA Cloud database instance. 

14. The *poetry-slams-db* is now in state *Creating*. Once the status switches to *Running*, the database can be used.

## Subscribe to SAP Build Work Zone Application

1. In the SAP BTP cockpit (subaccount), open the *Service Marketplace* and select the service *SAP Build Work Zone*.

2. Create a subscription of *SAP Build Work Zone* with
    - *Service*: *SAP Build Work Zone, standard edition*
    -  *Plan*: *standard*

3. In the left navigation pane, open *Security > Users* and add the role collection *Launchpad_Admin* to your user.

> Note: SAP Build Work Zone provides a managed application router, which is used to manage application authentication and tokens. Before you deploy your application, subscribe to SAP Build Work Zone to ensure that the web app can be published as an HTML5 application.

## Develop, Test, and Deploy Your Application

Now, you can deploy your application:
- You can either [directly deploy Poetry Slam Manager](./13-Deploy-Sample-Application.md) as defined in this repository.
- Alternatively, follow the step-by-step guidelines about [how to develop the application](./14-Develop-Core-Application.md) from scratch and [how to deploy it](./15a-Prepare-One-Off-Deployment.md).

Looking for more information? Read up on [testing, tracing, debugging](./16-Test-Trace-Debug.md) and check out the [guided tour that shows you the functionality of Poetry Slam Manager](./17-Guided-Tour.md).