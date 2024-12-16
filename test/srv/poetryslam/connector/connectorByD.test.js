// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';
const cds = require('@sap/cds');

const Connector = require('../../../../srv/poetryslam/connector/connector');
const ConnectorByD = require('../../../../srv/poetryslam/connector/connectorByD');
const sinon = require('sinon');
const { expect } = cds.test(__dirname + '/../../../..');

describe('ConnectorByD', () => {
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
    connector = new ConnectorByD(connectorData);

    stubLog = sinon.stub(console, 'log');

    stubCreateConnectorData = sinon
      .stub(Connector, 'createConnectorData')
      .resolves(connectorData);

    stubINSERT = sinon.stub(INSERT, 'into').returns({
      entries: (projectRecord) => {
        return {
          ProjectID: projectRecord.ProjectID,
          ObjectID: 'UUID'
        };
      }
    });

    stubSELECTOne = sinon.stub(SELECT.one, 'from').returns({
      where: (projectRecord) => {
        return {
          projectID: projectRecord.projectID,
          ID: 3
        };
      }
    });

    stubSELECT = sinon.stub(SELECT, 'from').returns({
      where: (whereClause) => {
        return [
          {
            projectID: whereClause.ProjectID[0],
            costCenter: 'costCenterTest'
          }
        ];
      }
    });

    stubCDS = sinon.stub(cds.connect, 'to').resolves({
      run: (data) => {
        return data;
      },
      entities: { ProjectCollection: 'test' }
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

  it('should create a project record with SAP Business ByDesign specific data', async () => {
    const testProjectRecord = {
      ProjectID: 'POETRYSLAM_1',
      EstimatedCompletionPercent: 10,
      PlannedEndDateTime: new Date('03/03/2024'),
      PlannedStartDateTime: '2024-01-23T00:00:00.0000000Z',
      ProjectLanguageCode: ConnectorByD.PROJECT_LANGUAGE_CODE,
      ProjectTypeCode: ConnectorByD.PROJECT_TYPE_CODE,
      ResponsibleCostCentreID: ConnectorByD.RESPONSIBLE_COST_CENTER,
      ProjectSummaryTask: {
        ProjectName: 'testTitle',
        ResponsibleEmployeeID: ConnectorByD.RESPONSIBLE_EMPLOYEE_ID
      },
      Task: [
        {
          PlannedDuration: 'P30D',
          TaskID: 'POETRYSLAM_1-PREP',
          TaskName: 'Event planning and preparations',
          TaskRelationship: [
            {
              DependencyTypeCode: '2',
              LagDuration: 'P2D',
              SuccessorTaskID: 'POETRYSLAM_1-EXE'
            }
          ]
        },
        {
          ConstraintEndDateTime: '2024-02-28T00:00:00.0000000Z',
          PlannedDuration: 'P5D',
          ScheduleActivityEndDateTimeConstraintTypeCode: '2',
          TaskID: 'POETRYSLAM_1-EXE',
          TaskName: 'Event administration and execution'
        }
      ]
    };

    connector.projectDataRecord(1, 'testTitle', new Date('03/03/2024'));

    expect(connector.projectRecord).to.eql(testProjectRecord);
  });

  it('should determine the destination URL to navigate to the project in SAP Business ByDesign', async () => {
    connector.projectRecord = { ProjectID: 'testProject' };
    connector.systemURL = 'testSystemURL';

    const url = connector.determineDestinationURL();
    expect(url).to.eql(
      'testSystemURL/sap/ap/ui/runtime?bo_ns=http://sap.com/xi/AP/ProjectManagement/Global&bo=Project&node=Root&operation=OpenByProjectID&object_key=testProject&key_type=APC_S_PROJECT_ID'
    );
  });

  it('should read remote project data of the poetry slam entitiy', async () => {
    const poetrySlams = {
      projectSystem: ConnectorByD.PROJECT_SYSTEM,
      projectID: 1
    };

    const expectedResult = {
      projectID: 1,
      projectSystem: ConnectorByD.PROJECT_SYSTEM,
      toByDProject: {
        costCenter: 'costCenterTest',
        projectID: 1
      }
    };

    const objectData = await connector.readProject(poetrySlams);
    expect(objectData).to.eql(expectedResult);
  });

  it('should return poetry slam data when reading remote project data of a poetry slam entitiy without project ID', async () => {
    const poetrySlams = {
      ID: 'testID',
      projectSystem: ConnectorByD.PROJECT_SYSTEM
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
        ByDProjects: 'test'
      }
    };

    connector.projectRecord = { ProjectID: 1 };

    const objectData = await connector.getRemoteProjectData(srv);
    expect(objectData.projectID).to.eql(1);
    expect(objectData.projectObjectID).to.eql(3);
  });

  it('should insert remote project data to database of poetry slam entitiy', async () => {
    connector.projectRecord = { ProjectID: 1 };
    const objectData = await connector.insertRemoteProjectData();
    expect(objectData.projectID).to.eql(1);
    expect(objectData.projectObjectID).to.eql('UUID');
  });

  it('should create an instance of connector', async () => {
    const connectorLocal = await ConnectorByD.createConnectorInstance();

    sinon.assert.calledOnce(stubCreateConnectorData);

    sinon.assert.calledWith(
      stubLog,
      `SAP Business ByDesign connector created - connected: true`
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
