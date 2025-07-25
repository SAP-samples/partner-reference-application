// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Adds cds module
const cds = require('@sap/cds');
// Offers entity calculations
const entityCalculations = require('../../../srv/lib/entityCalculations');
const { httpCodes } = require('../../../srv/lib/codes');

const ConnectorByD = require('../../../srv/poetryslam/connector/connectorByD');
const ConnectorB1 = require('../../../srv/poetryslam/connector/connectorB1');

// Defines required CDS functions for testing
const { expect } = cds.test(__dirname + '/../../..');
const sinon = require('sinon');

describe('Util Entity Calculations - Project', () => {
  let stubCreateConnectorData,
    stubInsertRemoteProject,
    stubProjectDataRecord,
    stubUPDATE,
    stubSELECT;

  let connectorData, updateData, projectReturnData;

  beforeEach(() => {
    connectorData = {
      isConnected: function () {
        return true;
      },
      projectDataRecord: function () {
        return;
      },
      getRemoteProjectData: function () {
        return;
      },
      insertRemoteProjectData: function () {
        return;
      },
      determineDestinationURL: function () {
        return 'testDestinationURL';
      }
    };

    projectReturnData = {
      projectID: 'Test1',
      projectObjectID: 'TestObjectID'
    };

    stubCreateConnectorData = sinon
      .stub(ConnectorByD, 'createConnectorInstance')
      .resolves(connectorData);

    stubInsertRemoteProject = sinon
      .stub(connectorData, 'insertRemoteProjectData')
      .returns(projectReturnData);
    stubProjectDataRecord = sinon.stub(connectorData, 'projectDataRecord');

    stubSELECT = sinon.stub(SELECT.one, 'from').returns({
      where: (projectRecord) => {
        if (projectRecord.ID === 'ID not available') {
          return;
        }
        return {
          projectID: 'ProjectTestID',
          ID: projectRecord.ID,
          projectSystem: ConnectorByD.ERP_SYSTEM
        };
      }
    });

    stubUPDATE = sinon.stub(UPDATE, 'entity').returns({
      set: (setValue) => {
        updateData = setValue;
        return {
          where: () => {
            return;
          }
        };
      }
    });
  });

  afterEach(() => {
    stubCreateConnectorData.restore();
    stubInsertRemoteProject.restore();
    stubUPDATE.restore();
    stubSELECT.restore();
    stubProjectDataRecord.restore();
  });

  // ----------------------------------------------------------------------------
  // Entity Calculations Tests
  // ----------------------------------------------------------------------------
  it('should retrieve a project and update the poetry slam entity', async () => {
    const req = {
      params: [{ ID: 1 }]
    };

    const stubGetRemoteProject = sinon
      .stub(connectorData, 'getRemoteProjectData')
      .returns(projectReturnData);

    await entityCalculations.createProject(
      req,
      {},
      ConnectorByD,
      'errorTextTest'
    );

    expect(updateData.projectID).to.eql('Test1');
    expect(updateData.projectObjectID).to.eql('TestObjectID');
    expect(updateData.projectSystem).to.eql(ConnectorByD.ERP_SYSTEM);

    sinon.assert.calledOnce(stubProjectDataRecord);
    sinon.assert.notCalled(stubInsertRemoteProject);

    stubGetRemoteProject.restore();
  });

  it('should insert a project and update the poetry slam entity', async () => {
    const req = {
      params: [{ ID: 1 }]
    };

    await entityCalculations.createProject(
      req,
      {},
      ConnectorByD,
      'errorTextTest'
    );

    expect(updateData.projectID).to.eql('Test1');
    expect(updateData.projectObjectID).to.eql('TestObjectID');
    expect(updateData.projectSystem).to.eql(ConnectorByD.ERP_SYSTEM);

    sinon.assert.calledOnce(stubProjectDataRecord);
    sinon.assert.calledOnce(stubInsertRemoteProject);
  });

  it('should add warning to request when no connection to ERP system is found', async () => {
    const errorObject = {};
    const req = {
      warn: (errorID, errorText) => {
        errorObject.ID = errorID;
        errorObject.text = errorText;
      }
    };

    const stubIsConnected = sinon
      .stub(connectorData, 'isConnected')
      .returns(false);

    await entityCalculations.createProject(
      req,
      {},
      ConnectorByD,
      'errorTextTest'
    );

    expect(errorObject.ID).to.eql(httpCodes.internal_server_error);
    expect(errorObject.text).to.eql('errorTextTest');

    sinon.assert.notCalled(stubProjectDataRecord);
    sinon.assert.notCalled(stubInsertRemoteProject);

    stubIsConnected.restore();
  });

  it('should add error to request when no poetry slam with the ID is found', async () => {
    const errorObject = {};
    const req = {
      params: [{ ID: 'ID not available' }],
      error: (errorID, errorText) => {
        errorObject.ID = errorID;
        errorObject.text = errorText;
      }
    };

    await entityCalculations.createProject(
      req,
      {},
      ConnectorByD,
      'errorTextTest'
    );

    expect(errorObject.ID).to.eql(httpCodes.bad_request);
    expect(errorObject.text).to.eql('ACTION_CREATE_PROJECT_DRAFT');

    sinon.assert.notCalled(stubProjectDataRecord);
    sinon.assert.notCalled(stubInsertRemoteProject);
  });

  it('should add error to request when project creation fails', async () => {
    const errorObject = {};
    const req = {
      params: [{ ID: 1 }],
      warn: (errorID, errorText) => {
        errorObject.ID = errorID;
        errorObject.text = errorText;
      }
    };

    projectReturnData.projectID = null;

    await entityCalculations.createProject(
      req,
      {},
      ConnectorByD,
      'errorTextTest'
    );

    expect(errorObject.ID).to.eql(httpCodes.internal_server_error);
    expect(errorObject.text).to.eql('ACTION_CREATE_PROJECT_FAILED');

    sinon.assert.calledOnce(stubProjectDataRecord);
    sinon.assert.calledOnce(stubInsertRemoteProject);
  });
});

