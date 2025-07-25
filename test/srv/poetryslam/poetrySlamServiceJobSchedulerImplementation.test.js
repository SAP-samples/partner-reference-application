const cds = require('@sap/cds');
const { expect, axios, POST } = cds.test(__dirname + '/../../..');
const sinon = require('sinon');
const JobScheduler = require('../../../srv/lib/jobScheduler');
const { httpCodes } = require('../../../srv/lib/codes');

// Executes an action, like 'sendEmail'
const ACTION = (url, name, parameters = {}) =>
  POST(url + `/PoetrySlamService.${name}`, parameters);
// ----------------------------------------------------------------------------
// Tests with user with role assignment PoetrySlamManager
// ----------------------------------------------------------------------------
axios.defaults.auth = { username: 'peter', password: 'welcome' };

describe('sendReminderForPoetrySlam Service Handler', function () {
  let stubSELECT;
  let stubUPDATE;
  let jobSchedulerCreateStub;
  let jobSchedulerStartJobStub;
  let consoleErrorStub;
  let poetrySlamData;
  let id;

  beforeEach(function () {
    id = '79ceab87-300d-4b66-8cc3-f82c679b77a1';
    poetrySlamData = {
      ID: 'mockPoetrySlamID',
      number: 42 // Example number
    };
    // Stubbing SELECT
    stubSELECT = sinon.stub(cds.ql.SELECT, 'one').callsFake(() => ({
      where: sinon.stub().returns(Promise.resolve(poetrySlamData))
    }));

    // Stubbing UPDATE.entity
    stubUPDATE = sinon.stub(cds.ql.UPDATE, 'entity').returns({
      set: function () {
        return this;
      },
      where: function () {
        return 1;
      }
    });

    jobSchedulerStartJobStub = sinon.stub();
    jobSchedulerCreateStub = sinon.stub(JobScheduler, 'create').resolves({
      startJob: jobSchedulerStartJobStub
    });

    // Mocking console.error
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(function () {
    stubSELECT.restore();
    stubUPDATE.restore();
    jobSchedulerCreateStub.restore();
    consoleErrorStub.restore();
  });

  it('should start job successfully and update poetry slam status', async function () {
    process.env['test_tenant_id'] = 'mockTenantID';
    await ACTION(
      `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
      'sendReminderForPoetrySlam'
    );

    delete process.env['test_tenant_id'];
    expect(stubSELECT.calledOnce).to.be.true;
    expect(stubUPDATE.calledOnce).to.be.true;
    expect(jobSchedulerCreateStub.calledOnce).to.be.true;
    expect(jobSchedulerStartJobStub.calledOnce).to.be.true;
    expect(consoleErrorStub.notCalled).to.be.true;
  });

  it('should handle errors gracefully and respond with error', async function () {
    jobSchedulerStartJobStub.rejects(new Error('Job execution error'));
    process.env['test_tenant_id'] = 'mockTenantID';
    await expect(
      ACTION(
        `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
        'sendReminderForPoetrySlam'
      )
    ).to.rejectedWith(httpCodes.internal_server_error.toString());

    delete process.env['test_tenant_id'];

    expect(consoleErrorStub.called).to.be.true;
    expect(stubSELECT.calledOnce).to.be.true;
    expect(jobSchedulerCreateStub.calledOnce).to.be.true;
    expect(jobSchedulerStartJobStub.calledOnce).to.be.true;
    expect(stubUPDATE.calledOnce).to.be.true;
  });
});
