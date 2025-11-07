'use strict';
// Implementation of notification reuse functions

// For security reasons: To prevent injections
const escape = require('escape-html');

const destinationUtil = require('./destination');
const { visitStatusCode, httpCodes, httpRequestMethod } = require('./codes');

const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');
const { buildHeadersForDestination } = require('@sap-cloud-sdk/connectivity');

const NotificationSendStatus = {
  SUCCESS: 0, // Successful send
  FAILED: 1 // Failed send
};

class Notification {
  static notificationDestinationName = 'SAP_Notifications';
  mailConfig;

  constructor(receiver, subject, text, notificationSubtitle, visit) {
    this.mailConfig = {
      to: receiver,
      subject: subject,
      html: text,
      notificationSubtitle: notificationSubtitle,
      title: visit.title,
      description: visit.description,
      dateTime: new Date(visit.dateTime),
      visitorName: visit.visitorName,
      visitStatusCode: visit.visitStatusCode
    };
  }

  getNotificationType() {
    return {
      NotificationTypeKey: 'PoetrySlamManagerEventReminder',
      // Increase the type version in case a new notification text is required. In the user settings both version types will be available.
      NotificationTypeVersion: '1.0',
      Templates: [
        {
          Language: cds.context.locale ?? 'en',
          TemplatePublic: this.mailConfig.subject,
          TemplateSensitive: this.mailConfig.subject,
          TemplateGrouped: 'Poetry Slam Manager',
          TemplateLanguage: 'Mustache',
          Subtitle: this.mailConfig.notificationSubtitle,
          EmailSubject: this.mailConfig.subject,
          EmailHtml: this.mailConfig.html
        }
      ],
      // Enables that the notifications are sent as email, too. Default preference enables it for all users by default.
      DeliveryChannels: [
        { Type: 'MAIL', Enabled: true, DefaultPreference: true }
      ]
    };
  }

  getNotification(notificationType) {
    return {
      NotificationTypeKey: notificationType.NotificationTypeKey,
      NotificationTypeVersion: notificationType.NotificationTypeVersion,
      NavigationTargetAction: 'display',
      NavigationTargetObject: 'poetryslams',
      Priority: 'Neutral',
      Recipients: [{ RecipientId: this.mailConfig.to }],
      Properties: [
        {
          Key: 'visitor_name',
          Language: cds.context.locale ?? 'en',
          Value: this.mailConfig.visitorName,
          Type: 'String',
          IsSensitive: false
        },
        {
          Key: 'poetry_slam_title',
          Language: cds.context.locale ?? 'en',
          Value: this.mailConfig.title,
          Type: 'String',
          IsSensitive: false
        },
        {
          Key: 'poetry_slam_date',
          Language: cds.context.locale ?? 'en',
          Value: this.mailConfig.dateTime.toLocaleDateString(),
          Type: 'String',
          IsSensitive: false
        },
        {
          Key: 'poetry_slam_time',
          Language: cds.context.locale ?? 'en',
          Value: this.mailConfig.dateTime.toLocaleTimeString(),
          Type: 'String',
          IsSensitive: false
        },
        {
          Key: 'poetry_slam_description',
          Language: cds.context.locale ?? 'en',
          Value: this.mailConfig.description,
          Type: 'String',
          IsSensitive: false
        }
      ]
    };
  }

