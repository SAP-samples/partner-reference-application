'strict';
// Type definition required for CDSLint
/** @typedef {import('@sap/cds').CRUDEventHandler.On} OnHandler */

// eslint-disable-next-line no-unused-vars
const cds = require('@sap/cds');
const Notification = require('../lib/notification');
const { httpCodes } = require('../lib/codes');

// Type definition required for CDSLint
/** @type {OnHandler} */
module.exports = async (srv) => {
  // ----------------------------------------------------------------------------
  // Entity action "sendNotification": Informs the visitor via notification about the event
  // ----------------------------------------------------------------------------

  srv.on('sendNotification', async (req) => {
    const visit = await SELECT.one
      .from(req.subject)
      .columns(
        'status_code as visitStatusCode',
        'visitor.email as visitorEMail',
        'visitor.name as visitorName',
        'parent.title as title',
        'parent.description as description',
        'parent.dateTime as dateTime'
      );

    // If visit was not found, throw an error
    if (!visit) {
      const id = req.params[req.params.length - 1]?.ID;
      console.error('ACTION sendNotification: No visits found');
      req.error(httpCodes.bad_request, 'VISIT_NOT_FOUND', [id]);
      return;
    }

    const notification = new Notification(
      visit.visitorEMail,
      Notification.getMailTitleForPoetrySlam(),
      Notification.generateMailContentForPoetrySlam(),
      Notification.getNotificationSubtitleForPoetrySlam(),
      visit
    );
    await notification.send(req);
  });
};
