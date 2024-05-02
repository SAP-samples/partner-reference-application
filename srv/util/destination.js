'use strict';

// Include SAP Cloud SDK reuse functions
const { getDestination, retrieveJwt } = require('@sap-cloud-sdk/connectivity');

async function readDestination(req, destinationName) {
  try {
    // Check if the destination exist using the SAP Cloud SDK reusable getDestination function:
    // The JWT-token contains the subaccount information, such that the function works for single tenant as well as for multi-tenant apps:
    // - Single tenant: Get destination from the subaccount that hosts the app.
    // - Multi tenant: Get destination from subscriber subaccount.
    return await getDestination({
      destinationName: destinationName,
      jwt: retrieveJwt(req)
    });
  } catch (error) {
    // App reacts error tolerant if the destination cannot be retrieved
    console.log(`GET_DESTINATION; ${error}`);
  }
  return null;
}

// Get the ERP URL
function getDestinationURL(destination) {
  if (!destination) {
    console.log('Get ERP destination URL: destination not found');
    return; // No destination found
  }
  console.log(`Get ERP destination URL: ${destination.url}`);
  return destination.url;
}

// Get the ERP Name
async function getDestinationDescription(destination) {
  if (!destination) {
    console.log('Get ERP destination URL Description: destination not found');
    return; // No destination found
  }
  return destination.originalProperties?.Description;
}

// Publish constants and functions
module.exports = {
  readDestination,
  getDestinationURL,
  getDestinationDescription
};
