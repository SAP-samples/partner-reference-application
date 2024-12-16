// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Adds cds module
const cds = require('@sap/cds');
const {
  poetrySlamStatusCode,
  color,
  visitStatusCode
} = require('../../../srv/poetryslam/util/codes');
// Defines required CDS functions for testing
const { expect, GET, POST, PATCH, axios, test, DELETE } = cds.test(
  __dirname + '/../../..'
);

// Executes an action, like 'draftActivate', 'draftEdit' or 'publish'
const ACTION = (url, name, parameters = {}) =>
  POST(url + `/PoetrySlamService.${name}`, parameters);

// Authentication for tests; role PoetrySlamManager
axios.defaults.auth = { username: 'peter', password: 'welcome' };

// ----------------------------------------------------------------------------
// Tests authorizations for authorized user with role assignment PoetrySlamManager
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Entitiy Visits Tests
// ----------------------------------------------------------------------------

describe('Visits in PoetrySlamService', () => {
  let visits;

  beforeEach(async () => {
    await test.data.reset();
    await POST(`/odata/v4/poetryslamservice/createTestData`);

    // Read all poetry slams for usage in the tests
    visits = await GET(`/odata/v4/poetryslamservice/Visits`);
    expect(visits.data.value.length).to.greaterThan(0);
  });

  it('should set the correct statusCriticality during read of visits', async () => {
    expect(
      visits.data.value.find(
        (visit) => visit.status_code === visitStatusCode.booked
      ).statusCriticality
    ).to.eql(color.green);
    expect(
      visits.data.value.find(
        (visit) => visit.status_code === visitStatusCode.canceled
      ).statusCriticality
    ).to.eql(color.red);
  });

  it('should do the correct defaulting in visit creation and update', async () => {
    const poetrySlamId = '79ceab87-300d-4b66-8cc3-f82c679b77a4';

    const poetrySlam = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=true)`
    );
    await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=true)`,
      'draftEdit'
    );

    let visitResult = await POST(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=false)/visits`,
      {}
    );
    expect(visitResult.data.IsActiveEntity).to.false;
    // Status is not defaulted as long as no visitor is set in the visit; it will be set automatically as soon as a visitor is added
    expect(visitResult.data.status_code).to.eql(null);

    const visitors = await GET(`/odata/v4/poetryslamservice/Visitors?$top=1`);
    expect(visitors.data.value.length).to.eql(1);

    visitResult = await PATCH(
      `/odata/v4/poetryslamservice/Visits(ID=${visitResult.data.ID},IsActiveEntity=false)`,
      {
        visitor_ID: visitors.data.value[0].ID
      }
    );
    expect(visitResult.data.status_code).to.eql(visitStatusCode.booked);

    // The test copies the choreography of the UI which calls a draftPrepare before draftActivate
    await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=false)`,
      'draftPrepare'
    );
    await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=false)`,
      'draftActivate'
    );

    visitResult = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=true)/visits(ID=${visitResult.data.ID},IsActiveEntity=true)`
    );
    expect(visitResult.data.IsActiveEntity).to.true;

    let poetrySlamUpdated = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=true)`
    );
    expect(poetrySlamUpdated.data.freeVisitorSeats).to.eql(
      poetrySlam.data.freeVisitorSeats - 1
    );
    expect(poetrySlamUpdated.data.bookedSeats).to.eql(
      poetrySlam.data.bookedSeats + 1
    );

    await DELETE(
      `/odata/v4/poetryslamservice/Visits(ID=${visitResult.data.ID},IsActiveEntity=true)`
    );

    poetrySlamUpdated = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=true)`
    );
    expect(poetrySlamUpdated.data.freeVisitorSeats).to.eql(
      poetrySlam.data.freeVisitorSeats
    );
    expect(poetrySlamUpdated.data.bookedSeats).to.eql(
      poetrySlam.data.bookedSeats
    );
  });

  it('should reject creation and activation of a visit without visitor data', async () => {
    const poetrySlamId = '79ceab87-300d-4b66-8cc3-f82c679b77a2';

    await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=true)`,
      'draftEdit'
    );

    let visitResult = await POST(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=false)/visits`,
      {}
    );
    expect(visitResult.data.IsActiveEntity).to.false;
    expect(visitResult.data.status_code).to.eql(null);

    return expect(
      ACTION(
        `/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=false)`,
        'draftActivate'
      )
    ).to.rejected;
  });

  it('should reject the visit creation if poetry slam is already booked', async () => {
    const poetrySlamId = '79ceab87-300d-4b66-8cc3-f82c679b77a1';

    await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=true)`,
      'draftEdit'
    );
    return expect(
      POST(
        `/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=false)/visits`,
        {}
      )
    ).to.rejected;
  });

  it('should change the status of visit in action cancel on booked entity', async () => {
    const visit = visits.data.value.find(
      (visit) => visit.status_code === visitStatusCode.booked
    );

    const poetrySlam = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${visit.parent_ID},IsActiveEntity=true)`
    );
    expect(poetrySlam.data.status_code).to.eql(poetrySlamStatusCode.booked);

    const actionResult = await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${visit.parent_ID},IsActiveEntity=true)/visits(ID=${visit.ID},IsActiveEntity=true)`,
      'cancelVisit'
    );
    expect(actionResult.data.status_code).to.eql(visitStatusCode.canceled);

    // Read the status of the poetry slam and check that it was not changed
    let result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${visit.parent_ID},IsActiveEntity=true)/visits(ID=${visit.ID},IsActiveEntity=true)?$expand=parent`,
      {
        params: { $select: `ID,status_code,parent_ID` }
      }
    );
    expect(result.data.status_code).to.eql(visitStatusCode.canceled);

    // Check that poetry slam status and free visitor seats was updated correctly
    expect(result.data.parent.freeVisitorSeats).to.eql(
      poetrySlam.data.freeVisitorSeats + 1
    );
    expect(result.data.parent.bookedSeats).to.eql(
      poetrySlam.data.bookedSeats - 1
    );
    expect(result.data.parent.status_code).to.eql(
      poetrySlamStatusCode.published
    ); // PoetrySlam status changed from Fully Booked (3) to Published (2)

    result = await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${visit.parent_ID},IsActiveEntity=true)/visits(ID=${visit.ID},IsActiveEntity=true)`,
      'cancelVisit'
    );
    // Info message expected that it is already canceled
    expect(result.headers['sap-messages']).to.include('"numericSeverity":2');
  });

  it('should change the status of visit in action confirm on canceled visit', async () => {
    const visit = visits.data.value.find(
      (visit) => visit.status_code === visitStatusCode.canceled
    );
    const id = visit.ID;
    const poetrySlam = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${visit.parent_ID},IsActiveEntity=true)`
    );

    const actionResult = await ACTION(
      `/odata/v4/poetryslamservice/Visits(ID=${id},IsActiveEntity=true)`,
      'confirmVisit'
    );
    expect(actionResult.data.status_code).to.eql(visitStatusCode.booked);

    // Read the status of the visit and check that it was changed
    let result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${visit.parent_ID},IsActiveEntity=true)/visits(ID=${id},IsActiveEntity=true)`,
      {
        params: { $select: `ID,status_code,parent_ID` }
      }
    );
    expect(result.data.status_code).to.eql(visitStatusCode.booked);

    // Check that poetry slam status and free visitor seats was updated correctly
    result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${result.data.parent_ID},IsActiveEntity=true)`
    );
    expect(result.data.freeVisitorSeats).to.eql(
      poetrySlam.data.freeVisitorSeats - 1
    );
    expect(result.data.bookedSeats).to.eql(poetrySlam.data.bookedSeats + 1);
    expect(result.data.status_code).to.eql(poetrySlam.data.status_code);

    result = await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${visit.parent_ID},IsActiveEntity=true)/visits(ID=${visit.ID},IsActiveEntity=true)`,
      'confirmVisit'
    );
    // Info message expected that it is already canceled
    expect(result.headers['sap-messages']).to.include('"numericSeverity":2');
  });

  it('should throw error during action confirm on visit that does not exist', async () => {
    // ID that is not available
    const id = '79ceab87-300d-4b66-8cc3-f82c679b77bb';

    return expect(
      ACTION(
        `/odata/v4/poetryslamservice/Visits(ID=${id},IsActiveEntity=true)`,
        `confirmVisit`
      )
    ).to.rejected;
  });

  it('should throw error during action cancel on visit that does not exist', async () => {
    // ID that is not available
    const id = '79ceab87-300d-4b66-8cc3-f82c679b77bb';

    return expect(
      ACTION(
        `/odata/v4/poetryslamservice/Visits(ID=${id},IsActiveEntity=true)`,
        `cancelVisit`
      )
    ).to.rejected;
  });
});
