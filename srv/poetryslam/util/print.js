'use strict';

// Include the generated OpenAPI interfaces
const {
  QueuesApi,
  DocumentsApi,
  PrintTasksApi
} = require('../../external/PRINTAPI');

// Include util classes to access the service binding
const serviceCredentialsUtil = require('./serviceCredentials');

// ----------------------------------------------------------------------------
//  Read the available print queues
// ----------------------------------------------------------------------------
async function getPrintQueues() {
  //  Read the binding information for the Print Service and the target tenant
  const srvUrl =
    serviceCredentialsUtil.getServiceCredentials('print')?.service_url;
  let jwt = '';
  try {
    jwt = await serviceCredentialsUtil.getServiceToken('print');
  } catch (e) {
    console.error('ACTION getPrintQueues: Error retrieving jwt', e.message);
    return [];
  }

  //  Read the available print queues
  let queues;
  try {
    queues = await QueuesApi.getQmApiV1RestQueues()
      .addCustomHeaders({ Authorization: `Bearer ${jwt}` })
      .execute({ url: srvUrl });
  } catch (e) {
    console.error(
      'ACTION getPrintQueues - print queue could not be read: ',
      e.message
    );
    return [];
  }

  if (!queues?.length) {
    console.log('ACTION getPrintQueues - no print queues found');
    return [];
  }

  return queues.map((q) => {
    return { name: q.qname, descr: q.qdescription };
  });
}

// ----------------------------------------------------------------------------
//  Print the document (print + assign to print task)
// ----------------------------------------------------------------------------
async function print(req, printQueue, fileContent, fileName = 'Document') {
  if (!printQueue) {
    console.error(
      'Util print - function print: mandatory parameter printQueue not provided.'
    );
    req.error(500, 'ACTION_PRINT_NO_QUEUE');
    return;
  }

  //  Read the binding information for the Print Service and the target tenant
  const srvUrl =
    serviceCredentialsUtil.getServiceCredentials('print')?.service_url;
  let jwt = '';
  try {
    jwt = await serviceCredentialsUtil.getServiceToken('print');
  } catch (e) {
    console.error('ACTION print: Error retrieving jwt', e.message);
    req.error(500, 'ACTION_PRINT_NO_ACCESS');
    return;
  }

  try {
    //  Upload the document
    const documentResponse = await DocumentsApi.createDmApiV1RestPrintDocuments(
      fileContent,
      { 'If-None-Match': '*', scan: true }
    )
      .addCustomHeaders({ Authorization: `Bearer ${jwt}` })
      .execute({ url: srvUrl });

    if (!documentResponse) {
      console.error('ACTION print: Document creation failed (empty response)');
      req.error(500, 'ACTION_PRINT_NO_DOCUMENT');
      return;
    }
    console.log(`Function print: document ${documentResponse} created`);

    //  Create the Print Task (add the document to the selected print queue)
    const printTask = {
      numberOfCopies: 1,
      username: cds.context?.user?.id,
      qname: printQueue,
      printContents: [
        {
          objectKey: documentResponse,
          documentName: fileName
        }
      ]
    };

    const printTaskResponse =
      await PrintTasksApi.updateQmApiV1RestPrintTasksByItemId(
        documentResponse,
        printTask,
        { 'If-None-Match': '*', scan: true }
      )
        .addCustomHeaders({ Authorization: `Bearer ${jwt}` })
        .executeRaw({ url: srvUrl });

    // Expected response status: 204 - success, no content
    if (printTaskResponse.status !== 204) {
      console.error(
        `ACTION print: PrintTask creation failed (status ${printTaskResponse.status})`
      );
      req.error(500, 'ACTION_PRINT_NO_PRINTTASK');
      return;
    }
  } catch (e) {
    console.error('ACTION print - Error: ', e.message);
    req.error(500, 'ACTION_PRINT_FAIL');
    return;
  }

  //  Success
  req.info(200, 'ACTION_PRINT_SUCCESS', [fileName, printQueue]);
}

// Publish constants and functions
module.exports = {
  getPrintQueues,
  print
};
