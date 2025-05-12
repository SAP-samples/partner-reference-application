// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Adds cds module
const cds = require('@sap/cds');

// Defines required CDS functions for testing
const { expect } = cds.test(__dirname + '/../../..');

// Import Logo Reuse Class
const Logo = require('../../../srv/lib/logo');

describe('Util Logo - Reuse', () => {
  it('should read a file and encode Base64', function () {
    const encodedDefault = Logo.encodeFileBase64();
    expect(encodedDefault).to.not.null;

    const encodedLogo = Logo.encodeFileBase64(
      '../poetryslam/sample_data/poetrySlamLogo.jpg'
    );
    expect(encodedLogo).to.equal(encodedDefault);
  });
});
