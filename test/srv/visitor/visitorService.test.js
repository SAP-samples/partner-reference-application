// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Adds cds module
const cds = require('@sap/cds');
// Defines required CDS functions for testing
const { expect, GET, POST, axios } = cds.test(__dirname + '/../../..');

// Executes an action, like 'draftActivate', 'draftEdit' or 'publish'
const ACTION = (url, name, parameters = {}) =>
  POST(url + `/VisitorService.${name}`, parameters);

// Authentication for tests; role PoetrySlamManager
axios.defaults.auth = { username: 'peter', password: 'welcome' };

// ----------------------------------------------------------------------------
// Visitor Service Tests
// ----------------------------------------------------------------------------

describe('VisitorService', () => {
  it('should return the visitor data', async () => {
    // Read all visitors
    const visitors = await GET(`/odata/v4/visitorservice/Visitors`, {
      params: { $select: `ID,name,email` }
    });
    expect(visitors.data.value.length).to.greaterThan(0);
  });

  it('should allow the creation of a visitor', async () => {
    const entryToBeCreated = {
      name: 'Julie',
      email: 'julie@pra.ondemand.com'
    };

    const createdDraftEntity = await POST(
      `/odata/v4/visitorservice/Visitors`,
      entryToBeCreated
    );

    const id = createdDraftEntity.data.ID;
    expect(id).is.not.null;

    // Read the newly created poetry slam in draft mode
    let result = await GET(
      `/odata/v4/visitorservice/Visitors(ID=${id},IsActiveEntity=false)`
    );
    expect(result.data).to.containSubset(entryToBeCreated);

    // Activate the draft
    await ACTION(
      `/odata/v4/visitorservice/Visitors(ID=${id},IsActiveEntity=false)`,
      'draftActivate'
    );
    result = await GET(
      `/odata/v4/visitorservice/Visitors(ID=${id},IsActiveEntity=true)`
    );
    expect(result.data).to.containSubset(entryToBeCreated);
  });
});
