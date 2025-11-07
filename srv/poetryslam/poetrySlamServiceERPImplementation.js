'strict';
// Type definition required for CDSLint
/** @typedef {import('@sap/cds').CRUDEventHandler.On} OnHandler */

// eslint-disable-next-line no-unused-vars
const cds = require('@sap/cds');

// Add connector for project management systems
const ConnectorByD = require('./connector/connectorByD');
const ConnectorS4HC = require('./connector/connectorS4HC');
const ConnectorB1 = require('./connector/connectorB1');

// Type definition required for CDSLint
/** @type {OnHandler} */
module.exports = async (srv) => {
  const { ByDProjects, S4HCProjects, S4HCSalesOrderPartner, B1PurchaseOrder } =
    srv.entities;
  // -------------------------------------------------------------------------------------------------
  // Implementation of remote OData services (back-channel integration with SAP Business ByDesign)
  // -------------------------------------------------------------------------------------------------

  // Delegate OData requests to remote project entities
  srv.on('READ', ByDProjects, async (req) => {
    const connector = await ConnectorByD.createConnectorInstance(req);
    return await connector.delegateODataRequests(
      req,
      ConnectorByD.PROJECT_SERVICE
    );
  });

  // -------------------------------------------------------------------------------------------------
  // Implementation of remote OData services (back-channel integration with SAP S/4HANA Cloud)
  // -------------------------------------------------------------------------------------------------

  // Delegate OData requests to SAP S/4HANA Cloud remote project entities
  srv.on('READ', S4HCProjects, async (req) => {
    const connector = await ConnectorS4HC.createConnectorInstance(req);
    return await connector.delegateODataRequests(
      req,
      ConnectorS4HC.PROJECT_SERVICE
    );
  });

  // Delegate OData requests to SAP S/4HANA Cloud remote sales order entities
  srv.on('READ', S4HCSalesOrderPartner, async (req) => {
    const connector = await ConnectorS4HC.createConnectorInstance(req);
    return await connector.delegateODataRequests(
      req,
      ConnectorS4HC.SALES_ORDER_SERVICE
    );
  });

  // -------------------------------------------------------------------------------------------------
  // Implementation of remote OData services (back-channel integration with SAP Business One)
  // -------------------------------------------------------------------------------------------------

  // Delegate OData requests to SAP Business One remote purchase order entities
  srv.on('READ', B1PurchaseOrder, async (req) => {
    const connector = await ConnectorB1.createConnectorInstance(req);
    return await connector.delegateODataRequests(
      req,
      ConnectorB1.PURCHASE_ORDER_SERVICE
    );
  });
};
