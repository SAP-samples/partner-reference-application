'use strict';
// Implementation of attachments reuse function

const cds = require('@sap/cds');

// Access file system
const fs = require('fs');
const path = require('path');

const { httpCodes, mimeTypes } = require('../lib/codes');

class Attachments {
  constructor(req, db, poetrySlamIDs) {
    this.req = req;
    this.db = db;
    this.poetrySlamIDs = poetrySlamIDs;
  }

  async handleAttachmentTestData() {
    try {
      const Attachments = cds.entities['PoetrySlams.attachments'];
      // Clear Attachments test data
      await this.db.run(
        DELETE.from(Attachments).where({ up__ID: { in: this.poetrySlamIDs } })
      );
      // Collect role collections assigned to a user
      const roleCollections =
        this.req.user?.authInfo?.token?.xsSystemAttributes?.[
          'xs.rolecollections'
        ] || [];
      // Check if user has the SDM_User role collection assigned, needed for Document Management Service to manage attachments
      const hasDocumentManagementRoleCollection = roleCollections.includes(
        'PoetrySlamDocumentManagementRoleCollection'
      );
      // Check if the Document Management Service is connected
      const documentManagementServiceConnected =
        !!cds.env.requires.sdm?.credentials;

      // Add catering PDF as attachment to test data. Required that XSUAA and Document Management service are connected.
      if (
        Attachments &&
        hasDocumentManagementRoleCollection &&
        documentManagementServiceConnected
      ) {
        const cateringPDFFileName =
          'echoesOfThoughtPoetrySlamSpectacle_catering.pdf';
        const cateringPDFPath = `../poetryslam/sample_data/${cateringPDFFileName}`;
        const cateringPDF = fs.readFileSync(
          path.join(__dirname, cateringPDFPath)
        );
        const base64CateringPDF = Buffer.from(cateringPDF).toString('base64');

        const poetrySlamID = '79ceab87-300d-4b66-8cc3-f82c679b77a1';
        const poetrySlam = await SELECT.one
          .from('PoetrySlamService.PoetrySlams')
          .where({ ID: poetrySlamID });

        if (!poetrySlam) {
          console.error('Poetry Slam not found');
          this.req.error(httpCodes.not_found, 'POETRYSLAM_NOT_FOUND', [
            poetrySlamID
          ]);
          return;
        }

        const attachmentData = {
          filename: cateringPDFFileName,
          mimeType: mimeTypes.application_pdf,
          content: base64CateringPDF,
          note: cds.i18n.labels.at(
            'ATTACHMENT_NOTE',
            cds.context.locale ?? 'en'
          ),
          up__ID: poetrySlamID,
          ID: cds.utils.uuid()
        };
        await this.db.run(INSERT(attachmentData).into(Attachments));
      }
      return;
    } catch (error) {
      console.error(
        `Error: Failed add attachment PDF to test data`,
        error.message
      );
      this.req.error(
        httpCodes.internal_server_error,
        'ADD_ATTACHMENT_TO_TEST_DATA_FAILED'
      );
    }
  }
}

// Publish class
module.exports = Attachments;