  // Send a notification with the data given in constructor
  async send(req) {
    // Do not send notification for test data
    if (this.mailConfig.to?.endsWith('@pra.ondemand.com')) {
      console.error(
        `ACTION send notification: Sending notification to pra.ondemand.com not allowed`
      );
      req.error(httpCodes.bad_request, 'ACTION_NOTIFICATION_SEND_FAIL', [
        this.mailConfig.to
      ]);
      return NotificationSendStatus.FAILED;
    }
    // Do not send notification when booking status is canceled
    if (this.mailConfig.visitStatusCode === visitStatusCode.canceled) {
      console.error(`ACTION send notification: Can't send to canceled visitor`);
      req.info(httpCodes.ok, 'ACTION_NOTIFICATION_SEND_CANCELLED', [
        this.mailConfig.to
      ]);
      return NotificationSendStatus.FAILED;
    }

    let notificationServiceDestination, csrfHeaders;
    try {
      // Fetch the destination to the notifications service.
      // It is required that your app is bound to both XSUAA and destination service
      notificationServiceDestination = await destinationUtil.readDestination(
        req,
        Notification.notificationDestinationName
      );

      // Fetch the CSRF token and the __VCAP_ID__ and JSESSIONID cookies required for the POST request below.
      csrfHeaders = await buildHeadersForDestination(
        notificationServiceDestination,
        { url: 'v2/Notification.svc' }
      );
    } catch (error) {
      console.error(
        `ACTION send notification: Destination not found: ${error.message}`
      );
      req.error(httpCodes.bad_request, 'ACTION_NOTIFICATION_SEND_FAIL', [
        this.mailConfig.to
      ]);
      return NotificationSendStatus.FAILED;
    }

    const notificationType = this.getNotificationType();

    try {
      // Publish the notification type
      await executeHttpRequest(notificationServiceDestination, {
        url: 'v2/NotificationType.svc/NotificationTypes',
        method: httpRequestMethod.post,
        data: notificationType,
        headers: csrfHeaders
      });
    } catch (error) {
      // In case the notification type does already exist, move on and send the notification
      if (error.status === httpCodes.conflict) {
        console.error(
          `ACTION send notification: Notification type does already exist`
        );
      } else {
        console.error(
          `ACTION send notification: Error publishing notification type: ${error.message}`
        );
        req.error(httpCodes.bad_request, 'ACTION_NOTIFICATION_SEND_FAIL', [
          this.mailConfig.to
        ]);
        return NotificationSendStatus.FAILED;
      }
    }

    try {
      const notificationData = this.getNotification(notificationType);

      await executeHttpRequest(notificationServiceDestination, {
        url: 'v2/Notification.svc/Notifications',
        method: httpRequestMethod.post,
        data: notificationData,
        headers: csrfHeaders
      });

      req.info(httpCodes.ok, 'ACTION_NOTIFICATION_SEND_SUCCESS', [
        this.mailConfig.to
      ]);
    } catch (error) {
      console.error(
        `ACTION send notification: Error sending notification: ${error.message}`
      );
      req.error(httpCodes.bad_request, 'ACTION_NOTIFICATION_SEND_FAIL', [
        this.mailConfig.to
      ]);
      return NotificationSendStatus.FAILED;
    }
    return NotificationSendStatus.SUCCESS;
  }

  // Generate the HTML mail content
  static generateMailContentForPoetrySlam() {
    return escape(`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>{{poetry_slam_title}}</title>
        </head>
        <body>
          <p>${Notification.getMailContentForPoetrySlam()}</p>
          <p><img src="https://github.com/SAP-samples/partner-reference-application/blob/main-multi-tenant-features/srv/poetryslam/sample_data/poetrySlamLogo.jpg?raw=true"></p>
          </body>
      </html>`);
  }

  // Get the title in the user's locale
  static getMailTitleForPoetrySlam() {
    return cds.i18n.labels.at('emailTitle', cds.context.locale ?? 'en');
  }

  // Get the title in the user's locale
  static getNotificationSubtitleForPoetrySlam() {
    return cds.i18n.labels.at(
      'notificationSubtitle',
      cds.context?.locale ?? 'en'
    );
  }

  // Get the message content in the user's locale
  static getMailContentForPoetrySlam() {
    const text = cds.i18n.labels
      .at('emailContent', cds.context.locale ?? 'en')
      .replace(/\\\n/g, ''); //Replaces \\\n as otherwise \ will be shown in the notification
    return text;
  }
}

// Publish class
module.exports = Notification;
