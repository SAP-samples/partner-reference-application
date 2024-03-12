# Preparation of Provider Subaccount 
## Prepare SAP BTP

Both the single-tenant and the multi-tenant applications use the same names and IDs and, therefore, cannot be deployed into the same SAP BTP subaccount. Hence, you create two new SAP BTP subaccounts. The subaccount *PoetrySlamsProvider* will host the application and handle the application, routing, and subscriptions. The consumer subaccount *PoetrySlamsMTSubscriber1* will be used to subscribe to and access the application. 

The process for setting up *PoetrySlamsMTSubscriber1* is explained in [Provision Tenants of the Multi-Tenant Application to Customers](./25-Multi-Tenancy-Provisioning.md).

You have already created a subaccount for the one-off deployment. Similar steps are required to create a *PoetrySlamsProvider* subaccount for your multitenancy case. These are described below.

## Set Up the SAP BTP Provider Subaccount

In the SAP BTP cockpit (global account), navigate to the provider subaccount and assign the required entitlements:

> Note: In the following steps and descriptions, this subaccount is referred to as *provider subaccount*.

Open *Entity Assignments* and assign quotas for the following entities to your provider subaccount: 

- *SAP BTP Cloud Foundry runtime* (3 units of application runtime)
	- As *Plan*, select *standard-edition (Application)*.
- *SAP HANA Cloud* (1 unit)
	- As *Plan*, select *hana*.
- *SAP HANA Schemas & HDI Containers* (min. 3 units: for the provider and two tenants)
- *SAP Authorization and Trust Management service* (1 unit)
	- As *Plan*, select *broker*.
- *SAP Custom Domain Service*
	- As *Plan*, select *standard (Application)*.

> Note: Contact SAP if there aren't enough service entitlements available in your global account.

The relevant entity assignments are selected by default when the subaccount is created (no action required):

- *Service Manager*, service plan *container*
- *SaaS Provisioning Service*, service plan *application*
- *HTML5 Application Repository Service*, service plans *app-runtime* and *app-host*

### Maintain Provider Subaccount Administrators

In the SAP BTP cockpit (provider subaccount), maintain the application administrators:

1. Open the menu item *Security - Users* and enter the users. 
2. Assign the role collection *Subaccount Administrators* to the users that take on the role of subaccount administrators. 

### Enable SAP BTP Cloud Foundry Runtime

In the SAP BTP cockpit (provider subaccount), create an SAP BTP Cloud Foundry runtime space to host the database and the runtime:

1. Go to *Overview* in the subaccount and enable Cloud Foundry:
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

2. Create a space and enter a name, for example, `app` as *Space Name*.

3. Keep the standard roles and add Cloud Foundry org members and Cloud Foundry space members. 

### Create a SAP HANA Cloud Database

1. In the SAP BTP cockpit (provider subaccount), in the left navigation pane, go to *Cloud Foundry* and *Spaces*. Open the desired space.
2. Go to SAP HANA Cloud.
3. To create an SAP HANA Cloud database, 
	1. Choose *CF Organization + Space*.
	2. As *Instance Name*, enter `poetryslams-db`.
	3. Enter a password.
	4. Choose *Create* and save your changes.

You have now successfully prepared your provider account for deployment and can now [enhance the one-off application for multi-tenancy](./23-Multi-Tenancy-Develop-Sample-Application.md).
