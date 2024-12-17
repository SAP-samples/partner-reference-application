// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Adds cds module
const cds = require('@sap/cds');
// Defines required CDS functions for testing
const { expect, test, POST, axios } = cds.test(__dirname + '/../..');

// Authorized user from .cdsrc.json with PoetrySlamManager role
axios.defaults.auth = { username: 'peter', password: 'welcome' };
// ----------------------------------------------------------------------------
// Tests
// ----------------------------------------------------------------------------
describe('PoetrySlamManager Domain Model', () => {
  let db;

  before(async () => {
    // Connect to the database of the current project
    db = await cds.connect.to('db');
    expect(db).to.exist;
  });

  beforeEach(async () => {
    await test.data.reset();
    await POST(`/odata/v4/poetryslamservice/createTestData`);
  });

  it('should load the generated poetry slams test data', async () => {
    const { PoetrySlams } = db.entities;
    expect(PoetrySlams).to.exist;
    const result = await SELECT.from(PoetrySlams).columns(
      'ID',
      'createdBy',
      'number',
      'status_code',
      'title',
      'description',
      'dateTime',
      'maxVisitorsNumber',
      'freeVisitorSeats',
      'visitorsFeeAmount',
      'visitorsFeeCurrency_code'
    );
    expect(result.length).to.greaterThan(0);
  });

  it('should load the generated visits test data', async () => {
    const { Visits } = db.entities;
    expect(Visits).to.exist;
    const result = await SELECT.from(Visits).columns(
      'ID',
      'parent_ID',
      'visitor_ID',
      'artistIndicator',
      'status_code'
    );
    expect(result.length).to.greaterThan(0);
  });

  it('should load the generated visitors test data', async () => {
    const { Visitors } = db.entities;
    expect(Visitors).to.exist;
    const result = await SELECT.from(Visitors).columns('ID', 'name', 'email');
    expect(result.length).to.greaterThan(0);
  });

  it('should ensure the uniqueness of the poetry slam ID ', async () => {
    const { PoetrySlams } = db.model.entities;
    const result = await SELECT.one
      .from(PoetrySlams)
      .columns('ID', 'number', 'title', 'dateTime', 'maxVisitorsNumber');
    // As the ID shall be tested and not the number, change the number to a unique value
    result.number = 'UNITTEST_UNIQUE_ID_9999';
    await expect(db.create(PoetrySlams).entries(result)).to.rejected;
  });

  it('should ensure the uniqueness of the poetryslam number ', async () => {
    const { PoetrySlams } = db.model.entities;
    const result = await SELECT.one
      .from(PoetrySlams)
      .columns('number', 'title', 'dateTime', 'maxVisitorsNumber');
    await expect(db.create(PoetrySlams).entries(result)).to.rejected;
  });

  it('should ensure the uniqueness of the visits ID', async () => {
    const { Visits } = db.model.entities;
    const result = await SELECT.one.from(Visits).columns('ID');

    await expect(db.create(Visits).entries(result)).to.rejected;
  });

  it('should ensure the uniqueness of combination of visitor ID and poetry slam ID', async () => {
    const { Visits } = db.model.entities;
    const result = await SELECT.one
      .from(Visits)
      .columns('parent_ID', 'visitor_ID');

    await expect(db.create(Visits).entries(result)).to.rejected;
  });

  it('should ensure the integrity of the poetry slam ID', async () => {
    const { Visits } = db.model.entities;
    const result = await SELECT.one
      .from(Visits)
      .columns('parent_ID', 'visitor_ID', 'artistIndicator');
    // Set non existing poetry slam ID
    result.parent_ID = '79ceab87-0000-4b66-0000-000000000000';

    await expect(db.create(Visits).entries(result)).to.rejected;
  });

  it('should ensure the integrity of the visitor ID', async () => {
    const { Visits } = db.model.entities;
    const result = await SELECT.one
      .from(Visits)
      .columns('parent_ID', 'visitor_ID', 'artistIndicator');
    // Set non existing visitor ID
    result.visitor_ID = '79ceab87-300d-4b66-0000-000000000000';

    await expect(db.create(Visits).entries(result)).to.rejected;
  });
});
