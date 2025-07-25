'strict';

const cds = require('@sap/cds');
const { expect } = cds.test(__dirname + '/../../..');

const ServiceCredentials = require('../../../srv/lib/serviceCredentials');

// Test data
const credMock = { myData: 'myValue' };
const credMockFull = [{ credentials: credMock }];
const tokenMock = { data: { access_token: 'test token' } };
const urisMock = ['UnitTestApplURL'];

describe('Util ServiceCredentials', () => {
  const originalEnv = process.env;

  // Add a mocked service binding
  function addMockServiceToEnv() {
    process.env.VCAP_SERVICES = JSON.stringify({
      mockService: credMockFull,
      ...JSON.parse(process.env.VCAP_SERVICES || '{}')
    });
  }

  // Add a mocked application binding
  function addMockApplicationToEnv() {
    const existingApp = JSON.parse(process.env.VCAP_APPLICATION || '{}');
    process.env.VCAP_APPLICATION = JSON.stringify({
      ...existingApp,
      uris: urisMock
    });
  }
  afterEach(() => {
    process.env = originalEnv;
  });

  // Actual tests
  it('should not return credentials if there is no binding', async () => {
    const cred = ServiceCredentials.getServiceCredentials('mockService');
    expect(cred).to.undefined;
  });

  it('should return credentials if there is a binding', async () => {
    addMockServiceToEnv();

    const cred = ServiceCredentials.getServiceCredentials('mockService');
    expect(cred).to.eql(credMock);
  });

  it('should throw an error when retrieving a token for a service without binding', async () => {
    await expect(ServiceCredentials.getServiceToken('mockService')).rejected;
  });

  it('should return a tenant-specfic token (and fail if tenant ID is missing)', async () => {
    addMockServiceToEnv();
    process.env.test_tenant_id = 'UnitTest-TenantId';

    // Success case
    const token = await ServiceCredentials.getServiceToken(
      'mockService',
      'UnitTest-TenantId',
      true,
      () => Promise.resolve(tokenMock)
    );
    expect(token).eql('test token');

    // Error case: tenantId missing for consumer-specific token request
    delete process.env.test_tenant_id;
    await expect(
      ServiceCredentials.getServiceToken('mockService', null, true, () =>
        Promise.resolve(tokenMock)
      )
    ).rejected;
  });

  it('should not get tenant-specfic token of another consumer', async () => {
    addMockServiceToEnv();
    process.env.test_tenant_id = 'UnitTest-TenantId';

    // Error case: consumer tenant try to get credentials from other consumer
    await expect(
      ServiceCredentials.getServiceToken(
        'mockService',
        'UnitTest-TenantId2',
        true,
        () => Promise.resolve(tokenMock)
      )
    ).rejected;
  });

  it('should return a tenant-independent token', async () => {
    addMockServiceToEnv();

    const token = await ServiceCredentials.getServiceToken(
      'mockService',
      'UnitTest-TenantId',
      false,
      () => Promise.resolve(tokenMock)
    );
    expect(token).eql('test token');
  });

  it('should fail if no token is returned from auth service', async () => {
    addMockServiceToEnv();

    await expect(
      ServiceCredentials.getServiceToken('mockService', null, false, () =>
        Promise.resolve({ data: 'UnitTest: some response without token' })
      )
    ).rejected;
  });

  it('should return application URL', async () => {
    addMockApplicationToEnv();
    const applUrl = ServiceCredentials.getAppUrl();
    expect(applUrl).eql('https://' + urisMock);
  });
});
