// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Adds cds module
const cds = require('@sap/cds');
// Defines required CDS functions for testing
const { expect, test } = cds.test(__dirname + '/../..');

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
  });

  it('should load with pre-defined poetry slams test data', async () => {
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

  it('should load with pre-defined visits test data', async () => {
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

  it('should load with pre-defined visitors test data', async () => {
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
    // Check that the promise of asynchronous function is rejected. To be thrown does not work in this case
    return expect(db.create(PoetrySlams).entries(result)).to.rejected;
  });

  it('should ensure the uniqueness of the poetryslam number ', async () => {
    const { PoetrySlams } = db.model.entities;
    const result = await SELECT.one
      .from(PoetrySlams)
      .columns('number', 'title', 'dateTime', 'maxVisitorsNumber');
    return expect(db.create(PoetrySlams).entries(result)).to.rejected;
  });

  it('should ensure the uniqueness of the visits ID', async () => {
    const { Visits } = db.model.entities;
    const result = await SELECT.one.from(Visits).columns('ID');

    return expect(db.create(Visits).entries(result)).to.rejected;
  });

  it('should ensure the uniqueness of combination of visitor ID and poetry slam ID', async () => {
    const { Visits } = db.model.entities;
    const result = await SELECT.one
      .from(Visits)
      .columns('parent_ID', 'visitor_ID');

    // Asynchronous calls require a return to be checked correctly
    return expect(db.create(Visits).entries(result)).to.rejected;
  });

  it('should ensure the integrity of the poetry slam ID', async () => {
    const { Visits } = db.model.entities;
    const result = await SELECT.one
      .from(Visits)
      .columns('parent_ID', 'visitor_ID', 'artistIndicator');
    // Set non existing poetry slam ID
    result.parent_ID = '79ceab87-0000-4b66-0000-000000000000';

    // Asynchronous calls require a return to be checked correctly
    return expect(db.create(Visits).entries(result)).to.rejected;
  });

  it('should ensure the integrity of the visitor ID', async () => {
    const { Visits } = db.model.entities;
    const result = await SELECT.one
      .from(Visits)
      .columns('parent_ID', 'visitor_ID', 'artistIndicator');
    // Set non existing visitor ID
    result.visitor_ID = '79ceab87-300d-4b66-0000-000000000000';

    // Asynchronous calls require a return to be checked correctly
    return expect(db.create(Visits).entries(result)).to.rejected;
  });
});
