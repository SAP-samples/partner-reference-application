# Test and Troubleshoot Multitenancy

## The Subscription Management Dashboard

When developing a multi-tenant application, the *Subscription Management Dashboard* can be used to easily manage and maintain each of the tenants that have currently been subscribed to the application. In case there are problems with a subscription, the subscription dashboard can be used to analyze the current status.

Capabilities of the *Subscription Management Dashboard*: 
- The dashboard enables application providers to review the deployment of multi-tenant applications including the application and subscription status and the change history/subscription history.
- Application providers can perform subscription actions such as *Unsubscribe* and *Update*, and track the status of subscriptions in progress.
- In the *Overview* section of the subscribed application, application owners can review information such as *Subscription Status*, *Global Accounts*, *Consumer Subaccounts*, *Application Name*, *Application URL*, *License Type* (productive, test tenant), *Changed On*, and *Created On*.
- In the *Dependencies* section, application providers can review the service dependencies of the application. There is a tree view and a table view of dependencies. The information helps users view the full list of dependencies among various services used in the application. It outlines, for example, the dependencies between the application service module and modules for destinations, 
SAP HTML5 Application Repository service for SAP BTP, and connectivity services. 

To use the dashboard:

1. Open the SAP BTP cockpit of the provider subaccount.

2. Assign the role collection *Subscription Management Dashboard Administrator* or *Subscription Management Dashboard Viewer* to your user. 
    > Note: This role collection is created when an application including the service *SaaS Provisioning Service* (technical name *saas-registry*) is deployed.
3. In the navigation bar of the SAP BTP subaccount cockpit, select *Services* and go to *Instances and Subscriptions*. 
4. In the *Instances* section, find the instance of the service *SaaS Provisioning Service* (in your case: *poetry-slams-registry*) and choose the *poetry-slams-registry* hyperlink.
    > Note: In case of authorization issues, open it in an incognito window of your browser.
5. This will open a new window where a list of all subscriptions is displayed. If a subscription has failed, you can find the error details here.
6. Click on the line of a specific tenant to display the dependency graph for a visual overview of the dependencies of the services:

<center><img src="./images/26_DependencyGraph.png" width="75%"></center>

For more information about using the Subscription Management Dashboard, refer to [Using the Subscription Management Dashboard](https://help.sap.com/docs/btp/sap-business-technology-platform/using-subscription-management-dashboard)

## Automated Tests

In general, the same tests can be used in the multitenancy environment as in the one-off application.  

In comparison to the One Page Acceptance (OPA5) Tests for the one-off application, one change is required in file **FirstJourney.js**. Remove the line `When.onTheShell.iPressTile('fe-lrop-v4');` to have the tests working again.

You can have a look at the [*app/poetryslams/webapp/test/integration/FirstJourney.js*](../../../tree/main-multi-tenant/app/poetryslams/webapp/test/integration/FirstJourney.js) and [*app/visitors/webapp/test/integration/FirstJourney.js*](../../../tree/main-multi-tenant/app/visitors/webapp/test/integration/FirstJourney.js) of the reference application.

## Additional Information

The information above is specific to a multi-tenant application. Find additional hints in the tutorials [Test and Troubleshoot](16-Test-Trace-Debug.md) (for one-off applications) and [Test and Troubleshoot an ERP Integration](32-Test-Trace-Debug-ERP.md).