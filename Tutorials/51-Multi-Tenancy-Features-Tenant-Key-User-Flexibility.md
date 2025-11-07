# Enable Key User Flexibility Using SAP Build Work Zone
Imagine you're a key user, also known as citizen user, for a customer using the poetry slam manager. You want to customize the user interface of the poetry slam manager application for all users in your company. This could be adding, hiding or rearranging fields, or renaming labels. 

In SAP Build Work Zone, the [SAP BTP service UI5 flexibility for key users](https://help.sap.com/docs/ui5-flexibility-for-key-users) comes included out of the box. You can enable it in a SAP Build Work Zone site to support key user adaptations for applications built with SAP Fiori elements. 

Make sure you've completed the steps described in chapter [Provision Your Multi-Tenant Application to Consumer Subaccounts](./25-Multi-Tenancy-Provisioning.md), including the SAP Build Work Zone setup. 

## Configure the SAP Build Work Zone Site 
Ensure that the key user adaptation is enabled in the SAP Build Work Zone site by following these steps:

1. Open the SAP BTP cockpit of the consumer.
2. Navigate to the *Instances and Subscriptions* view.
3. Open the *SAP Build Work Zone, standard edition* application.
4. In the *Site Manager*, open the *Site Directory*. 
5. Choose the *gear icon* of the *Partner Reference Application* site to access the *Site Settings*.
6. Edit the *Site Settings*.
7. In section *Services*, set the *Key User Adaptation* to *Yes*.
8. Save your changes.

## Configure Authorization Roles 
To assign authorization roles to different users, use user groups from the Identity Authentication Service (IAS). For more details and setup steps, see [Configure Authentication and Authorization](./25-Multi-Tenancy-Provisioning.md#configure-authentication-and-authorization).

To set up authorization roles for your application, follow these steps:

1. In the Identity Authentication service, create a new user group named *PoetrySlamManagerKeyUser* and assign the key users to it.

    > Note: An overview of the supported roles of the *UI5 flexibility service for key users* can be found in the SAP Help document [Defining and Bundling Roles](https://help.sap.com/docs/ui5-flexibility-for-key-users/ui5-flexibility-for-key-users/defining-and-bundling-roles).

2. In the SAP BTP consumer subaccount, create a new role collection named *PoetrySlamKeyUserRoleCollection* and add the *FlexKeyUser* role. The role grants key users the authorizations needed to adapt the user interface for all users of the *Poetry Slam Manager*.

3. Assign the created user group *PoetrySlamManagerKeyUser* from the identity provider to the role collection *PoetrySlamKeyUserRoleCollection*.

## Adapting the User Interface for all Users
After completing these enablement steps, key users are ready to adapt the user interface for all users of the *Poetry Slam Manager*:

1. Open the application *Poetry Slam Manager*.
2. Open the *User Action Menu* by clicking on your profile.
3. Choose *Adapt UI* to start the *UI Adaptation*.

Examples of possible adaptations include moving and renaming UI elements and embedding external content. You can find more examples in [Key User Adaptation](https://help.sap.com/docs/UI5_FLEXIBILITY/430e2c1a4ff241bc8162df4bf51e0730/328a550137344514ae085b924180d078.html) on SAP Help Portal.

You can also find a description on how to adapt the user interface in [Adapting SAP Fiori UIs at Runtime - Key User Adaptation](https://help.sap.com/docs/ui5-flexibility-for-key-users/ui5-flexibility-for-key-users/adapting-sap-fiori-uis-at-runtime-key-user-adaptation) on SAP Help Portal.
