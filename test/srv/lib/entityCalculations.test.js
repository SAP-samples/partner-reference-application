// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Adds cds module
const cds = require('@sap/cds');
// Offers entity calculations
const entityCalculations = require('../../../srv/lib/entityCalculations');
// Defines required CDS functions for testing
const { expect } = cds.test(__dirname + '/../../..');
const sinon = require('sinon');

describe('Util Entity Calculations - Calculate PoetrySlam Data', () => {
  let stubLog;
  let stubSELECT;

  beforeEach(() => {
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

  beforeEach(() => {
    // Use Stubs for external services
    stubLog = sinon.stub(console, 'error');
    stubIsArray = sinon.stub(Array, 'isArray').returns(false);
  });

  afterEach(function () {
    // Restore Stubs
    stubLog.restore();
    stubIsArray.restore();
  });

  it('should return an empty array because of missing object', () => {
    const result = entityCalculations.convertToArray(null);

    sinon.assert.calledWith(
      stubLog,
      'Input not defined - Cannot convert to array'
    );
    expect(result).to.be.empty;
    expect(result.length).to.equal(0);
  });

  it('should return an array from a object', () => {
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
