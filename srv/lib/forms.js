'use strict';
// Implementation of forms reuse functions

// XML parser and helper
const escape = require('xml-escape');
const { XMLBuilder } = require('fast-xml-parser');
const { Readable } = require('stream');

const { httpCodes } = require('./codes');

const Logo = require('./logo');

// Generated OpenAPI interfaces
const {
  StoreFormTemplatesApi,
  ADSRenderRequestApi
} = require('../external/FORMSAPI');

// Reuse functions to access service credentials
const serviceCredentials = require('./serviceCredentials');

class Forms {
  // Names of the created form and uploaded template in SAP Forms Service by Adobe Template Store
  static FORM_NAME = 'ps_bookings_list_form';
  static TEMPLATE_NAME = 'ps_bookings_list_template';
  // Configurations for the body to be send with the PDF render request
  static FORM_TYPE = 'print';
  static FORM_LOCALE = 'en_US';
  static TAGGED_PDF = 1;
  static EMBED_FONT = 1;
  static CHANGE_NOT_ALLOWED = false;
  static PRINT_NOT_ALLOWED = false;

  constructor(req, poetrySlamId) {
    this.req = req;
    this.poetrySlamId = poetrySlamId;
    this.eventAgencyLogo = Logo.encodeFileBase64();

    // Data to be filled in readPoetrySlamData()
    this.poetrySlam = undefined;
    this.poetrySlamArtists = undefined;
    this.poetrySlamVisitors = undefined;
  }

  async readPoetrySlamData() {
    this.poetrySlam = await SELECT.one('PoetrySlamService.PoetrySlams')
      .columns('number', 'title', 'dateTime', 'description')
      .where({ ID: this.poetrySlamId });

    // If poetry slam was not found, throw an error
    if (!this.poetrySlam) {
      this.req.error(httpCodes.bad_request, 'POETRYSLAM_NOT_FOUND', [
        this.poetrySlamId
      ]);
      return;
    }

    const poetrySlamBookings = await SELECT.from(
      'PoetrySlamService.PoetrySlams'
    )
      .columns(
        'visits.visitor.name as visitorName',
        'visits.artistIndicator as artistIndicator',
        'visits.status_code as visitStatus'
      )
      .where({
        ID: this.poetrySlamId,
        'visits.status_code': 1
      });

    this.poetrySlamVisitors = poetrySlamBookings.filter(
      (visitor) =>
        visitor.artistIndicator === 0 || visitor.artistIndicator === false
    );

    this.poetrySlamArtists = poetrySlamBookings.filter(
      (artist) =>
        artist.artistIndicator === 1 || artist.artistIndicator === true
    );
  }

  // Create XML according to schema uploaded to SAP Forms service based on business data
  async createDataXML() {
    if (!this.poetrySlam) {
      await this.readPoetrySlamData();
    }
    const obj = {
      ps_bookings_list_form: {
        logo: this.eventAgencyLogo,
        title: escape(this.poetrySlam.title),
        description: escape(this.poetrySlam.description),
        date: escape(this.poetrySlam.dateTime),
        visitors_table: {
          visitor_row: this.poetrySlamVisitors.map((visitor) => ({
            name: escape(visitor.visitorName)
          }))
        },
        artists_table: {
          artist_row: this.poetrySlamArtists.map((artist) => ({
            name: escape(artist.visitorName)
          }))
        }
      }
    };
    const builder = new XMLBuilder();
    const xmlData = builder.build(obj);
    const xmlDataBase64 = Buffer.from(xmlData).toString('base64');

    return xmlDataBase64;
  }

  // Send render request to SAP Forms Service by Adobe API
  // The response is a base64-encoded PDF
  async callFormsService(xmlDataBase64) {
    try {
      const credentials =
        serviceCredentials.getServiceCredentials('adsrestapi');
      const access_token = await serviceCredentials.getServiceToken(
        'adsrestapi',
        false
      );

      const { xdpTemplate } = await StoreFormTemplatesApi.templateGet(
        Forms.FORM_NAME,
        Forms.TEMPLATE_NAME
      )
        .addCustomHeaders({ Authorization: `Bearer ${access_token}` })
        .execute({ url: credentials.uri });

      // Prepare data to be send to the SAP Forms Service by Adobe API
      const form = JSON.stringify({
        xdpTemplate: xdpTemplate,
        xmlData: xmlDataBase64,
        formType: Forms.FORM_TYPE,
        formLocale: Forms.FORM_LOCALE,
        taggedPdf: Forms.TAGGED_PDF,
        embedFont: Forms.EMBED_FONT,
        changeNotAllowed: Forms.CHANGE_NOT_ALLOWED,
        printNotAllowed: Forms.PRINT_NOT_ALLOWED
      });

      const { fileContent } = await ADSRenderRequestApi.renderingPdfPost(form)
        .addCustomHeaders({ Authorization: `Bearer ${access_token}` })
        .addCustomHeaders({ 'Content-Type': 'application/json' })
        .execute({ url: credentials.uri });

      return fileContent;
    } catch (error) {
      console.error(
        `An error occurred while getting the rendered PDF: ${error.message}`
      );
    }
  }

  // Returns the base64-encoded PDF
  async getRenderedPDF() {
    // Create XML using business data
    const xmlDataBase64 = await this.createDataXML();

    if (xmlDataBase64 === undefined) {
      console.error('Util Forms: xml creation failed');
      this.req.error(httpCodes.bad_request, 'DATA_XML_CREATION_FAILED', [
        this.poetrySlamId
      ]);
      return;
    }

    // Send render request to SAP Forms Service by Adobe API
    const formsResult = await this.callFormsService(xmlDataBase64);
    return formsResult;
  }

  // Get a file name for the guest list PDF - used for print and download
  async getFileName(textId = 'guestList') {
    if (!this.poetrySlam) {
      await this.readPoetrySlamData();
    }

    let stringPoetrySlam;
    try {
      // Get a the text "Poetry Slam" in the user's locale with fallbacks
      stringPoetrySlam = cds.i18n.labels.at(textId).replace(/\s/g, '');
    } catch (e) {
      console.error(
        'Function getFileName: error accessing texbundle',
        e.message
      );
      stringPoetrySlam = 'PoetrySlam';
    }

    const stringPoetrySlamNumber = this.poetrySlam.number || this.poetrySlamId;

    return stringPoetrySlam + '_' + stringPoetrySlamNumber;
  }

  // Convert file content as returned from the SAP Forms Service into a Readable that is returned as LargeBinary by the CAP service
  async getReadable(fileContent) {
    if (!fileContent) {
      throw new Error('Util Forms: missing file content');
    }
    const readable = new Readable();
    readable.push(Buffer.from(fileContent, 'base64'));
    // Signal the end of the stream
    readable.push(null);

    const fileName = (await this.getFileName()) + '.pdf';
    // Return the readable stream along with metadata for content type and file name
    return {
      value: readable,
      $mediaContentType: 'application/pdf',
      $mediaContentDispositionFilename: fileName
    };
  }
}

// Publish class
module.exports = Forms;
