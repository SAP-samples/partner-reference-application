'strict';

// Include cds libraries and utility files
const cds = require('@sap/cds');

// Access file system
const fs = require('fs');
const path = require('path');

const poetrySlamsHandler = require('./poetrySlamServicePoetrySlamsImplementation');
const visitsHandler = require('./poetrySlamServiceVisitsImplementation');

module.exports = class extends cds.ApplicationService {
  async init() {
    // For better readability, outsource implementation files
    await poetrySlamsHandler(this); // Forward handler to the Poetry Slam entity
    await visitsHandler(this); // Forward handler to the Visits entity
    // ----------------------------------------------------------------------------
    // Implementation of OData function
    // ----------------------------------------------------------------------------

    // Function "userInfo": Return logged-in user
    this.on('userInfo', () => {
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
    this.on('createTestData', async () => {
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
        console.warn('Test data is not defined');
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

    // Register the current class for the CDS runtime as the implementation for the service.
    // Only allowed in the main class and not in the subclasses of the services.
    return super.init();
  }
};
