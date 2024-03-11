// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Adds cds module
const cds = require('@sap/cds');
// Defines required CDS functions for testing
const { expect, GET, axios } = cds.test(__dirname + '/../..');

// ----------------------------------------------------------------------------
// OData Function Tests
// ----------------------------------------------------------------------------

describe('OData function in PoetrySlamManager Service', () => {
  it('Should return the data of the logged in user', async () => {
    // Authorized user from .cdsrc.json
    axios.defaults.auth = { username: 'peter', password: 'welcome' };
    // Get user info
    const userInfo = await GET(`/odata/v4/poetryslammanager/userInfo()`, {
      headers: { 'Accept-Language': 'de-DE' }
    });
    expect(userInfo.status).to.eql(200);
    expect(userInfo.data.id).to.eql(axios.defaults.auth.username);
    expect(userInfo.data.locale).to.eql('de');
    expect(userInfo.data.roles).to.deep.eql({
      identified: true,
      authenticated: true
    });
  });

  it('Should return 403 (Forbidden) for an unauthorized user', async () => {
    // Unauthorized user from .cdsrc.json
    axios.defaults.auth = { username: 'denise', password: 'welcome' };

    return expect(
      GET(`/odata/v4/poetryslammanager/userInfo()`, {})
    ).to.rejectedWith(403);
  });
});
