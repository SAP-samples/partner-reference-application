'strict';

// Include utility files
const codes = require('./util/codes');
const {
  calculatePoetrySlamData,
  updatePoetrySlam,
  convertToArray
} = require('./util/entityCalculations');

module.exports = async (srv) => {
  // ----------------------------------------------------------------------------
  // Implementation of entity events (entity Visits)
  // ----------------------------------------------------------------------------

  // Check if visit is allowed to be created
  srv.before('CREATE', ['Visits.drafts', 'Visits'], async (req) => {
    // Check that a visit is allowed to be created due to status of the poetry slam
    // Errors are thrown inside the method
    await checkPoetrySlamForVisitCreation(req.data.parent_ID, req);
  });

  // Initialize status of visit and update poetry slam
  srv.on('UPDATE', ['Visits.drafts', 'Visits'], async (req, next) => {
    // In case visitor is updated, default status of visit
    if (req.data.visitor_ID) {
      req.data.status_code = codes.visitStatusCode.booked;
    }

    return next();
  });

  srv.after('UPDATE', ['Visits.drafts', 'Visits'], async (_results, req) => {
    if (!req.data.visitor_ID) {
      return;
    }

    const visit = await SELECT.one.from(req.subject).columns('ID', 'parent_ID');

    if (!visit) {
      // Error message: update not possible
      req.error(500, 'UPDATE_VISIT_NOT_POSSIBLE', [req.data.ID]);
      return;
    }

    // Update the free visitor seats and the status of the poetry slam
    const changedData = await calculatePoetrySlamData(visit.parent_ID, req);
    await updatePoetrySlam(
      visit.parent_ID,
      changedData.status_code,
      changedData.freeVisitorSeats,
      req,
      { text: 'UPDATE_VISIT_NOT_POSSIBLE', param: req.data.ID }
    );
  });

  // Updates the poetry slam status and freevistor seats in case of deletion of a visit
  srv.before('DELETE', ['Visits.drafts', 'Visits'], async (req) => {
    if (!req.data.ID) {
      req.error(500, 'VISIT_NOT_FOUND', [req.data.ID]);
      return;
    }

    const currentVisit = await SELECT.one
      .from(req.subject)
      .columns('ID', 'parent_ID', 'visitor_ID', 'status_code');

    if (!currentVisit) {
      req.error(500, 'VISIT_NOT_FOUND', [req.data.ID]);
      return;
    }

    // Update the free visitor seats and the status of the poetry slam
    const changedData = await calculatePoetrySlamData(
      currentVisit.parent_ID,
      req,
      currentVisit.status_code === codes.visitStatusCode.booked ? -1 : null
    );

    await updatePoetrySlam(
      currentVisit.parent_ID,
      changedData.status_code,
      changedData.freeVisitorSeats,
      req,
      {
        text: 'DELETION_VISIT_NOT_POSSIBLE',
        param: await readVisitorName(currentVisit.visitor_ID)
      }
    );
  });

  // Apply a colour code based on the visit status
  srv.after('READ', ['Visits.drafts', 'Visits'], (data) => {
    for (const visits of convertToArray(data)) {
      const status = visits.status?.code || visits.status_code;
      // Set status colour code
      switch (status) {
        case codes.visitStatusCode.booked:
          visits.statusCriticality = codes.color.green; // Booked visits are green
          break;
        case codes.visitStatusCode.canceled:
          visits.statusCriticality = codes.color.red; // Canceled visits are yellow
          break;
        default:
          // In case the status is defined, but not filled, return statusCriticality with null, otherwise UI will break
          if (status === null) {
            visits.statusCriticality = null;
          }
      }
    }
  });

  // ----------------------------------------------------------------------------
  // Implementation of entity actions (entity Visits)
  // ----------------------------------------------------------------------------

  // Entity action "cancelVisit": Set the status of the visit to canceled
  // Actions are not mass enabled in service, only on UI; they are handled in a batch mode;
  srv.on('cancelVisit', async (req) => {
    // In case, the visit is called via composition of poetry slam, there are two entries, the last is the association where the action was executed
    const visit = await SELECT.one
      .from(req.subject)
      .columns('ID', 'status_code', 'parent_ID', 'visitor_ID');

    if (!visit) {
      const id = req.params[req.params.length - 1]?.ID;
      req.error(400, 'VISIT_NOT_FOUND', [id]);
      return;
    }

    // Determine the visitorname for the success and error messages
    const vistitorName = await readVisitorName(visit.visitor_ID);

    if (visit.status_code === codes.visitStatusCode.canceled) {
      req.info(200, 'ACTION_CANCELED_ALREADY', [vistitorName]);
      return visit;
    }

    // Change the status of the visit
    visit.status_code = codes.visitStatusCode.canceled;

    // Update the free visitor seats and the status of the poetry slam
    const changedData = await calculatePoetrySlamData(visit.parent_ID, req, -1);

    const success = await updatePoetrySlam(
      visit.parent_ID,
      changedData.status_code,
      changedData.freeVisitorSeats,
      req,
      { text: 'ACTION_VISIT_CANCEL_NOT_POSSIBLE', param: vistitorName }
    );

    if (!success) {
      return {};
    }

    // Update status of visit for which the action was called
    const result = await UPDATE(req.subject).set({
      status_code: visit.status_code
    });

    if (result !== 1) {
      req.error(500, 'ACTION_VISIT_CANCEL_NOT_POSSIBLE', [vistitorName]);
      return;
    }
    req.info(200, 'ACTION_VISIT_CANCEL_SUCCESS', [vistitorName]);

    return visit; // Return the changed visit; visit data is returned in OData request
  });

  // Entity action "confirmVisit": Set the status of visit to confirmed
  // Actions are not mass enabled in service, only on UI; they are handled in a batch mode;
  srv.on('confirmVisit', async (req) => {
    // In case, the visit is called via composition of poetry slam, there are two entries, the last is the association where the action was executed
    const visit = await SELECT.one
      .from(req.subject)
      .columns('ID', 'status_code', 'parent_ID', 'visitor_ID');

    // If visit was not found, throw an error
    if (!visit) {
      const id = req.params[req.params.length - 1]?.ID;
      req.error(400, 'VISITS_NOT_FOUND', [id]);
      return;
    }

    const vistitorName = await readVisitorName(visit.visitor_ID);

    if (visit.status_code === codes.visitStatusCode.booked) {
      req.info(200, 'ACTION_BOOKED_ALREADY', [vistitorName]);
      return visit;
    }

    //In case event gets overbooked do not allow visit confirmation
    const allowed = await checkPoetrySlamForVisitCreation(visit.parent_ID, req);
    if (!allowed) {
      return;
    }
    visit.status_code = codes.visitStatusCode.booked;

    // Update the free visitor seats and the status of the poetry slam
    const changedData = await calculatePoetrySlamData(visit.parent_ID, req, 1);
    const success = await updatePoetrySlam(
      visit.parent_ID,
      changedData.status_code,
      changedData.freeVisitorSeats,
      req,
      { text: 'ACTION_VISIT_BOOK_NOT_POSSIBLE', param: vistitorName }
    );

    if (!success) {
      return {};
    }

    // Update visits
    const result = await UPDATE(req.subject).set({
      status_code: visit.status_code
    });

    // Handle error case of update result
    if (result !== 1) {
      // Error message: could not be booked
      req.error(400, 'ACTION_VISIT_BOOK_NOT_POSSIBLE', [vistitorName]);
      return;
    }

    req.info(200, 'ACTION_BOOKING_SUCCESS', [vistitorName]);

    return visit;
  });

  // ----------------------------------------------------------------------------
  // Implementation of reuse functions
  // ----------------------------------------------------------------------------

  // Enable creation of visits only for published poetry slams
  async function checkPoetrySlamForVisitCreation(poetrySlamID, req) {
    if (!poetrySlamID) {
      req.error(500, 'POETRYSLAM_NOT_FOUND', [poetrySlamID]);
      return false;
    }

    let result = true;
    // Update the free visitor seats and the status of the poetry slam
    const poetrySlam = await SELECT.one
      .from(
        `PoetrySlamService.PoetrySlams${
          req.target.name.endsWith('drafts') ? '.drafts' : ''
        }`
      )
      .columns('status_code', 'number')
      .where({ ID: poetrySlamID });

    // Check poetry slam status
    if (!poetrySlam) {
      req.error(400, 'POETRYSLAM_NOT_FOUND', [poetrySlamID]);
      result = false;
    } else if (poetrySlam.status_code === codes.poetrySlamStatusCode.booked) {
      req.error(400, 'POETRYSLAM_FULLY_BOOKED', [poetrySlam.number]);
      result = false;
    } else if (poetrySlam.status_code === codes.poetrySlamStatusCode.canceled) {
      req.error(400, 'POETRYSLAM_CANCELED', [poetrySlam.number]);
      result = false;
    } else if (
      poetrySlam.status_code === codes.poetrySlamStatusCode.inPreparation
    ) {
      req.error(400, 'POETRYSLAM_NOT_PUBLISHED', [poetrySlam.number]);
      result = false;
    }

    return result;
  }

  // Read visitor name from visitorID
  async function readVisitorName(visitorId) {
    const visitor = await SELECT.one
      .from(`PoetrySlamService.Visitors`)
      .columns('ID', 'name')
      .where({ ID: visitorId });

    return visitor?.name;
  }
};
