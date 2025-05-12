'use strict';

const cds = require('@sap/cds');
const { expect } = cds.test(__dirname + '/../../..');
const sinon = require('sinon');
const serviceCredentials = require('../../../srv/lib/serviceCredentials');
const TenantManager = require('../../../srv/lib/tenantManager');

describe('TenantManager Class', () => {
  let serviceCredentialsStub;
  let errorLogStub;
  let originalEnv;
  let mockTenants;

  beforeEach(() => {
    // Store original environment variables to restore them after tests
    originalEnv = { ...process.env };
    process.env['test_tenant_id'] = 'mockProviderTenantID';

    mockTenants = [
      { tenantId: 'mockTenantID1' },
      { tenantId: 'mockTenantID2' }
    ];
    // Mocking
    serviceCredentialsStub = sinon
      .stub(serviceCredentials, 'getServiceCredentials')
      .returns({ tenantid: 'mockProviderTenantID' });

    errorLogStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    // Restore the environment variables
    process.env = originalEnv;

    // Restore stubs
    serviceCredentialsStub.restore();
    errorLogStub.restore();
  });

  describe('Constructor', () => {
    it('should throw an error if tenant context is incorrect', () => {
      // Overwrite process.env for test scenario
      process.env['test_tenant_id'] = 'mockDifferentTenantID';

      expect(() => new TenantManager()).to.throw(
        'TenantManager: The tenant context is incorrect. Access denied.'
      );
    });

    it('should not throw an error if tenant context is correct', () => {
      // Overwrite process.env for test scenario
      process.env['test_tenant_id'] = 'mockProviderTenantID';

      expect(() => new TenantManager()).to.not.throw();
    });
  });

  describe('getAllTenants Method', () => {
    describe('Tenant fetch - Successfull', () => {
      let connectStub;

      beforeEach(() => {
        connectStub = sinon.stub(cds.connect, 'to').resolves({
          get: async () => mockTenants
        });
      });

      afterEach(() => {
        connectStub.restore();
      });

      it('should return tenants on successful fetch', async () => {
        const tenantManager = new TenantManager();
        const tenants = await tenantManager.getSubscriberTenantIds();
        expect(connectStub.calledOnce).to.be.true;
        expect(tenants).to.deep.equal(mockTenants);
      });
    });

    describe('Tenant fetch - Failing', () => {
      let connectStub;

      beforeEach(() => {
        connectStub = sinon.stub(cds.connect, 'to').resolves({
          get: sinon.stub()
        });
      });

      afterEach(() => {
        connectStub.restore();
      });

      it('should throw error on failing tenant fetch', async () => {
        const tenantManager = new TenantManager();
        await expect(tenantManager.getSubscriberTenantIds()).to.rejected;
        expect(connectStub.calledOnce).to.be.true;
      });
    });
  });
});
