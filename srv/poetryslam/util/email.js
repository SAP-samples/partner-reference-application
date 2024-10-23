'use strict';
// Implementation of email reuse functions
const mailClient = require('@sap-cloud-sdk/mail-client');
const connectivity = require('@sap-cloud-sdk/connectivity');
const Logo = require('./logo');
const TextBundle = require('@sap/textbundle').TextBundle;
const path = require('path');
// For security reasons: To prevent injections
const escape = require('escape-html');

class EMail {
  // The sender needs to be adopted to an email address of the customer.
  // It is possible to add the sender to the destination instead.
  static sender = 'noreply+poetryslams-pra-ondemand@sap.corp';
  mailConfig;
  constructor(receiver, subject, text) {
    this.mailConfig = {
      from: EMail.sender,
      to: receiver,
      subject: subject,
      html: text
    };
  }

  // Send an email with the data given in constructor
  async send(req) {
    // Do not send email for test data
    if (this.mailConfig.to?.endsWith('@pra.ondemand.com')) {
      console.log(
        `ACTION send email: Sending email to pra.ondemand.com not allowed`
      );
      req.error(400, 'ACTION_EMAIL_SEND_FAIL', [this.mailConfig.to]);
      return;
    }

    try {
      // Destination name is set to "Email"
      const response = await mailClient.sendMail(
        { destinationName: 'Email', jwt: connectivity.retrieveJwt(req) },
        [this.mailConfig]
      );

      if (response[0]?.accepted?.length > 0) {
        req.info(200, 'ACTION_EMAIL_SEND_SUCCESS', [this.mailConfig.to]);
      } else {
        console.error(
          `ACTION send email: Error sending email: ${response[0].response}`
        );
        req.error(400, 'ACTION_EMAIL_SEND_FAIL', [this.mailConfig.to]);
      }
    } catch (error) {
      console.error(`ACTION send email: Error sending email: ${error.message}`);
      req.error(400, 'ACTION_EMAIL_SEND_FAIL', [this.mailConfig.to]);
    }
  }

  // Generate the HTML mail content
  static generateMailContentForPoetrySlam(
    title,
    description,
    eventDate,
    visitorName
  ) {
    const logo = Logo.encodeFileBase64();
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escape(title)}</title>
      </head>
      <body>
          <p>${EMail.getMailContentForPoetrySlam(escape(title), escape(description), escape(eventDate), escape(visitorName))}</p>
          <p><img src="data:image/jpg;base64,${logo}"></p>
        </tr>
      </table>
      </body>`;
  }

  // Get the title in the user's locale
  // See https://www.npmjs.com/package/@sap/textbundle
  static getMailTitleForPoetrySlam() {
    const bundle = new TextBundle(
      path.resolve(__dirname, '../../i18n/email.properties'),
      cds.context.locale
    );
    return bundle.getText('POETRYSLAM_EMAIL_TITLE');
  }

  // Get the message content in the user's locale
  // See https://www.npmjs.com/package/@sap/textbundle
  static getMailContentForPoetrySlam(
    title,
    description,
    eventDateTime,
    visitorName
  ) {
    const bundle = new TextBundle(
      path.resolve(__dirname, '../../i18n/email.properties'),
      cds.context.locale
    );
    const dateTime = new Date(eventDateTime);
    return bundle.getText('POETRYSLAM_EMAIL_CONTENT', [
      visitorName,
      title,
      dateTime.toLocaleDateString(),
      dateTime.toLocaleTimeString(),
      description
    ]);
  }
}

// Publish class
module.exports = EMail;
