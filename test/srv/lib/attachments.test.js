'use strict';

// Adds cds module
const cds = require('@sap/cds');
// Defines required CDS functions for testing
const { expect, POST, axios, test } = cds.test(__dirname + '/../../..');

// Add modules to allow mocking
const sinon = require('sinon');
const Attachments = require('../../../srv/lib/attachments');
const fs = require('fs');
const path = require('path');

// Authentication for tests; role PoetrySlamManager
axios.defaults.auth = { username: 'peter', password: 'welcome' };

describe('Util Attachments', () => {
  before(async () => {
    await test.data.reset();
    await POST(`/odata/v4/poetryslamservice/createTestData`);
  });

  describe('handleAttachmentTestData', () => {
    let poetrySlamIds,
      req,
      db,
      stubBuffer,
      stubSELECTOne,
      stubFs,
      stubPathJoin,
      stubConsoleError,
      stubI18n,
      stubCdsEnv,
      stubRun,
      attachments;

    beforeEach(function () {
      // Create stubs
      stubBuffer = sinon.stub(Buffer, 'from').returns({
        toString: () => 'Mocked Base64 encoded PDF'
      });
      stubFs = sinon.stub(fs, 'readFileSync').returns('Mocked file bytes');
      stubPathJoin = sinon.stub(path, 'join').returns('/mocked/path.pdf');
      stubConsoleError = sinon.stub(console, 'error');
      stubCdsEnv = sinon.stub(cds, 'env').value({
        requires: {
          sdm: {
            credentials: { key: 'value' }
          }
        }
      });
      stubI18n = sinon.stub(cds, 'i18n').value({
        labels: { at: sinon.stub().returns('Mocked i18n text') }
      });

      req = {
        error: sinon.stub().throws(new Error('Mocked request error')),
        info: sinon.stub(),
        user: {
          authInfo: {
            token: {
              xsSystemAttributes: {
                'xs.rolecollections': [
                  'PoetrySlamDocumentManagementRoleCollection'
                ]
              }
            }
          }
        }
      };

      const poetrySlamId = '79ceab87-300d-4b66-8cc3-f82c679b77a2';
      poetrySlamIds = [poetrySlamId];
    });

    afterEach(function () {
      // Restore stubs
      stubBuffer.restore();
      stubSELECTOne.restore();
      stubFs.restore();
      stubConsoleError.restore();
      stubCdsEnv.restore();
      stubPathJoin.restore();
      stubI18n.restore();
      sinon.restore();
    });

    it('should handle attachment test data', async function () {
      db = {
        run: sinon.stub()
      };
      sinon.stub(cds, 'context').value({
        locale: 'en'
      });
      stubSELECTOne = sinon.stub(SELECT.one, 'from').returns({
        where: () => {
          return {
            ID: 'Mocked Poetry Slam'
          };
        }
      });

      attachments = new Attachments(req, db, poetrySlamIds);

      await attachments.handleAttachmentTestData();
      sinon.assert.calledOnce(stubBuffer);
      sinon.assert.calledOnce(stubSELECTOne);
      sinon.assert.calledOnce(stubFs);
      sinon.assert.calledOnce(stubPathJoin);
    });

    it('should throw error caused by database when handling attachment test data', async function () {
      stubRun = sinon.stub().throws(new Error('Mocked DB error'));
      db = {
        run: stubRun
      };
      stubSELECTOne = sinon.stub(SELECT.one, 'from').returns({
        where: () => {
          return {
            ID: 'Mocked Poetry Slam'
          };
        }
      });

      attachments = new Attachments(req, db, poetrySlamIds);

      await expect(attachments.handleAttachmentTestData()).to.rejectedWith(
        'Mocked request error'
      );
      sinon.assert.calledOnce(stubConsoleError);
      sinon.assert.calledOnce(req.error);
      sinon.assert.calledOnce(stubRun);
    });

    it('should throw error caused by missing Poetry Slam when handling attachment test data', async function () {
      db = {
        run: sinon.stub()
      };
      stubSELECTOne = sinon.stub(SELECT.one, 'from').returns({
        where: () => null
      });

      attachments = new Attachments(req, db, poetrySlamIds);

      await expect(attachments.handleAttachmentTestData()).to.rejectedWith(
        'Mocked request error'
      );
      sinon.assert.calledTwice(stubConsoleError);
      sinon.assert.calledTwice(req.error);
    });
  });
});
