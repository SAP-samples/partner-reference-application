'strict';

// Adds cds module
const cds = require('@sap/cds');
// Defines required CDS functions for testing
const { expect, POST, axios, test } = cds.test(__dirname + '/../../..');

// Add modules to allow mocking
const sinon = require('sinon');
const { XMLBuilder } = require('fast-xml-parser');
const { Readable } = require('stream');
const {
  StoreFormTemplatesApi,
  ADSRenderRequestApi
} = require('../../../srv/external/FORMSAPI');
const Forms = require('../../../srv/lib/forms');
const Logo = require('../../../srv/lib/logo');
const serviceCredentials = require('../../../srv/lib/serviceCredentials');

// Authentication for tests; role PoetrySlamManager
axios.defaults.auth = { username: 'peter', password: 'welcome' };

// Test data
const mockBase64Image = Buffer.from('Mock base64 image').toString('base64');
const poetrySlamId = '79ceab87-300d-4b66-8cc3-f82c679b77a2';
const expectedFormsData = {
  ps_bookings_list_form: {
    logo: mockBase64Image,
    title: 'Being Human Poetry Slam',
    description:
      'Poetry Slams about human existence, revealing the beauty and complexity within',
    visitors_table: {
      visitor_row: [
        {
          name: 'Thomas Schmidt'
        }
      ]
    },
    artists_table: {
      artist_row: [
        {
          name: 'Miguel Rodriguez'
        }
      ]
    }
  }
};

