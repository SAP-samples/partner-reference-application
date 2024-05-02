'strict';

// Include cds libraries and utility files
const cds = require('@sap/cds');

const erpForwardHandler = require('./poetrySlamManagerServiceERPImplementation');
const poetrySlamsHandler = require('./poetrySlamManagerServicePoetrySlamsImplementation');
const visitsHandler = require('./poetrySlamManagerServiceVisitsImplementation');

module.exports = cds.service.impl(async (srv) => {
  // For better readability, outsource implementation files
  poetrySlamsHandler(srv); // Forward handler to the Poetry Slam entity
  visitsHandler(srv); // Forward handler to the Visits entity
  erpForwardHandler(srv); // Forward handler to the ERP systems

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
});
