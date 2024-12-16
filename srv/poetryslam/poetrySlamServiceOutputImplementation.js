'strict';

const Forms = require('./util/forms');
const EMail = require('./util/email');
const { getPrintQueues, print } = require('./util/print');

const { httpCodes } = require('./util/codes');

module.exports = async (srv) => {
  // ----------------------------------------------------------------------------
  // Implementation of service call to SAP Forms by Adobe API Service
  // ----------------------------------------------------------------------------

  srv.on('READ', 'PDFDocument', async (req) => {
    const poetrySlam = req.data;

    try {
      // Generate PDF and create a readable stream for it
      const forms = new Forms(req, poetrySlam.ID);
      const fileContent = await forms.getRenderedPDF();
      return await forms.getReadable(fileContent);
    } catch (e) {
      console.error('READ PDFDocument error:', e.message);
      req.error(httpCodes.bad_request, 'PDF_RENDER_ERROR', [poetrySlam.ID]);
    }
  });

  // ----------------------------------------------------------------------------
  // Implementation of print service
  // ----------------------------------------------------------------------------

  // Entity action "printGuestList": Create a Form (PDF) and send it to the Print Service
  srv.on('printGuestList', async (req) => {
    const poetrySlam = req.params[req.params.length - 1];

    // In case you want to use/test the print service without the forms service you can replace the next 2 lines by any other logic or a constant (test) file content
    const forms = new Forms(req, poetrySlam.ID);
    const fileContent = await forms.getRenderedPDF();

    if (!fileContent) {
      console.error('PrintGuestList error: Forms file content is empty');
      req.error(httpCodes.bad_request, 'ACTION_PRINT_FAIL', [poetrySlam.ID]);
      return;
    }

    // Sent the file content to the print service
    const fileContentRaw = Buffer.from(fileContent, 'base64');
    await print(
      req,
      req.data?.printQueue,
      fileContentRaw,
      await forms.getFileName()
    );
  });

  // Virtual Entity PrintQueues
  srv.on('READ', 'PrintQueues', async () => {
    return await getPrintQueues();
  });

  // ----------------------------------------------------------------------------
  // Entity action "sendEMail": Informs the visitor via email about the event
  // ----------------------------------------------------------------------------

  srv.on('sendEMail', async (req) => {
    const visit = await SELECT.one
      .from(req.subject)
      .columns(
        'parent_ID',
        'visitor_ID',
        'visits.visitor.email as visitorEMail',
        'visits.visitor.name as visitorName',
        'parent.title as title',
        'parent.description as description',
        'parent.dateTime as dateTime'
      );

    // If visit was not found, throw an error
    if (!visit) {
      const id = req.params[req.params.length - 1]?.ID;
      req.error(httpCodes.bad_request, 'VISITS_NOT_FOUND', [id]);
      return;
    }

    const email = new EMail(
      visit.visitorEMail,
      EMail.getMailTitleForPoetrySlam(),
      EMail.generateMailContentForPoetrySlam(
        visit.title,
        visit.description,
        visit.dateTime,
        visit.visitorName
      )
    );
    await email.send(req);
  });
};
