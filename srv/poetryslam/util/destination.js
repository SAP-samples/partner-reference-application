'use strict';

// Include SAP Cloud SDK reuse functions
const { getDestination, retrieveJwt } = require('@sap-cloud-sdk/connectivity');

async function readDestination(req, destinationName) {
  try {
    // Check if the destination exists using the SAP Cloud SDK reusable getDestination function
    // The incoming JWT-token contains the subaccount information to retrieve the destination for the correct tenant
    const jwt = retrieveJwt(req) || retrieveJwt(cds.context.http?.req);
    return await getDestination({
      destinationName: destinationName,
      jwt: jwt
    });
  } catch (error) {
    // App reacts error tolerant if the destination cannot be retrieved
    console.error(`GET_DESTINATION; ${error}`);
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
