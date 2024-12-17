// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Adds cds module
const cds = require('@sap/cds');
const { httpCodes } = require('../../../srv/poetryslam/util/codes');
// Defines required CDS functions for testing
const { expect, GET, POST, axios, test } = cds.test(__dirname + '/../../..');

const { httpCodes } = require('../../../srv/poetryslam/util/codes');

// ----------------------------------------------------------------------------
// Tests authorizations for authorized user without role assignment for application
// Authorizations of PoetrySlamService with User Peter are tested in poetrySlamService.test.js
// ----------------------------------------------------------------------------

describe('Authorizations of PoetrySlamService with User Denise (authenticated user only)', () => {
  beforeEach(async () => {
    // Authorized user from .cdsrc.json with PoetrySlamManager role
    axios.defaults.auth = { username: 'peter', password: 'welcome' };

    await test.data.reset();
    await POST(`/odata/v4/poetryslamservice/createTestData`);

    // Authentication for tests
    axios.defaults.auth = { username: 'denise', password: 'welcome' };
  });

  it('should reject the reading of the poetry slams', async () => {
    await expect(
      GET(`/odata/v4/poetryslamservice/PoetrySlams`, {
        params: { $select: `ID,status_code,statusCriticality` }
      })
    ).to.rejectedWith('403');
  });

  it('should reject the creation of a poetry slam', async () => {
    const poetrySlamToBeCreated = {
      title: 'Poetry Slam 12',
      description: 'Description Poetry Slam 12',
      dateTime: new Date(),
      maxVisitorsNumber: 20,
      visitorsFeeAmount: 9.95,
      visitorsFeeCurrency_code: 'EUR'
    };

    // Create a new poetry slam; shall be rejected
    await expect(
      POST(`/odata/v4/poetryslamservice/PoetrySlams`, poetrySlamToBeCreated)
    ).to.rejectedWith('403');
  });

  it('should reject the reading of visitors', async () => {
    // Read all poetry slams; shall be rejected
    await expect(
      GET(`/odata/v4/poetryslamservice/Visitors`, {
        params: { $select: `ID,name` }
      })
    ).to.rejectedWith('403');
  });

  it('should reject the creation of a visitor', async () => {
    const entryToBeCreated = {
      name: 'Max Mustermann',
      email: 'max@mustermann.de'
    };

    // Create a new poetry slam; shall be rejected
    await expect(
      POST(`/odata/v4/poetryslamservice/Visitors`, entryToBeCreated)
    ).to.rejectedWith('403');
  });

  it('should reject the reading of visits', async () => {
    // Read all poetry slams; shall be rejected
    await expect(
      GET(`/odata/v4/poetryslamservice/Visits`, {
        params: { $select: `ID,artists` }
      })
    ).to.rejectedWith('403');
  });

  it('should reject the creation of a visits', async () => {
    const entryToBeCreated = {
      parent_ID: '79ceab87-300d-4b66-8cc3-f82c679b77a8',
      visitor_ID: '79ceab87-300d-4b66-8cc3-c82c679b7c12'
    };

    // Create a new poetry slam; shall be rejected as read-only
    await expect(
      POST(`/odata/v4/poetryslamservice/Visits`, entryToBeCreated)
    ).to.rejectedWith('403');
  });
});

// ----------------------------------------------------------------------------
// Tests authorizations for authorized user with role assignment PoetrySlamVisitor
// ----------------------------------------------------------------------------

describe('Authorizations of PoetrySlamService with User Julie (role PoetrySlamVisitor)', () => {
  beforeEach(async () => {
    // Authorized user from .cdsrc.json with PoetrySlamManager role
    axios.defaults.auth = { username: 'peter', password: 'welcome' };

    await test.data.reset();
    await POST(`/odata/v4/poetryslamservice/createTestData`);

    // Authentication for tests
    axios.defaults.auth = { username: 'julie', password: 'welcome' };
  });

  it('should return data of poetry slams in status booked and published', async () => {
    const poetrySlams = await GET(`/odata/v4/poetryslamservice/PoetrySlams`, {
      params: { $select: `ID,status_code` }
    });

    expect(poetrySlams.status).to.eql(httpCodes.ok);
    // Read all poetry slams; shall be possible
    expect(poetrySlams.data.value.length).to.greaterThan(0);

    expect(
      poetrySlams.data.value.filter(
        (poetrySlam) => poetrySlam.status_code === 1
      ).length
    ).to.eql(0);
    expect(
      poetrySlams.data.value.filter(
        (poetrySlam) => poetrySlam.status_code === 4
      ).length
    ).to.eql(0);
  });

  it('should reject the creation of a poetry slam', async () => {
    const poetrySlamToBeCreated = {
      number: '12',
      title: 'Poetry Slam 12',
      description: 'Description Poetry Slam 12',
      dateTime: new Date(),
      maxVisitorsNumber: 20,
      visitorsFeeAmount: 9.95,
      visitorsFeeCurrency_code: 'EUR'
    };

    // Create a new poetry slam; shall be rejected
    await expect(
      POST(`/odata/v4/poetryslamservice/PoetrySlams`, poetrySlamToBeCreated)
    ).to.rejectedWith('403');
  });

  it('should allow the reading of visitors', async () => {
    const visitors = await GET(`/odata/v4/poetryslamservice/Visitors`, {
      params: { $select: `ID,name` }
    });

    expect(visitors.status).to.eql(httpCodes.ok);
    // Read all visitors; allowed but none were created by Julie
    expect(visitors.data.value.length).to.eql(0);
  });

  it('should reject the creation of a visitor', async () => {
    const entryToBeCreated = {
      name: 'Julie',
      email: 'julie@pra.ondemand.com'
    };

    await expect(
      POST(`/odata/v4/poetryslamservice/Visitors`, entryToBeCreated)
    ).to.rejectedWith('405');
  });

  it('should allow reading of visits', async () => {
    const visits = await GET(`/odata/v4/poetryslamservice/Visits`, {
      params: { $select: `ID,artistIndicator` }
    });

    // Read all visits; Julie is allowed to read all visits of artists
    expect(
      visits.data.value.find(
        (poetrySlam) => poetrySlam.artistIndicator === false
      )
    ).to.undefined;

    expect(
      visits.data.value.filter(
        (poetrySlam) => poetrySlam.artistIndicator === true
      ).length
    ).to.greaterThan(0);
  });

  it('should reject the creation of a visit', async () => {
    const entryToBeCreated = {
      parent_ID: '79ceab87-300d-4b66-8cc3-f82c679b77a8',
      visitor_ID: '79ceab87-300d-4b66-8cc3-c82c679b7c12'
    };

    await expect(
      POST(`/odata/v4/poetryslamservice/Visits`, entryToBeCreated)
    ).to.rejectedWith('403');
  });
});
