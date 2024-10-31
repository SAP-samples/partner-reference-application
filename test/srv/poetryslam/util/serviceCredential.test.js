'strict';

const cds = require('@sap/cds');
const { expect } = cds.test(__dirname + '/../../../..');

const serviceCredentials = require('../../../../srv/poetryslam/util/serviceCredentials');

// Test data
const credMock = { myData: 'myValue' };
const credMockFull = [{ credentials: credMock }];
const tokenMock = { data: { access_token: 'test token' } };

describe('Util serviceCredentials', () => {
  const originalEnv = process.env;

  // Add a mocked service binding
  function addMockServiceToEnv() {
    process.env.VCAP_SERVICES = JSON.stringify({
      mockService: credMockFull,
      ...JSON.parse(process.env.VCAP_SERVICES || '{}')
    });
  }

  afterEach(() => {
    process.env = originalEnv;
  });

  // Actual tests
  it('should not return credentials if there is no binding', async () => {
    const cred = serviceCredentials.getServiceCredentials('mockService');
    expect(cred).to.undefined;
  });

  it('should return credentials if there is a binding', async () => {
    addMockServiceToEnv();

    const cred = serviceCredentials.getServiceCredentials('mockService');
    expect(cred).to.eql(credMock);
  });

  it('should throw an error when retrieving a token for a service without binding', async () => {
    await expect(serviceCredentials.getServiceToken('mockService')).rejected;
  });

  it('should return a tenant-specfic token (and fail if tenant ID is missing)', async () => {
    addMockServiceToEnv();
    process.env.test_tenant_id = 'UnitTest-TenantId';

    const token = await serviceCredentials.getServiceToken(
      'mockService',
      true,
      () => Promise.resolve(tokenMock)
    );
    expect(token).eql('test token');

    delete process.env.test_tenant_id;
    await expect(serviceCredentials.getServiceToken('mockService'), true, () =>
      Promise.resolve(tokenMock)
    ).rejected;
  });

  it('should return a tenant-independent token', async () => {
    addMockServiceToEnv();

    const token = await serviceCredentials.getServiceToken(
      'mockService',
      false,
      () => Promise.resolve(tokenMock)
    );
    expect(token).eql('test token');
  });

  it('should fail if no token is returned from auth service', async () => {
    addMockServiceToEnv();

    await expect(serviceCredentials.getServiceToken('mockService'), false, () =>
      Promise.resolve({ data: 'UnitTest: some response without token' })
    ).rejected;
  });
});
