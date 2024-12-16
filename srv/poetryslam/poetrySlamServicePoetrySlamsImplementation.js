'strict';

// Include utility files
const { color, poetrySlamStatusCode, httpCodes } = require('./util/codes');
const {
  calculatePoetrySlamData,
  updatePoetrySlam,
  convertToArray
} = require('./util/entityCalculations');

const uniqueNumberGenerator = require('./util/uniqueNumberGenerator');

module.exports = async (srv) => {
  const db = await cds.connect.to('db');

  // ----------------------------------------------------------------------------
  // Implementation of entity events (entity PoetrySlams)
  // ----------------------------------------------------------------------------

  // Initialize status of drafts
  // Default the freeVisitorSeats to the maximumVisitorsNumber
  // Default number of poetry slam (human readable identifier)
  srv.before('CREATE', 'PoetrySlams.drafts', async (req) =>
    initializePoetrySlam(req)
  );

  // Initialize status
  // Default the freeVisitorSeats to the maximumVisitorsNumber
  // Default number of poetry slam (human readable identifier)
  srv.before('CREATE', 'PoetrySlams', async (req) => {
    initializePoetrySlam(req);

    // Generate readable ID for poetry slam document
    try {
      req.data.number =
        'PS-' +
        (await uniqueNumberGenerator.getNextNumber(
          'poetrySlamNumber',
          db.kind,
          req.data.ID
        ));
    } catch (error) {
      req.error(httpCodes.internal_server_error, 'NO_POETRYSLAM_NUMBER', [
        error.message
      ]);
    }
  });

  // Set the event status to booked based on confirmed seats
  srv.on('UPDATE', ['PoetrySlams.drafts', 'PoetrySlams'], async (req, next) => {
    const { ID } = req.data;
    const result = await calculatePoetrySlamData(ID, req);
    if (result) {
      req.data.freeVisitorSeats = result.freeVisitorSeats;
      req.data.status_code = result.status_code;
    }
    return next();
  });

  srv.before('DELETE', 'PoetrySlams', async (req) => {
    // In req.subject, the poetry slam that is to be deleted is already included as condition
    const poetrySlam = await SELECT.one
      .from(req.subject)
      .columns('status_code', 'number');

    if (
      poetrySlam.status_code !== poetrySlamStatusCode.inPreparation &&
      poetrySlam.status_code !== poetrySlamStatusCode.canceled
    ) {
      req.error(httpCodes.bad_request, 'POETRYSLAM_COULD_NOT_BE_DELETED', [
        poetrySlam.number
      ]);
    }
  });

  // Apply a colour code based on the poetry slam status
  srv.after('READ', ['PoetrySlams.drafts', 'PoetrySlams'], (data) => {
    for (const poetrySlam of convertToArray(data)) {
      const status = poetrySlam.status?.code || poetrySlam.status_code;
      // Set status colour code
      switch (status) {
        case poetrySlamStatusCode.inPreparation:
          poetrySlam.statusCriticality = color.grey; // New poetry slams are grey
          break;
        case poetrySlamStatusCode.published:
          poetrySlam.statusCriticality = color.green; // Published poetry slams are green
          break;
        case poetrySlamStatusCode.booked:
          poetrySlam.statusCriticality = color.yellow; // Fully booked poetry slams are yellow
          break;
        case poetrySlamStatusCode.canceled:
          poetrySlam.statusCriticality = color.red; // Canceled poetry slams are red
          break;
        default:
          poetrySlam.statusCriticality = null;
      }
    }
  });

  // ----------------------------------------------------------------------------
  // Implementation of entity actions (entity PoetrySlams)
  // ----------------------------------------------------------------------------

  // Entity action "cancel": Set the status of poetry slam to canceled
  // Note: Our entity action "cancel" is different from the core service "CANCEL"
  // Actions are not mass enabled in service, only on UI; they are handled in a batch mode;
  srv.on('cancel', async (req) => {
    const id = req.params[req.params.length - 1].ID; // Depending on the UI, the request can contain several IDs, e.g. /PoetrySlams(ID1)/Visits(ID2) would contain two IDs, /Visits(ID1) will contain only one. However, the last ID is always the ID of the Visit
    const poetrySlam = await SELECT.one
      .from('PoetrySlamService.PoetrySlams')
      .columns('ID', 'status_code', 'number')
      .where({ ID: id });

    // If poetry slam was not found, throw an error
    if (!poetrySlam) {
      req.error(httpCodes.bad_request, 'POETRYSLAM_NOT_FOUND', [id]);
      return;
    }

    if (poetrySlam.status_code === poetrySlamStatusCode.inPreparation) {
      // Poetry slams that are in preperation shall be deleted
      req.info(httpCodes.ok, 'ACTION_CANCEL_IN_PREPARATION', [
        poetrySlam.number
      ]);
      return poetrySlam;
    }

    poetrySlam.status_code = poetrySlamStatusCode.canceled;

    const success = await updatePoetrySlam(
      id,
      poetrySlam.status_code,
      null,
      req,
      { text: 'ACTION_CANCEL_NOT_POSSIBLE', param: poetrySlam.number },
      { text: 'ACTION_CANCEL_SUCCESS', param: poetrySlam.number }
    );

    return success ? poetrySlam : {}; // Return the changed poetry slam
  });

  // Entity action "publish": Set the status of poetry slam to published
  // Actions are not mass enabled in service, only on UI; they are handled in a batch mode;
  srv.on('publish', async (req) => {
    const id = req.params[req.params.length - 1].ID;
    // Allow action for active entity instances only (draft events cannot be published)
    const poetrySlam = await SELECT.one
      .from('PoetrySlamService.PoetrySlams')
      .columns('ID', 'status_code', 'number')
      .where({ ID: id });

    // If poetry slam was not found, throw an error
    if (!poetrySlam) {
      req.error(httpCodes.bad_request, 'POETRYSLAM_NOT_FOUND', [id]);
      return;
    }

    if (
      poetrySlam.status_code === poetrySlamStatusCode.booked ||
      poetrySlam.status_code === poetrySlamStatusCode.published
    ) {
      req.info(httpCodes.ok, 'ACTION_PUBLISHED_ALREADY', [poetrySlam.number]);
      return poetrySlam;
    }

    // For canceled poetry slams that are re-published a recalculation of free visitor seats is required
    const data = await calculatePoetrySlamData(id, req);
    poetrySlam.status_code =
      data.freeVisitorSeats > 0
        ? poetrySlamStatusCode.published
        : poetrySlamStatusCode.booked;

    // Update status
    const success = await updatePoetrySlam(
      id,
      poetrySlam.status_code,
      null,
      req,
      { text: 'ACTION_PUBLISH_NOT_POSSIBLE', param: poetrySlam.number },
      { text: 'ACTION_PUBLISH_SUCCESS', param: poetrySlam.number }
    );

    return success ? poetrySlam : {}; // Return the changed poetry slam
  });

  // ----------------------------------------------------------------------------
  // Implementation of reuse functions
  // ----------------------------------------------------------------------------

  // Initialize max visitor number, free visitor seats and booked seats
  function initializePoetrySlam(req) {
    req.data.freeVisitorSeats = req.data.maxVisitorsNumber =
      req.data.maxVisitorsNumber ?? 0;
    req.data.bookedSeats = 0;
  }
};
