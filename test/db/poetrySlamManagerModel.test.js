// ----------------------------------------------------------------------------
// Initialization of test
// ----------------------------------------------------------------------------
'strict';

// The project's root folder
const project = __dirname + '/../..';
// Adds cds module
const cds = require('@sap/cds');
// Defines required CDS functions for testing
const { expect, axios, test } = cds.test(project);

// Authentication for tests
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

  beforeEach(test.data.reset);

  it('should load with pre-defined poetryslams test data', async () => {
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

  it('should ensure the uniqueness of the poetryslam ID ', async () => {
    const { PoetrySlams } = db.model.entities;
    const result = await SELECT.from(PoetrySlams)
      .columns('ID', 'number', 'title', 'dateTime', 'maxVisitorsNumber')
      .limit(1);
    result[0].number = 10;
    // Check that the promise of asynchronous function is rejected. To be thrown does not work in this case
    return expect(db.create(PoetrySlams).entries(result[0])).to.be.rejected;
  });

  it('should ensure the uniqueness of the poetryslam number ', async () => {
    const { PoetrySlams } = db.model.entities;
    const result = await SELECT.from(PoetrySlams)
      .columns('number', 'title', 'dateTime', 'maxVisitorsNumber')
      .limit(1);
    return expect(db.create(PoetrySlams).entries(result[0])).to.be.rejected;
  });

  it('should ensure the uniqueness of the visits ID', async () => {
    const { Visits } = db.model.entities;
    const result = await SELECT.from(Visits)
      .columns('ID', 'parent_ID', 'visitor_ID', 'artistIndicator')
      .limit(1);
    // Change the visitor ID that is integer and not already there in combination with poetry slam ID
    result[0].visitor_ID = '79ceab87-300d-4b66-8cc3-482c679b7c04';

    return expect(db.create(Visits).entries(result[0])).to.be.rejected;
  });

  it('should ensure the integrity of the poetry slam ID', async () => {
    const { Visits } = db.model.entities;
    const result = await SELECT.from(Visits)
      .columns('parent_ID', 'visitor_ID', 'artistIndicator')
      .limit(1);
    // Set non existing poetry slam ID
    result[0].parent_ID = '79ceab87-0000-4b66-0000-000000000000';

    // Asynchronous calls require a return to be checked correclty
    return expect(db.create(Visits).entries(result[0])).to.be.rejected;
  });

  it('should ensure the integrity of the visitor ID', async () => {
    const { Visits } = db.model.entities;
    const result = await SELECT.from(Visits)
      .columns('parent_ID', 'visitor_ID', 'artistIndicator')
      .limit(1);
    // Set non existing visitor ID
    result[0].visitor_ID = '79ceab87-300d-4b66-0000-000000000000';

    // Asynchronous calls require a return to be checked correclty
    return expect(db.create(Visits).entries(result[0])).to.be.rejected;
  });

  it('should ensure the uniquness of combination of visitor ID and poetry slam ID', async () => {
    const { Visits } = db.model.entities;
    const result = await SELECT.from(Visits)
      .columns('parent_ID', 'visitor_ID', 'artistIndicator')
      .limit(1);

    // Asynchronous calls require a return to be checked correclty
    return expect(db.create(Visits).entries(result[0])).to.be.rejected;
  });
});
