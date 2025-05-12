'use strict';
const serviceCredentialsUtil = require('./serviceCredentials');
const cds = require('@sap/cds');

class TenantManager {
  constructor() {
    this.providerTenantID =
      serviceCredentialsUtil.getServiceCredentials('xsuaa')?.tenantid;

    // Ensure that this service is only used in the provider context
    const currentTenantID =
      cds.context?.tenant || process.env['test_tenant_id'];

    if (this.providerTenantID !== currentTenantID) {
      const errorMessage =
        'TenantManager: The tenant context is incorrect. Access denied.';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  getProviderTenantId() {
    return this.providerTenantID;
  }

  async getSubscriberTenantIds() {
    try {
      const ssp = await cds.connect.to('cds.xt.SaasProvisioningService');
      const allTenants = await ssp.get('/tenant');

      // Filter out the provider tenant
      const subscribedTenants = allTenants.filter(
        (tenant) => tenant.subscribedTenantId !== this.providerTenantID
      );
      return subscribedTenants;
    } catch (error) {
      console.error('Error fetching tenants:', error);
      throw new Error('Failed to retrieve tenants');
    }
  }
}

module.exports = TenantManager;
