// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Executes an action, like draftActivate, draftEdit or publish
const ACTION = (url, name, parameters = {}) =>
  POST(url + `/VisitorService.${name}`, parameters);
// Adds cds module
const cds = require('@sap/cds');
// Defines required CDS functions for testing
const { expect, GET, POST, PATCH, axios, test } = cds.test(
  __dirname + '/../../..'
);

// Authentication for tests; role PoetrySlamManager
axios.defaults.auth = { username: 'peter', password: 'welcome' };

// ----------------------------------------------------------------------------
// Tests Data Privacy
// ----------------------------------------------------------------------------

const { filterLog } = require('../../auditLogUtil.js');

describe('personal data audit logging in CRUD', () => {
  let cdsTestLog = cds.test.log();

  beforeEach(async () => {
    await test.data.reset();
    await GET(`/odata/v4/poetryslamservice/createTestData`);
  });

  it('should log audit log messages when a visitor is changed and activated', async function () {
    const id = '79ceab87-300d-4b66-8cc3-182c679b7c01';

    // Move visitor into draft mode by calling draftEdit action
    await ACTION(
      `/odata/v4/visitorservice/Visitors(ID=${id},IsActiveEntity=true)`,
      `draftEdit`
    );

    // Reduce max visitors
    let result = await PATCH(
      `/odata/v4/visitorservice/Visitors(ID=${id},IsActiveEntity=false)`,
      {
        name: 'Thomas Schmitt'
      }
    );

    expect(result.data.name).to.eql('Thomas Schmitt');
    let auditLog = filterLog(cdsTestLog);
    expect(auditLog.length).to.eql(1);

    // Read the updated poetry slam in draft mode
    result = await GET(
      `/odata/v4/visitorservice/Visitors(ID=${id},IsActiveEntity=false)`
    );

    expect(result.data.name).to.eql('Thomas Schmitt');
    auditLog = filterLog(cdsTestLog);
    expect(auditLog.length).to.eql(1);

    // Change the name back
    await PATCH(
      `/odata/v4/visitorservice/Visitors(ID=${id},IsActiveEntity=false)`,
      {
        name: 'Thomas Schmidt'
      }
    );

    // Activate the draft
    await ACTION(
      `/odata/v4/visitorservice/Visitors(ID=${id},IsActiveEntity=false)`,
      'draftActivate'
    );

    // Audit Log updates of visitors
    auditLog = filterLog(cdsTestLog);
    const types = auditLog.map((log) => log.type);
    expect(auditLog.length).to.eql(3);
    expect(types).to.include('PersonalDataModified');

    result = await GET(
      `/odata/v4/visitorservice/Visitors(ID=${id},IsActiveEntity=true)`
    );

    expect(result.data.IsActiveEntity).to.eql(true);
    auditLog = filterLog(cdsTestLog);
    expect(auditLog.length).to.eql(4);
  });

  it('should log an audit log message when a visitor is read', async function () {
    // Read the updated poetry slam in draft mode
    const visitors = await GET(`/odata/v4/visitorservice/Visitors?$top=1`);
    expect(visitors.data.value.length).to.greaterThan(0);
    const auditLog = filterLog(cdsTestLog);
    expect(auditLog.length).to.eql(1);
    expect(auditLog[0].type).to.eql('SensitiveDataRead');
    expect(auditLog[0].attributes[0]).to.eql('email');
  });
});
