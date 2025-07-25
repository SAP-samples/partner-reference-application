// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';
const cds = require('@sap/cds');

const Connector = require('../../../../srv/poetryslam/connector/connector');
const ConnectorS4HC = require('../../../../srv/poetryslam/connector/connectorS4HC');
const sinon = require('sinon');
const { expect } = cds.test(__dirname + '/../../../..');

describe('ConnectorS4HC - General', () => {
  let stubLog, stubCreateConnectorData, connector;

  const connectorData = {
    destination: 'testDestination',
    destinationURL: 'testDestinationURL',
    systemURL: 'testSystemURL',
    systemName: 'testSystemName',
    isConnectedIndicator: true
  };

  beforeEach(() => {
    connector = new ConnectorS4HC(connectorData);

    stubLog = sinon.stub(console, 'log');

    stubCreateConnectorData = sinon
      .stub(Connector, 'createConnectorData')
      .resolves(connectorData);
  });

  afterEach(() => {
    stubLog.restore();
    stubCreateConnectorData.restore();
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

  it('should create an instance of connector', async () => {
    const connectorLocal = await ConnectorS4HC.createConnectorInstance();

    sinon.assert.calledOnce(stubCreateConnectorData);

    sinon.assert.calledWith(
      stubLog,
      `SAP S/4HANA Cloud connector created - connected: true`
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

describe('ConnectorS4HC - Project Handling', () => {
  let stubErrorLog, connector, stubINSERT, stubSELECTOne, stubSELECT, stubCDS;

  const connectorData = {
    destination: 'testDestination',
    destinationURL: 'testDestinationURL',
    systemURL: 'testSystemURL',
    systemName: 'testSystemName',
    isConnectedIndicator: true
  };

  beforeEach(() => {
    connector = new ConnectorS4HC(connectorData);

    stubErrorLog = sinon.stub(console, 'error');

    stubINSERT = sinon.stub(INSERT, 'into').returns({
      entries: (projectRecord) => {
        return {
          Project: projectRecord.project,
          ProjectUUID: projectRecord.projectUUID
        };
      }
    });

    stubSELECTOne = sinon.stub(SELECT.one, 'from').returns({
      where: (whereClause) => {
        if (whereClause.project) {
          return {
            project: whereClause.project,
            projectUUID: 3
          };
        }
        if (whereClause.ProjectProfileCode) {
          return {
            ProjectProfileCode: whereClause.ProjectProfileCode,
            ProjectProfileCodeText: 'profileCodeTextTest'
          };
        }
        if (whereClause.ProcessingStatus) {
          return {
            ProcessingStatus: whereClause.ProcessingStatus,
            ProcessingStatusText: 'processingStatusTextTest'
          };
        }
      }
    });

    stubSELECT = sinon.stub(SELECT, 'from').returns({
      where: (whereClause) => {
        return [
          {
            project: whereClause.project[0],
            projectProfileCode: 'profileCodeTest',
            processingStatus: 'processingStatusTest'
          }
        ];
      }
    });

    stubCDS = sinon.stub(cds.connect, 'to').resolves({
      run: (data) => {
        return data;
      },
      entities: {
        A_EnterpriseProject: 'test',
        ProjectProfileCode: 'test',
        ProcessingStatus: 'test'
      }
    });
  });

  afterEach(() => {
    stubErrorLog.restore();
    stubINSERT.restore();
    stubSELECTOne.restore();
    stubCDS.restore();
    stubSELECT.restore();
  });

  it('should create a project record with SAP S/4HANA Cloud specific data', async () => {
    const testProjectRecord = {
      EntProjectIsConfidential: false,
      ProfitCenter: ConnectorS4HC.PROFIT_CENTER,
      Project: 'POETRYSLAM_1',
      ProjectCurrency: ConnectorS4HC.PROJECT_CURRENCY,
      ProjectDescription: 'testTitle',
      ProjectEndDate: '2024-03-03T00:00:00.0000000Z',
      ProjectProfileCode: ConnectorS4HC.PROJECT_PROFILE_CODE,
      ProjectStartDate: '2024-02-02T00:00:00.0000000Z',
      ResponsibleCostCenter: '10101101',
      to_EnterpriseProjectElement: [
        {
          PlannedEndDate: '2024-02-28T00:00:00.0000000Z',
          PlannedStartDate: '2024-02-02T00:00:00.0000000Z',
          ProjectElement: 'POETRYSLAM_1-PLAN',
          ProjectElementDescription: 'Event planning and preparations'
        },
        {
          PlannedEndDate: '2024-03-03T00:00:00.0000000Z',
          PlannedStartDate: '2024-03-02T00:00:00.0000000Z',
          ProjectElement: 'POETRYSLAM_1-EXE',
          ProjectElementDescription: 'Event administration and execution'
        }
      ]
    };

    connector.projectDataRecord(1, 'testTitle', new Date('03/03/2024'));

    expect(connector.projectRecord).to.eql(testProjectRecord);
  });

  it('should determine the destination URL to navigate to the project in SAP S/4HANA Cloud', async () => {
    connector.systemURL = 'testSystemURL';

    const url = connector.determineDestinationURL('testProject');
    expect(url).to.eql(
      'testSystemURL/ui#EnterpriseProject-planProject?EnterpriseProject=testProject'
    );
  });

  it('should return an empty string when determing the destination URL and the systemURL is empty', async () => {
    connector.systemURL = '';

    const url = connector.determineDestinationURL('testProject');
    expect(url).to.eql('');
  });

  it('should read remote project data of the poetry slam entity', async () => {
    const poetrySlams = {
      projectSystem: ConnectorS4HC.ERP_SYSTEM,
      projectID: 1
    };

    const expectedResult = {
      projectID: 1,
      projectSystem: ConnectorS4HC.ERP_SYSTEM,
      projectProfileCodeText: 'profileCodeTextTest',
      processingStatusText: 'processingStatusTextTest',
      toS4HCProject: {
        project: 1,
        projectProfileCode: 'profileCodeTest',
        processingStatus: 'processingStatusTest'
      }
    };

    const objectData = await connector.readProject(poetrySlams);
    expect(objectData).to.eql(expectedResult);
  });

  it('should throw an error when remote project data cannot be read', async () => {
    stubCDS.restore();

    stubCDS = sinon.stub(cds.connect, 'to').resolves({
      run: () => {
        throw new Error('test');
      }
    });

    const poetrySlams = {
      projectSystem: ConnectorS4HC.ERP_SYSTEM,
      projectID: 999
    };

    await connector.readProject(poetrySlams);

    sinon.assert.calledWith(
      stubErrorLog,
      `ACTION_READ_PROJECT_CONNECTION - Project; Error: test`
    );
  });

  it('should throw an error when remote code texts cannot be read', async () => {
    stubCDS.restore();

    stubCDS = sinon.stub(cds.connect, 'to').resolves({
      run: (data) => {
        if (data && data[0] && data[0].project === 1) {
          return data;
        }
        throw new Error('test');
      },
      entities: {
        A_EnterpriseProject: 'test',
        ProjectProfileCode: 'test',
        ProcessingStatus: 'test'
      }
    });

    const poetrySlams = {
      projectSystem: ConnectorS4HC.ERP_SYSTEM,
      projectID: 1
    };

    await connector.readProject(poetrySlams);

    sinon.assert.calledWith(
      stubErrorLog,
      `ACTION_READ_PROJECT_CONNECTION - Project Profile Code; Error: test`
    );

    sinon.assert.calledWith(
      stubErrorLog,
      `ACTION_READ_PROJECT_CONNECTION  - Project Processing Status Code; Error: test`
    );
  });

  it('should return poetry slam data when reading remote project data of a poetry slam entity without project ID', async () => {
    const poetrySlams = {
      ID: 'testID',
      projectSystem: ConnectorS4HC.ERP_SYSTEM
    };

    const objectData = await connector.readProject(poetrySlams);
    expect(objectData).to.eql(poetrySlams);
  });

  it('should get remote project data from database of poetry slam entity', async () => {
    const srv = {
      run: async (data) => {
        return data;
      },
      entities: {
        S4HCProjects: 'test'
      }
    };

    connector.projectRecord = { Project: 1 };

    const objectData = await connector.getRemoteProjectData(srv);
    expect(objectData.projectID).to.eql(1);
    expect(objectData.projectObjectID).to.eql(3);
  });

  it('should insert remote project data to database of poetry slam entity', async () => {
    connector.projectRecord = { project: 1, projectUUID: 2 };

    const objectData = await connector.insertRemoteProjectData();
    expect(objectData.projectID).to.eql(1);
    expect(objectData.projectObjectID).to.eql(2);
  });
});

describe('ConnectorS4HC - Sales Order Handling', () => {
  let connector, stubSELECT, stubSELECTOne, stubCDS;

  const connectorData = {
    destination: 'testDestination',
    destinationURL: 'testDestinationURL',
    systemURL: 'testSystemURL',
    systemName: 'testSystemName',
    isConnectedIndicator: true
  };

  beforeEach(() => {
    connector = new ConnectorS4HC(connectorData);

    stubSELECT = sinon.stub(SELECT, 'from').returns({
      where: (whereClause) => {
        return [
          {
            salesOrderUUID: whereClause.salesOrderUUID[0],
            customer: '1'
          }
        ];
      }
    });

    stubSELECTOne = sinon.stub(SELECT.one, 'from').returns({
      where: (whereClause) => {
        if (whereClause.Customer) {
          return {
            Customer: whereClause.Customer,
            BusinessPartnerFullName: 'CustomerFullName'
          };
        }
      }
    });

    stubCDS = sinon.stub(cds.connect, 'to').resolves({
      run: (data) => {
        return data;
      },
      entities: {
        A_BusinessPartner: 'testBusinessPartner'
      }
    });
  });

  afterEach(() => {
    stubCDS.restore();
    stubSELECT.restore();
    stubSELECTOne.restore();
  });

  it('should read remote sales order data of the poetry slam entity', async () => {
    const poetrySlams = {
      salesOrderID: 'salesOrderID'
    };

    const expectedResult = {
      salesOrderID: 'salesOrderID',
      customerFullName: 'CustomerFullName',
      toS4HCSalesOrderPartner: {
        salesOrderUUID: 'salesOrderID',
        customer: '1'
      }
    };

    const objectData = await connector.readSalesOrder(poetrySlams);
    expect(objectData).to.eql(expectedResult);
  });

  it('should determine the destination URL to navigate to the sales order in SAP S/4HANA Cloud', async () => {
    connector.systemURL = 'testSystemURL';

    const url = connector.determineSalesOrderURL('testSalesOrder');
    expect(url).to.eql(
      "testSystemURL/ui#SalesOrder-manageV2&/SalesOrderManage('testSalesOrder')"
    );
  });

  it('should return an empty string when determing the destination URL and the systemURL is empty', async () => {
    connector.systemURL = '';

    const url = connector.determineSalesOrderURL('testSalesOrder');
    expect(url).to.eql('');
  });
});
