'use strict';

const { httpCodes, poetrySlamStatusCode, visitStatusCode } = require('./codes');

// ----------------------------------------------------------------------------
// Implementation of reuse functions
// ----------------------------------------------------------------------------

// Default the freeVisitorSeats to the maximumVisitorsNumber
async function calculatePoetrySlamData(id, req, additionalVisits = 0) {
  const tableExtension = req.target.name.endsWith('drafts') ? '.drafts' : '';
  const changedData = {};
  if (!id) {
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
    return [];
  }
  return Array.isArray(x) ? x : [x];
}

// Publish constants and functions
module.exports = {
  calculatePoetrySlamData,
  updatePoetrySlam,
  convertToArray
};
