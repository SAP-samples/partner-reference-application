// ----------------------------------------------------------------------------
// Initialization of test
// ----------------------------------------------------------------------------
'strict';

// The project's root folder
const project = __dirname + '/../../..';
// Adds cds module
const cds = require('@sap/cds');
// Defines Sequence Helper for Poetry Slum Number
const uniqueNumberGenerator = require('./../../../srv/util/uniqueNumberGenerator');
// Defines required CDS functions for testing
const { expect } = cds.test(project);

describe('Util Unique Number Generator', () => {
  // ----------------------------------------------------------------------------
  // Number range UniqueNumberGenerator Tests
  // ----------------------------------------------------------------------------
  it('should throw error message because of unknown database ', async () => {
    let number;
    try {
      number = await uniqueNumberGenerator.getNextNumber(
        'poetrySlamNumber',
        'unknownDB',
        ''
      );
    } catch (error) {
      return expect(number).to.be.eq(undefined);
    }
    return expect.fail('Should have thrown');
  });

  it('should throw error message because of unknown sequence (only hana) ', async () => {
    let number;
    try {
      number = await uniqueNumberGenerator.getNextNumber(
        'unkownSequenceName',
        'hana',
        ''
      );
    } catch (error) {
      return expect(number).to.be.eq(undefined);
    }
    return expect.fail('Should have thrown');
  });

  it('should reject invalid sequence names', async () => {
    let number;
    try {
      number = await uniqueNumberGenerator.getNextNumber(
        'invalid/SequenceName',
        'sqlite',
        ''
      );
    } catch (error) {
      return expect(number).to.be.eq(undefined);
    }
    return expect.fail('Should have thrown');
  });
});
