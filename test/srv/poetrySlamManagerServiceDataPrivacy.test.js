// ----------------------------------------------------------------------------
// Initialization of test
// ----------------------------------------------------------------------------
'strict';

// The project's root folder
const project = __dirname + '/../..';

// Executes an action, like draftActivate, draftEdit or publish
const ACTION = (url, name, parameters = {}) =>
  POST(url + `/PoetrySlamManager.${name}`, parameters);
// Adds cds module
const cds = require('@sap/cds');
// Defines required CDS functions for testing
const { expect, GET, POST, PATCH, axios, test } = cds.test(project);

// Authentication for tests; role PoetrySlamManager
axios.defaults.auth = { username: 'peter', password: 'welcome' };

// ----------------------------------------------------------------------------
// Tests Data Privacy
// ----------------------------------------------------------------------------

const _logger = require('../logger')({ debug: true });
const __logger = cds.log.Logger;

describe('personal data audit logging in CRUD', () => {
  let __log, _logs;
  // Writes the audit-logs into an array for comparison
  const _log = (...args) => {
    if (
      !(
        args.length === 2 &&
        typeof args[0] === 'string' &&
        args[0].match(/\[audit-log\]/i)
      )
    ) {
      // not an audit log
      return __log(...args);
    }

    _logs.push(args[1]);
  };

  before(() => {
    // Overwrites the CDS logger
    cds.log.Logger = _logger;
    // Stores and overwrites the global console log
    __log = global.console.log;
    global.console.log = _log;
  });

  beforeEach(async () => {
    await test.data.reset();
    // Clears the log
    _logs = [];
    _logger._resetLogs();
  });

  after(() => {
    // Restores the global console log
    global.console.log = __log;
    // Restores the CDS logger
    cds.log.Logger = __logger;
  });

  it('should log audit log messages when a poetry slam is changed and activated', async function () {
    const id = '79ceab87-300d-4b66-8cc3-f82c679b77a1';

    // Move poetry slam into draft mode by calling draftEdit action
    await ACTION(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      `draftEdit`
    );

    // Reduce max visitors
    let result = await PATCH(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=false)`,
      {
        maxVisitorsNumber: 3
      }
    );

    expect(result.data.maxVisitorsNumber).to.eql(3);
    expect(_logs.length).to.eql(0);

    // Read the updated poetry slam in draft mode
    result = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=false)`
    );

    expect(result.data.maxVisitorsNumber).to.eql(3);

    // Activate the draft
    await POST(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=false)/PoetrySlamManager.draftActivate`,
      {}
    );
    result = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=true)`
    );

    expect(result.data.IsActiveEntity).to.eql(true);
    // Audit Log for poetry slam and two visits
    expect(_logs.length).to.eql(3);
  });

  it('should log an audit log message when a visitor is read', async function () {
    // Read the updated poetry slam in draft mode
    const visitors = await GET(`/odata/v4/poetryslammanager/Visitors?$top=1`);
    expect(visitors.data.value.length).to.greaterThan(0);
    expect(_logs.length).to.eql(1);
    expect(_logs[0].attributes[0].name).to.eql('email');
  });
});
