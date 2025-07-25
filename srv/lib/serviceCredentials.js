'use strict';
const cds = require('@sap/cds');

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
  try {
    // The header attribute 'X-Zid' is set to the consumer tenant id, this retrieves a consumer-specific JWT (if requested)
    const authorization = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64'
    );
    const response = await executeHttpRequest(
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
    return response;
  } catch (error) {
    console.error('Error receiving JWT token:', error.message);
  }
}

// The parameter getToken is used for unit tests and allows a dependency injection; by default the internal implementation _getToken() is used
async function getServiceToken(
  serviceName,
  inTenantId,
  isConsumerSpecific = true,
  getToken = _getToken
) {
  const srvCredentials = getServiceCredentials(serviceName);
  if (!srvCredentials) {
    console.error(`Missing binding credentials for service "${serviceName}"`);
    throw new Error(`Missing binding credentials for service "${serviceName}"`);
  }

  const tenantId =
    inTenantId || cds.context?.tenant || process.env['test_tenant_id'];
  const clientId = srvCredentials?.uaa?.clientid || srvCredentials?.clientid;
  const clientSecret =
    srvCredentials?.uaa?.clientsecret || srvCredentials?.clientsecret;
  const authUrl = srvCredentials?.uaa?.url || srvCredentials?.url;

  if (isConsumerSpecific && !tenantId) {
    console.error(
      'Util ServiceCredentials - getServiceToken: tenantId missing for consumer-specific token request'
    );
    throw new Error(
      `Tenant ID missing during token retrieval for bound service "${serviceName}"`
    );
  }

  // Security check: A consumer tenant must not receive the token of another consumer tenant
  if (tenantId) {
    const providerTenantID = getServiceCredentials('xsuaa')?.tenantid;
    let currentTenantID = cds.context?.tenant || process.env['test_tenant_id'];
    if (providerTenantID !== currentTenantID && currentTenantID !== tenantId) {
      const errorMessage =
        'Util ServiceCredentials - getServiceToken: action not allowed for consumer tenant';
      console.error(errorMessage);
      throw new Error(
        `Consumer Tenant foreign token retrieval not allowed "${serviceName}"`
      );
    }
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

function getAppUrl() {
  //Get service module app URL
  let appUrl = 'Application URL could not be determined';

  if (process.env.VCAP_APPLICATION) {
    // Parse VCAP_APPLICATION environment variable
    const vcapApplication = JSON.parse(process.env.VCAP_APPLICATION);
    const uris = vcapApplication.uris;
    if (uris && uris.length > 0) {
      appUrl = `https://${uris[0]}`;
    }
  }
  return appUrl;
}

// Publish constants and functions
module.exports = {
  getServiceCredentials,
  getServiceToken,
  getAppUrl
};
