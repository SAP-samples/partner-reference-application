'strict';
// Type definition required for CDSLint
/** @typedef {import('@sap/cds').CRUDEventHandler.On} OnHandler */

// eslint-disable-next-line no-unused-vars
const cds = require('@sap/cds');
const Forms = require('../lib/forms');
const { getPrintQueues, print } = require('../lib/print');
const { httpCodes } = require('../lib/codes');

// Type definition required for CDSLint
/** @type {OnHandler} */
module.exports = async (srv) => {
  const { PDFDocument, PrintQueues } = srv.entities;
  // ----------------------------------------------------------------------------
  // Implementation of service call to SAP Forms by Adobe API Service
  // ----------------------------------------------------------------------------

  srv.on('READ', PDFDocument, async (req) => {
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
  srv.on('READ', PrintQueues, async () => {
    return await getPrintQueues();
  });
};
