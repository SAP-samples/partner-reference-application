'use strict';

const { httpCodes, poetrySlamStatusCode, visitStatusCode } = require('./codes');

// ----------------------------------------------------------------------------
// Implementation of reuse functions
// ----------------------------------------------------------------------------

const DATE_DAYS_MULTIPLIER = 24 * 60 * 60 * 1000;

// Default the freeVisitorSeats to the maximumVisitorsNumber
async function calculatePoetrySlamData(id, req, additionalVisits = 0) {
  const tableExtension = req.target.name.endsWith('drafts') ? '.drafts' : '';
  const changedData = {};
  if (!id) {
    console.error('Poetry Slam ID not found');
    req.error(httpCodes.internal_server_error, 'POETRYSLAM_NOT_FOUND', [id]);
    return;
  }

  // Target.name of the request includes the originally changed entity. In case it is the draft, check in the draft table.
  const poetrySlam = await SELECT.one
    .from(`PoetrySlamService.PoetrySlams${tableExtension}`)
    .columns('status_code', 'number', 'maxVisitorsNumber', 'freeVisitorSeats')
    .where({ ID: id });

  // If poetry slam was not found, throw an error
  if (!poetrySlam) {
    console.error('Poetry Slam not found');
    req.error(httpCodes.internal_server_error, 'POETRYSLAM_NOT_FOUND', [id]);
    return;
  }

  let visitConfirmedCount = 0;
  // Request contains visits
  if (req.data?.visits?.length) {
    visitConfirmedCount =
      req.data.visits.filter(
        (visit) => visit.status_code === visitStatusCode.booked
      )?.length || 0;
  } else {
    // Request does not contain data in all cases. If it is not included, the data needs to be read from the database
    // Read and calculate the confirmed visits
    let visit = await SELECT.one
      .from(`PoetrySlamService.Visits${tableExtension}`)
      .columns('parent_ID', 'count(*) as visitConfirmedCount')
      .where({ parent_ID: id, status_code: visitStatusCode.booked })
      .groupBy('parent_ID');

    visitConfirmedCount = visit?.visitConfirmedCount ?? 0;
  }
  visitConfirmedCount = visitConfirmedCount + additionalVisits;

  // In case maxVisitorsNumber was changed, use the changed
  const maxVisitorsNumber =
    req.data?.maxVisitorsNumber || poetrySlam.maxVisitorsNumber;

  // Calculate the free seats
  changedData.freeVisitorSeats = Math.max(
    maxVisitorsNumber - visitConfirmedCount,
    0
  );

  // Calculation is required for update case
  // Set the status of reading event to booked, if there are no free seats and status is published
  changedData.status_code = calculatePoetrySlamStatus(
    poetrySlam.status_code,
    changedData.freeVisitorSeats
  );
  return changedData;
}

// Calculate the status in cases of changes
function calculatePoetrySlamStatus(currentStatus, freeVisitorSeats) {
  if (
    currentStatus === poetrySlamStatusCode.published &&
    freeVisitorSeats === 0
  ) {
    return poetrySlamStatusCode.booked;
  } else if (
    currentStatus === poetrySlamStatusCode.booked &&
    freeVisitorSeats > 0
  ) {
    // Check if there are free seats and status was booked, then change the status to published
    return poetrySlamStatusCode.published;
  }
  return currentStatus;
}

// Update poetry slam status and free visitor seats
async function updatePoetrySlam(
  poetrySlamID,
  newStatus,
  newFeeVisitorSeats,
  req,
  errorMessage,
  successMessage
) {
  const updateValues = {
    status_code: newStatus
  };

  if (newFeeVisitorSeats) {
    updateValues.freeVisitorSeats = newFeeVisitorSeats;
  }

  const result = await UPDATE(
    `PoetrySlamService.PoetrySlams${
      req.target.name.endsWith('drafts') ? '.drafts' : ''
    }`
  )
    .set(updateValues)
    .where({ ID: poetrySlamID });

  if (result !== 1) {
    console.error('Update Poetry Slam failed');
    req.error(httpCodes.internal_server_error, errorMessage.text, [
      errorMessage.param
    ]);
    return false;
  }

  if (successMessage) {
    req.info(httpCodes.ok, successMessage.text, [successMessage.param]);
  }
  return true;
}

// Helper function to convert an object to an array
function convertToArray(x) {
  if (!x) {
    console.error('Input not defined - Cannot convert to array');
    return [];
  }
  return Array.isArray(x) ? x : [x];
}

// Timezone offset is used to use function toISOString() without changing the returned date value
function subtractDaysFormatRFC3339(date, days = 0) {
  const generatedDate = new Date(date);
  generatedDate.setTime(generatedDate.getTime() - DATE_DAYS_MULTIPLIER * days); //40 days
  generatedDate.setMinutes(
    generatedDate.getTimezoneOffset() > 0
      ? generatedDate.getMinutes() + generatedDate.getTimezoneOffset()
      : generatedDate.getMinutes() - generatedDate.getTimezoneOffset()
  );
  return generatedDate.toISOString().substring(0, 10) + 'T00:00:00.0000000Z';
}

