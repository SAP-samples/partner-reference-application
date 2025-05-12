'strict';

// Include utility files
const { color, poetrySlamStatusCode, httpCodes } = require('../lib/codes');

const {
  calculatePoetrySlamData,
  updatePoetrySlam,
  convertToArray,
  createProject,
  createPurchaseOrder
} = require('../lib/entityCalculations');

const uniqueNumberGenerator = require('../lib/uniqueNumberGenerator');

const GenAI = require('../lib/genAI');

// Add connector for project management systems
const ConnectorByD = require('./connector/connectorByD');
const ConnectorS4HC = require('./connector/connectorS4HC');
const ConnectorB1 = require('./connector/connectorB1');

module.exports = async (srv) => {
  const db = await cds.connect.to('db');

  // ----------------------------------------------------------------------------
  // Implementation of entity events (entity PoetrySlams)
  // ----------------------------------------------------------------------------

  // Initialize status of drafts
  // Default the freeVisitorSeats to the maximumVisitorsNumber
  // Default number of poetry slam (human readable identifier)
  srv.before('CREATE', 'PoetrySlams.drafts', (req) =>
    initializePoetrySlam(req)
  );

  // Initialize status
  // Default the freeVisitorSeats to the maximumVisitorsNumber
  // Default number of poetry slam (human readable identifier)
  srv.before('CREATE', 'PoetrySlams', async (req) => {
    initializePoetrySlam(req);

    // Generate readable ID for poetry slam document
    try {
      req.data.number =
        'PS-' +
        (await uniqueNumberGenerator.getNextNumber(
          'poetrySlamNumber',
          db.kind,
          req.data.ID
        ));
    } catch (error) {
      req.error(httpCodes.internal_server_error, 'NO_POETRYSLAM_NUMBER', [
        error.message
      ]);
    }
  });

  // Set the event status to booked based on confirmed seats
  srv.on('UPDATE', ['PoetrySlams.drafts', 'PoetrySlams'], async (req, next) => {
    const { ID } = req.data;
    const result = await calculatePoetrySlamData(ID, req);
    if (result) {
      req.data.freeVisitorSeats = result.freeVisitorSeats;
      req.data.status_code = result.status_code;
    }

    return next();
  });

  srv.before('DELETE', 'PoetrySlams', async (req) => {
    // In req.subject, the poetry slam that is to be deleted is already included as condition
    const poetrySlam = await SELECT.one
      .from(req.subject)
      .columns('status_code', 'number');

    if (
      poetrySlam.status_code !== poetrySlamStatusCode.inPreparation &&
      poetrySlam.status_code !== poetrySlamStatusCode.canceled
    ) {
      req.error(httpCodes.bad_request, 'POETRYSLAM_COULD_NOT_BE_DELETED', [
        poetrySlam.number
      ]);
    }
  });

  // Expand poetry slams
  srv.on('READ', ['PoetrySlams.drafts', 'PoetrySlams'], async (req, next) => {
    // Read the PoetrySlams instances
    let poetrySlams = await next();

    // In this method we enrich the data from the database by external data and calculated fields
    // In case none of these enriched fields are requested, we do not need to read from the external services
    // So we first check if the requested columns contain any of the enriched columns and return if not
    const requestedColumns = req.query.SELECT.columns?.map((item) =>
      Array.isArray(item.ref) ? item.ref[0] : item.as
    );
    const enrichedFields = [
      'projectSystemName',
      'purchaseOrderSystemName',
      'processingStatusText',
      'projectProfileCodeText',
      'createByDProjectEnabled',
      'createS4HCProjectEnabled',
      'createB1PurchaseOrderEnabled',
      'isByD',
      'isS4HC',
      'isB1',
      'toByDProject',
      'toS4HCProject',
      'toB1PurchaseOrder',
      'isJobStatusShown'
    ];

    if (
      requestedColumns &&
      !enrichedFields.some((item) => requestedColumns?.includes(item))
    ) {
      return poetrySlams;
    }

    // The requested columns include some of the enriched fields so we do add the corresponding data

    // SAP Business ByDesign
    // Check and read SAP Business ByDesign project related data
    const connectorByD = await ConnectorByD.createConnectorInstance(req);
    if (connectorByD?.isConnected()) {
      poetrySlams = await connectorByD.readProject(poetrySlams);
    }

    // SAP S/4HANA Cloud
    // Check and read SAP S/4HANA Cloud project related data
    const connectorS4HC = await ConnectorS4HC.createConnectorInstance(req);
    if (connectorS4HC?.isConnected()) {
      poetrySlams = await connectorS4HC.readProject(poetrySlams);
    }

    // SAP Business One
    // Check and read SAP Business One purchase order data
    const connectorB1 = await ConnectorB1.createConnectorInstance(req);
    if (connectorB1?.isConnected()) {
      poetrySlams = await connectorB1.readPurchaseOrder(poetrySlams);
    }

    for (const poetrySlam of convertToArray(poetrySlams)) {
      [
        'projectSystemName',
        'processingStatusText',
        'projectProfileCodeText',
        'purchaseOrderSystemName'
      ].forEach((item) => {
        poetrySlam[item] = poetrySlam[item] || '';
      });

      // Update project system name and visibility of the "Create Project"-buttons
      if (poetrySlam.projectID) {
        const systemNames = {
          ByD: connectorByD.getSystemName(),
          S4HC: connectorS4HC.getSystemName()
        };
        poetrySlam.createByDProjectEnabled = false;
        poetrySlam.createS4HCProjectEnabled = false;
        poetrySlam.projectSystemName = systemNames[poetrySlam.projectSystem];
      } else {
        poetrySlam.createByDProjectEnabled = connectorByD.isConnected();
        poetrySlam.createS4HCProjectEnabled = connectorS4HC.isConnected();
      }

      // Update PO system name and visibility of the "Create Purchase Order"-button
      if (poetrySlam.purchaseOrderID) {
        poetrySlam.createB1PurchaseOrderEnabled = false;
        poetrySlam.purchaseOrderSystemName = connectorB1.getSystemName();
      } else {
        poetrySlam.createB1PurchaseOrderEnabled = connectorB1.isConnected();
      }

      // Update the backend system connected indicator used in UI for controlling visibility of UI elements
      poetrySlam.isByD = connectorByD.isConnected();
      poetrySlam.isS4HC = connectorS4HC.isConnected();
      poetrySlam.isB1 = connectorB1.isConnected();

      // Initialize the associations
      poetrySlam.toByDProject = poetrySlam.toByDProject || null;
      poetrySlam.toB1PurchaseOrder = poetrySlam.toB1PurchaseOrder || null;
      poetrySlam.toS4HCProject = poetrySlam.toS4HCProject || null;

      // Display information about background execution
      if (poetrySlam.jobStatusText !== 'Job not triggered yet') {
        poetrySlam.isJobStatusShown = true;
      } else {
        poetrySlam.isJobStatusShown = false;
      }
    }

    // Return remote data
    return poetrySlams;
  });

  // Apply a colour code based on the poetry slam status
  srv.after('READ', ['PoetrySlams.drafts', 'PoetrySlams'], (data) => {
    for (const poetrySlam of convertToArray(data)) {
      const status = poetrySlam.status?.code || poetrySlam.status_code;
      // Set status colour code
      switch (status) {
        case poetrySlamStatusCode.inPreparation:
          poetrySlam.statusCriticality = color.grey; // New poetry slams are grey
          break;
        case poetrySlamStatusCode.published:
          poetrySlam.statusCriticality = color.green; // Published poetry slams are green
          break;
        case poetrySlamStatusCode.booked:
          poetrySlam.statusCriticality = color.yellow; // Fully booked poetry slams are yellow
          break;
        case poetrySlamStatusCode.canceled:
          poetrySlam.statusCriticality = color.red; // Canceled poetry slams are red
          break;
        default:
          poetrySlam.statusCriticality = null;
      }
    }
  });

  // ----------------------------------------------------------------------------
  // Implementation of entity actions (entity PoetrySlams)
  // ----------------------------------------------------------------------------

  // Entity action "cancel": Set the status of poetry slam to canceled
  // Note: Our entity action "cancel" is different from the core service "CANCEL"
  // Actions are not mass enabled in service, only on UI; they are handled in a batch mode;
  srv.on('cancel', async (req) => {
    const id = req.params[req.params.length - 1].ID; // Depending on the UI, the request can contain several IDs, e.g. /PoetrySlams(ID1)/Visits(ID2) would contain two IDs, /Visits(ID1) will contain only one. However, the last ID is always the ID of the Visit
    const poetrySlam = await SELECT.one
      .from('PoetrySlamService.PoetrySlams')
      .columns('ID', 'status_code', 'number')
      .where({ ID: id });

    // If poetry slam was not found, throw an error
    if (!poetrySlam) {
      req.error(httpCodes.bad_request, 'POETRYSLAM_NOT_FOUND', [id]);
      return;
    }

    if (poetrySlam.status_code === poetrySlamStatusCode.inPreparation) {
      // Poetry slams that are in preperation shall be deleted
      req.info(httpCodes.ok, 'ACTION_CANCEL_IN_PREPARATION', [
        poetrySlam.number
      ]);
      return poetrySlam;
    }

    poetrySlam.status_code = poetrySlamStatusCode.canceled;

    const success = await updatePoetrySlam(
      id,
      poetrySlam.status_code,
      null,
      req,
      { text: 'ACTION_CANCEL_NOT_POSSIBLE', param: poetrySlam.number },
      { text: 'ACTION_CANCEL_SUCCESS', param: poetrySlam.number }
    );

    return success ? poetrySlam : {}; // Return the changed poetry slam
  });

  // Entity action "publish": Set the status of poetry slam to published
  // Actions are not mass enabled in service, only on UI; they are handled in a batch mode;
  srv.on('publish', async (req) => {
    const id = req.params[req.params.length - 1].ID;
    // Allow action for active entity instances only (draft events cannot be published)
    const poetrySlam = await SELECT.one
      .from('PoetrySlamService.PoetrySlams')
      .columns('ID', 'status_code', 'number')
      .where({ ID: id });

    // If poetry slam was not found, throw an error
    if (!poetrySlam) {
      req.error(httpCodes.bad_request, 'POETRYSLAM_NOT_FOUND', [id]);
      return;
    }

    if (
      poetrySlam.status_code === poetrySlamStatusCode.booked ||
      poetrySlam.status_code === poetrySlamStatusCode.published
    ) {
      req.info(httpCodes.ok, 'ACTION_PUBLISHED_ALREADY', [poetrySlam.number]);
      return poetrySlam;
    }

    // For canceled poetry slams that are re-published a recalculation of free visitor seats is required
    const data = await calculatePoetrySlamData(id, req);
    poetrySlam.status_code =
      data.freeVisitorSeats > 0
        ? poetrySlamStatusCode.published
        : poetrySlamStatusCode.booked;

    // Update status
    const success = await updatePoetrySlam(
      id,
      poetrySlam.status_code,
      null,
      req,
      { text: 'ACTION_PUBLISH_NOT_POSSIBLE', param: poetrySlam.number },
      { text: 'ACTION_PUBLISH_SUCCESS', param: poetrySlam.number }
    );

    return success ? poetrySlam : {}; // Return the changed poetry slam
  });

  // Entity action: Clear project data
  srv.on('clearProjectData', async (req) => {
    const poetrySlamID = req.params[req.params.length - 1].ID;

    // Allow action for active entity instances only
    const poetrySlam = await SELECT.one
      .from('PoetrySlamService.PoetrySlams')
      .columns('ID', 'number')
      .where({ ID: poetrySlamID });

    // If poetry slam was not found, throw an error
    if (!poetrySlam) {
      req.error(httpCodes.bad_request, 'POETRYSLAM_NOT_FOUND', [poetrySlamID]);
      return;
    }

    // Remove all project data
    const updateValues = {
      projectID: null,
      projectObjectID: null,
      projectURL: null,
      projectSystem: null
    };

    const result = await UPDATE(`PoetrySlamService.PoetrySlams`)
      .set(updateValues)
      .where({ ID: poetrySlamID });

    if (result !== 1) {
      req.error(
        httpCodes.internal_server_error,
        'POETRYSLAM_COULD_NOT_BE_UPDATED',
        [poetrySlam.number]
      );
    }
  });

  // Entity action: clear purchase order data
  srv.on('clearPurchaseOrderData', async (req) => {
    const poetrySlamID = req.params[req.params.length - 1].ID;

    // Allow action for active entity instances only
    const poetrySlam = await SELECT.one
      .from('PoetrySlamService.PoetrySlams')
      .columns('ID', 'number')
      .where({ ID: poetrySlamID });

    // If poetry slam was not found, throw an error
    if (!poetrySlam) {
      req.error(httpCodes.bad_request, 'POETRYSLAM_NOT_FOUND', [poetrySlamID]);
      return;
    }

    // Remove all purchase order data
    const updateValues = {
      purchaseOrderID: null,
      purchaseOrderObjectID: null,
      purchaseOrderURL: null,
      purchaseOrderSystem: null
    };

    const result = await UPDATE(`PoetrySlamService.PoetrySlams`)
      .set(updateValues)
      .where({ ID: poetrySlamID });

    if (result !== 1) {
      req.error(
        httpCodes.internal_server_error,
        'POETRYSLAM_COULD_NOT_BE_UPDATED',
        [poetrySlam.number]
      );
    }
  });

  // ----------------------------------------------------------------------------
  // Implementation of entity events (entity PoetrySlams)
  // with impact on remote services of SAP Business ByDesign
  // ----------------------------------------------------------------------------

  // Entity action: Create SAP Business ByDesign Project
  srv.on('createByDProject', async (req) => {
    await createProject(
      req,
      srv,
      ConnectorByD,
      'ACTION_CREATE_PROJECT_NO_SAP_BUSINESS_BY_DESIGN_SYSTEM'
    );
  });

  // ----------------------------------------------------------------------------
  // Implementation of entity events (entity PoetrySlams)
  // with impact on remote services of SAP S/4HANA Cloud
  // ----------------------------------------------------------------------------

  // Entity action: Create SAP S/4HANA Cloud Enterprise Project
  srv.on('createS4HCProject', async (req) => {
    await createProject(
      req,
      srv,
      ConnectorS4HC,
      'ACTION_CREATE_PROJECT_NO_S4_HANA_CLOUD_SYSTEM'
    );
  });

  // ----------------------------------------------------------------------------
  // Implementation of entity events (entity PoetrySlams)
  // with impact on remote services of SAP Business One
  // ----------------------------------------------------------------------------

  // Entity action: Create SAP Business One Purchase Order
  srv.on('createB1PurchaseOrder', async (req) => {
    await createPurchaseOrder(
      req,
      srv,
      ConnectorB1,
      'ACTION_CREATE_PURCHASE_ORDER_NO_B1_SYSTEM'
    );
  });

  // Entity action: Create a poetry slam with generative artifical intelligence
  srv.on('createWithAI', async (req) => {
    // GenAI constructor is synchronous
    // It returns a promise as soon as it is resolved the instance can be used
    const genAI = new GenAI();

    await genAI.initializeModels();

    // Check if the deployment does already exist if not create one
    if (!(await genAI.checkAndCreateDeployment(req))) {
      return;
    }

    const response = await genAI.callAI(
      req.data.tags,
      req.data.language,
      req.data.rhyme,
      req
    );

    const poetrySlamDraft = await GenAI.createPoetrySlamWithAI(
      response,
      req,
      srv,
      db
    );
    return poetrySlamDraft;
  });

  // ----------------------------------------------------------------------------
  // Implementation of reuse functions
  // ----------------------------------------------------------------------------

  // Initialize max visitor number, free visitor seats and booked seats
  function initializePoetrySlam(req) {
    req.data.freeVisitorSeats = req.data.maxVisitorsNumber =
      req.data.maxVisitorsNumber ?? 0;
    req.data.bookedSeats = 0;
  }
};
