// ----------------------------------------------------------------------------
// Initialization of test
// ----------------------------------------------------------------------------
'strict';

// The project's root folder
const project = __dirname + '/../..';
// Adds cds module
const cds = require('@sap/cds');
// Defines required CDS functions for testing
const { expect, GET, POST, PATCH, axios, test, DELETE } = cds.test(project);

// Executes an action, like draftActivate, draftEdit or publish
const ACTION = (url, name, parameters = {}) =>
  POST(url + `/PoetrySlamManager.${name}`, parameters);

// Authentication for tests; role PoetrySlamManager
axios.defaults.auth = { username: 'peter', password: 'welcome' };

// ----------------------------------------------------------------------------
// Tests authorizations for authorized user with role assignment PoetrySlamManager
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Entitiy PoetrySlams Tests
// ----------------------------------------------------------------------------
let db;
describe('Poetryslams in PoetrySlamManager Service', () => {
  let poetrySlams;

  before(async () => {
    // Connect to the database of the current project
    db = await cds.connect.to('db');
    expect(db).to.exist;

    // Read all poetry slams for usage in the tests
    poetrySlams = await GET(`/odata/v4/poetryslammanager/PoetrySlams`, {
      params: { $select: `ID,status_code,statusCriticality` }
    });
    expect(poetrySlams.data.value.length).to.greaterThan(0);
  });

  beforeEach(test.data.reset);

  it('should set the correct statusCriticality during read of poetryslams', async () => {
    expect(
      poetrySlams.data.value.filter(
        (poetrySlam) => poetrySlam.status_code === 1
      )[0].statusCriticality
    ).to.eql(0);
    expect(
      poetrySlams.data.value.filter(
        (poetrySlam) => poetrySlam.status_code === 4
      )[0].statusCriticality
    ).to.eql(1);
    expect(
      poetrySlams.data.value.filter(
        (poetrySlam) => poetrySlam.status_code === 3
      )[0].statusCriticality
    ).to.eql(2);
    expect(
      poetrySlams.data.value.filter(
        (poetrySlam) => poetrySlam.status_code === 2
      )[0].statusCriticality
    ).to.eql(3);
  });

  it('should get the values for the currency association (cds-common-content)', async () => {
    const commonCurrencyEuro = [
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
      `/odata/v4/poetryslammanager/PoetrySlams?$expand=visitorsFeeCurrency`,
      { headers: { 'Accept-Language': 'en-US;en;' } }
    );
    expect(result.data.value.length).to.be.greaterThan(0);

    let poetrySlamEuro = result.data.value.find(
      (poetrySlam) => poetrySlam.visitorsFeeCurrency.code === 'EUR'
    );
    expect(poetrySlamEuro.visitorsFeeCurrency).to.containSubset(
      commonCurrencyEuro[0]
    );

    result = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams?$expand=visitorsFeeCurrency`,
      { headers: { 'Accept-Language': 'fr-Fr;fr;' } }
    );
    expect(result.data.value.length).to.be.greaterThan(0);

    poetrySlamEuro = result.data.value.find(
      (poetrySlam) => poetrySlam.visitorsFeeCurrency.code === 'EUR'
    );
    expect(poetrySlamEuro.visitorsFeeCurrency).to.containSubset(
      commonCurrencyEuro[1]
    );
  });

  it('should do the correct defaulting during poetryslam creation', async () => {
    const poetrySlamToBeCreated = {
      title: 'Poetry Slam Default Test',
      description: 'Description Poetry Slam Default Test',
      dateTime: new Date(),
      maxVisitorsNumber: 20,
      visitorsFeeAmount: 9.95,
      visitorsFeeCurrency_code: 'EUR'
    };

    // Create a new poetry slam; it will be created in draft mode
    let actionResult = await POST(
      `/odata/v4/poetryslammanager/PoetrySlams`,
      poetrySlamToBeCreated
    );
    expect(actionResult.data.number).is.null;

    poetrySlamToBeCreated.freeVisitorSeats =
      poetrySlamToBeCreated.maxVisitorsNumber;
    poetrySlamToBeCreated.createdBy = 'peter';
    poetrySlamToBeCreated.status_code = 1;
    poetrySlamToBeCreated.statusCriticality = 0;
    // DataTime cannot be compared with the object due to data conversion
    delete poetrySlamToBeCreated.dateTime;
    const id = actionResult.data.ID;

    // Read the newly created poetry slam in draft mode
    let result = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=false)`
    );
    expect(result.data).to.containSubset(poetrySlamToBeCreated);

    // Activate the draft
    await ACTION(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=false)`,
      'draftActivate'
    );
    result = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=true)`
    );
    expect(result.data).to.containSubset(poetrySlamToBeCreated);
    expect(result.data.number).is.not.null;
  });

  it('should do the correct determinations during poetryslam update', async () => {
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

    expect(result.data.status_code).to.eql(2);
    expect(result.data.maxVisitorsNumber).to.eql(3);
    expect(result.data.freeVisitorSeats).to.eql(1);
    expect(result.data.bookedSeats).to.eql(2);

    // Read the updated poetry slam in draft mode
    result = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=false)`
    );

    expect(result.data.status_code).to.eql(2);
    expect(result.data.maxVisitorsNumber).to.eql(3);
    expect(result.data.freeVisitorSeats).to.eql(1);
    expect(result.data.bookedSeats).to.eql(2);

    // Update the  poetry slam in draft mode by reducing the max visitors
    result = await PATCH(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=false)`,
      {
        maxVisitorsNumber: 2
      }
    );

    expect(result.data.status_code).to.eql(3);
    expect(result.data.maxVisitorsNumber).to.eql(2);
    expect(result.data.freeVisitorSeats).to.eql(0);
    expect(result.data.bookedSeats).to.eql(2);

    result = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=false)`
    );

    expect(result.data.status_code).to.eql(3);
    expect(result.data.maxVisitorsNumber).to.eql(2);
    expect(result.data.freeVisitorSeats).to.eql(0);
    expect(result.data.bookedSeats).to.eql(2);

    // Activate the draft
    await POST(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=false)/PoetrySlamManager.draftActivate`,
      {}
    );
    result = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=true)`
    );

    expect(result.data.status_code).to.eql(3);
    expect(result.data.maxVisitorsNumber).to.eql(2);
    expect(result.data.freeVisitorSeats).to.eql(0);
    expect(result.data.bookedSeats).to.eql(2);
    expect(result.data.IsActiveEntity).to.eql(true);
  });

  it('should change the status of poetryslams correctly during action publish', async () => {
    const id = poetrySlams.data.value.filter(
      (poetrySlam) => poetrySlam.status_code === 1
    )[0].ID;

    // Execute the publish action on a poetry slam with status in preperation
    const actionResult = await ACTION(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      'publish'
    );
    expect(actionResult.data.status_code).to.eql(2);

    // Read the status of the poetry slam and check that it is changed to 2 (published)
    const result = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=true)?`,
      {
        params: { $select: `ID,status_code,statusCriticality` }
      }
    );

    expect(result.data.status_code).to.eql(2);
    expect(result.data.statusCriticality).to.eql(3);
  });

  it('should not change the status of poetryslams during action publish on booked entities', async () => {
    const id = poetrySlams.data.value.filter(
      (poetrySlam) => poetrySlam.status_code === 3
    )[0].ID;

    // Execute the publish action on a poetry slam with status in preparation
    const actionResult = await ACTION(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      `publish`
    );
    expect(actionResult.data.status_code).to.eql(3);
    expect(actionResult.status).to.eql(200);

    // Read the status of the poetry slam and check that it is changed to 2 (published)
    const result = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=true)?`,
      {
        params: { $select: `ID,status_code,statusCriticality` }
      }
    );

    expect(result.data.status_code).to.eql(3);
    expect(result.data.statusCriticality).to.eql(2);
  });

  it('should not change the status of poetryslams during action cancel on entities in preparation', async () => {
    // Execute the cancel action on a poetry slam with status in preperation --> nothing happens
    const id = poetrySlams.data.value.filter(
      (poetrySlam) => poetrySlam.status_code === 1
    )[0].ID;

    const actionResult = await ACTION(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      'cancel'
    );
    expect(actionResult.data.status_code).to.eql(1);

    // Read the status of the poetry slam and check that it was not changed
    const result = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=true)?`,
      {
        params: { $select: `ID,status_code,statusCriticality` }
      }
    );

    expect(result.data.status_code).to.eql(1);
    expect(result.data.statusCriticality).to.eql(0);
  });

  it('should change the status of poetryslams during action cancel on published entities', async () => {
    const id = poetrySlams.data.value.filter(
      (poetrySlam) => poetrySlam.status_code === 2
    )[0].ID;

    const actionResult = await ACTION(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      'cancel'
    );
    expect(actionResult.data.status_code).to.eql(4);

    // Read the status of the poetry slam and check that it was not changed
    const result = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=true)?`,
      {
        params: { $select: `ID,status_code,statusCriticality` }
      }
    );

    expect(result.data.status_code).to.eql(4);
    expect(result.data.statusCriticality).to.eql(1);
  });
});

// ----------------------------------------------------------------------------
// Entitiy Visits Tests
// ----------------------------------------------------------------------------

describe('Visits in PoetrySlamManager Service', () => {
  let visits;

  before(async () => {
    // Read all poetry slams for usage in the tests
    visits = await GET(`/odata/v4/poetryslammanager/Visits`);
    expect(visits.data.value.length).to.greaterThan(0);
  });

  beforeEach(test.data.reset);

  it('should set the correct statusCriticality during read of visits', async () => {
    expect(
      visits.data.value.filter((visit) => visit.status_code === 1)[0]
        .statusCriticality
    ).to.eql(3);
    expect(
      visits.data.value.filter((visit) => visit.status_code === 2)[0]
        .statusCriticality
    ).to.eql(1);
  });

  it('should do the correct defaulting during visit creation and update', async () => {
    const poetrySlamId = '79ceab87-300d-4b66-8cc3-f82c679b77a4';

    const poetrySlam = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=true)`
    );
    await ACTION(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=true)`,
      'draftEdit'
    );

    let visitResult = await POST(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=false)/visits`,
      {}
    );
    expect(visitResult.data.IsActiveEntity).to.be.false;
    expect(visitResult.data.HasActiveEntity).to.be.false;
    expect(visitResult.data.status_code).to.be.eq(null);

    const visitors = await GET(`/odata/v4/poetryslammanager/Visitors?$top=1`);
    expect(visitors.data.value.length).to.greaterThan(0);

    visitResult = await PATCH(
      `/odata/v4/poetryslammanager/Visits(ID=${visitResult.data.ID},IsActiveEntity=false)`,
      {
        visitor_ID: visitors.data.value[0].ID
      }
    );

    expect(visitResult.data.status_code).to.eql(1);

    await ACTION(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=false)`,
      'draftPrepare'
    );
    await ACTION(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=false)`,
      'draftActivate'
    );

    visitResult = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=true)/visits(ID=${visitResult.data.ID},IsActiveEntity=true)`
    );
    expect(visitResult.data.IsActiveEntity).to.be.true;

    let poetrySlamUpdated = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=true)`
    );
    expect(poetrySlamUpdated.data.freeVisitorSeats).to.eql(
      poetrySlam.data.freeVisitorSeats - 1
    );
    expect(poetrySlamUpdated.data.bookedSeats).to.eql(
      poetrySlam.data.bookedSeats + 1
    );

    await DELETE(
      `/odata/v4/poetryslammanager/Visits(ID=${visitResult.data.ID},IsActiveEntity=true)`
    );

    poetrySlamUpdated = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=true)`
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
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=true)`,
      'draftEdit'
    );

    let visitResult = await POST(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=false)/visits`,
      {}
    );
    expect(visitResult.data.IsActiveEntity).to.be.false;
    expect(visitResult.data.HasActiveEntity).to.be.false;
    expect(visitResult.data.status_code).to.be.eq(null);

    return expect(
      ACTION(
        `/odata/v4/poetryslammanager/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=false)`,
        'draftActivate'
      )
    ).to.be.rejected;
  });

  it('should reject the visit creation as poetry slam is already booked', async () => {
    const poetrySlamId = '79ceab87-300d-4b66-8cc3-f82c679b77a1';

    await ACTION(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=true)`,
      'draftEdit'
    );
    return expect(
      POST(
        `/odata/v4/poetryslammanager/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=false)/visits`,
        {}
      )
    ).to.be.rejected;
  });

  it('should change the status of visit during action cancel on booked entity', async () => {
    const visit = visits.data.value.filter(
      (visit) => visit.status_code === 1
    )[0];
    const id = visit.ID;
    const poetrySlam = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${visit.parent_ID},IsActiveEntity=true)`
    );

    const actionResult = await ACTION(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${visit.parent_ID},IsActiveEntity=true)/visits(ID=${id},IsActiveEntity=true)`,
      'cancelVisit'
    );
    expect(actionResult.data.status_code).to.eql(2);

    // Read the status of the poetry slam and check that it was not changed
    let result = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${visit.parent_ID},IsActiveEntity=true)/visits(ID=${id},IsActiveEntity=true)?`,
      {
        params: { $select: `ID,status_code,statusCriticality,parent_ID` }
      }
    );
    expect(result.data.status_code).to.eql(2);
    expect(result.data.statusCriticality).to.eql(1);

    // Check that poetry slam status and free visitor seats was updated correctly
    result = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${result.data.parent_ID},IsActiveEntity=true)`
    );
    expect(result.data.freeVisitorSeats).to.eql(
      poetrySlam.data.freeVisitorSeats + 1
    );
    expect(result.data.bookedSeats).to.eql(poetrySlam.data.bookedSeats - 1);
    expect(result.data.status_code).to.eql(2); // PoetrySlam status changed from Fully Booked (3) to Published (2)
  });

  it('should change the status of visit during action confirm on canceled entity', async () => {
    const visit = visits.data.value.filter(
      (visit) => visit.status_code === 2
    )[0];
    const id = visit.ID;
    const poetrySlam = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${visit.parent_ID},IsActiveEntity=true)`
    );

    const actionResult = await ACTION(
      `/odata/v4/poetryslammanager/Visits(ID=${id},IsActiveEntity=true)`,
      'confirmVisit'
    );
    expect(actionResult.data.status_code).to.eql(1);

    // Read the status of the visit and check that it was changed
    let result = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${visit.parent_ID},IsActiveEntity=true)/visits(ID=${id},IsActiveEntity=true)?`,
      {
        params: { $select: `ID,status_code,statusCriticality,parent_ID` }
      }
    );
    expect(result.data.status_code).to.eql(1);
    expect(result.data.statusCriticality).to.eql(3);

    // Check that poetry slam status and free visitor seats was updated correctly
    result = await GET(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${result.data.parent_ID},IsActiveEntity=true)`
    );
    expect(result.data.freeVisitorSeats).to.eql(
      poetrySlam.data.freeVisitorSeats - 1
    );
    expect(result.data.bookedSeats).to.eql(poetrySlam.data.bookedSeats + 1);
    expect(result.data.status_code).to.eql(poetrySlam.data.status_code);
  });
});

// ----------------------------------------------------------------------------
// Entitiy Visitor Tests
// ----------------------------------------------------------------------------

describe('Visitors in PoetrySlamManager Service', () => {
  beforeEach(test.data.reset);

  it('should return the visitor data', async () => {
    // Read all visitors
    const visitors = await GET(`/odata/v4/poetryslammanager/Visitors`, {
      params: { $select: `ID,name,email` }
    });
    expect(visitors.data.value.length).to.greaterThan(0);
  });

  it('should fail when creatiing a visitor', async () => {
    const entryToBeCreated = {
      name: 'Peter',
      email: 'peter@pra.ondemand.com'
    };

    return expect(
      POST(`/odata/v4/poetryslammanager/Visitors`, entryToBeCreated)
    ).to.be.rejected;
  });
});

// ----------------------------------------------------------------------------
// OData Function Tests
// ----------------------------------------------------------------------------

describe('OData function in PoetrySlamManager Service', () => {
  // Decouple test data
  let username;
  let password;

  before(() => {
    username = axios.defaults.auth.username;
    password = axios.defaults.auth.password;
  });

  beforeEach(test.data.reset);

  after(() => {
    axios.defaults.auth = { username: username, password: password };
  });

  it('Should return the data of the logged in user', async () => {
    // Authorized user from .cdsrc.json
    axios.defaults.auth = { username: 'peter', password: 'welcome' };
    // Get user info
    const userInfo = await GET(`/odata/v4/poetryslammanager/userInfo()`, {
      headers: { 'Accept-Language': 'de-DE' }
    });
    expect(userInfo.status).to.equal(200);
    expect(userInfo.data.id).to.equal(axios.defaults.auth.username);
    expect(userInfo.data.locale).to.equal('de');
    expect(userInfo.data.roles).to.deep.equal({
      identified: true,
      authenticated: true
    });
  });

  it('Should return 403 (Forbidden) for an unauthorized user', async () => {
    // Unauthorized user from .cdsrc.json
    axios.defaults.auth = { username: 'denise', password: 'welcome' };
    try {
      await GET(`/odata/v4/poetryslammanager/userInfo()`, {});
    } catch (error) {
      expect(error.response.status).to.equal(403);
    }
  });
});