// Create a project in a ERP system
async function createProject(req, srv, ConnectorClass, errorText) {
  const connector = await ConnectorClass.createConnectorInstance(req);

  if (!connector.isConnected()) {
    console.info(errorText);
    req.warn(httpCodes.internal_server_error, errorText);
    return;
  }

  const poetrySlamID = req.params[req.params.length - 1].ID;
  const poetrySlam = await SELECT.one
    .from('PoetrySlamService.PoetrySlams')
    .where({ ID: poetrySlamID });
  // Allow action for active entity instances only
  if (!poetrySlam) {
    console.error('Poetry Slam not found');
    req.error(httpCodes.bad_request, 'ACTION_CREATE_PROJECT_DRAFT');
    return;
  }

  if (
    poetrySlam.projectSystem &&
    poetrySlam.projectSystem !== ConnectorClass.ERP_SYSTEM
  ) {
    console.info(errorText);
    req.warn(httpCodes.internal_server_error, errorText);
    return;
  }

  const poetrySlamIdentifier = poetrySlam.number;
  const poetrySlamTitle = poetrySlam.title;
  const poetrySlamDate = poetrySlam.dateTime;

  try {
    connector.projectDataRecord(
      poetrySlamIdentifier,
      poetrySlamTitle,
      poetrySlamDate
    );

    // Check and create the project instance
    // If the project already exist, then read and update the local project elements in entity poetrySlams

    let remoteProject = await connector.getRemoteProjectData(srv);

    if (!remoteProject?.projectID) {
      remoteProject = await connector.insertRemoteProjectData();
    }

    if (!remoteProject?.projectID) {
      console.info(
        'Remote Project ID is not available. PoetrySlam could not be updated.'
      );
      req.warn(
        httpCodes.internal_server_error,
        'ACTION_CREATE_PROJECT_FAILED',
        [poetrySlamIdentifier]
      );
      return;
    }

    // Generate remote Project URL and update the URL
    // Update project elements in entity poetrySlams
    await UPDATE.entity('PoetrySlamService.PoetrySlams')
      .set({
        projectID: remoteProject.projectID,
        projectObjectID: remoteProject.projectObjectID,
        projectSystem: ConnectorClass.ERP_SYSTEM
      })
      .where({ ID: poetrySlamID });
  } catch (error) {
    // App reacts error tolerant in case of calling the remote service, mostly if the remote service is not available of if the destination is missing
    console.error(`ACTION_CREATE_PROJECT_FAILED; ${error}`);
    req.warn(httpCodes.internal_server_error, 'ACTION_CREATE_PROJECT_FAILED', [
      poetrySlamIdentifier
    ]);
  }
}

// Create a purchase order in a ERP system
async function createPurchaseOrder(req, srv, ConnectorClass, errorText) {
  const connector = await ConnectorClass.createConnectorInstance(req);

  if (!connector.isConnected()) {
    console.info(errorText);
    req.warn(httpCodes.internal_server_error, errorText);
    return;
  }

  const poetrySlamID = req.params[req.params.length - 1].ID;
  const poetrySlam = await SELECT.one
    .from('PoetrySlamService.PoetrySlams')
    .where({ ID: poetrySlamID });
  // Allow action for active entity instances only
  if (!poetrySlam) {
    console.error('Poetry Slam not found');
    req.error(httpCodes.bad_request, 'ACTION_CREATE_PURCHASE_ORDER_DRAFT');
    return;
  }

  if (
    poetrySlam.purchaseOrderSystem &&
    poetrySlam.purchaseOrderSystem !== ConnectorClass.ERP_SYSTEM
  ) {
    console.info(errorText);
    req.warn(httpCodes.internal_server_error, errorText);
    return;
  }

  // With purchase order the read is not possible. It is always a create. Remove the purchase order first
  if (poetrySlam.purchaseOrderID) {
    console.error('Purchase Order ID given. Read not possible.');
    req.error(httpCodes.internal_server_error, errorText);
    return;
  }

  const poetrySlamIdentifier = poetrySlam.number;
  const poetrySlamDescription = poetrySlam.description;
  const poetrySlamTitle = poetrySlam.title;
  const poetrySlamDate = poetrySlam.dateTime;
  const poetrySlamMaxVisitorsNumber = poetrySlam.maxVisitorsNumber;
  const poetrySlamsVisitorsFeeAmount = poetrySlam.visitorsFeeAmount;

  try {
    connector.purchaseOrderDataRecord(
      poetrySlamIdentifier,
      poetrySlamTitle,
      poetrySlamDescription,
      poetrySlamDate,
      poetrySlamMaxVisitorsNumber,
      poetrySlamsVisitorsFeeAmount
    );

    // Create the purchase Order instance
    const remotePurchaseOrder = await connector.insertRemotePurchaseOrderData();

    if (!remotePurchaseOrder?.purchaseOrderID) {
      console.info(
        'Remote Purchase Order ID is not available. PoetrySlam could not be updated.'
      );
      req.warn(
        httpCodes.internal_server_error,
        'ACTION_CREATE_PURCHASE_ORDER_FAILED',
        [poetrySlamIdentifier]
      );
      return;
    }

    // Update purchase order elements in entity poetrySlams
    await UPDATE.entity('PoetrySlamService.PoetrySlams')
      .set({
        purchaseOrderID: remotePurchaseOrder.purchaseOrderID,
        purchaseOrderObjectID: remotePurchaseOrder.purchaseOrderObjectID,
        purchaseOrderSystem: ConnectorClass.ERP_SYSTEM
      })
      .where({ ID: poetrySlamID });
  } catch (error) {
    // App reacts error tolerant in case of calling the remote service, mostly if the remote service is not available of if the destination is missing
    console.info(`ACTION_CREATE_PURCHASE_ORDER_FAILED; ${error}`);
    req.warn(
      httpCodes.internal_server_error,
      'ACTION_CREATE_PURCHASE_ORDER_FAILED',
      [poetrySlamIdentifier]
    );
  }
}

// Publish constants and functions
module.exports = {
  calculatePoetrySlamData,
  updatePoetrySlam,
  convertToArray,
  subtractDaysFormatRFC3339,
  createProject,
  createPurchaseOrder
};
