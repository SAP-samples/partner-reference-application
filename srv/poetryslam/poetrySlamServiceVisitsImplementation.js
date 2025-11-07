'strict';
// Type definition required for CDSLint
/** @typedef {import('@sap/cds').CRUDEventHandler.On} OnHandler */

// eslint-disable-next-line no-unused-vars
const cds = require('@sap/cds');

// Include utility files
const {
  httpCodes,
  visitStatusCode,
  poetrySlamStatusCode,
  color
} = require('../lib/codes');

const {
  calculatePoetrySlamData,
  updatePoetrySlam,
  convertToArray
} = require('../lib/entityCalculations');

// Type definition required for CDSLint
/** @type {OnHandler} */
module.exports = async (srv) => {
  const { Visits } = srv.entities;
  // ----------------------------------------------------------------------------
  // Implementation of entity events (entity Visits)
  // ----------------------------------------------------------------------------

  // Check if visit is allowed to be created
  srv.before('CREATE', [Visits, Visits.drafts], async (req) => {
    // Check that a visit is allowed to be created due to status of the poetry slam
    // Errors are thrown inside the method
    await checkPoetrySlamForVisitCreation(req.data.parent_ID, req);
  });

  srv.before('UPDATE', [Visits, Visits.drafts], async (req) => {
    const visit = await SELECT.one.from(req.subject).columns('ID', 'parent_ID');
    const result = await checkPoetrySlamForVisitCreation(visit.parent_ID, req);
    if (result === false) {
      console.error('Action createVisits: Overbooked');
      req.reject(httpCodes.bad_request, 'POETRYSLAM_OVERBOOKED');
    }
  });

  // Initialize status of visit and update poetry slam
  srv.on('UPDATE', [Visits, Visits.drafts], (req, next) => {
    // In case visitor is updated, default status of visit
    if (req.data.visitor_ID) {
      req.data.status_code = visitStatusCode.booked;
    }

    return next();
  });

  srv.after('UPDATE', [Visits, Visits.drafts], async (data, req) => {
    // If visitor_ID is not part of the update, no need to update poetry slam
    if (!Object.hasOwn(data, 'visitor_ID')) return;

    const visit = await SELECT.one.from(req.subject).columns('ID', 'parent_ID');

    if (!visit) {
      console.error('Visit not found - Update Visit not possible');
      req.error(httpCodes.internal_server_error, 'UPDATE_VISIT_NOT_POSSIBLE', [
        data.ID
      ]);
      return;
    }

    // Update the free visitor seats and the status of the poetry slam
    const changedData = await calculatePoetrySlamData(visit.parent_ID, req);
    await updatePoetrySlam(
      visit.parent_ID,
      changedData.status_code,
      changedData.freeVisitorSeats,
      req,
      { text: 'UPDATE_VISIT_NOT_POSSIBLE', param: data.ID }
    );
  });

  // Updates the poetry slam status and freevistor seats in case of deletion of a visit
  srv.before('DELETE', [Visits, Visits.drafts], async (req) => {
    if (!req.data.ID) {
      console.error('Visit ID not found');
      req.error(httpCodes.internal_server_error, 'VISIT_NOT_FOUND', [
        req.data.ID
      ]);
      return;
    }

    const currentVisit = await SELECT.one
      .from(req.subject)
      .columns('ID', 'parent_ID', 'visitor_ID', 'status_code');

    if (!currentVisit) {
      console.error('Current Visit not found');
      req.error(httpCodes.internal_server_error, 'VISIT_NOT_FOUND', [
        req.data.ID
      ]);
      return;
    }

    // Update the free visitor seats and the status of the poetry slam
    const changedData = await calculatePoetrySlamData(
      currentVisit.parent_ID,
      req,
      currentVisit.status_code === visitStatusCode.booked ? -1 : null
    );

    await updatePoetrySlam(
      currentVisit.parent_ID,
      changedData.status_code,
      changedData.freeVisitorSeats,
      req,
      {
        text: 'DELETE_VISIT_NOT_POSSIBLE',
        param: await readVisitorName(currentVisit.visitor_ID)
      }
    );
  });

  // Apply a colour code based on the visit status
  srv.after('READ', [Visits, Visits.drafts], (data) => {
    for (const visits of convertToArray(data)) {
      const status = visits.status?.code || visits.status_code;
      // Set status colour code
      switch (status) {
        case visitStatusCode.booked:
          visits.statusCriticality = color.green; // Booked visits are green
          break;
        case visitStatusCode.canceled:
          visits.statusCriticality = color.red; // Canceled visits are yellow
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
      console.error('Visit not found');
      req.error(httpCodes.bad_request, 'VISIT_NOT_FOUND', [id]);
      return;
    }

    // Determine the visitorname for the success and error messages
    const vistitorName = await readVisitorName(visit.visitor_ID);

    if (visit.status_code === visitStatusCode.canceled) {
      console.info('Booking already canceled.');
      req.info(httpCodes.ok, 'ACTION_CANCELED_ALREADY', [vistitorName]);
      return visit;
    }

    // Change the status of the visit
    visit.status_code = visitStatusCode.canceled;

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
      console.error('Update Poetry Slam failed');
      return {};
    }

    // Update status of visit for which the action was called
    const result = await UPDATE(req.subject).set({
      status_code: visit.status_code
    });

    if (result !== 1) {
      console.error('Update Visit not possible');
      req.error(
        httpCodes.internal_server_error,
        'ACTION_VISIT_CANCEL_NOT_POSSIBLE',
        [vistitorName]
      );
      return;
    }
    req.info(httpCodes.ok, 'ACTION_VISIT_CANCEL_SUCCESS', [vistitorName]);

    return visit; // Return the changed visit; visit data is returned in OData request
  });

  // Entity action "confirmVisit": Set the status of visit to confirmed
  // Actions are not mass enabled in service, only on UI; they are handled in a batch mode;
  srv.on('confirmVisit', async (req) => {
    // In case, the visit is called via composition of poetry slam, there are two entries, the last is the association where the action was executed
    const id = req.params[req.params.length - 1]?.ID;
    const visit = await SELECT.one
      .from(req.subject)
      .columns('ID', 'status_code', 'parent_ID', 'visitor_ID');

    // If visit was not found, throw an error
    if (!visit) {
      console.error('Visit not found');
      req.error(httpCodes.bad_request, 'VISITS_NOT_FOUND', [id]);
      return;
    }

    const vistitorName = await readVisitorName(visit.visitor_ID);

    if (visit.status_code === visitStatusCode.booked) {
      console.info('Visit already booked.');
      req.info(httpCodes.ok, 'ACTION_BOOKED_ALREADY', [vistitorName]);
      return visit;
    }

    //In case event gets overbooked do not allow visit confirmation
    const allowed = await checkPoetrySlamForVisitCreation(visit.parent_ID, req);
    if (!allowed) {
      console.error('Visit creation not allowed');
      req.error(httpCodes.bad_request, 'ACTION_VISIT_BOOK_NOT_POSSIBLE', [id]);
      return;
    }
    visit.status_code = visitStatusCode.booked;

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
      console.error('Update Poetry Slam failed');
      return {};
    }

    // Update visits
    const result = await UPDATE(req.subject).set({
      status_code: visit.status_code
    });

    // Handle error case of update result
    if (result !== 1) {
      console.error('Visit could not be booked');
      req.error(httpCodes.bad_request, 'ACTION_VISIT_BOOK_NOT_POSSIBLE', [
        vistitorName
      ]);
      return;
    }

    req.info(httpCodes.ok, 'ACTION_BOOKING_SUCCESS', [vistitorName]);

    return visit;
  });

  // ----------------------------------------------------------------------------
  // Implementation of reuse functions
  // ----------------------------------------------------------------------------

  // Enable creation of visits only for published poetry slams
  async function checkPoetrySlamForVisitCreation(poetrySlamID, req) {
    if (!poetrySlamID) {
      console.error('Poetry Slam ID not found');
      req.error(httpCodes.internal_server_error, 'POETRYSLAM_NOT_FOUND', [
        poetrySlamID
      ]);
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
      console.error('Visit creation not possible. Poetry Slam not found.');
      req.error(httpCodes.bad_request, 'POETRYSLAM_NOT_FOUND', [poetrySlamID]);
      result = false;
    } else if (poetrySlam.status_code === poetrySlamStatusCode.booked) {
      console.error('Visit creation not possible. Poetry Slam fully booked.');
      req.error(httpCodes.bad_request, 'POETRYSLAM_FULLY_BOOKED', [
        poetrySlam.number
      ]);
      result = false;
    } else if (poetrySlam.status_code === poetrySlamStatusCode.canceled) {
      console.error('Visit creation not possible. Poetry Slam canceled.');
      req.error(httpCodes.bad_request, 'POETRYSLAM_CANCELED', [
        poetrySlam.number
      ]);
      result = false;
    } else if (poetrySlam.status_code === poetrySlamStatusCode.inPreparation) {
      console.error('Visit creation not possible. Poetry Slam not published');
      req.error(httpCodes.bad_request, 'POETRYSLAM_NOT_PUBLISHED', [
        poetrySlam.number
      ]);
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
