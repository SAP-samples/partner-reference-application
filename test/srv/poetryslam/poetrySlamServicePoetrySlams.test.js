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
  httpCodes
} = require('../../../srv/lib/codes');

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
describe('Poetryslams in PoetrySlamService', () => {
  let poetrySlams;
  let db;

  before(async () => {
    // Connect to the database of the current project
    db = await cds.connect.to('db');
    expect(db).to.exist;
  });

  beforeEach(async () => {
    await test.data.reset();
    await POST(`/odata/v4/poetryslamservice/createTestData`);

    // Read all poetry slams for usage in the tests
    poetrySlams = await GET(`/odata/v4/poetryslamservice/PoetrySlams`, {
      params: { $select: `ID,status_code,statusCriticality` }
    });
    expect(poetrySlams.data.value.length).to.greaterThan(0);
  });

  it('should set the correct statusCriticality in read of poetry slams', () => {
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

    // @cap-js/hana: Reading decimal as string to not loose precision in case the db is of kind 'hana'
    if (cds.env.requires.db.kind === 'hana') {
      poetrySlamToBeCreated.visitorsFeeAmount =
        poetrySlamToBeCreated.visitorsFeeAmount.toString();
    }

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
    expect(actionResult.status).to.eql(httpCodes.ok);

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

    await expect(
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
    expect(result.status).to.eql(httpCodes.ok_no_content);
  });

  it('should be possible to delete a poetry slam that is canceled', async () => {
    const id = poetrySlams.data.value.find(
      (poetrySlam) => poetrySlam.status_code === poetrySlamStatusCode.canceled
    ).ID;

    const result = await DELETE(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`
    );
    expect(result.status).to.eql(httpCodes.ok_no_content);
  });

  it('should not be possible to delete a poetry slam that is published', async () => {
    const id = poetrySlams.data.value.find(
      (poetrySlam) => poetrySlam.status_code === poetrySlamStatusCode.published
    ).ID;

    await expect(
      DELETE(
        `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`
      )
    ).to.rejected;
  });

  it('should reset project data when clearProjectData action is called', async () => {
    const id = poetrySlams.data.value.find(
      (poetrySlam) => poetrySlam.status_code === poetrySlamStatusCode.published
    ).ID;

    const { PoetrySlams } = db.model.entities;

    let result = await db.update(PoetrySlams).with({
      projectID: '1',
      projectObjectID: '2',
      projectSystem: 'System'
    }).where`ID=${id}`;

    expect(result).to.eql(1);

    result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      {
        params: {
          $select: `ID,projectID,projectObjectID,projectSystem`
        }
      }
    );

    expect(result.data.projectID).to.eql('1');
    expect(result.data.projectObjectID).to.eql('2');
    expect(result.data.projectSystem).to.eql('System');

    await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      `clearProjectData`
    );

    result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`
    );

    expect(result.data.projectID).to.eql(null);
    expect(result.data.projectObjectID).to.eql(null);
    expect(result.data.projectSystem).to.eql(null);
  });

  it('should reset purchase order data when clearPurchaseOrderData action is called', async () => {
    const id = poetrySlams.data.value.find(
      (poetrySlam) => poetrySlam.status_code === poetrySlamStatusCode.published
    ).ID;

    const { PoetrySlams } = db.model.entities;

    let result = await db.update(PoetrySlams).with({
      purchaseOrderID: '1',
      purchaseOrderObjectID: '2',
      purchaseOrderSystem: 'System'
    }).where`ID=${id}`;

    expect(result).to.eql(1);

    result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      {
        params: {
          $select: `ID,purchaseOrderID,purchaseOrderObjectID,purchaseOrderSystem`
        }
      }
    );

    expect(result.data.purchaseOrderID).to.eql('1');
    expect(result.data.purchaseOrderObjectID).to.eql('2');
    expect(result.data.purchaseOrderSystem).to.eql('System');

    await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      `clearPurchaseOrderData`
    );

    result = await GET(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`
    );

    expect(result.data.purchaseOrderID).to.eql(null);
    expect(result.data.purchaseOrderObjectID).to.eql(null);
    expect(result.data.purchaseOrderSystem).to.eql(null);
  });

  it('should add purchaseOrderObjectID to select when purchaseOrderID is requested', async () => {
    let result = await GET(`/odata/v4/poetryslamservice/PoetrySlams`, {
      params: {
        $select: `ID`,
        $top: 1
      }
    });

    expect(result.data.value.length).to.eql(1);
    expect(Object.keys(result.data.value[0])).to.not.include('purchaseOrderID');
    expect(Object.keys(result.data.value[0])).to.not.include(
      'purchaseOrderObjectID'
    );

    result = await GET(`/odata/v4/poetryslamservice/PoetrySlams`, {
      params: {
        $select: `ID,purchaseOrderID`,
        $top: 1
      }
    });

    expect(result.data.value.length).to.eql(1);
    expect(Object.keys(result.data.value[0])).to.include('purchaseOrderID');
    expect(Object.keys(result.data.value[0])).to.include(
      'purchaseOrderObjectID'
    );
  });

  it('should reject createWithAI action without running SAP BTP AI Core service', async () => {
    await expect(
      ACTION(`/odata/v4/poetryslamservice/PoetrySlams`, `createWithAI`, {
        language: 'English',
        tags: 'funny',
        rhyme: false
      })
    ).to.rejectedWith(httpCodes.internal_server_error.toString());
  });
});
