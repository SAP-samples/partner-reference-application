'strict';

const cds = require('@sap/cds');
const { expect } = cds.test(__dirname + '/../../..');

// Mocking
const sinon = require('sinon');
const {
  QueuesApi,
  DocumentsApi,
  PrintTasksApi
} = require('../../../srv/external/PRINTAPI');
const serviceCredentials = require('../../../srv/lib/serviceCredentials');

// Code to test
const printUtil = require('../../../srv/lib/print');

const { httpCodes } = require('../../../srv/lib/codes');

describe('Util print', () => {
  let serviceCredentialsStub;
  let serviceCredentialsTokenStub;
  let queuesApiStub;
  let documentsApiStub;
  let printTasksApiStub;

  afterEach(() => {
    if (serviceCredentialsStub) {
      serviceCredentialsStub.restore();
      serviceCredentialsStub = undefined;
    }
    if (serviceCredentialsTokenStub) {
      serviceCredentialsTokenStub.restore();
      serviceCredentialsTokenStub = undefined;
    }
    if (queuesApiStub) {
      queuesApiStub.restore();
      queuesApiStub = undefined;
    }
    if (documentsApiStub) {
      documentsApiStub.restore();
      documentsApiStub = undefined;
    }
    if (printTasksApiStub) {
      printTasksApiStub.restore();
      printTasksApiStub = undefined;
    }
  });

  function apiMock(response) {
    // Mock the cascaded call <api>.addCustomHeaders().execute() or <api>.addCustomHeaders().executeRaw()
    const executeDummy = async function () {
      return response;
    };
    const addCustomHeadersDummy = function () {
      return { execute: executeDummy, executeRaw: executeDummy };
    };
    return { addCustomHeaders: addCustomHeadersDummy };
  }

  describe('getPrintQueues', () => {
    it('should return nothing in case of missing service credentials', async () => {
      expect(await printUtil.getPrintQueues()).eql([]);
    });

    it('should return nothing in case of missing service binding for Print Service', async () => {
      serviceCredentialsStub = sinon
        .stub(serviceCredentials, 'getServiceCredentials')
        .returns({ service_url: 'something' });

      expect(await printUtil.getPrintQueues()).eql([]);
    });

    it('should return print queues', async () => {
      // Mocking
      serviceCredentialsStub = sinon
        .stub(serviceCredentials, 'getServiceCredentials')
        .returns({ service_url: 'something' });
      serviceCredentialsTokenStub = sinon
        .stub(serviceCredentials, 'getServiceToken')
        .resolves('dummy token');
      queuesApiStub = sinon.stub(QueuesApi, 'getQmApiV1RestQueues').returns(
        apiMock([
          { qname: 'name1', qdescription: 'descr1' },
          { qname: 'name2', qdescription: 'descr2' }
        ])
      );

      //actual test
      const queues = await printUtil.getPrintQueues();
      expect(queues).eql([
        { name: 'name1', descr: 'descr1' },
        { name: 'name2', descr: 'descr2' }
      ]);
    });
  });

  describe('print', () => {
    let reqCalls = [];
    const reqMock = {
      error: function (status, message) {
        reqCalls.push(['E', status, message]);
      },
      info: function (status, message) {
        reqCalls.push(['I', status, message]);
      }
    };

    afterEach(() => {
      reqCalls = [];
    });

    it('should fail in case of missing print queue', async () => {
      await printUtil.print(reqMock);
      expect(reqCalls).eql([
        ['E', httpCodes.bad_request, 'ACTION_PRINT_NO_QUEUE']
      ]);
    });

    it('should fail in case of missing service credentials', async () => {
      await printUtil.print(reqMock, 'queue');
      expect(reqCalls).eql([
        ['E', httpCodes.internal_server_error, 'ACTION_PRINT_NO_ACCESS']
      ]);
    });

    it('should fail in case external services are not connected', async () => {
      serviceCredentialsTokenStub = sinon
        .stub(serviceCredentials, 'getServiceToken')
        .resolves('dummy token');

      await printUtil.print(reqMock, 'queue');
      expect(reqCalls).eql([
        ['E', httpCodes.internal_server_error, 'ACTION_PRINT_FAIL']
      ]);
    });

    it('should fail in case of missing document response', async () => {
      serviceCredentialsTokenStub = sinon
        .stub(serviceCredentials, 'getServiceToken')
        .resolves('dummy token');
      documentsApiStub = sinon
        .stub(DocumentsApi, 'createDmApiV1RestPrintDocuments')
        .returns(apiMock(undefined));

      await printUtil.print(reqMock, 'queue');
      expect(reqCalls).eql([
        ['E', httpCodes.internal_server_error, 'ACTION_PRINT_NO_DOCUMENT']
      ]);
    });

    it('should fail in case print task cannot be created', async () => {
      serviceCredentialsTokenStub = sinon
        .stub(serviceCredentials, 'getServiceToken')
        .resolves('dummy token');
      documentsApiStub = sinon
        .stub(DocumentsApi, 'createDmApiV1RestPrintDocuments')
        .returns(apiMock('dummy document'));
      printTasksApiStub = sinon
        .stub(PrintTasksApi, 'updateQmApiV1RestPrintTasksByItemId')
        .returns(apiMock({ status: httpCodes.internal_server_error }));

      await printUtil.print(reqMock, 'queue');
      expect(reqCalls).eql([
        ['E', httpCodes.internal_server_error, 'ACTION_PRINT_NO_PRINTTASK']
      ]);
    });

    it('should return success if print task can be created', async () => {
      serviceCredentialsTokenStub = sinon
        .stub(serviceCredentials, 'getServiceToken')
        .resolves('dummy token');
      documentsApiStub = sinon
        .stub(DocumentsApi, 'createDmApiV1RestPrintDocuments')
        .returns(apiMock('dummy document'));
      printTasksApiStub = sinon
        .stub(PrintTasksApi, 'updateQmApiV1RestPrintTasksByItemId')
        .returns(apiMock({ status: httpCodes.ok_no_content }));

      await printUtil.print(reqMock, 'queue');
      expect(reqCalls).eql([['I', httpCodes.ok, 'ACTION_PRINT_SUCCESS']]);
    });
  });
});
