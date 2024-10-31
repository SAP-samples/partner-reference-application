'use strict';

// Include SAP Cloud SDK reuse functions
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');

// ----------------------------------------------------------------------------
//  Read the binding information
// ----------------------------------------------------------------------------
function getServiceCredentials(serviceName) {
  const vcap = JSON.parse(process.env['VCAP_SERVICES'] || '{}');
  return (vcap[serviceName] || [])[0]?.credentials;
}

// ----------------------------------------------------------------------------
//  Get a JWT using the binding information
// ----------------------------------------------------------------------------

// _getToken() retrieves a token from the bound service
// It is only called from function getServiceToken(), for UnitTests it can be replaced by dependency injection (see parameters of getServiceToken())
async function _getToken(
  authUrl,
  clientId,
  clientSecret,
  isConsumerSpecific,
  tenantId
) {
  // The header attribute 'X-Zid' is set to the consumer tenant id, this retrieves a consumer-specific JWT (if requested)
  const authorization = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64'
  );
  return await executeHttpRequest(
    {
      url: `${authUrl}/oauth/token?grant_type=client_credentials`
    },
    {
      method: 'GET',
      headers: {
        Authorization: `Basic ${authorization}`,
        ...(isConsumerSpecific && { 'X-Zid': tenantId })
      }
    }
  );
}

// The parameter getToken is used for unit tests and allows a dependency injection; by default the internal implementation _getToken() is used
async function getServiceToken(
  serviceName,
  isConsumerSpecific = true,
  getToken = _getToken
) {
  const srvCredentials = getServiceCredentials(serviceName);
  if (!srvCredentials) {
    throw new Error(`Missing binding credentials for service "${serviceName}"`);
  }

  const clientId = srvCredentials?.uaa?.clientid;
  const clientSecret = srvCredentials?.uaa?.clientsecret;
  const authUrl = srvCredentials?.uaa?.url;

  const tenantId = cds.context?.tenant || process.env['test_tenant_id'];
  if (isConsumerSpecific && !tenantId) {
    console.error(
      'Util ServiceCredentials - getServiceToken: tenantId missing for consumer-specific token request'
    );
    throw new Error(
      `Tenant ID missing during token retrieval for bound service "${serviceName}"`
    );
  }

  const responseGetToken = await getToken(
    authUrl,
    clientId,
    clientSecret,
    isConsumerSpecific,
    tenantId
  );
  const jwt = responseGetToken?.data?.access_token;

  if (!jwt) {
    console.error(
      'Util ServiceCredentials - getServiceToken: empty token from service',
      serviceName
    );
    throw new Error(
      `Empty JWT returned from authorization service for bound service "${serviceName}"`
    );
  }

  return jwt;
}

// Publish constants and functions
module.exports = {
  getServiceCredentials,
  getServiceToken
};
