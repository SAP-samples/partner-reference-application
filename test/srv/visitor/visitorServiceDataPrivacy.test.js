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
const {
  expect,
  GET: _GET,
  POST: _POST,
  PATCH: _PATCH,
  axios,
  test,
  sleep
} = cds.test(__dirname + '/../../..');

// As the log is only updated with delay, the requests need to be slowed down (only required for jest test execution)
const _slowify =
  (fn) =>
  async (...args) => {
    const res = await fn(...args);
    await sleep(42);
    return res;
  };
const GET = _slowify(_GET);
const POST = _slowify(_POST);
const PATCH = _slowify(_PATCH);

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

  // Check when PersonalDataModified is available again in the audit log.
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

    // Read the updated poetry slam in draft mode
    result = await GET(
      `/odata/v4/visitorservice/Visitors(ID=${id},IsActiveEntity=false)`
    );

    expect(result.data.name).to.eql('Thomas Schmitt');

    // Activate the draft; Audit Log is only written after activation
    await ACTION(
      `/odata/v4/visitorservice/Visitors(ID=${id},IsActiveEntity=false)`,
      'draftActivate'
    );

    // Read the updated poetry slam in draft mode
    await GET(
      `/odata/v4/visitorservice/Visitors(ID=${id},IsActiveEntity=true)`
    );

    // Audit Log updates of visitors
    let auditLog = filterLog(cdsTestLog);
    const types = auditLog.map((log) => log.type);
    expect(auditLog.length).to.eql(4);
    expect(types).to.include('PersonalDataModified');

    // Move visitor into draft mode by calling draftEdit action
    await ACTION(
      `/odata/v4/visitorservice/Visitors(ID=${id},IsActiveEntity=true)`,
      `draftEdit`
    );

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