describe('Util Forms', () => {
  before(async () => {
    await test.data.reset();
    await POST(`/odata/v4/poetryslamservice/createTestData`);
  });

  describe('Data XML', () => {
    // Data XML Stubs
    let bufferStub, buildStub, logoStub;

    beforeEach(function () {
      // Create Data XML Stubs
      // Create a stub for the XMLBuilder instance

      const date = new Date();
      date.setDate(date.getDate() + 60);
      date.setHours(15, 0, 0);

      date.setMilliseconds(0);
      expectedFormsData.ps_bookings_list_form.date =
        date.toISOString().split('.')[0] + 'Z';

      sinon.createStubInstance(XMLBuilder);
      buildStub = sinon
        .stub(XMLBuilder.prototype, 'build')
        .returns(expectedFormsData);
      bufferStub = sinon.stub(Buffer, 'from').returns({
        toString: () => 'Mock data XML base64'
      });
      logoStub = sinon.stub(Logo, 'encodeFileBase64').returns(mockBase64Image);
    });

    afterEach(function () {
      // Restore create Data XML Stubs
      buildStub.restore();
      bufferStub.restore();
      logoStub.restore();
    });

    it('should create xml data', async function () {
      const forms = new Forms(undefined, poetrySlamId);
      const xmlDataBase64 = await forms.createDataXML();

      expect(xmlDataBase64).to.equal('Mock data XML base64');
      sinon.assert.calledOnce(buildStub);
      sinon.assert.calledWith(buildStub, expectedFormsData);
      sinon.assert.calledOnce(bufferStub);
    });
  });

  describe('getFileName', () => {
    it('should return a fallback file name', async function () {
      const forms = new Forms(undefined, poetrySlamId);
      const fileName = await forms.getFileName(null);
      expect(fileName).to.equal('PoetrySlam_2');
    });

    it('should return the correct file name', async function () {
      const forms = new Forms(undefined, poetrySlamId);
      const fileName = await forms.getFileName();
      expect(fileName).to.equal('GuestList_2');
    });
  });

  describe('getReadable', () => {
    it('should return a Readable for a given file input', async function () {
      const forms = new Forms(undefined, poetrySlamId);

      const testContent = Buffer.from('test file content').toString('base64');
      const readable = await forms.getReadable(testContent);
      expect(readable.value instanceof Readable).eql(true);
      expect(readable.$mediaContentType).eql('application/pdf');
      expect(readable.$mediaContentDispositionFilename).eql('GuestList_2.pdf');
    });
  });

  describe('ADS Render Request', () => {
    let mockXdpTemplate;
    let mockFileContent;
    let mockBufferedDataBase64;

    // ADS Render Requests Stubs
    let getCredentialsStub;
    let getTokenStub;
    let StoreFormTemplatesApiStub;
    let ADSRenderRequestApiStub;
    let bufferStub;
    let readableStub;

    beforeEach(async () => {
      mockXdpTemplate = 'Mock XdpTemplate';
      mockFileContent = 'Mock File Content';
      mockBufferedDataBase64 = 'Mock buffered data XML base64';

      // Various stubs for external services
      getCredentialsStub = sinon
        .stub(serviceCredentials, 'getServiceCredentials')
        .returns({ uri: 'Mock srvUrl' });
      getTokenStub = sinon
        .stub(serviceCredentials, 'getServiceToken')
        .resolves('Mock token');
      bufferStub = sinon.stub(Buffer, 'from').returns(mockBufferedDataBase64);
      sinon.createStubInstance(Readable);
      readableStub = sinon.stub(Readable.prototype, 'push');
      StoreFormTemplatesApiStub = sinon
        .stub(StoreFormTemplatesApi, 'templateGet')
        .returns({
          addCustomHeaders: () => ({
            execute: () => Promise.resolve({ xdpTemplate: mockXdpTemplate })
          })
        });
      ADSRenderRequestApiStub = sinon
        .stub(ADSRenderRequestApi, 'renderingPdfPost')
        .returns({
          addCustomHeaders: () => ({
            addCustomHeaders: () => ({
              execute: () => Promise.resolve({ fileContent: mockFileContent })
            })
          })
        });
    });

    afterEach(function () {
      // Restore stubs
      StoreFormTemplatesApiStub.restore();
      getCredentialsStub.restore();
      getTokenStub.restore();
      ADSRenderRequestApiStub.restore();
      bufferStub.restore();
      readableStub.restore();
    });

    it('should send render request to SAP Forms Service by Adobe API', async function () {
      const forms = new Forms(undefined, poetrySlamId);
      const result = await forms.getRenderedPDF();

      expect(result).eql(mockFileContent);
      sinon.assert.calledOnce(getCredentialsStub);
      sinon.assert.calledOnce(getTokenStub);
      sinon.assert.calledOnce(StoreFormTemplatesApiStub);
      sinon.assert.calledOnce(ADSRenderRequestApiStub);
    });
  });

  describe('ADS Render Request Error', () => {
    // ADS Render Requests Stubs
    let stubLog;
    let getCredentialsStub;
    let getTokenStub;
    let StoreFormTemplatesApiStub;

    beforeEach(async () => {
      // Use Stubs for external services
      stubLog = sinon.stub(console, 'error');
      getCredentialsStub = sinon
        .stub(serviceCredentials, 'getServiceCredentials')
        .returns(Promise.resolve({ uri: 'Mock srvUrl' }));
      getTokenStub = sinon
        .stub(serviceCredentials, 'getServiceToken')
        .returns(Promise.resolve('Mock token'));
      StoreFormTemplatesApiStub = sinon
        .stub(StoreFormTemplatesApi, 'templateGet')
        .throws('Error');
    });

    afterEach(function () {
      // Restore Stubs
      getCredentialsStub.restore();
      getTokenStub.restore();
      StoreFormTemplatesApiStub.restore();
      stubLog.restore();
    });

    it('should handle error during render request to SAP Forms Service by Adobe API', async function () {
      const forms = new Forms(undefined, poetrySlamId);
      await forms.getRenderedPDF();

      sinon.assert.calledWith(
        stubLog,
        'An error occurred while getting the rendered PDF: Sinon-provided Error'
      );
    });
  });

  describe('ADS getCredentials', () => {
    let bufferStub, stubLog;

    beforeEach(async () => {
      stubLog = sinon.stub(console, 'error');
      bufferStub = sinon.stub(Buffer, 'from').returns({
        toString: () => 'Mock base64 encoded client credentials'
      });
    });

    afterEach(function () {
      // Restore Get Credential Stub
      stubLog.restore();
      bufferStub.restore();
    });

    it('should handle error received from trying to get a JWT token without service binding', async function () {
      const forms = new Forms(undefined, poetrySlamId);
      await forms.getRenderedPDF();

      sinon.assert.calledWith(
        stubLog,
        `An error occurred while getting the rendered PDF: Missing binding credentials for service "adsrestapi"`
      );
    });
  });
});
