'use strict';

// Include SAP Cloud SDK reuse functions
const { getDestination, retrieveJwt } = require('@sap-cloud-sdk/connectivity');

// Get the ERP URL
async function getDestinationURL(req, destinationName) {
  let destinationURL;
  try {
    // Read the destination details using the SAP Cloud SDK reusable getDestination function:
    // The JWT-token contains the subaccount information, such that the function works for single tenant as well as for multi-tenant apps:
    // - Single tenant: Get destination from the subaccount that hosts the app.
    // - Multi tenant: Get destination from subscriber subaccount.
    const destination = await getDestination({
      destinationName: destinationName,
      jwt: retrieveJwt(req)
    });

    if (destination) {
      console.log('Get ERP destination URL: ' + destination.url);
      destinationURL = destination.url;
    } else {
      // No destination found
      console.log('Get ERP destination URL: ' + destinationName + ' not found');
    }
  } catch (error) {
    // App reacts error tolerant if the destination cannot be retrieved
    console.log('GET_DESTINATION' + '; ' + error);
  }
  return destinationURL;
}

// Check if BTP destination exists
async function checkDestination(req, destinationName) {
  try {
    // Check if the destination exist using the SAP Cloud SDK reusable getDestination function:
    // The JWT-token contains the subaccount information, such that the function works for single tenant as well as for multi-tenant apps:
    // - Single tenant: Get destination from the subaccount that hosts the app.
    // - Multi tenant: Get destination from subscriber subaccount.
    const destination = await getDestination({
      destinationName: destinationName,
      jwt: retrieveJwt(req)
    });

    if (destination) {
      console.log('Check ERP destination: ' + destinationName + ' found');
      return true;
    }
  } catch (error) {
    // App reacts error tolerant if the destination is missing
    console.log('CHECK_DESTINATION' + '; ' + error);
  }
  console.log('Check ERP destination: ' + destinationName + ' not found');
  return false;
}

// Get the ERP Name
async function getDestinationDescription(req, destinationName) {
  let destinationDescription;
  try {
    // Read the destination details using the SAP Cloud SDK reusable getDestinationDescription function:
    // The JWT-token contains the subaccount information, such that the function works for single tenant as well as for multi-tenant apps:
    // - Single tenant: Get destination from the subaccount that hosts the app.
    // - Multi tenant: Get destination from subscriber subaccount.
    const destination = await getDestination({
      destinationName: destinationName,
      jwt: retrieveJwt(req)
    });
    if (destination) {
      for (const originalProperty in destination.originalProperties) {
        if (originalProperty == 'Description') {
          destinationDescription =
            destination.originalProperties[originalProperty];
          break;
        }
      }
    }
  } catch (error) {
    // App reacts error tolerant if the destination is missing
    console.log('GET_DESTINATION_DESCRIPTION' + '; ' + error);
  }
  return destinationDescription;
}

// Publish constants and functions
module.exports = {
  getDestinationURL,
  checkDestination,
  getDestinationDescription
};
