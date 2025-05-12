// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Adds cds module
const cds = require('@sap/cds');
// Defines required CDS functions for testing
const { expect, GET, axios, POST, test } = cds.test(__dirname + '/../../..');

const { httpCodes } = require('../../../srv/lib/codes');

// ----------------------------------------------------------------------------
// OData Function Tests
// ----------------------------------------------------------------------------

describe('OData userInfo function in PoetrySlamService', () => {
  it('Should return the data of the logged in user', async () => {
    // Authorized user from .cdsrc.json with PoetrySlamManager role
    axios.defaults.auth = { username: 'peter', password: 'welcome' };
    // Get user info
    const userInfo = await GET(`/odata/v4/poetryslamservice/userInfo()`, {
      headers: { 'Accept-Language': 'de-DE' }
    });

    expect(userInfo.status).to.eql(httpCodes.ok);
    expect(userInfo.data.id).to.eql(axios.defaults.auth.username);
    expect(userInfo.data.locale).to.eql('de');
    expect(userInfo.data.roles).to.deep.eql({
      identified: true,
      authenticated: true
    });
  });

  it('Should return 403 (Forbidden) for an unauthorized user', async () => {
    // Unauthorized user from .cdsrc.json without role
    axios.defaults.auth = { username: 'denise', password: 'welcome' };

    await expect(
      GET(`/odata/v4/poetryslamservice/userInfo()`, {})
    ).to.rejectedWith(httpCodes.forbidden.toString());
  });
});

describe('OData createTestData action in PoetrySlamService', () => {
  beforeEach(async () => {
    await test.data.reset();
  });

  it('Should create test data', async () => {
    // Authorized user from .cdsrc.json with PoetrySlamManager role
    axios.defaults.auth = { username: 'peter', password: 'welcome' };

    // Read all poetry slams
    let poetrySlams = await GET(`/odata/v4/poetryslamservice/PoetrySlams`, {
      params: { $select: `ID` }
    });

    expect(poetrySlams.data.value.length).to.eql(0);

    // Create test data
    const result = await POST(`/odata/v4/poetryslamservice/createTestData`);

    expect(result.status).to.eql(httpCodes.ok);
    expect(result.data.value).to.eql(true);

    // Read all poetry slams
    poetrySlams = await GET(`/odata/v4/poetryslamservice/PoetrySlams`, {
      params: { $select: `ID` }
    });

    // Compare with count of poetry slams sample data (refer to json file)
    expect(poetrySlams.data.value.length).to.eql(8);

    // Read all visitors
    const visitors = await GET(`/odata/v4/poetryslamservice/Visitors`, {
      params: { $select: `ID` }
    });

    // Compare with count of visitors sample data (refer to json file)
    expect(visitors.data.value.length).to.eql(12);

    // Read all visits
    const visits = await GET(`/odata/v4/poetryslamservice/Visits`, {
      params: { $select: `ID` }
    });

    // Compare with count of visits sample data (refer to json file)
    expect(visits.data.value.length).to.eql(10);
  });

  it('Should return 403 (Forbidden) for an unauthorized user', async () => {
    // Unauthorized user from .cdsrc.json without role
    axios.defaults.auth = { username: 'denise', password: 'welcome' };

    await expect(
      POST(`/odata/v4/poetryslamservice/createTestData`)
    ).to.rejectedWith(httpCodes.forbidden.toString());
  });
});
