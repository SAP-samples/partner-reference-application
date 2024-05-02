'strict';

// Add connector for project management systems
const ConnectorByD = require('./connector/connectorByD');
const ConnectorS4HC = require('./connector/connectorS4HC');
const ConnectorB1 = require('./connector/connectorB1');

module.exports = async (srv) => {
  // ----------------------------------------------------------------------------
  // Implementation of remote OData services (back-channel integration with SAP Business ByDesign)
  // ----------------------------------------------------------------------------

  // Delegate OData requests to remote project entities
  srv.on(
    ['READ', 'CREATE', 'UPDATE', 'DELETE'],
    ['ByDProjects', 'ByDProjectSummaryTasks', 'ByDProjectTasks'],
    async (req) => {
      const connector = await ConnectorByD.createConnectorInstance(req);
      return await connector.delegateODataRequests(
        req,
        ConnectorByD.PROJECT_SERVICE
      );
    }
  );

  // ----------------------------------------------------------------------------
  // Implementation of remote OData services (back-channel integration with SAP S/4HANA Cloud)
  // ----------------------------------------------------------------------------

  // Delegate OData requests to SAP S/4HANA Cloud remote project entities
  srv.on(
    ['READ', 'CREATE', 'UPDATE', 'DELETE'],
    [
      'S4HCProjects',
      'S4HCEnterpriseProjectElement',
      'S4HCEntProjEntitlement',
      'S4HCEntProjTeamMember'
    ],
    async (req) => {
      const connector = await ConnectorS4HC.createConnectorInstance(req);
      return await connector.delegateODataRequests(
        req,
        ConnectorS4HC.PROJECT_SERVICE
      );
    }
  );
  srv.on('READ', 'S4HCProjectsProcessingStatus', async (req) => {
    const connector = await ConnectorS4HC.createConnectorInstance(req);
    return await connector.delegateODataRequests(
      req,
      ConnectorS4HC.PROCESSING_STATUS_SERVICE
    );
  });
  srv.on('READ', 'S4HCProjectsProjectProfileCode', async (req) => {
    const connector = await ConnectorS4HC.createConnectorInstance(req);
    return await connector.delegateODataRequests(
      req,
      ConnectorS4HC.PROFILE_CODE_SERVICE
    );
  });

  // ----------------------------------------------------------------------------
  // Implementation of remote OData services (back-channel integration with SAP Business One)
  // ----------------------------------------------------------------------------

  // Delegate OData requests to SAP Business One remote purchase order entities
  srv.on(
    ['READ', 'CREATE', 'UPDATE', 'DELETE'],
    'B1PurchaseOrder',
    async (req) => {
      const connector = await ConnectorB1.createConnectorInstance(req);
      return await connector.delegateODataRequests(
        req,
        ConnectorB1.PURCHASE_ORDER_SERVICE
      );
    }
  );
};