describe('Util Entity Calculations - Purchase Order', () => {
  let stubCreateConnectorData,
    stubInsertRemotePurchaseOrder,
    stubPurchaseOrderDataRecord,
    stubUPDATE,
    stubSELECT;

  let connectorData, updateData, purchaseOrderReturnData;

  beforeEach(() => {
    connectorData = {
      isConnected: function () {
        return true;
      },
      purchaseOrderDataRecord: function () {
        return;
      },
      insertRemotePurchaseOrderData: function () {
        return;
      },
      determineDestinationURL: function () {
        return 'testDestinationURL';
      }
    };

    purchaseOrderReturnData = {
      purchaseOrderID: 'Test1',
      purchaseOrderObjectID: 'TestObjectID'
    };

    stubCreateConnectorData = sinon
      .stub(ConnectorB1, 'createConnectorInstance')
      .resolves(connectorData);

    stubInsertRemotePurchaseOrder = sinon
      .stub(connectorData, 'insertRemotePurchaseOrderData')
      .returns(purchaseOrderReturnData);
    stubPurchaseOrderDataRecord = sinon.stub(
      connectorData,
      'purchaseOrderDataRecord'
    );

    stubSELECT = sinon.stub(SELECT.one, 'from').returns({
      where: (record) => {
        if (record.ID === 'ID not available') {
          return;
        }
        return {
          ID: record.ID,
          purchaseOrderSystem: ConnectorB1.ERP_SYSTEM
        };
      }
    });

    stubUPDATE = sinon.stub(UPDATE, 'entity').returns({
      set: (setValue) => {
        updateData = setValue;
        return {
          where: () => {
            return;
          }
        };
      }
    });
  });

  afterEach(() => {
    stubCreateConnectorData.restore();
    stubInsertRemotePurchaseOrder.restore();
    stubUPDATE.restore();
    stubSELECT.restore();
    stubPurchaseOrderDataRecord.restore();
  });

  // ----------------------------------------------------------------------------
  // Entity Calculations Tests
  // ----------------------------------------------------------------------------
  it('should insert a purchase order and update the poetry slam entity', async () => {
    const req = {
      params: [{ ID: 1 }]
    };

    await entityCalculations.createPurchaseOrder(
      req,
      {},
      ConnectorB1,
      'errorTextTest'
    );

    expect(updateData.purchaseOrderID).to.eql('Test1');
    expect(updateData.purchaseOrderObjectID).to.eql('TestObjectID');
    expect(updateData.purchaseOrderSystem).to.eql(ConnectorB1.ERP_SYSTEM);

    sinon.assert.calledOnce(stubPurchaseOrderDataRecord);
    sinon.assert.calledOnce(stubInsertRemotePurchaseOrder);
  });

  it('should add warning to request when no connection to ERP system is found', async () => {
    const errorObject = {};
    const req = {
      warn: (errorID, errorText) => {
        errorObject.ID = errorID;
        errorObject.text = errorText;
      }
    };

    const stubIsConnected = sinon
      .stub(connectorData, 'isConnected')
      .returns(false);

    await entityCalculations.createPurchaseOrder(
      req,
      {},
      ConnectorB1,
      'errorTextTest'
    );

    expect(errorObject.ID).to.eql(httpCodes.internal_server_error);
    expect(errorObject.text).to.eql('errorTextTest');

    sinon.assert.notCalled(stubPurchaseOrderDataRecord);
    sinon.assert.notCalled(stubInsertRemotePurchaseOrder);

    stubIsConnected.restore();
  });

  it('should add error to request when no poetry slam with the ID is found', async () => {
    const errorObject = {};
    const req = {
      params: [{ ID: 'ID not available' }],
      error: (errorID, errorText) => {
        errorObject.ID = errorID;
        errorObject.text = errorText;
      }
    };

    await entityCalculations.createPurchaseOrder(
      req,
      {},
      ConnectorB1,
      'errorTextTest'
    );

    expect(errorObject.ID).to.eql(httpCodes.bad_request);
    expect(errorObject.text).to.eql('ACTION_CREATE_PURCHASE_ORDER_DRAFT');

    sinon.assert.notCalled(stubPurchaseOrderDataRecord);
    sinon.assert.notCalled(stubInsertRemotePurchaseOrder);
  });

  it('should add error to request when purchase order creation failed', async () => {
    const errorObject = {};
    const req = {
      params: [{ ID: 1 }],
      warn: (errorID, errorText) => {
        errorObject.ID = errorID;
        errorObject.text = errorText;
      }
    };
    purchaseOrderReturnData.purchaseOrderID = null;

    await entityCalculations.createPurchaseOrder(
      req,
      {},
      ConnectorB1,
      'errorTextTest'
    );

    expect(errorObject.ID).to.eql(httpCodes.internal_server_error);
    expect(errorObject.text).to.eql('ACTION_CREATE_PURCHASE_ORDER_FAILED');

    sinon.assert.calledOnce(stubPurchaseOrderDataRecord);
    sinon.assert.calledOnce(stubInsertRemotePurchaseOrder);
  });
});

