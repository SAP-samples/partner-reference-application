'strict';

// Include cds libraries and utility files
const cds = require('@sap/cds');

const erpForwardHandler = require('./poetrySlamServiceERPImplementation');
// Access file system
const fs = require('fs');
const path = require('path');

const poetrySlamsHandler = require('./poetrySlamServicePoetrySlamsImplementation');
const outputHandler = require('./poetrySlamServiceOutputImplementation');
const visitsHandler = require('./poetrySlamServiceVisitsImplementation');

module.exports = cds.service.impl(async (srv) => {
  // For better readability, outsource implementation files
  poetrySlamsHandler(srv); // Forward handler to the Poetry Slam entity
  visitsHandler(srv); // Forward handler to the Visits entity
  erpForwardHandler(srv); // Forward handler to the ERP systems
  outputHandler(srv); // Forward handler for output

  // ----------------------------------------------------------------------------
  // Implementation of oData function
  // ----------------------------------------------------------------------------

  // Function "userInfo": Return logged-in user
  srv.on('userInfo', async () => {
    let { user, locale } = cds.context;
    let results = {};
    results.id = user.id;
    results.locale = locale;
    results.roles = {};
    results.roles.identified = user.is('identified-user');
    results.roles.authenticated = user.is('authenticated-user');
    return results;
  });

  // Action "createTestData": Create test data (poetry slams, visitors, visits)
  // Only for demo purpose
  srv.on('createTestData', async () => {
    const db = await cds.connect.to('db');
    const { PoetrySlams, Visits, Visitors } = cds.entities;

    // Read logo image to be used in the form from the file system
    const poetrySlamsJson = fs.readFileSync(
      path.join(__dirname, './sample_data/poetrySlams.json')
    );

    const visitorsJson = fs.readFileSync(
      path.join(__dirname, './sample_data/visitors.json')
    );

    const visitsJson = fs.readFileSync(
      path.join(__dirname, './sample_data/visits.json')
    );

    const poetrySlamsTestData = JSON.parse(poetrySlamsJson)?.poetrySlams;
    const visitorsTestData = JSON.parse(visitorsJson)?.visitors;
    const visitsTestData = JSON.parse(visitsJson)?.visits;

    if (!poetrySlamsTestData || !visitorsTestData || !visitsTestData) {
      return false;
    }

    await db.run(UPSERT(poetrySlamsTestData).into(PoetrySlams));
    await db.run(UPSERT(visitorsTestData).into(Visitors));
    await db.run(UPSERT(visitsTestData).into(Visits));

    return true;
  });
});
