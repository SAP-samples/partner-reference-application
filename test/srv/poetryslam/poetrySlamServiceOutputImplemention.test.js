// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';
// Adds cds module
const cds = require('@sap/cds');
// Defines required CDS functions for testing
const { expect, GET, axios, test, POST } = cds.test(__dirname + '/../../..');
const { visitStatusCode } = require('../../../srv/poetryslam/util/codes');

// Executes an action, like 'sendEmail'
const ACTION = (url, name, parameters = {}) =>
  POST(url + `/PoetrySlamService.${name}`, parameters);

// ----------------------------------------------------------------------------
// Tests with user with role assignment PoetrySlamManager
// ----------------------------------------------------------------------------
axios.defaults.auth = { username: 'peter', password: 'welcome' };

const poetrySlamId = '79ceab87-300d-4b66-8cc3-f82c679b77a2';
describe('PoetrySlamService - Output', () => {
  describe('SAP Forms Service by Adobe', () => {
    before(async () => {
      await test.data.reset();
      await GET(`/odata/v4/poetryslamservice/createTestData`);
    });

    it('should throw an error when rendering a PDF document of a poetry slam due to missing SAP Forms Service by Adobe credentials for service connection', async () => {
      await expect(
        GET(
          `/odata/v4/poetryslamservice/PDFDocument(ID=${poetrySlamId})/content`
        )
      ).to.rejectedWith(400);
    });
  });

  describe('SAP email', () => {
    before(async () => {
      await test.data.reset();
      await GET(`/odata/v4/poetryslamservice/createTestData`);
    });

    it('should reject sending an email for test data', async () => {
      // Read all visits with status booked
      const visits = await GET(
        `/odata/v4/poetryslamservice/Visits?$filter=status_code eq ${visitStatusCode.booked}`
      );
      expect(visits.data.value.length).to.greaterThan(0);
      const visit = visits.data.value[0];

      return expect(
        ACTION(
          `/odata/v4/poetryslamservice/PoetrySlams(ID=${visit.parent_ID},IsActiveEntity=true)/visits(ID=${visit.ID},IsActiveEntity=true)`,
          'sendEMail'
        )
      ).to.rejectedWith(400);
    });
  });

  describe('Print Service', () => {
    before(async () => {
      await test.data.reset();
      await GET(`/odata/v4/poetryslamservice/createTestData`);
    });

    it('printGuestList should fail in test environment', async () => {
      return expect(
        ACTION(
          `/odata/v4/poetryslamservice/PoetrySlams(ID=${poetrySlamId},IsActiveEntity=true)`,
          'printGuestList',
          { printQueue: 'dummyPrintQueue' }
        )
      ).to.rejectedWith(400);
    });

    it('GET PrintQueues should return nothing in test environment', async () => {
      const queueResp = await GET(`/odata/v4/poetryslamservice/PrintQueues`);
      expect(queueResp?.data?.value).eql([]);
    });
  });
});
