# Send Notifications and Emails with SAP Build Work Zone

Imagine you're a poetry slam manager using a poetry slam management app to organize events. You want to notify your artists and guests before the event. The Partner Reference Application uses the [SAP Alert Notification service for SAP BTP](https://help.sap.com/docs/alert-notification/sap-alert-notification-for-sap-btp/what-is-sap-alert-notification-service-for-sap-btp), integrated into [SAP Build Work Zone](https://help.sap.com/docs/build-work-zone-standard-edition/sap-build-work-zone-standard-edition/enabling-notifications), to send notifications and emails.

Notifications created with the service appear in the SAP Build Work Zone launchpad of the user. They can also be sent as email. The application defines the notification type, and users can choose which types to display and whether to receive emails. However, the application sets a default. SAP Build Work Zone supports navigation from a notification to a SAP Fiori elements floorplan, like the **Poetry Slam List Report**.

To use this feature, you need to enable SAP Build Work Zone, standard edition. Follow the tutorial [Entitle and Subscribe to SAP Build Work Zone Application](./25-Multi-Tenancy-Provisioning.md#entitle-and-subscribe-to-sap-build-work-zone-application).

## How to Enhance the Application Step by Step
To explore this feature with the Poetry Slam Manager, you have two options: 

1. Clone the repository of the Partner Reference Application. Check out the [*main-multi-tenant*](../../../tree/main-multi-tenant) branch and enhance the application step by step. 

2. Alternatively, check out the [*main-multi-tenant-features*](../../../tree/main-multi-tenant-features) branch where the feature is already included. 

The following describes how to enhance the **main-multi-tenant** branch (option 1).

### Application Enablement 

To enable the Poetry Slam Manager, refer to [Developing Cloud Foundry Applications With Notifications](https://help.sap.com/docs/build-work-zone-standard-edition/sap-build-work-zone-standard-edition/developing-cloud-foundry-applications-with-notifications) on SAP Help Portal.

1. Enhance the poetry slam service.

    1. Add a new action called *sendNotification* to the **visit** entity in the [poetry slam service](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamService.cds). This action sends a notification to the visitor of the selected visit. 
        ```cds
        // Action: Inform the visitor about the event
        action sendNotification();
        ```

    2. Copy the [*notification.js*](../../../tree/main-multi-tenant-features/srv/lib/notification.js) notification class to your project. The notification class manages the creation and sending of the notifications. The example implementation shows how to generate a notification in the user's language. It also shows how to navigate to a floorplan using the **NavigationTargetAction** and the **NavigationTargetObject** properties.

        > Note: For demonstration purposes, the notification type is directly created when sending the notification. In a production scenario, it's recommended to use a different approach since notification types are persisted. Each type has a specific version. As soon as the notification content is changed, the version of the type needs to be increased. Otherwise the content is not adapted. The old notification type version remains visible in the user's settings. To remove it completely, the application needs to delete it from the SAP Build Work Zone notifications.
        
    3. Copy the [poetry slam service notification implementation](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamServiceNotificationImplementation.js) file. The implementation handles the *sendNotification* action. 

    4. Add the notification implementation handler to the [srv/poetryslam/poetrySlamServiceImplementation.js](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamServiceImplementation.js).
    
        ```js
        const notificationHandler = require('./poetrySlamServiceNotificationImplementation');
        module.exports = class extends cds.ApplicationService {
            async init() {
                ...
                 await notificationHandler(this); // Forward handler for notification
                ...
            }
        };
        ```    

    5. Copy the [*srv/lib/destination.js*](../../../tree/main-multi-tenant-features/srv/lib/destination.js) file to your project. The reuse functions *readDestination*, *getDestinationURL*, and *getDestinationDescription* are required to read the destination from the subscriber subaccount. To achieve this, pass the JSON Web Token (JWT) of the logged-in user to the function. The JWT contains the tenant information. The reuse function *getDestinationDescription* returns the destination description from the SAP BTP consumer subaccount.
    
    6. Add the newly created message texts for the action success and error handling into the [*srv/i18n/messages.properties*](../../../tree/main-multi-tenant-features/srv/i18n/messages.properties) file.

        ```
        ACTION_NOTIFICATION_SEND_SUCCESS                        = The notification to {0} was sent successfully.
        ACTION_NOTIFICATION_SEND_FAIL                           = The notification to {0} could not be sent.
        ACTION_NOTIFICATION_SEND_CANCELLED                      = {0} has canceled the booking and won't receive a notification.
        ```

        > Note: In the reference example, the [*srv/i18n/messages_de.properties*](../../../tree/main-multi-tenant-features/srv/i18n/messages_de.properties) file with the German texts is available, too. You can adopt them accordingly.

    7. Add the newly created notification-specific texts, such as title and content of the generated notification in the [*srv/i18n/i18n.properties*](../../../tree/main-multi-tenant-features/srv/i18n/i18n.properties) file.

        ```
        # -------------------------------------------------------------------------------------
        # Texts notification functionality

        notificationSubtitle                        = Congratulations! You’ve just booked your spot at the most *verse-tile* event of the year — {{poetry_slam_title}}! 🎤🔥

        emailTitle                                  = Your Rhymes Are Reserved! 🖋️✨

        emailContent                                = Dear {{visitor_name}}!, <br> \
            <br> \
            Congratulations! You’ve just booked your spot at the most *verse-tile* event of the year — {{poetry_slam_title}}! <br> \
            <br> \
            Date: {{poetry_slam_date}} <br> \
            Time: When the mics get lit (aka {{poetry_slam_time}}) <br> \
            Description: {{poetry_slam_description}} <br> \
            <br> \
            Prepare your soul (and your snaps) for an evening of alliteration and lines so deep they’ll make you reconsider every text you’ve ever sent. <br> \
            <br> \
            Yours in rhymes and rhythm, <br> \
            The Team {{poetry_slam_title}}
        ```
    
        > Note: In the reference example, the [*srv/i18n/i18n_de.properties*](../../../tree/main-multi-tenant-features/srv/i18n/i18n_de.properties) file with the German texts is available, too. You can adopt them accordingly.    

2. Enhance the SAP Fiori elements UI of the *Poetry Slams* application. 

    1. Enhance the **LineItem #VisitorData** section of the [annotations file](../../../tree/main-multi-tenant-features/app/poetryslams/annotations.cds). Add a button that triggers the action to send the notification. 
    
        ```cds
        {
            $Type : 'UI.DataFieldForAction',
            Action: 'PoetrySlamService.sendNotification',
            Label : '{i18n>sendNotification}'
        }
        ```      

    2. Add the newly created texts into the [*/app/poetryslams/i18n/i18n.properties*](../../../tree/main-multi-tenant-features/app/poetryslams/i18n/i18n.properties) file.

        ```
        sendNotification                = Send Confirmation Notification
        ```

        > Note: In the reference example, the [*/app/poetryslams/i18n/i18n_de.properties*](../../../tree/main-multi-tenant-features/app/poetryslams/i18n/i18n_de.properties) file with the German texts is available, too. You can adopt them accordingly.

4. Add the required npm modules as dependencies to the *package.json* of your project. Refer to the [package.json](../../../tree/main-multi-tenant-features/package.json) file of the sample application.
    
    1. Open a terminal.
    
    2. Run the `npm add @sap-cloud-sdk/http-client` command. The package handles the sending HTTP requests to the notification service of SAP Build Work Zone.  

    3. Run the `npm add @sap-cloud-sdk/connectivity` command. The package handles the access to the connectivity service.

    4. Run the `npm add escape-html` command. This handles the HTML escaping of the poetry slam data when creating the email. 

### SAP BTP Deployment

1. Run the `npm install` command in your project root folder to install the required npm modules for the application. 

2. Build and deploy the application.
    > Note: For detailed instructions on how to deploy, refer to [Deploy Your SAP BTP Multi-Tenant Application](./24-Multi-Tenancy-Deployment.md).

### SAP BTP Configuration of the Consumer Subaccount
To send notifications, you need to enable notifications for custom apps on SAP BTP Cloud Foundry. 

1. Open the SAP BTP cockpit of the consumer subaccount.

2. Enable and set up the notifications in SAP Build Work Zone. More details are available under [Enabling Notifications From Cloud Solutions and Services](https://help.sap.com/docs/build-work-zone-standard-edition/sap-build-work-zone-standard-edition/enabling-notifications-from-cloud-solutions) on SAP Help Portal.

    1. Create a new role collection and assign your user and the **Business_Notifications_Admin** role to it.

    2. In the navigation bar, choose **Services** and go to **Instances and Subscriptions**. 

    3. In the **Subscriptions** section, open SAP Build Work Zone, standard edition. The Site Manager of SAP Build Work Zone opens.
 
    4. Open the site in the **Site Directory** and go to **Site Settings**.

    5. Enable **Show Notification** for the site and save your changes.

    6. Choose **Settings** in the navigation bar on the left side.

    7. Choose the **Notifications** tab.

    8. Generate new credentials. These are required to set up the destination in the next step.

2. Create the required destinations.

    1. In the SAP BTP cockpit, go to **Connectivity**.

    2. Choose **Destinations**.

    3. Set up a destination to the notification service of SAP Build Work Zone. For more details, refer to [Configure the destination to the notifications service](https://help.sap.com/docs/build-work-zone-standard-edition/sap-build-work-zone-standard-edition/enabling-notifications-for-custom-apps-on-sap-btp-cloud-foundry#configure-the-destination-to-the-notifications-service) on SAP Help Portal.

        1.  Create a new destination from scratch with the following field values.

            | Parameter Name            | Value                                                                    |
            | :--------------------     | :--------------------------------------------------------------          |
            | **Name**:                   | `SAP_Notifications`                                                      |
            | **Type**:                   | `HTTP`                                                                   |
            | **Description**:            | Enter a destination description, for example, `Notification service`.    |
            | **Proxy Type**:             | `Internet`                                                               |
            | **URL**:                    | *Host* from the credentials of the SAP Build Work Zone notifications. Add `https://` in front of it.     |
            | **Authentication**:         | `OAuth2ClientCredentials`                                                |
            | **Client ID**:              | *OAuth 2.0 Client ID* from the credentials of the SAP Build Work Zone notifications |
            | **Client Secret**:          | *Client Secret* from the credentials of the SAP Build Work Zone notifications       |
            | **Token Service URL**:      | *Token Endpoint* from the credentials of the SAP Build Work Zone notifications. Add `https://` in front of it.       |
            | **Token Service URL Type**: | `Dedicated`                               |
        
        2. Enter the **Additional Properties**:
        
            | Property Name                 | Value                                                                |
            | :--------------               | :--------------------------------------------------------------      |
            | **HTML5.DynamicDestination**:   | true                                                                 |
        
        3. Save the destination.

    4. Set up a destination to send emails with SMTP. For more details, refer to [Configuring an SMTP Mail Destination](https://help.sap.com/docs/build-work-zone-standard-edition/sap-build-work-zone-standard-edition/configuring-smtp-mail-destination) on SAP Help Portal.

        1.  Create a new destination from scratch with the following field values.

            | Parameter Name        | Value                                                                    |
            | :-------------------- | :--------------------------------------------------------------          |
            | **Name**:               | `SAP_Business_Notifications_Mail`                                        |
            | **Type**:               | `MAIL`                                                                   |
            | **Description**:        | Enter a destination description, for example, `Email provider`.         |
            | **Proxy Type**:         | `Internet`                                                               |
            | **Authentication**:     |`BasicAuthentication`                                                     |
            | **User**:               | Enter the username of your email account.                                |
            | **Password**:           | Enter the password of your email account.                               |
        
        2. Enter the **Additional Properties**:
        
            | Property Name         | Value                                                                         |
            | :--------------       | :--------------------------------------------------------------               |
            | **mail.smtp.host**:     | Enter the *SMTP* host URL.                                                     |
            | **mail.smtp.port**:     | Enter the *SMTP* host port.                                                    |
            | **mail.smtp.from**:     | Add the email address that serves as a sender of the email.                    |
            | **mail.smtp.starttls**: | Set to true for encryption with TLS (Transport Layer Security) or SSL (Secure Sockets Layer) |

        3. Save the destination.

### Testing

For quality assurance, it is important to test the new functionality.

#### Unit Tests

Unit tests are available to test the notification feature:

1. Copy the [test/srv/poetryslam/poetrySlamServiceNotificationImplemention.test.js](../../../tree/main-multi-tenant-features/test/srv/poetryslam/poetrySlamServiceNotificationImplemention.test.js) file to your project. This file tests the enhancements of the poetry slam service.

2. Copy the [test/srv/lib/notification.test.js](../../../tree/main-multi-tenant-features/test/srv/lib/notification.test.js) file to your project. This file tests the notification class.

3. To run the automated SAP Cloud Application Programming Model tests:

    1. Enter the `npm install` command in a terminal in SAP Business Application Studio.
    2. Enter the `npm run test` command. All tests are carried out and the result is shown afterwards.

## A Guided Tour to Explore the Notification Feature

Now it is time to take you on a guided tour through the notification feature of Poetry Slam Manager.

> Note: The notification functionality is switched off for the visitors and artists of the sample data. Therefore, you need to create a new visitor with an individual notification address to test the functionality.

1. Open the SAP BTP cockpit of the customer subaccount.

2. Open the **Poetry Slams** application.

3. Choose **Create** to create a new poetry slam.

4. Choose **Maintain Visitors** to navigate to the visitors application.

5. Choose **Create** to create a new visitor.

6. Enter a name and your email address and create the visitor.

7. Select **Maintain Poetry Slams** to navigate to the poetry slams application.

8. Open the **New Object** poetry slam from the list.

9. Enter the mandatory data and create the poetry slam. 

10. Publish the poetry slam.

11. Edit the poetry slam and create a new booking.

12. Select the newly created visitor and save your changes.

13. Select the booking from the list of visitors.

14. Choose **Send Confirmation Notification**.

    > Note: An email is sent to your email address. Additionally, a notification pops up at the notification icon in the launchpad.

15. Select the notification icon on the top right corner of the launchpad.

16. When selecting the received notification, the application navigates to the poetry slams list.

17. Select your user's profile located on the top right corner of the launchpad.

18. Open the settings.

19. Select **Notifications**.

20. The **PoetrySlamManagerEventReminder** notification type is enabled. Mobile notifications and emails are sent for this type.
