# Prepare Your SAP BTP Subaccount for Deployment

When you want to deploy your SAP BTP application to a subaccount, first, you need to prepare a few things, for example, you need to assign the required services and enable SAP BTP Cloud Foundry runtime.

## Set Up the SAP BTP Subaccount

1. In the SAP BTP cockpit (global account), create a subaccount to host the application runtime (in this example, the data center of *Amazon Web Services (AWS)* and *Europe (Frankfurt)* as region are used). To keep things simple, you can reuse the subaccount used for development.

2. Optional: Assign the subaccount to a directory as a parent.

3. Check if sufficient service assignments are available in your global account:
	- SAP BTP Cloud Foundry runtime (3 units of application runtime)
	- SAP HANA Cloud (1 unit)
	- SAP HANA Schemas & HDI containers
	- SAP Build Work Zone 

4. Open *Entity Assignments* and assign quotas for the following entities to your subaccount you want to deploy the application to: 
	- *Foundry runtime* (3 units of application runtime)
	- *SAP HANA Cloud* (1 unit)
	- *SAP HANA Schemas & HDI Containers*
	- *SAP Build Work Zone* (plan: *standard (Application)*)

> Note: If the value help doesn't offer an item referring to *Cloud Foundry*, select *Application runtime*. Save your changes and the name of the list item changes to *Cloud Foundry*. 

## Enable SAP BTP Cloud Foundry Runtime

1. To enable SAP BTP Cloud Foundry runtime, in the SAP BTP cockpit (subaccount), go to *Overview* in the subaccount. 
2. Under *Cloud Foundry Environment*, choose *Enable Cloud Foundry*.
3. Enter the following information:
	- As *Plan*, select *standard*.
	- As *Landscape*, select *cf-eu10*. 
	- As *Instance Name*, enter `poetryslams`.
	- As *Org Name*, enter `poetryslams`.
5. Choose *Create*. 
6. Choose *Create Space* and enter a name, for example, `runtime` as *Space Name*.
7. Keep the standard roles and add [Cloud Foundry org members](https://help.sap.com/docs/btp/sap-business-technology-platform/add-org-members-using-cockpit) and [Cloud Foundry space members](https://help.sap.com/docs/btp/sap-business-technology-platform/add-space-members-using-cockpit).

## Create an SAP HANA Cloud Database

1. In the SAP BTP cockpit (subaccount), in the left navigation pane, go to *Cloud Foundry* and *Spaces*. Open the desired space.
2. Go to SAP HANA Cloud.
3. To create an SAP HANA Cloud database, 
	- Choose *CF Organization + Space*.
	- As *Instance Name*, enter `poetryslams-db`.
	- Enter a password.
	- Choose *Create*.

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
- Alternatively, follow the step-by-step guidelines about [how to develop the application](./14-Develop-Core-Application.md) from scratch and [how to deploy it](./15-One-Off-Deployment.md).

Looking for more information? Read up on [testing, tracing, debugging](./16-Test-Trace-Debug.md) and check out the [guided tour that shows you the functionality of Poetry Slam Manager](./17-Guided-Tour.md).
