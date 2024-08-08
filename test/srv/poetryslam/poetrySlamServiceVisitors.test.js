// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Adds cds module
const cds = require('@sap/cds');
// Defines required CDS functions for testing
const { expect, GET, POST, axios, test } = cds.test(__dirname + '/../../..');

// Authentication for tests; role PoetrySlamManager
axios.defaults.auth = { username: 'peter', password: 'welcome' };

// ----------------------------------------------------------------------------
// Tests authorizations for authorized user with role assignment PoetrySlamManager
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Entitiy Visitor Tests
// ----------------------------------------------------------------------------

describe('Visitors in PoetrySlamService', () => {
  beforeEach(async () => {
    await test.data.reset();
  });

  it('should return the visitor data', async () => {
    // Read all visitors
    const visitors = await GET(`/odata/v4/poetryslamservice/Visitors`, {
      params: { $select: `ID,name,email` }
    });
    expect(visitors.data.value.length).to.greaterThan(0);
  });

  it('should fail when creating a visitor', async () => {
    const entryToBeCreated = {
      name: 'Peter',
      email: 'peter@pra.ondemand.com'
    };

    return expect(
      POST(`/odata/v4/poetryslamservice/Visitors`, entryToBeCreated)
    ).to.rejected;
  });
});
