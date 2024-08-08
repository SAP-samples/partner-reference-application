'strict';

// Include utility files
const codes = require('./util/codes');
const {
  calculatePoetrySlamData,
  updatePoetrySlam,
  convertToArray,
  createProject,
  createPurchaseOrder
} = require('./util/entityCalculations');

const uniqueNumberGenerator = require('./util/uniqueNumberGenerator');

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
  srv.before('CREATE', 'PoetrySlams.drafts', async (req) =>
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
      req.error(500, 'NO_POETRYSLAM_NUMBER', [error.message]);
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

    // Remove all project data if the project id is cleared
    if (req.data.projectID === '') {
      req.data.projectID = null;
      req.data.projectObjectID = null;
      req.data.projectURL = null;
      req.data.projectSystem = null;
      req.data.projectSystemName = null;
    }

    // Remove all purchase order data if the purchase order id is cleared
    if (req.data.purchaseOrderID === '') {
      req.data.purchaseOrderID = null;
      req.data.purchaseOrderObjectID = null;
      req.data.purchaseOrderURL = null;
      req.data.purchaseOrderSystem = null;
      req.data.purchaseOrderSystemName = null;
    }

    return next();
  });

  srv.before('DELETE', 'PoetrySlams', async (req) => {
    // In req.subject, the poetry slam that is to be deleted is already included as condition
    const poetrySlam = await SELECT.one
      .from(req.subject)
      .columns('status_code', 'number');

    if (
      poetrySlam.status_code !== codes.poetrySlamStatusCode.inPreparation &&
      poetrySlam.status_code !== codes.poetrySlamStatusCode.canceled
    ) {
      req.error(400, 'POETRYSLAM_COULD_NOT_BE_DELETED', [poetrySlam.number]);
    }
  });

  // Expand poetry slams
  srv.on('READ', ['PoetrySlams.drafts', 'PoetrySlams'], async (req, next) => {
    // Read the PoetrySlams instances
    let poetrySlams = await next();

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
        'projectProfileCodeText'
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
        case codes.poetrySlamStatusCode.inPreparation:
          poetrySlam.statusCriticality = codes.color.grey; // New poetry slams are grey
          break;
        case codes.poetrySlamStatusCode.published:
          poetrySlam.statusCriticality = codes.color.green; // Published poetry slams are green
          break;
        case codes.poetrySlamStatusCode.booked:
          poetrySlam.statusCriticality = codes.color.yellow; // Fully booked poetry slams are yellow
          break;
        case codes.poetrySlamStatusCode.canceled:
          poetrySlam.statusCriticality = codes.color.red; // Canceled poetry slams are red
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
      req.error(400, 'POETRYSLAM_NOT_FOUND', [id]);
      return;
    }

    if (poetrySlam.status_code === codes.poetrySlamStatusCode.inPreparation) {
      // Poetry slams that are in preperation shall be deleted
      req.info(200, 'ACTION_CANCEL_IN_PREPARATION', [poetrySlam.number]);
      return poetrySlam;
    }

    poetrySlam.status_code = codes.poetrySlamStatusCode.canceled;

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
      req.error(400, 'POETRYSLAM_NOT_FOUND', [id]);
      return;
    }

    if (
      poetrySlam.status_code === codes.poetrySlamStatusCode.booked ||
      poetrySlam.status_code === codes.poetrySlamStatusCode.published
    ) {
      req.info(200, 'ACTION_PUBLISHED_ALREADY', [poetrySlam.number]);
      return poetrySlam;
    }

    // For canceled poetry slams that are re-published a recalculation of free visitor seats is required
    const data = await calculatePoetrySlamData(id, req);
    poetrySlam.status_code =
      data.freeVisitorSeats > 0
        ? codes.poetrySlamStatusCode.published
        : codes.poetrySlamStatusCode.booked;

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
