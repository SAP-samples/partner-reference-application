// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Adds cds module
const cds = require('@sap/cds');
const destination = require('../../../srv/poetryslam/util/destination');
// Defines required CDS functions for testing
const { expect, GET, POST, axios, test } = cds.test(__dirname + '/../../..');
const sinon = require('sinon');

// Executes an action, like draftActivate, draftEdit or publish
const ACTION = (url, name, parameters = {}) =>
  POST(url + `/PoetrySlamService.${name}`, parameters);

// Authentication for tests; role PoetrySlamManager
axios.defaults.auth = { username: 'peter', password: 'welcome' };

// ----------------------------------------------------------------------------
// Tests authorizations for authorized user with role assignment PoetrySlamManager
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Remote Projects Tests
// ----------------------------------------------------------------------------
let db;
describe('Remote Projects in PoetrySlamService', () => {
  let stubDestination;
  let poetrySlams;

  before(async () => {
    // Connect to the database of the current project
    db = await cds.connect.to('db');
    expect(db).to.exist;
    
    await test.data.reset();

    // Read all poetry slams for usage in the tests
    poetrySlams = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams?$filter=status_code%20eq%203`,
      {
        params: { $select: `ID,status_code` }
      }
    );
    expect(poetrySlams.data.value.length).to.greaterThan(0);
  });

  beforeEach(async () => {
    await test.data.reset();
    stubDestination = sinon.stub(destination, 'readDestination');
  });

  afterEach(() => {
    stubDestination.restore();
  });

  it('should throw warning message during action createByDProject as no destination is set', async () => {
    // Execute the createByDProject action on a poetry slam with status fully booked
    const actionResult = await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlams.data.value[0].ID},IsActiveEntity=true)`,
      'createByDProject'
    );

    expect(actionResult.headers['sap-messages']).to.include(
      '"numericSeverity":3'
    );
  });

  it('should throw warning message during action createS4HCProject as no destination is set', async () => {
    // Execute the createS4HCProject action on a poetry slam with status fully booked
    const actionResult = await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlams.data.value[0].ID},IsActiveEntity=true)`,
      'createS4HCProject'
    );
    expect(actionResult.headers['sap-messages']).to.include(
      '"numericSeverity":3'
    );
  });

  it('should throw error message when retrieving SAP HANA Cloud project and no system is connected', async () => {
    expect(
      GET(
        `/odata/v4/poetryslamservice/S4HCProjects(projectUUID=00000000-0000-0000-0000-000000000000)`
      )
    ).to.rejectedWith(500);
  });

  it('should throw error message when retrieving SAP HANA Cloud processing status and no system is connected', async () => {
    expect(
      GET(
        `/odata/v4/poetryslamservice/S4HCProjectsProcessingStatus(processingStatus='aa')`
      )
    ).to.rejectedWith(500);
  });

  it('should throw error message when retrieving SAP HANA Cloud project profile code and no system is connected', async () => {
    expect(
      GET(
        `/odata/v4/poetryslamservice/S4HCProjectsProjectProfileCode(projectProfileCode='aaaaaaa')`
      )
    ).to.rejectedWith(500);
  });

  it('should throw error message when retrieving SAP Business ByDesign project and no system is connected', async () => {
    expect(
      GET(
        `/odata/v4/poetryslamservice/ByDProjects(ID='00000000-0000-0000-0000-000000000000')`
      )
    ).to.rejectedWith(500);
  });

  it('should throw error message when retrieving SAP Business One purchase order and no system is connected', async () => {
    expect(
      GET(`/odata/v4/poetryslamservice/B1PurchaseOrder(docEntry=1)`)
    ).to.rejectedWith(500);
  });
});
