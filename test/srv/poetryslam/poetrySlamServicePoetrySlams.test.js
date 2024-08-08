// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Adds cds module
const cds = require('@sap/cds');
const {
  poetrySlamStatusCode,
  color
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
// Entity PoetrySlams Tests
// ----------------------------------------------------------------------------
let db;
describe('Poetryslams in PoetrySlamService', () => {
  let poetrySlams;

  before(async () => {
    // Connect to the database of the current project
    db = await cds.connect.to('db');
    expect(db).to.exist;

    await test.data.reset();

    // Read all poetry slams for usage in the tests
    poetrySlams = await GET(`/odata/v4/poetryslamservice/PoetrySlams`, {
      params: { $select: `ID,status_code,statusCriticality` }
    });
    expect(poetrySlams.data.value.length).to.greaterThan(0);
  });

  beforeEach(async () => {
    await test.data.reset();
  });

  it('should set the correct statusCriticality in read of poetry slams', async () => {
    expect(
      poetrySlams.data.value.find(
        (poetrySlam) =>
          poetrySlam.status_code === poetrySlamStatusCode.inPreparation
      ).statusCriticality
    ).to.eql(0);
    expect(
      poetrySlams.data.value.find(
        (poetrySlam) => poetrySlam.status_code === poetrySlamStatusCode.canceled
      ).statusCriticality
    ).to.eql(1);
    expect(
      poetrySlams.data.value.find(
        (poetrySlam) => poetrySlam.status_code === poetrySlamStatusCode.booked
      ).statusCriticality
    ).to.eql(2);
    expect(
      poetrySlams.data.value.find(
        (poetrySlam) =>
          poetrySlam.status_code === poetrySlamStatusCode.published
      ).statusCriticality
    ).to.eql(3);
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
      `/odata/v4/poetryslamservice/PoetrySlams?$expand=visitorsFeeCurrency`,
      { headers: { 'Accept-Language': 'en-US;en;' } }
    );
    expect(result.data.value.length).to.greaterThan(0);

    let poetrySlam = result.data.value.find(
      (poetrySlam) => poetrySlam.visitorsFeeCurrency.code === 'EUR'
    );
    expect(poetrySlam.visitorsFeeCurrency).to.containSubset(commonCurrency[0]);

    result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams?$expand=visitorsFeeCurrency`,
      { headers: { 'Accept-Language': 'fr-Fr;fr;' } }
    );
    expect(result.data.value.length).to.greaterThan(0);

    poetrySlam = result.data.value.find(
      (poetrySlam) => poetrySlam.visitorsFeeCurrency.code === 'EUR'
    );
    expect(poetrySlam.visitorsFeeCurrency).to.containSubset(commonCurrency[1]);
  });

  it('should do the correct defaulting in poetry slam creation', async () => {
    const poetrySlamToBeCreated = {
      title: 'Poetry Slam Default Test',
      description: 'Description Poetry Slam Default Test',
      dateTime: new Date().toISOString().replace(/\..*(?=Z)/, ''),
      maxVisitorsNumber: 20,
      visitorsFeeAmount: 9.95,
      visitorsFeeCurrency_code: 'EUR'
    };

    // Create a new poetry slam; it will be created in draft mode
    const createdDraftEntity = await POST(
      `/odata/v4/poetryslamservice/PoetrySlams`,
      poetrySlamToBeCreated
    );
    const id = createdDraftEntity.data.ID;
    expect(id).is.not.null;
    expect(createdDraftEntity.data.number).is.null;

    poetrySlamToBeCreated.freeVisitorSeats =
      poetrySlamToBeCreated.maxVisitorsNumber;
    poetrySlamToBeCreated.createdBy = 'peter';
    poetrySlamToBeCreated.status_code = poetrySlamStatusCode.inPreparation;
    poetrySlamToBeCreated.statusCriticality = color.grey;

    // Read the newly created poetry slam in draft mode
    let result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=false)`
    );
    expect(result.data).to.containSubset(poetrySlamToBeCreated);

    // Activate the draft
    await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=false)`,
      'draftActivate'
    );
    result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`
    );
    expect(result.data).to.containSubset(poetrySlamToBeCreated);
    expect(result.data.number).is.not.null;
  });

  it('should do the correct calculations in poetryslam update', async () => {
    // Poetry slam is booked and has 2 visitors assigned
    const id = '79ceab87-300d-4b66-8cc3-f82c679b77a1';

    // Read the updated poetry slam in draft mode
    let result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`
    );
    expect(result.data.status_code).to.eql(poetrySlamStatusCode.booked);
    expect(result.data.maxVisitorsNumber).to.eql(2);
    expect(result.data.freeVisitorSeats).to.eql(0);
    expect(result.data.bookedSeats).to.eql(2);

    // Move poetry slam into draft mode by calling action 'draftEdit'
    await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      `draftEdit`
    );

    // Increase max visitors --> status should be changed to published and free visitor seats and booked seats are changed
    result = await PATCH(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=false)`,
      {
        maxVisitorsNumber: 3
      }
    );
    expect(result.data.status_code).to.eql(poetrySlamStatusCode.published);
    expect(result.data.maxVisitorsNumber).to.eql(3);
    expect(result.data.freeVisitorSeats).to.eql(1);
    expect(result.data.bookedSeats).to.eql(2);

    // Read the updated poetry slam in draft mode
    result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=false)`
    );
    expect(result.data.status_code).to.eql(poetrySlamStatusCode.published);
    expect(result.data.maxVisitorsNumber).to.eql(3);
    expect(result.data.freeVisitorSeats).to.eql(1);
    expect(result.data.bookedSeats).to.eql(2);

    // Decrease max visitors --> status should be changed to booked and free visitor seats and booked seats are changed
    result = await PATCH(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=false)`,
      {
        maxVisitorsNumber: 2
      }
    );
    expect(result.data.status_code).to.eql(poetrySlamStatusCode.booked);
    expect(result.data.maxVisitorsNumber).to.eql(2);
    expect(result.data.freeVisitorSeats).to.eql(0);
    expect(result.data.bookedSeats).to.eql(2);

    result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=false)`
    );

    expect(result.data.status_code).to.eql(poetrySlamStatusCode.booked);
    expect(result.data.maxVisitorsNumber).to.eql(2);
    expect(result.data.freeVisitorSeats).to.eql(0);
    expect(result.data.bookedSeats).to.eql(2);

    // Activate the draft
    await POST(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=false)/PoetrySlamService.draftActivate`,
      {}
    );
    result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`
    );
    expect(result.data.status_code).to.eql(poetrySlamStatusCode.booked);
    expect(result.data.maxVisitorsNumber).to.eql(2);
    expect(result.data.freeVisitorSeats).to.eql(0);
    expect(result.data.bookedSeats).to.eql(2);
    expect(result.data.IsActiveEntity).to.eql(true);
  });

  it('should change the status of poetry slams correctly in action publish', async () => {
    const id = poetrySlams.data.value.find(
      (poetrySlam) =>
        poetrySlam.status_code === poetrySlamStatusCode.inPreparation
    ).ID;

    // Execute the action 'publish' on a poetry slam with status in preperation
    const actionResult = await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      'publish'
    );
    expect(actionResult.data.status_code).to.eql(2);

    // Read the status of the poetry slam and check that it is changed to 2 (published)
    const result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      {
        params: { $select: `ID,status_code` }
      }
    );
    expect(result.data.status_code).to.eql(poetrySlamStatusCode.published);
  });

  it('should not change the status of poetry slams in action publish on booked entities', async () => {
    const id = poetrySlams.data.value.find(
      (poetrySlam) => poetrySlam.status_code === poetrySlamStatusCode.booked
    ).ID;

    // Execute the action 'publish' on a poetry slam with status booked
    const actionResult = await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      `publish`
    );
    expect(actionResult.data.status_code).to.eql(poetrySlamStatusCode.booked);
    expect(actionResult.status).to.eql(200);

    // Info message expected that it is already booked
    expect(actionResult.headers['sap-messages']).to.include(
      '"numericSeverity":2'
    );

    // Read the status of the poetry slam and check that it is not changed
    const result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      {
        params: { $select: `ID,status_code` }
      }
    );

    expect(result.data.status_code).to.eql(poetrySlamStatusCode.booked);
  });

  it('should throw error in action publish on poetry slam that does not exist', async () => {
    // ID that is not available
    const id = '79ceab87-300d-4b66-8cc3-f82c679b77bb';

    return expect(
      ACTION(
        `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
        `publish`
      )
    ).to.rejected;
  });

  it('should change the status of poetry slams in action cancel on published entities', async () => {
    const id = poetrySlams.data.value.find(
      (poetrySlam) => poetrySlam.status_code === poetrySlamStatusCode.published
    ).ID;

    const actionResult = await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      'cancel'
    );
    expect(actionResult.data.status_code).to.eql(poetrySlamStatusCode.canceled);

    // Read the status of the poetry slam and check that it was canceled
    const result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      {
        params: { $select: `ID,status_code` }
      }
    );
    expect(result.data.status_code).to.eql(poetrySlamStatusCode.canceled);
  });

  it('should not change the status of poetry slams in action cancel on entities in preparation', async () => {
    // Execute action 'cancel' on a poetry slam with status in preperation --> nothing happens
    const id = poetrySlams.data.value.find(
      (poetrySlam) =>
        poetrySlam.status_code === poetrySlamStatusCode.inPreparation
    ).ID;

    const actionResult = await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      'cancel'
    );
    expect(actionResult.data.status_code).to.eql(
      poetrySlamStatusCode.inPreparation
    );

    // Info message expected that cancelation is not possible in this status
    expect(actionResult.headers['sap-messages']).to.include(
      '"numericSeverity":2'
    );

    // Read the status of the poetry slam and check that it was not changed
    const result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      {
        params: { $select: `ID,status_code` }
      }
    );
    expect(result.data.status_code).to.eql(poetrySlamStatusCode.inPreparation);
  });

  it('should be possible to delete a poetry slam that is in preparation', async () => {
    const id = poetrySlams.data.value.find(
      (poetrySlam) =>
        poetrySlam.status_code === poetrySlamStatusCode.inPreparation
    ).ID;

    const result = await DELETE(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`
    );
    expect(result.status).to.eql(204);
  });

  it('should be possible to delete a poetry slam that is canceled', async () => {
    const id = poetrySlams.data.value.find(
      (poetrySlam) => poetrySlam.status_code === poetrySlamStatusCode.canceled
    ).ID;

    const result = await DELETE(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`
    );
    expect(result.status).to.eql(204);
  });

  it('should not be possible to delete a poetry slam that is published', async () => {
    const id = poetrySlams.data.value.find(
      (poetrySlam) => poetrySlam.status_code === poetrySlamStatusCode.published
    ).ID;

    return expect(
      DELETE(
        `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`
      )
    ).to.rejected;
  });

  it('should reset project data when project ID is reset', async () => {
    const id = poetrySlams.data.value.find(
      (poetrySlam) => poetrySlam.status_code === poetrySlamStatusCode.published
    ).ID;

    // Move poetry slam into draft mode by calling action 'draftEdit'
    await ACTION(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      `draftEdit`
    );

    // When project ID is reset all project fields are set to null
    const result = await PATCH(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=false)`,
      {
        projectID: ''
      }
    );
    expect(result.data.projectID).to.eql(null);
    expect(result.data.projectObjectID).to.eql(null);
    expect(result.data.projectURL).to.eql(null);
    expect(result.data.projectSystem).to.eql(null);
    expect(result.data.projectSystemName).to.eql('');
  });

  it('should reset purchase order data when purchase order ID is reset', async () => {
    const id = poetrySlams.data.value.find(
      (poetrySlam) => poetrySlam.status_code === poetrySlamStatusCode.published
    ).ID;

    // Move poetry slam into draft mode by calling action 'draftEdit'
    await ACTION(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      `draftEdit`
    );

    // When purchase order ID is reset all purchase order fields are set to null
    const result = await PATCH(
      `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=false)`,
      {
        purchaseOrderID: ''
      }
    );
    expect(result.data.purchaseOrderID).to.eql(null);
    expect(result.data.purchaseOrderObjectID).to.eql(null);
    expect(result.data.purchaseOrderURL).to.eql(null);
    expect(result.data.purchaseOrderSystem).to.eql(null);
    expect(result.data.purchaseOrderSystemName).to.eql(undefined);
  });
});
