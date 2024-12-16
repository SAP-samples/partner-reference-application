// ----------------------------------------------------------------------------
// Initialization of test
// CAP Unit Testing: https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run
// ----------------------------------------------------------------------------
'strict';

// Adds cds module
const cds = require('@sap/cds');
// Defines required CDS functions for testing
const { expect, GET, POST, axios, test } = cds.test(__dirname + '/../../..');

// ----------------------------------------------------------------------------
// Tests authorizations for authorized user without role assignment for application
// Authorizations of visitorservice with User Peter are tested in visitorservice.test.js
// ----------------------------------------------------------------------------

describe('Authorizations of VisitorService with User Denise (authenticated user only)', () => {
  beforeEach(async () => {
    // Authentication for tests
    axios.defaults.auth = { username: 'peter', password: 'welcome' };

    await test.data.reset();
    await POST(`/odata/v4/poetryslamservice/createTestData`);

    // Authentication for tests
    axios.defaults.auth = { username: 'julie', password: 'welcome' };
  });

  it('should reject the reading of the poetry slams', async () => {
    // Read all poetry slams; shall be rejected

    const test = GET(`/odata/v4/visitorservice/PoetrySlams`, {
      params: { $select: `ID,status_code,statusCriticality` }
    });

    return expect(test).to.rejectedWith('403');
  });

  it('should reject the creation of a poetry slam', async () => {
    const poetrySlamToBeCreated = {
      title: 'Poetry Slam 12',
      description: 'Description Poetry Slam 12'
    };

    // Create a new poetry slam; shall be rejected
    return expect(
      POST(`/odata/v4/visitorservice/PoetrySlams`, poetrySlamToBeCreated)
    ).to.rejectedWith('403');
  });

  it('should reject the reading of visitors', async () => {
    // Read all poetry slams; shall be rejected
    return expect(
      GET(`/odata/v4/visitorservice/Visitors`, {
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
    return expect(
      POST(`/odata/v4/visitorservice/Visitors`, entryToBeCreated)
    ).to.rejectedWith('403');
  });

  it('should reject the reading of visits', async () => {
    // Read all poetry slams; shall be rejected
    return expect(
      GET(`/odata/v4/visitorservice/Visits`, {
        params: { $select: `ID,artists` }
      })
    ).to.rejectedWith('403');
  });

  it('should reject the creation of a visits', async () => {
    const entryToBeCreated = {
      parent_ID: '79ceab87-300d-4b66-8cc3-f82c679b77a8',
      visitor_ID: '79ceab87-300d-4b66-8cc3-c82c679b7c12'
    };

    // Create a new poetry slam; shall be rejected
    return expect(POST(`/odata/v4/visitorservice/Visits`, entryToBeCreated)).to
      .rejected;
  });
});

// ----------------------------------------------------------------------------
// Tests authorizations for authorized user with role assignment PoetrySlamVisitor
// ----------------------------------------------------------------------------

describe('Authorizations of VisitorService with User Julie (role PoetrySlamVisitor)', () => {
  beforeEach(async () => {
    // Authentication for tests
    axios.defaults.auth = { username: 'peter', password: 'welcome' };

    await test.data.reset();
    await POST(`/odata/v4/poetryslamservice/createTestData`);

    // Authentication for tests
    axios.defaults.auth = { username: 'julie', password: 'welcome' };
  });

  it('should return data of poetry slams', async () => {
    return expect(
      GET(`/odata/v4/visitorservice/PoetrySlams`, {
        params: { $select: `ID` }
      })
    ).to.rejectedWith('403');
  });

  it('should reject the creation of a poetry slam', async () => {
    const poetrySlamToBeCreated = {
      title: 'Poetry Slam 12',
      dateTime: new Date()
    };

    // Create a new poetry slam; shall be rejected
    return expect(
      POST(`/odata/v4/visitorservice/PoetrySlams`, poetrySlamToBeCreated)
    ).to.rejectedWith('403');
  });

  it('should allow the reading of visitors', async () => {
    return expect(
      GET(`/odata/v4/visitorservice/Visitors`, {
        params: { $select: `ID,name` }
      })
    ).to.rejectedWith('403');
  });

  it('should reject the creation of a visitor', async () => {
    const entryToBeCreated = {
      name: 'Julie',
      email: 'julie@pra.ondemand.com'
    };

    return expect(
      POST(`/odata/v4/visitorservice/Visitors`, entryToBeCreated)
    ).to.rejectedWith('403');
  });

  it('should allow reading of visits', async () => {
    return expect(
      GET(`/odata/v4/visitorservice/Visits`, {
        params: { $select: `ID,artistIndicator` }
      })
    ).to.rejectedWith('403');
  });

  it('should reject the creation of a visit', async () => {
    const entryToBeCreated = {
      parent_ID: '79ceab87-300d-4b66-8cc3-f82c679b77a8',
      visitor_ID: '79ceab87-300d-4b66-8cc3-c82c679b7c12'
    };

    return expect(
      POST(`/odata/v4/visitorservice/Visits`, entryToBeCreated)
    ).to.rejectedWith('403');
  });
});
