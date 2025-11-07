// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';
// Adds cds module
const cds = require('@sap/cds');
// Defines required CDS functions for testing
const { expect, GET, axios, test, POST } = cds.test(__dirname + '/../../..');
const { visitStatusCode, httpCodes } = require('../../../srv/lib/codes');

// Executes an action, like 'sendNotification'
const ACTION = (url, name, parameters = {}) =>
  POST(url + `/PoetrySlamService.${name}`, parameters);

// ----------------------------------------------------------------------------
// Tests with user with role assignment PoetrySlamManager
// ----------------------------------------------------------------------------
axios.defaults.auth = { username: 'peter', password: 'welcome' };

describe('PoetrySlamService - Notification', () => {
  describe('SAP email address', () => {
    before(async () => {
      await test.data.reset();
      await POST(`/odata/v4/poetryslamservice/createTestData`);
    });

    it('should reject sending a notification for test data', async () => {
      // Read all visits with status booked
      const visits = await GET(
        `/odata/v4/poetryslamservice/Visits?$filter=status_code eq ${visitStatusCode.booked}`
      );
      expect(visits.data.value.length).to.greaterThan(0);
      const visit = visits.data.value[0];
      await expect(
        ACTION(
          `/odata/v4/poetryslamservice/PoetrySlams(ID=${visit.parent_ID},IsActiveEntity=true)/visits(ID=${visit.ID},IsActiveEntity=true)`,
          'sendNotification'
        )
      ).to.rejectedWith(httpCodes.bad_request.toString());
    });
  });
});
