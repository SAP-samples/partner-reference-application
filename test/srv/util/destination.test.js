// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';
const cds = require('@sap/cds');

const destination = require('../../../srv/util/destination');
const sinon = require('sinon');
const { expect } = cds.test(__dirname + '/../../..');

describe('Destination', () => {
  let stubLog;

  beforeEach(() => {
    stubLog = sinon.stub(console, 'log');
  });

  afterEach(() => {
    stubLog.restore();
  });

  it('should return the URL of the destination object', async () => {
    await destination.readDestination(null, 'testDestination');

    sinon.assert.calledWith(
      stubLog,
      "GET_DESTINATION; TypeError: Cannot read properties of null (reading 'headers')"
    );
  });

  it('should return the URL of the destination object when calling getDestinationURL', async () => {
    const result = await destination.getDestinationURL({ url: 'testURL' });
    expect(result).to.eql('testURL');
  });

  it('should write into console log if no destination is set when calling getDestinationURL', async () => {
    await destination.getDestinationURL();
    sinon.assert.calledWith(
      stubLog,
      'Get ERP destination URL: destination not found'
    );
  });

  it('should return the description of the destination object when calling getDestinationDescription', async () => {
    const result = await destination.getDestinationDescription({
      originalProperties: {
        Description: 'testDescription'
      }
    });
    expect(result).to.eql('testDescription');
  });

  it('should write into console log if no destination is set when calling getDestinationDescription', async () => {
    await destination.getDestinationDescription();
    sinon.assert.calledWith(
      stubLog,
      'Get ERP destination URL Description: destination not found'
    );
  });
});
