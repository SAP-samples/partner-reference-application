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
const jobSchedulerHandler = require('./poetrySlamServiceJobSchedulerImplementation');

module.exports = cds.service.impl(async (srv) => {
  // For better readability, outsource implementation files
  await poetrySlamsHandler(srv); // Forward handler to the Poetry Slam entity
  await visitsHandler(srv); // Forward handler to the Visits entity
  await erpForwardHandler(srv); // Forward handler to the ERP systems
  await outputHandler(srv); // Forward handler for output
  await jobSchedulerHandler(srv); // Forward handler for jobscheduler

  // ----------------------------------------------------------------------------
  // Implementation of oData function
  // ----------------------------------------------------------------------------

  // Function "userInfo": Return logged-in user
  srv.on('userInfo', () => {
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

    // Read the json-files with the test data from the file system
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

    let count = 1;
    poetrySlamsTestData.forEach((poetrySlam) => {
      poetrySlam.dateTime = new Date();
      // Determine days to add to today as event date; in 30 days steps
      const daysToAdd = poetrySlam.dateTime.getDate() + 30 * count;
      poetrySlam.dateTime.setDate(daysToAdd);
      // Determine hours of the event between between 2 and 22 p.m.
      poetrySlam.dateTime.setHours(13 + count, 0, 0);
      poetrySlam.dateTime.setMilliseconds(0);
      count++;
    });

    await db.run(UPSERT(poetrySlamsTestData).into(PoetrySlams));
    await db.run(UPSERT(visitorsTestData).into(Visitors));
    await db.run(UPSERT(visitsTestData).into(Visits));

    return true;
  });
});
