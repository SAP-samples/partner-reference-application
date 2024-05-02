// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';
const cds = require('@sap/cds');

const Connector = require('../../../srv/connector/connector');
const ConnectorS4HC = require('../../../srv/connector/connectorS4HC');
const sinon = require('sinon');
const { expect } = cds.test(__dirname + '/../../..');

describe('ConnectorS4HC', () => {
  let stubLog,
    stubCreateConnectorData,
    connector,
    stubINSERT,
    stubSELECTOne,
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
    connector = new ConnectorS4HC(connectorData);

    stubLog = sinon.stub(console, 'log');
    stubCreateConnectorData = sinon
      .stub(Connector, 'createConnectorData')
      .resolves(connectorData);

    stubINSERT = sinon.stub(INSERT, 'into').returns({
      entries: (projectRecord) => {
        return {
          project: projectRecord.project,
          projectUUID: projectRecord.projectUUID
        };
      }
    });

    stubSELECTOne = sinon.stub(SELECT.one, 'from').returns({
      where: (projectRecord) => {
        return {
          project: projectRecord.project,
          projectUUID: 3
        };
      }
    });

    stubSELECT = sinon.stub(SELECT, 'from').returns({
      where: (whereClause) => {
        return [
          {
            project: whereClause.project,
            projectProfileCode: 'profileCodeTest',
            projectProfileCodeText: 'profileCodeTextTest',
            processingStatus: 'processingStatusTest',
            processingStatusText: 'processingStatusTextTest'
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
    stubSELECTOne.restore();
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

    await connector.projectDataRecord(1, 'testTitle', new Date('03/03/2024'));

    expect(connector.projectRecord).to.eql(testProjectRecord);
  });

  it('should determine the destination URL to navigate to the project in SAP S/4HANA Cloud', async () => {
    connector.projectRecord = { Project: 'testProject' };
    connector.systemURL = 'testSystemURL';

    const url = connector.determineDestinationURL();
    expect(url).to.eql(
      'testSystemURL/ui#EnterpriseProject-planProject?EnterpriseProject=testProject'
    );
  });

  it('should read remote project data of the poetry slam entitiy', async () => {
    const poetrySlams = {
      projectSystem: ConnectorS4HC.PROJECT_SYSTEM,
      projectID: 1
    };

    const expectedResult = {
      processingStatusText: 'processingStatusTextTest',
      projectID: 1,
      projectProfileCodeText: 'profileCodeTextTest',
      projectSystem: ConnectorS4HC.PROJECT_SYSTEM,
      toS4HCProject: {
        processingStatus: 'processingStatusTest',
        processingStatusText: 'processingStatusTextTest',
        projectProfileCode: 'profileCodeTest',
        projectProfileCodeText: 'profileCodeTextTest',
        project: [1]
      }
    };

    const objectData = await connector.readProject(poetrySlams);
    expect(objectData).to.eql(expectedResult);
  });

  it('should return poetry slam data when reading remote project data of a poetry slam entitiy without project ID', async () => {
    const poetrySlams = {
      ID: 'testID',
      projectSystem: ConnectorS4HC.PROJECT_SYSTEM
    };

    const objectData = await connector.readProject(poetrySlams);
    expect(objectData).to.eql(poetrySlams);
  });

  it('should get remote project data from database of poetry slam entitiy', async () => {
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

  it('should insert remote project data to database of poetry slam entitiy', async () => {
    const srv = {
      run: async function (data) {
        return data;
      },
      entities: {
        S4HCProjects: 'test'
      }
    };

    connector.projectRecord = { project: 1, projectUUID: 2 };

    const objectData = await connector.insertRemoteProjectData(srv);
    expect(objectData.projectID).to.eql(1);
    expect(objectData.projectObjectID).to.eql(2);
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
