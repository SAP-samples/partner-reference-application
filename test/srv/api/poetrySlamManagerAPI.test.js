// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Adds cds module
const cds = require('@sap/cds');
// Defines required CDS functions for testing
const { expect, DELETE, GET, PATCH, axios, POST, test } = cds.test(
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

  it('should allow updating a poetryslam', async () => {
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
        description: 'Test description'
      }
    );
    expect(result.data.description).to.eql('Test description');

    // Read the updated poetry slam
    result = await GET(`/odata/v4/poetryslammanagerapi/PoetrySlams(ID=${id})`);
    expect(result.data.description).to.eql('Test description');

    // Read the updated poetry slam via poetry slam service
    result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      {
        params: { $select: `ID,description` }
      }
    );
    expect(result.data.description).to.eql('Test description');
  });

  it('should get the values for the currency association (cds-common-content)', async () => {
    const commonCurrency = [
      {
        name: 'Euro',
        descr: 'European Euro',
        code: 'EUR'
      },
      {
        name: 'Euro',
        descr: 'Euro européen',
        code: 'EUR'
      }
    ];

    let result = await GET(
      `/odata/v4/poetryslammanagerapi/PoetrySlams?$expand=visitorsFeeCurrency`,
      { headers: { 'Accept-Language': 'en-US;en;' } }
    );
    expect(result.data.value.length).to.greaterThan(0);

    let poetrySlam = result.data.value.find(
      (poetrySlam) => poetrySlam.visitorsFeeCurrency.code === 'EUR'
    );
    expect(poetrySlam.visitorsFeeCurrency).to.containSubset(commonCurrency[0]);

    result = await GET(
      `/odata/v4/poetryslammanagerapi/PoetrySlams?$expand=visitorsFeeCurrency`,
      { headers: { 'Accept-Language': 'fr-Fr;fr;' } }
    );
    expect(result.data.value.length).to.greaterThan(0);

    poetrySlam = result.data.value.find(
      (poetrySlam) => poetrySlam.visitorsFeeCurrency.code === 'EUR'
    );
    expect(poetrySlam.visitorsFeeCurrency).to.containSubset(commonCurrency[1]);
  });

  it('should reject the creation of a poetry slam', async () => {
    const poetrySlamToBeCreated = {
      title: 'Poetry Slam Default Test',
      description: 'Description Poetry Slam Default Test',
      dateTime: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
      visitorsFeeAmount: 9.95,
      visitorsFeeCurrency_code: 'EUR'
    };

    await expect(
      POST(`/odata/v4/poetryslammanagerapi/PoetrySlams`, poetrySlamToBeCreated)
    ).to.rejected;
  });

  it('should reject to deletion of a poetry slam', async () => {
    const id = poetrySlams.data.value.find(
      (poetrySlam) =>
        poetrySlam.status_code === poetrySlamStatusCode.inPreparation
    ).ID;

    await expect(DELETE(`/odata/v4/poetryslammanagerapi/PoetrySlams(ID=${id})`))
      .to.rejected;
  });
});
