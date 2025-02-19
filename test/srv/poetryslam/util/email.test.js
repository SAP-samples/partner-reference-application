// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Adds cds module
const cds = require('@sap/cds');

// Defines required CDS functions for testing
const { expect } = cds.test(__dirname + '/../../../..');

// Import EMail Service
const EMail = require('./../../../../srv/poetryslam/util/email');

const { httpCodes } = require('./../../../../srv/poetryslam/util/codes');

describe('Util EMail - Reuse', () => {
  let cdsTestLog = cds.test.log();

  it('should be initialized successfully', function () {
    const eMail = new EMail('receiver@praondemand.com', 'subject', 'text');
    expect(eMail.mailConfig.to).to.equal('receiver@praondemand.com');
    expect(eMail.mailConfig.from).to.equal(
      'noreply+poetryslams-pra-ondemand@sap.corp'
    );
    expect(eMail.mailConfig.subject).to.equal('subject');
    expect(eMail.mailConfig.html).to.equal('text');
  });

  it('should not send emails for pra.ondemand.com mail addresses ', async function () {
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
    const eMail = new EMail('receiver@pra.ondemand.com', 'subject', 'text');
    await eMail.send(req);

    expect(errorObject.statusCode).to.equal(httpCodes.bad_request);
    expect(errorObject.i18n).to.equal('ACTION_EMAIL_SEND_FAIL');
    expect(errorObject.params[0]).to.equal('receiver@pra.ondemand.com');
    expect(cdsTestLog.output).to.eql(
      'ACTION send email: Sending email to pra.ondemand.com not allowed\n'
    );
  });

  it('should throw an error message when error occurs during sending the email', async function () {
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
    const eMail = new EMail('receiver@test.com', 'subject', 'text');
    await eMail.send(req);

    expect(errorObject.statusCode).to.equal(httpCodes.bad_request);
    expect(errorObject.i18n).to.equal('ACTION_EMAIL_SEND_FAIL');
    expect(errorObject.params[0]).to.equal('receiver@test.com');
    expect(cdsTestLog.output).to.eql(
      'ACTION send email: Error sending email: Failed to load destination.\n'
    );
  });

  it('should generate email content for a poetry slam including translation German', function () {
    cds.context = {
      locale: 'de'
    };
    const currentDate = new Date();
    const content = EMail.generateMailContentForPoetrySlam(
      'unit test title',
      'unit test description',
      currentDate,
      'unit test visitor'
    );

    expect(content).to.include('Hallo unit test visitor');
    expect(content).to.include('<title>unit test title</title>');
    expect(content).to.include('unit test descriptio');
    expect(content).to.include('data:image/jpg;base64');
    expect(content).to.include(currentDate.toLocaleDateString());
    expect(content).to.include(currentDate.toLocaleTimeString());
  });

  it('should generate email content for a poetry slam including translation English', function () {
    cds.context = {
      locale: 'EN'
    };
    const currentDate = new Date();
    const content = EMail.generateMailContentForPoetrySlam(
      'unit test title',
      'unit test description',
      currentDate,
      'unit test visitor'
    );

    expect(content).to.include('Dear unit test visitor');
    expect(content).to.include('<title>unit test title</title>');
    expect(content).to.include('unit test descriptio');
    expect(content).to.include('data:image/jpg;base64');
    expect(content).to.include(currentDate.toLocaleDateString());
    expect(content).to.include(currentDate.toLocaleTimeString());
  });

  it('should escape the generated email content for a poetry slam', function () {
    cds.context = {
      locale: 'EN'
    };
    const currentDate = new Date();
    const content = EMail.generateMailContentForPoetrySlam(
      '<unit test title>',
      '&unit test description',
      currentDate,
      '"unit test visitor'
    );

    expect(content).to.include('Dear &quot;unit test visitor');
    expect(content).to.include('<title>&lt;unit test title&gt;</title>');
    expect(content).to.include(' &amp;unit test description');
    expect(content).to.include('data:image/jpg;base64');
    expect(content).to.include(currentDate.toLocaleDateString());
    expect(content).to.include(currentDate.toLocaleTimeString());
  });

  it('should generate email title for a poetry slam in German', function () {
    cds.context = {
      locale: 'de'
    };
    const content = EMail.getMailTitleForPoetrySlam();
    expect(content).to.equal('Deine Reime sind reserviert! 🖋️✨');
  });

  it('should generate mail title for a poetry slam in English', function () {
    cds.context = {
      locale: 'EN'
    };
    const content = EMail.getMailTitleForPoetrySlam();
    expect(content).to.equal('Your Rhymes Are Reserved! 🖋️✨');
  });
});
