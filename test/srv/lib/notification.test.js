// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Adds cds module
const cds = require('@sap/cds');

// Defines required CDS functions for testing
const { expect } = cds.test(__dirname + '/../../..');

// Import notification Service
const Notification = require('../../../srv/lib/notification');

const { httpCodes, visitStatusCode } = require('../../../srv/lib/codes');

describe('Util Notification - Reuse', () => {
  let cdsTestLog = cds.test.log();

  it('should be initialized successfully', function () {
    const notification = new Notification(
      'receiver@praondemand.com',
      'subject',
      'text',
      'notificationSubtitle',
      {
        title: 'title',
        description: 'description',
        dateTime: new Date(),
        visitorName: 'visitorName',
        visitorStatusCode: visitStatusCode.booked
      }
    );
    expect(notification.mailConfig.to).to.equal('receiver@praondemand.com');
    expect(notification.mailConfig.subject).to.equal('subject');
    expect(notification.mailConfig.html).to.equal('text');
    expect(notification.mailConfig.notificationSubtitle).to.equal(
      'notificationSubtitle'
    );
  });

  it('should return the correct notification type ', async function () {
    cds.context = {
      locale: 'en'
    };

    const notification = new Notification(
      'receiver@pra.ondemand.com',
      'subject',
      'text',
      'notificationSubtitle',
      {
        title: 'title',
        description: 'description',
        dateTime: new Date(),
        visitorName: 'visitorName',
        visitorStatusCode: visitStatusCode.booked
      }
    );
    const type = notification.getNotificationType();

    expect(type.NotificationTypeKey).to.equal('PoetrySlamManagerEventReminder');
    expect(type.NotificationTypeVersion).to.equal('1.0');
    expect(type.Templates[0].Language).to.equal('en');
    expect(type.Templates[0].TemplatePublic).to.equal('subject');
    expect(type.Templates[0].TemplateSensitive).to.equal('subject');
    expect(type.Templates[0].TemplateGrouped).to.equal('Poetry Slam Manager');
    expect(type.Templates[0].Subtitle).to.equal('notificationSubtitle');
    expect(type.Templates[0].EmailSubject).to.equal('subject');
    expect(type.Templates[0].EmailHtml).to.equal('text');
    expect(type.DeliveryChannels[0]).to.eql({
      Type: 'MAIL',
      Enabled: true,
      DefaultPreference: true
    });
  });

  it('should return the correct notification ', async function () {
    cds.context = {
      locale: 'en'
    };
    const notification = new Notification(
      'receiver@pra.ondemand.com',
      'subject',
      'text',
      'notificationSubtitle',
      {
        title: 'title',
        description: 'description',
        dateTime: new Date(),
        visitorName: 'visitorName'
      }
    );
    const notificationToSend = notification.getNotification({
      NotificationTypeKey: 'PoetrySlamManagerEventReminder',
      NotificationTypeVersion: '1.0'
    });

    expect(notificationToSend.NotificationTypeKey).to.equal(
      'PoetrySlamManagerEventReminder'
    );
    expect(notificationToSend.NotificationTypeVersion).to.equal('1.0');
    expect(notificationToSend.NavigationTargetAction).to.equal('display');
    expect(notificationToSend.NavigationTargetObject).to.equal('poetryslams');
    expect(notificationToSend.Priority).to.equal('Neutral');
    expect(notificationToSend.Recipients[0]).to.eql({
      RecipientId: 'receiver@pra.ondemand.com'
    });
  });

  it('should not send notifications for pra.ondemand.com mail addresses ', async function () {
    let errorObject;
    const req = {
      error: function (statusCode, i18n, params) {
        errorObject = {
          statusCode: statusCode,
          i18n: i18n,
          params: params
        };
      }
    };
    const notification = new Notification(
      'receiver@pra.ondemand.com',
      'subject',
      'text',
      'notificationSubtitle',
      {
        title: 'title',
        description: 'description',
        dateTime: new Date(),
        visitorName: 'visitorName',
        visitorStatusCode: visitStatusCode.booked
      }
    );
    await notification.send(req);

    expect(errorObject.statusCode).to.equal(httpCodes.bad_request);
    expect(errorObject.i18n).to.equal('ACTION_NOTIFICATION_SEND_FAIL');
    expect(errorObject.params[0]).to.equal('receiver@pra.ondemand.com');
    expect(cdsTestLog.output).to.eql(
      'ACTION send notification: Sending notification to pra.ondemand.com not allowed\n'
    );
  });

  it('should throw an error message when error occurs during sending the notification', async function () {
    let errorObject;
    const req = {
      error: function (statusCode, i18n, params) {
        errorObject = {
          statusCode: statusCode,
          i18n: i18n,
          params: params
        };
      }
    };
    const notification = new Notification(
      'receiver@test.com',
      'subject',
      'text',
      'notificationSubtitle',
      {
        title: 'title',
        description: 'description',
        dateTime: new Date(),
        visitorName: 'visitorName',
        visitStatusCode: visitStatusCode.booked
      }
    );
    await notification.send(req);

    expect(errorObject.statusCode).to.equal(httpCodes.bad_request);
    expect(errorObject.i18n).to.equal('ACTION_NOTIFICATION_SEND_FAIL');
    expect(errorObject.params[0]).to.equal('receiver@test.com');
    expect(cdsTestLog.output).to.deep.include(
      "ACTION send notification: Destination not found: Cannot read properties of null (reading 'authTokens')"
    );
  });

  it('should throw an info message when visit status is canceled', async function () {
    let infoObject;
    const req = {
      info: function (statusCode, i18n, params) {
        infoObject = {
          statusCode: statusCode,
          i18n: i18n,
          params: params
        };
      }
    };
    const notification = new Notification(
      'receiver@test.com',
      'subject',
      'text',
      'notificationSubtitle',
      {
        title: 'title',
        description: 'description',
        dateTime: new Date(),
        visitorName: 'visitorName',
        visitStatusCode: visitStatusCode.canceled
      }
    );
    await notification.send(req);

    expect(infoObject.statusCode).to.equal(httpCodes.ok);
    expect(infoObject.i18n).to.equal('ACTION_NOTIFICATION_SEND_CANCELLED');
    expect(infoObject.params[0]).to.equal('receiver@test.com');
    expect(cdsTestLog.output).to.eql(
      `ACTION send notification: Can't send to canceled visitor\n`
    );
  });

  it('should generate email content for a poetry slam including translation German', function () {
    cds.context = {
      locale: 'de'
    };

    const content = Notification.generateMailContentForPoetrySlam();

    expect(content).to.include('Hallo {{visitor_name}}');
    expect(content).to.include(
      '&lt;title&gt;{{poetry_slam_title}}&lt;/title&gt;'
    );
    expect(content).to.include('{{poetry_slam_description}');
    expect(content).to.include('{{poetry_slam_time}}');
    expect(content).to.include('{{poetry_slam_date}}');
  });

  it('should generate email content for a poetry slam including translation English', function () {
    cds.context = {
      locale: 'EN'
    };
    const content = Notification.generateMailContentForPoetrySlam();

    expect(content).to.include('Dear {{visitor_name}}');
    expect(content).to.include(
      '&lt;title&gt;{{poetry_slam_title}}&lt;/title&gt'
    );
    expect(content).to.include('{{poetry_slam_description}}');
    expect(content).to.include('{{poetry_slam_time}}');
    expect(content).to.include('{{poetry_slam_date}}');
  });

  it('should escape the generated email content for a poetry slam', function () {
    cds.context = {
      locale: 'EN'
    };
    const content = Notification.generateMailContentForPoetrySlam();

    expect(content).to.include('Dear {{visitor_name}}!');
    expect(content).to.include('&gt;{{poetry_slam_title}}&lt;');
    expect(content).to.include('Description: {{poetry_slam_description}}');
    expect(content).to.include(
      '&lt;p&gt;&lt;img src=&quot;https://github.com/SAP-samples/partner-reference-application/blob/main-multi-tenant-features/srv/poetryslam/sample_data/poetrySlamLogo.jpg?raw=true&quot;&gt;&lt;/p&gt;'
    );
    expect(content).to.include('{{poetry_slam_time}}');
    expect(content).to.include('{{poetry_slam_date}}');
  });

  it('should generate email title for a poetry slam in German', function () {
    cds.context = {
      locale: 'de'
    };
    const content = Notification.getMailTitleForPoetrySlam();
    expect(content).to.equal('Deine Reime sind reserviert! 🖋️✨');
  });

  it('should generate mail title for a poetry slam in English', function () {
    cds.context = {
      locale: 'EN'
    };
    const content = Notification.getMailTitleForPoetrySlam();
    expect(content).to.equal('Your Rhymes Are Reserved! 🖋️✨');
  });

  it('should generate notification subtitle for a poetry slam in German', function () {
    cds.context = {
      locale: 'de'
    };
    const content = Notification.getNotificationSubtitleForPoetrySlam();
    expect(content).to.equal(
      'Herzlichen Glückwunsch! Sie haben sich gerade Ihren Platz für die diVERSeste Veranstaltung des Jahres gesichert — {{poetry_slam_title}}! 🎤🔥'
    );
  });

  it('should generate notification subtitle for a poetry slam in English', function () {
    cds.context = {
      locale: 'EN'
    };
    const content = Notification.getNotificationSubtitleForPoetrySlam();
    expect(content).to.equal(
      'Congratulations! You’ve just booked your spot at the most *verse-tile* event of the year — {{poetry_slam_title}}! 🎤🔥'
    );
  });
});
