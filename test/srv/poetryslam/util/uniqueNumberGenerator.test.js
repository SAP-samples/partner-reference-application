// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Adds cds module
const cds = require('@sap/cds');
// Defines Sequence Helper for Poetry Slum Number
const uniqueNumberGenerator = require('./../../../../srv/poetryslam/util/uniqueNumberGenerator');
// Defines required CDS functions for testing
const { expect } = cds.test(__dirname + '/../../../..');

describe('Util Unique Number Generator', () => {
  // ----------------------------------------------------------------------------
  // Number Range UniqueNumberGenerator Tests
  // ----------------------------------------------------------------------------
  it('should throw error message because of unknown database ', async () => {
    return expect(
      uniqueNumberGenerator.getNextNumber('poetrySlamNumber', 'unknownDB', '')
    ).to.rejected;
  });

  it('should throw error message because of unknown sequence (only hana) ', async () => {
    return expect(
      uniqueNumberGenerator.getNextNumber('unkownSequenceName', 'hana', '')
    ).to.rejected;
  });

  it('should reject sequences with invalid characters in the name to avoid SQL injection', async () => {
    return expect(
      uniqueNumberGenerator.getNextNumber('invalid/SequenceName', 'sqlite', '')
    ).to.rejected;
  });
});
