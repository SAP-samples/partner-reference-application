// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Adds cds module
const cds = require('@sap/cds');
// Defines required CDS functions for testing
const { expect, GET, POST, axios, test } = cds.test(__dirname + '/../..');

// Executes an action, like draftActivate, draftEdit or publish
const ACTION = (url, name, parameters = {}) =>
  POST(url + `/PoetrySlamManager.${name}`, parameters);

// Authentication for tests; role PoetrySlamManager
axios.defaults.auth = { username: 'peter', password: 'welcome' };

// ----------------------------------------------------------------------------
// Tests authorizations for authorized user with role assignment PoetrySlamManager
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Remote Projects Tests
// ----------------------------------------------------------------------------
let db;
describe('Remote Projects in PoetrySlamManager Service', () => {
  let poetrySlams;

  before(async () => {
    // Connect to the database of the current project
    db = await cds.connect.to('db');
    expect(db).to.exist;

    // Read all poetry slams for usage in the tests
    poetrySlams = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams?$filter=status_code%20eq%203`,
      {
        params: { $select: `ID,status_code` }
      }
    );
    expect(poetrySlams.data.value.length).to.greaterThan(0);
  });

  beforeEach(test.data.reset);

  it('should throw warning message during action createByDProject as no destination is set', async () => {
    // Execute the createByDProject action on a poetry slam with status fully booked
    const actionResult = await ACTION(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${poetrySlams.data.value[0].ID},IsActiveEntity=true)`,
      'createByDProject'
    );

    expect(actionResult.headers['sap-messages']).to.include(
      '"numericSeverity":3'
    );
  });

  it('should throw warning message during action createS4HCProject as no destination is set', async () => {
    // Execute the createS4HCProject action on a poetry slam with status fully booked
    const actionResult = await ACTION(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${poetrySlams.data.value[0].ID},IsActiveEntity=true)`,
      'createS4HCProject'
    );
    expect(actionResult.headers['sap-messages']).to.include(
      '"numericSeverity":3'
    );
  });
});
