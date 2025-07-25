// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Adds cds module
const cds = require('@sap/cds');
// Defines required CDS functions for testing
const { expect, GET, PATCH, axios, POST, test } = cds.test(
  __dirname + '/../../..'
);

const { poetrySlamStatusCode } = require('../../../srv/lib/codes');

// ----------------------------------------------------------------------------
// Tests authorizations for authorized user with role assignment PoetrySlamManager
// ----------------------------------------------------------------------------

// Authentication for tests; role PoetrySlamManager
axios.defaults.auth = { username: 'peter', password: 'welcome' };

// ----------------------------------------------------------------------------
// Entity PoetrySlams Tests
// ----------------------------------------------------------------------------
describe('Poetryslams in PoetrySlamManagerAPI', () => {
  let poetrySlams;

  beforeEach(async () => {
    await test.data.reset();
    await POST(`/odata/v4/poetryslamservice/createTestData`);

    // Read all poetry slams for usage in the tests
    poetrySlams = await GET(`/odata/v4/poetryslammanagerapi/PoetrySlams`, {
      params: { $select: `ID,status_code` }
    });
    expect(poetrySlams.data.value.length).to.greaterThan(0);
  });

  it('should allow updating the sales order ID of a poetryslam via poetryslammanagerapi service', async () => {
    const id = poetrySlams.data.value.find(
      (poetrySlam) =>
        poetrySlam.status_code === poetrySlamStatusCode.inPreparation
    ).ID;

    // Read poetry slam that shall be updated
    let result = await GET(
      `/odata/v4/poetryslammanagerapi/PoetrySlams(ID=${id})`
    );
    expect(result.data.salesOrderID).to.eql(null);

    result = await PATCH(
      `/odata/v4/poetryslammanagerapi/PoetrySlams(ID=${id})`,
      {
        salesOrderID: '3'
      }
    );
    expect(result.data.salesOrderID).to.eql('3');

    // Read the updated poetry slam
    result = await GET(`/odata/v4/poetryslammanagerapi/PoetrySlams(ID=${id})`);
    expect(result.data.salesOrderID).to.eql('3');

    // Read the updated poetry slam via poetry slam service
    result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      {
        params: { $select: `ID,salesOrderID,salesOrderURL` }
      }
    );
    expect(result.data.salesOrderID).to.eql('3');
    expect(result.data.salesOrderURL).to.eql('');
  });
});
