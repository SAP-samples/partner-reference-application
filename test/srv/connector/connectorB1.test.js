// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';
const cds = require('@sap/cds');

const Connector = require('../../../srv/connector/connector');
const ConnectorB1 = require('../../../srv/connector/connectorB1');
const sinon = require('sinon');
const { expect } = cds.test(__dirname + '/../../..');

describe('ConnectorB1', () => {
  let stubLog,
    stubCreateConnectorData,
    connector,
    stubINSERT,
    stubSELECT,
    stubCDS;

  const connectorData = {
    destination: 'testDestination',
    destinationURL: 'testDestinationURL',
    systemURL: 'testSystemURL',
    systemName: 'testSystemName',
    isConnectedIndicator: true
  };

  beforeEach(() => {
    connector = new ConnectorB1(connectorData);

    stubLog = sinon.stub(console, 'log');
    stubCreateConnectorData = sinon
      .stub(Connector, 'createConnectorData')
      .resolves(connectorData);

    stubINSERT = sinon.stub(INSERT, 'into').returns({
      entries: () => {
        return {
          docEntry: 'UUID',
          docNum: 'generatedID'
        };
      }
    });

    stubSELECT = sinon.stub(SELECT, 'from').returns({
      where: (whereClause) => {
        return [
          {
            docNum: whereClause.DocNum,
            comments: 'commentsTest'
          }
        ];
      }
    });

    stubCDS = sinon.stub(cds.connect, 'to').resolves({
      run: (data) => {
        return data;
      }
    });
  });

  afterEach(() => {
    stubLog.restore();
    stubCreateConnectorData.restore();
    stubINSERT.restore();
    stubCDS.restore();
    stubSELECT.restore();
  });

  it('should create an instance with data given in parameter', async () => {
    expect(connector.destination).to.eql('testDestination');
    expect(connector.destinationURL).to.eql('testDestinationURL');
    expect(connector.systemURL).to.eql('testSystemURL');
    expect(connector.systemName).to.eql('testSystemName');
    expect(connector.getSystemName()).to.eql('testSystemName');
    expect(connector.isConnectedIndicator).to.eql(true);
    expect(connector.isConnected()).to.eql(true);
  });

  it('should create a project record with SAP Business One specific data', async () => {
    const testPurchaseOrderRecord = {
      DocType: ConnectorB1.DOC_TYPE,
      DocDueDate: '2024-01-23T00:00:00.0000000Z',
      CardCode: ConnectorB1.CARD_CODE,
      Comments: `Poet's Buffet for Poetry Slam 1 - testTitle\ntestDescription`,
      DocumentLines: [
        {
          LineNum: 0,
          ItemDescription:
            'Appetizers: Crab Spring Rolls, Kimchi Potstickers, Pakoras',
          AccountCode: ConnectorB1.ACCOUNT_CODE,
          LineTotal: 0.05
        },
        {
          LineNum: 1,
          ItemDescription:
            'First Course: Bouillabaisse, Clam Chowder, Gazpacho',
          AccountCode: ConnectorB1.ACCOUNT_CODE,
          LineTotal: 0.05
        },
        {
          LineNum: 2,
          ItemDescription:
            'Main Course: Spaghetti Carbonara, Chicken Tikka Masala, Cheeseburger and Fries',
          AccountCode: ConnectorB1.ACCOUNT_CODE,
          LineTotal: 0.05
        },
        {
          LineNum: 3,
          ItemDescription: 'Dessert: Black Forest gateau, Falooda, Apple Pie',
          AccountCode: ConnectorB1.ACCOUNT_CODE,
          LineTotal: 0.05
        },
        {
          LineNum: 4,
          ItemDescription: 'All you can eat: Mousse au Chocolat',
          AccountCode: ConnectorB1.ACCOUNT_CODE,
          LineTotal: 0.05
        }
      ]
    };

    await connector.purchaseOrderDataRecord(
      1,
      'testTitle',
      'testDescription',
      '2024-01-23T00:00:00.0000000Z',
      1,
      2
    );

    expect(connector.purchaseOrderRecord).to.eql(testPurchaseOrderRecord);
  });

  it('should determine the destination URL to navigate to the project in SAP Business One', async () => {
    connector.systemURL = 'testSystemURL';

    const url = connector.determineDestinationURL('ID1');
    expect(url).to.eql(
      'testSystemURL/webx/index.html#webclient-OPOR&/Objects/OPOR/Detail?view=OPOR.detailView&id=OPOR%252CID1'
    );
  });

  it('should read remote purchase order data of the poetry slam entitiy', async () => {
    const poetrySlams = {
      purchaseOrderSystem: ConnectorB1.PURCHASE_ORDER_SYSTEM,
      purchaseOrderID: 1
    };

    const expectedResult = {
      purchaseOrderID: 1,
      purchaseOrderSystem: ConnectorB1.PURCHASE_ORDER_SYSTEM,
      toB1PurchaseOrder: {
        comments: 'commentsTest',
        docNum: [1]
      }
    };

    const objectData = await connector.readPurchaseOrder(poetrySlams);
    expect(objectData).to.eql(expectedResult);
  });

  it('should return poetry slam data when reading remote purchase order data of a poetry slam entitiy without project ID', async () => {
    const poetrySlams = {
      purchaseOrderSystem: ConnectorB1.PURCHASE_ORDER_SYSTEM,
      ID: 1
    };

    const objectData = await connector.readPurchaseOrder(poetrySlams);
    expect(objectData).to.eql(poetrySlams);
  });

  it('should insert remote purchase order data to database of poetry slam entitiy', async () => {
    const srv = {
      run: async function (data) {
        return data;
      },
      entities: {
        B1Projects: 'test'
      }
    };

    const objectData = await connector.insertRemotePurchaseOrderData(srv);
    expect(objectData.purchaseOrderID).to.eql('generatedID');
    expect(objectData.purchaseOrderObjectID).to.eql('UUID');
  });

  it('should create an instance of connector', async () => {
    const connectorLocal = await ConnectorB1.createConnectorInstance();

    sinon.assert.calledOnce(stubCreateConnectorData);

    sinon.assert.calledWith(
      stubLog,
      `SAP Business One connector created - connected: true`
    );

    expect(connectorLocal.destination).to.eql('testDestination');
    expect(connectorLocal.destinationURL).to.eql('testDestinationURL');
    expect(connectorLocal.systemURL).to.eql('testSystemURL');
    expect(connectorLocal.systemName).to.eql('testSystemName');
    expect(connectorLocal.getSystemName()).to.eql('testSystemName');
    expect(connectorLocal.isConnectedIndicator).to.eql(true);
    expect(connectorLocal.isConnected()).to.eql(true);
  });
});
