# Send Emails

Imagine you're a poetry slam manager using a poetry slam management app to organize events. You need to send email reminders to your artists and guests before the event. The Partner Reference Application uses the [SAP Cloud SDK Mail Client](https://www.npmjs.com/package/@sap-cloud-sdk/mail-client) to send emails to your email servers.

> Note: The SAP Cloud SDK Mail Package is deprecated (refer to [SAP Cloud SDK Upgrade to Version 4](https://sap.github.io/cloud-sdk/docs/js/guides/upgrade-to-version-4#remove-deprecated-content)). While the approach below still works, it is scheduled for updates.

## Guide How to Enhance the Application Step by Step
To explore this feature with the Poetry Slam Manager, you have two options: 

1. Clone the repository of the Partner Reference Application. Check out the [*main-multi-tenant*](../../../tree/main-multi-tenant) branch and enhance the application step by step. 

2. Alternatively, check out the [*main-multi-tenant-features*](../../../tree/main-multi-tenant-features) branch where the feature is already included. 

The following describes how to enhance the **main-multi-tenant** branch (option 1).

### Application Enablement 

1. Enhance the poetry slam service.

    1. Add a new action *sendEMail* to the *visit* entity in the [poetry slam service](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamService.cds). This action sends the email to the visitor of the selected visit. 
        ```cds
        // Action: Inform the visitor about the event
        action sendEMail();
        ```

    2. Copy the email util class [*email.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/util/email.js) to your project. The email class handles the creation and sending of the emails. The example implementation shows how to generate an email in the user`s language.

    3. Copy the logo util class [*logo.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/util/logo.js) to your project. The logo class encodes an image in base64 format. The encoding is required by other output services, for instance forms, too. 

    4. Extend the [poetry slam service output implementation](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamServiceOutputImplementation.js) with the action implementation.

        1. Import the email class.

            ```js
            const EMail = require('./util/email');
            ```

        2. Add the action implementation.

            ```js
            // Entity action "sendEMail": Informs the visitor via email about the event
            srv.on('sendEMail', async (req) => {
                const visit = await SELECT.one
                    .from(req.subject)
                    .columns(
                        'parent_ID',
                        'visitor_ID',
                        'visits.visitor.email as visitorEMail',
                        'visits.visitor.name as visitorName',
                        'parent.title as title',
                        'parent.description as description',
                        'parent.dateTime as dateTime'
                );

                // If visit was not found, throw an error
                if (!visit) {
                    const id = req.params[req.params.length - 1]?.ID;
                    req.error(httpCodes.bad_request, 'VISITS_NOT_FOUND', [id]);
                    return;
                }

                const email = new EMail(
                    visit.visitorEMail,
                    EMail.getMailTitleForPoetrySlam(),
                    EMail.generateMailContentForPoetrySlam(
                        visit.title,
                        visit.description,
                        visit.dateTime,
                        visit.visitorName
                    )
                );
                await email.send(req);
            });
            ```

    5. Add the output management implementation handler to the [srv/poetryslam/poetrySlamServiceImplementation.js](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamServiceImplementation.js).
    
        ```js
        const outputHandler = require('./poetrySlamServiceOutputImplementation');
        module.exports = cds.service.impl(async (srv) => {
            ...
            await outputHandler(srv); // Forward handler for output
            ...
        });
        ```
    
    6. Add the newly created message texts for the action success and error handling into the [*srv/i18n/messages.properties* file](../../../tree/main-multi-tenant-features/srv/i18n/messages.properties).

        ```
        ACTION_EMAIL_SEND_SUCCESS                               = The email to {0} was sent successfully.
        ACTION_EMAIL_SEND_FAIL                                  = The email to {0} could not be sent.
        ```

        > Note: In the reference example, the [*srv/i18n/messages_de.properties*](../../../tree/main-multi-tenant-features/srv/i18n/messages_de.properties) file with the German texts is available, too. You can adopt them accordingly.

    7. Add the newly created email specific texts, such as title and content of the generated mail to the [*srv/i18n/i18n.properties* file](../../../tree/main-multi-tenant-features/srv/i18n/i18n.properties).

        ```
        # -------------------------------------------------------------------------------------
        # Texts email functionality

        POETRYSLAM_EMAIL_TITLE                                  = Your Rhymes Are Reserved! 🖋️✨

        POETRYSLAM_EMAIL_CONTENT                                = Dear {0}, <br> \
            <br> \
            Congratulations! You’ve just booked your spot at the most *verse-tile* event of the year — {1}! 🎤🔥 <br> \
            <br> \
            Date: {2} <br> \
            Time: When the mics get lit (aka {3}) <br> \
            Description: {4} <br> \
            <br> \
            Prepare your soul (and your snaps) for an evening of alliteration and lines so deep they’ll make you reconsider every text you’ve ever sent. <br> \
            <br> \
            Yours in rhymes and rhythm, <br> \
            The Team {1}
        ```
    
        > Note: In the reference example, the [*srv/i18n/i18n_de.properties*](../../../tree/main-multi-tenant-features/srv/i18n/i18n_de.properties) file with the German texts is available, too. You can adopt them accordingly.    

2. Add the logo [srv/poetryslam/sample_data/poetrySlamLogo.jpg](../../../tree/main-multi-tenant-features/srv/poetryslam/sample_data/poetrySlamLogo.jpg) for your email to path *srv/poetryslam/sample_data/* . This can be replaced with a customer-specific logo. The logo is shown in the generated email as an example for how to embed images. 

3. Enhance the Fiori Elements UI of the *Poetry Slams* application. 

    1. Enhance the section *LineItem #VisitorData* of the [annotations file](../../../tree/main-multi-tenant-features/app/poetryslams/annotations.cds) to add a button which triggers the action to send the email. 
    
        ```cds
        {
            $Type : 'UI.DataFieldForAction',
            Action: 'PoetrySlamService.sendEMail',
            Label : '{i18n>sendEMail}'
        }
        ```      

    2. Add the newly created texts into the [*/app/poetryslams/i18n/i18n.properties* file](../../../tree/main-multi-tenant-features/app/poetryslams/i18n/i18n.properties).

        ```
        sendEMail                = Send Confirmation Email
        ```

        > Note: In the reference example, the [*/app/poetryslams/i18n/i18n_de.properties*](../../../tree/main-multi-tenant-features/app/poetryslams/i18n/i18n_de.properties) file with the German texts is available, too. You can adopt them accordingly.

4. Add the required npm modules as dependencies to the *package.json* of your project. Refer to the file [package.json](../../../tree/main-multi-tenant-features/package.json) of the sample application.
    
    1. Open a terminal.
    
    2. Run the command `npm add @sap-cloud-sdk/mail-client`. The package handles the sending of the email.  

    3. Run the command `npm add escape-html`. This handles the html escaping of the poetry slam data when creating the email. 

### SAP BTP Deployment

1. Run the command `npm install` in your project root folder to install the required npm modules for the application. 

2. Build and deploy the application.
    > Note: For detailed instructions on how to deploy, refer to the section [Deploy the Multi-Tenant Application to a Provider Subaccount](./24-Multi-Tenancy-Deployment.md).

### SAP BTP Configuration of the Consumer Subaccount
To send the email, a destination needs to be set up in the consumer account.

1. Open the SAP BTP cockpit of the consumer subaccount.

2. Open the *Connectivity* menu item.

3. Choose *Destinations*.

4. Create a new destination with the following field values. For more details, refer to [Setting Up SAP BTP Destination for Service Layer](https://help.sap.com/docs/SAP_BUSINESS_ONE_WEB_CLIENT/e6ac71d18c7543828bd4463f77d67ff7/bfeaccb8b53348318970f8bbbc3d5f0a.html?locale=en-US&q=Business%20One%20extension).

    | Parameter Name        | Value                                                                    |
    | :-------------------- | :--------------------------------------------------------------          |
    | *Name*:               | *Email*                                                                  |
    | *Type*:               | *MAIL*                                                                   |
    | *Description*:        | Enter a destination description, for example, ``E-Mail provider``.       |
    | *Proxy Type*:         | *Internet*                                                               |
    | *Authentication*:     |*BasicAuthentication*                                                     |
    | *User*:               | Enter the username of your e-mail account                                |
    | *Password*:           | Enter the password of your e-mail account.                               |
    
5. Enter the *Additional Properties*:
    
    | Property Name     | Value                                                                         |
    | :--------------   | :--------------------------------------------------------------               |
    | *mail.smtp.host*: | Enter the *SMTP* host URL                                                     |
    | *mail.smtp.port*: | Enter the *SMTP* host port                                                    |

### Testing

For quality assurance, it is important to test the new functionality.

#### Unit Tests

Unit tests are available to test the email feature:

1. Copy the [test/srv/poetryslam/poetrySlamServiceOutputImplemention.test.js](../../../tree/main-multi-tenant-features/test/srv/poetryslam/poetrySlamServiceOutputImplemention.test.js) to your project. This file tests the enhancements of the poetry slam service.

2. Copy the [test/srv/poetryslam/util/email.test.js](../../../tree/main-multi-tenant-features/test/srv/poetryslam/util/email.test.js) to your project. This file tests the email util class.

3. Copy the [test/srv/poetryslam/util/logo.test.js](../../../tree/main-multi-tenant-features/test/srv/poetryslam/util/logo.test.js) to your project. This file tests the logo util class.

4. To run the automated SAP Cloud Application Programming Model tests:

    1. Enter the command `npm install` in a terminal in SAP Business Application Studio.
    2. Enter the command `npm run test`. All tests are carried out and the result is shown afterwards.

## A Guided Tour to Explore the E-Mails Feature

Now it is time to take you on a guided tour through the email feature of Poetry Slam Manager: 

> Note: The email functionality is switched off for the visitors and artists of the sample data. Therefore, you need to create a new visitor with an individual email address to test the functionality.

1. Open the SAP BTP cockpit of the customer subaccount.

2. Open the Poetry Slams application.

3. Choose *Create* to create a new poetry slam.

4. Choose  *Maintain Visitors* to navigate to the visitors application.

5. Choose *Create* to create a new visitor.

6. Enter a name and your email address and create the visitor.

7. Click *Maintain Poetry Slams* to navigate to the poetry slams application.

8. Open the poetry slam *New Object* from the list.

9. Enter the mandatory data and create the poetry slam. 

10. Publish the poetry slam.

11. Edit the poetry slam and create a new booking.

12. Select the newly created visitor and save your changes.

13. Select the booking from the list.

14. Click the button *Send Confirmation Email*.
