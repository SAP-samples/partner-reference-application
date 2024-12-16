# Deploy the Sample Application to a SAP BTP Account

This tutorial guides you through the steps to deploy and configure the sample application (Poetry Slam Manager) in a dedicated SAP BTP subaccount, representing an end-to-end provisioning process of a single-tenant partner application in a SAP BTP account.

> Note: This description applies to partner SAP BTP accounts of type "Test, Demo, and Development (TDD)". This is the recommended type for proof of concepts and development projects. For more details on partner SAP BTP environments for TDD and productive use, as well as the associated ordering processes, visit the [SAP Partner Portal, SAP PartnerEdge – Build Experience](https://partneredge.sap.com/en/partnership/development/build.html).

## Clone and Deploy the Sample Application

1. In the SAP BTP cockpit (subaccount level), navigate to *Instances and Subscriptions*, open *SAP Business Application Studio*, and create a new *Dev Space* with *Full-Stack Cloud Application*.

2. Start and open the SAP Business Application Studio dev space.

3. To clone this GitHub repository, on the *Welcome* view, choose *Clone from Git* (https://github.com/SAP-samples/partner-reference-application). 

> To learn more about how to clone a repository, go to the [GitHub documentation](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

### Build and Deploy Your Application

1. Open a new terminal and log on to SAP BTP Cloud Foundry runtime: 
    1. Run the command `cf login`.
    2. Enter the API endpoint of your SAP BTP account, if required, your development user and password, and select the SAP BTP Cloud Foundry runtime organization for the application.

2. To check out the Git branch with the single tenant version of the sample application, run the command `git checkout main-single-tenant`. A local branch *main-single-tenant* is created, which tracks the *origin/main-single-tenant* branch of the remote GitHub repository.   

3. Run the command `npm install` to install the npm packages from the *package.json*.

4. Run the command `npm run build` to build the project with the information from the *mta.yaml*. 

5. To deploy the application, run the command `npm run deploy`. The file *./mta_archives/archive.mtar* is copied and deployed into your SAP BTP Cloud Foundry runtime space.

## Configure the Launchpad in SAP Build Work Zone

Create and configure a launchpad site as described in [Configure the Launchpad](15b-One-Off-Deployment.md#configure-sap-build-work-zone).

> Note: SAP Build Work Zone has already been subscribed in the section *Set Up the SAP BTP Subaccount*.

## Configure Authentication and Authorization

Set up trust between the SAP BTP subaccount and the Identity Authentication service, and set up end user authorizations following the steps in [Configure Authentication and Authorization](15b-One-Off-Deployment.md#configure-authentication-and-authorization). This section also describes how to start the deployed sample application with single sign-on.

In the SAP BTP subaccount, open the menu item *Role Collections* and add the user group *Poetry_Slam_Manager* to the *Launchpad_Admin* role collection.

Looking for more information about the functionality of Poetry Slam Manager? Have a look at the [guided tour](17-Guided-Tour.md).