describe('Util Entity Calculations - Calculate PoetrySlam Data', () => {
  let stubLog;
  let stubSELECT;

  beforeEach(async () => {
    // Use Stubs for external services
    stubLog = sinon.stub(console, 'error');
    stubSELECT = sinon.stub(SELECT, 'one').returns(null);
  });

  afterEach(function () {
    // Restore Stubs
    stubLog.restore();
    stubSELECT.restore();
  });

  it('should throw error message because of missing id', async () => {
    const req = {
      target: {
        name: 'mockdrafts'
      }
    };

    await expect(entityCalculations.calculatePoetrySlamData(null, req)).to
      .rejected;

    sinon.assert.calledWith(stubLog, 'Poetry Slam ID not found');
  });

  it('should throw error message because of missing poetryslam', async () => {
    const req = {
      target: {
        name: 'mockdrafts'
      }
    };

    await expect(entityCalculations.calculatePoetrySlamData('mockId', req)).to
      .rejected;

    sinon.assert.calledWith(stubLog, 'Poetry Slam not found');
  });
});

describe('Util Entity Calculations - Convert to Array', () => {
  let stubIsArray;
  let stubLog;

  beforeEach(async () => {
    // Use Stubs for external services
    stubLog = sinon.stub(console, 'error');
    stubIsArray = sinon.stub(Array, 'isArray').returns(false);
  });

  afterEach(function () {
    // Restore Stubs
    stubLog.restore();
    stubIsArray.restore();
  });

  it('should return an empty array because of missing object', async () => {
    const result = entityCalculations.convertToArray(null);

    sinon.assert.calledWith(
      stubLog,
      'Input not defined - Cannot convert to array'
    );
    expect(result).to.be.empty;
    expect(result.length).to.equal(0);
  });

  it('should return an array from a object', async () => {
    const object = {
      mockKey1: 'mockValue1',
      mockKey2: 'mockValue2'
    };
    const result = entityCalculations.convertToArray(object);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(1);
    sinon.assert.called(stubIsArray);
  });
});
