// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Executes an action, like draftActivate, draftEdit or publish
const ACTION = (url, name, parameters = {}) =>
  POST(url + `/PoetrySlamService.${name}`, parameters);
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
    await POST(`/odata/v4/poetryslamservice/createTestData`);
  });

  it('should log audit log messages when a poetry slam is changed and activated', async function () {
    const id = '79ceab87-300d-4b66-8cc3-f82c679b77a1';

    // Move poetry slam into draft mode by calling draftEdit action
    await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      `draftEdit`
    );

    // Reduce max visitors
    let result = await PATCH(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=false)`,
      {
        maxVisitorsNumber: 3
      }
    );

    expect(result.data.maxVisitorsNumber).to.eql(3);
    expect(filterLog(cdsTestLog).length).to.eql(0);

    // Read the updated poetry slam in draft mode
    result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=false)`
    );

    expect(result.data.maxVisitorsNumber).to.eql(3);
    expect(filterLog(cdsTestLog).length).to.eql(0);

    // Activate the draft
    await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=false)`,
      'draftActivate'
    );

    // Audit Log updates of poetry slam and two visits
    const auditLog = filterLog(cdsTestLog);
    expect(auditLog.length).to.eql(3);
    expect(auditLog[0].type).to.eql('PersonalDataModified');
    expect(auditLog[0].attributes[0]).to.eql('modifiedBy');

    result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`
    );

    expect(result.data.IsActiveEntity).to.eql(true);
    expect(filterLog(cdsTestLog).length).to.eql(3);
  });

  it('should log an audit log message when a visitor is read', async function () {
    // Read the updated poetry slam in draft mode
    const visitors = await GET(`/odata/v4/poetryslamservice/Visitors?$top=1`);
    expect(visitors.data.value.length).to.greaterThan(0);
    const auditLog = filterLog(cdsTestLog);
    expect(auditLog.length).to.eql(1);
    expect(auditLog[0].type).to.eql('SensitiveDataRead');
    expect(auditLog[0].attributes[0]).to.eql('email');
  });
});
