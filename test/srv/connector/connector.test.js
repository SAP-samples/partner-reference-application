// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';
const cds = require('@sap/cds');

const Connector = require('../../../srv/connector/connector');
const sinon = require('sinon');
const destination = require('../../../srv/util/destination');
const { expect } = cds.test(__dirname + '/../../..');

describe('Connector', () => {
  let stubLog,
    stubReadDestination,
    stubGetDestinationUrl,
    stubGetDestinationDescription;

  beforeEach(() => {
    stubLog = sinon.stub(console, 'log');
    stubReadDestination = sinon.stub(destination, 'readDestination');
    stubReadDestination
      .withArgs(null, 'testDestinationName')
      .resolves('readDestinationTest');
    stubReadDestination
      .withArgs(null, 'testDestinationURLName')
      .resolves('readDestinationURLTest');
    stubReadDestination.withArgs(null, null).resolves();

    stubGetDestinationUrl = sinon
      .stub(destination, 'getDestinationURL')
      .resolves('testURL');
    stubGetDestinationDescription = sinon
      .stub(destination, 'getDestinationDescription')
      .resolves('testDescription');
  });

  afterEach(() => {
    stubLog.restore();
    stubReadDestination.restore();
    stubGetDestinationUrl.restore();
    stubGetDestinationDescription.restore();
  });

  it('should create an instance with data given in parameter', async () => {
    const connector = new Connector({
      destination: 'testDestination',
      destinationURL: 'testDestinationURL',
      systemURL: 'testSystemURL',
      systemName: 'testSystemName',
      isConnectedIndicator: true
    });

    expect(connector.destination).to.eql('testDestination');
    expect(connector.destinationURL).to.eql('testDestinationURL');
    expect(connector.systemURL).to.eql('testSystemURL');
    expect(connector.systemName).to.eql('testSystemName');
    expect(connector.getSystemName()).to.eql('testSystemName');
    expect(connector.isConnectedIndicator).to.eql(true);
    expect(connector.isConnected()).to.eql(true);
  });

  it('should create connector data with destinations', async () => {
    const connectorData = await Connector.createConnectorData(
      null,
      'testDestinationName',
      'testDestinationURLName'
    );

    expect(connectorData.destination).to.eql('readDestinationTest');
    expect(connectorData.destinationURL).to.eql('readDestinationURLTest');
    expect(connectorData.systemURL).to.eql('testURL');
    expect(connectorData.systemName).to.eql('testDescription');
    expect(connectorData.isConnectedIndicator).to.eql(true);

    sinon.assert.calledTwice(stubReadDestination);
    sinon.assert.calledTwice(stubLog);

    sinon.assert.calledWith(
      stubLog,
      `Check ERP destination: testDestinationURLName found`
    );

    sinon.assert.calledWith(
      stubLog,
      `Check ERP destination: testDestinationName found`
    );
  });

  it('should write error logs when no destination is configured when calling createConnectorData', async () => {
    const connectorData = await Connector.createConnectorData(
      null,
      'not found'
    );

    expect(connectorData.destination).to.eql();
    expect(connectorData.isConnectedIndicator).to.eql(false);

    sinon.assert.calledOnce(stubReadDestination);

    sinon.assert.calledWith(
      stubLog,
      `Check ERP destination: not found not found`
    );
  });

  it('should write error logs when no URL destination is configured when calling createConnectorData', async () => {
    const connectorData = await Connector.createConnectorData(
      null,
      'testDestinationName',
      'not found'
    );

    expect(connectorData.destination).to.eql('readDestinationTest');
    expect(connectorData.destinationURL).to.eql();
    expect(connectorData.isConnectedIndicator).to.eql(true);

    sinon.assert.calledTwice(stubReadDestination);
    sinon.assert.calledTwice(stubLog);

    sinon.assert.calledWith(
      stubLog,
      `Check ERP destination: testDestinationName found`
    );

    sinon.assert.calledWith(
      stubLog,
      `Check ERP destination: not found not found`
    );
  });
});
