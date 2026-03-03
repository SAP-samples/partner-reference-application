'use strict';

const cds = require('@sap/cds');
const sinon = require('sinon');
const { expect } = cds.test(__dirname + '/../../..');
const GenAI = require('../../../srv/lib/genAI');

describe('GenAI', () => {
  let genAIInstance;
  let req;

  beforeEach(async () => {
    genAIInstance = await GenAI.init();
    req = {
      error: sinon.stub(),
      info: sinon.stub()
    };
  });

  describe('callOrchestrationChatCompletion', () => {
    it('should return error for invalid parameters', async () => {
      await genAIInstance.callOrchestrationChatCompletion(123, 'de', true, req);
      expect(req.error.calledOnce).to.be.true;

      await genAIInstance.callOrchestrationChatCompletion('tags', 1, true, req);
      expect(req.error.calledTwice).to.be.true;

      await genAIInstance.callOrchestrationChatCompletion(
        'tags',
        'de',
        'true',
        req
      );
      expect(req.error.calledThrice).to.be.true;
    });

    it('should return error for missing tags or language', async () => {
      let response = await genAIInstance.callOrchestrationChatCompletion(
        '',
        'de',
        true,
        req
      );
      expect(req.error.calledOnce).to.be.true;
      expect(response).to.be.null;

      response = await genAIInstance.callOrchestrationChatCompletion(
        ' ',
        'de',
        true,
        req
      );
      expect(req.error.calledTwice).to.be.true;
      expect(response).to.be.null;

      response = await genAIInstance.callOrchestrationChatCompletion(
        'tags',
        '',
        true,
        req
      );
      expect(req.error.calledThrice).to.be.true;
      expect(response).to.be.null;
    });

    it('should call orchestrationClient and return responseObject', async () => {
      const orchestrationClientMock = {
        chatCompletion: sinon.stub().resolves({
          getTokenUsage: () => ({
            total_tokens: 10,
            prompt_tokens: 5,
            completion_tokens: 5
          }),
          getContent: () =>
            JSON.stringify({ title: 'Titel', description: 'Description' })
        })
      };

      sinon
        .stub(genAIInstance, 'getOrchestrationClient')
        .resolves(orchestrationClientMock);

      const result = await genAIInstance.callOrchestrationChatCompletion(
        'tags',
        'EN',
        true,
        req
      );
      expect(result).to.deep.equal({
        title: 'Titel',
        description: 'Description'
      });

      genAIInstance.getOrchestrationClient.restore();
    });

    it('should handle invalid AI response format', async () => {
      const orchestrationClientMock = {
        chatCompletion: sinon.stub().resolves({
          getTokenUsage: () => ({}),
          getContent: () => JSON.stringify({ wrong: 'data' })
        })
      };
      sinon
        .stub(genAIInstance, 'getOrchestrationClient')
        .resolves(orchestrationClientMock);
      const result = await genAIInstance.callOrchestrationChatCompletion(
        'tags',
        'de',
        true,
        req
      );
      expect(req.error.calledOnce).to.be.true;
      expect(result).to.deep.equal({ title: '', description: '' });
      genAIInstance.getOrchestrationClient.restore();
    });

    it('should handle generic orchestration client errors', async () => {
      const orchestrationClientMock = {
        chatCompletion: sinon.stub().rejects(new Error('Orchestration error'))
      };
      sinon
        .stub(genAIInstance, 'getOrchestrationClient')
        .resolves(orchestrationClientMock);
      const result = await genAIInstance.callOrchestrationChatCompletion(
        'tags',
        'en',
        true,
        req
      );
      expect(req.error.calledOnce).to.be.true;
      expect(req.error.args[0][0]).to.be.equal(500);
      expect(req.error.args[0][1]).to.be.equal('ACTION_AI_ORCHESTRATION_ERROR');
      expect(result).to.be.null;
      genAIInstance.getOrchestrationClient.restore();
    });

    it('should handle AI response with safety filter violation', async () => {
      const orchestrationClientMock = {
        chatCompletion: sinon.stub().rejects(
          new Error('400 - Input Filter Violation', {
            cause: {
              response: {
                data: {
                  error: {
                    code: '400',
                    location: 'Filtering Module - Input Filter',
                    message: 'Input Filter Violation'
                  }
                }
              }
            }
          })
        )
      };
      sinon
        .stub(genAIInstance, 'getOrchestrationClient')
        .resolves(orchestrationClientMock);
      const result = await genAIInstance.callOrchestrationChatCompletion(
        'tags',
        'en',
        true,
        req
      );
      expect(req.error.calledOnce).to.be.true;
      expect(req.error.args[0][0]).to.be.equal(400);
      expect(req.error.args[0][1]).to.be.equal('ACTION_AI_FILTER_VIOLATION');
      expect(result).to.be.null;
      genAIInstance.getOrchestrationClient.restore();
    });
  });

  describe('getOrchestrationClient', () => {
    let listOrchestrationConfigsStub, createUpdateOrchestrationConfigStub;

    beforeEach(() => {
      listOrchestrationConfigsStub = sinon.stub(
        genAIInstance.orchestrationConfigsApi,
        'listOrchestrationConfigs'
      );
      createUpdateOrchestrationConfigStub = sinon.stub(
        genAIInstance.orchestrationConfigsApi,
        'createUpdateOrchestrationConfig'
      );
    });

    afterEach(() => {
      listOrchestrationConfigsStub.restore();
      createUpdateOrchestrationConfigStub.restore();
    });

    it('should use first config if multiple exist', async () => {
      listOrchestrationConfigsStub.returns({
        execute: sinon
          .stub()
          .resolves({ count: 2, resources: [{ id: 'id1' }, { id: 'id2' }] })
      });

      const client = await genAIInstance.getOrchestrationClient(
        'scenario',
        'name',
        '1.0.0'
      );
      expect(client.config.id).to.equal('id1');

      listOrchestrationConfigsStub.restore();
    });

    it('should create config if none exist', async () => {
      listOrchestrationConfigsStub.returns({
        execute: sinon.stub().resolves({ count: 0, resources: [] })
      });
      createUpdateOrchestrationConfigStub.returns({
        execute: sinon.stub().resolves({ id: 'id3' })
      });

      const client = await genAIInstance.getOrchestrationClient(
        'scenario',
        'name',
        '1.0.0'
      );
      expect(client.config.id).to.be.equal('id3');

      listOrchestrationConfigsStub.restore();
      createUpdateOrchestrationConfigStub.restore();
    });
  });

  describe('createPoetrySlamWithAI', () => {
    const TITEL = 'Titel';
    const DESCRIPTION = 'Description';
    const UUID_DRAFT = 'uuid1';
    const UUID_ENTITY = 'uuid2';
    const USER = 'user1';
    let dbStub, insertStub, selectOneStub, uuidStub;
    const capturedEntries = [];
    const srvMock = {
      entities: {
        DraftAdministrativeData: { name: 'DraftAdministrativeData' },
        PoetrySlams: { drafts: { name: 'PoetrySlams' } }
      }
    };
    const reqMock = {
      context: {
        timestamp: new Date(),
        user: { id: USER }
      }
    };

    before(() => {
      dbStub = {
        run: sinon.stub().callsFake((query) => {
          return Promise.resolve(query);
        })
      };

      insertStub = sinon.stub(INSERT, 'into').returns({
        entries: (data) => {
          capturedEntries.push(data);
          return data;
        }
      });

      selectOneStub = sinon.stub(SELECT.one, 'from').returns({
        where: (data) => {
          capturedEntries.push(data);
          return data;
        }
      });

      uuidStub = sinon.stub(cds.utils, 'uuid');
      uuidStub.onFirstCall().returns(UUID_DRAFT);
      uuidStub.onSecondCall().returns(UUID_ENTITY);
    });

    it('should create a poetry slam draft', async () => {
      const data = { title: TITEL, description: DESCRIPTION };
      const result = await GenAI.createPoetrySlamWithAI(
        data,
        reqMock,
        srvMock,
        dbStub
      );
      sinon.assert.calledTwice(insertStub);
      sinon.assert.calledOnce(selectOneStub);
      sinon.assert.calledTwice(uuidStub);
      expect(capturedEntries[0]).to.deep.equal([
        {
          DraftUUID: UUID_DRAFT,
          CreationDateTime: reqMock.context.timestamp,
          CreatedByUser: USER,
          DraftIsCreatedByMe: true,
          LastChangeDateTime: reqMock.context.timestamp,
          LastChangedByUser: USER,
          InProcessByUser: USER,
          DraftIsProcessedByMe: true
        }
      ]);
      expect(capturedEntries[1]).to.include({
        ID: UUID_ENTITY,
        title: TITEL,
        description: DESCRIPTION,
        DraftAdministrativeData_DraftUUID: UUID_DRAFT,
        HasActiveEntity: false,
        HasDraftEntity: false
      });

      expect(capturedEntries[1].ID).to.equal(capturedEntries[2].ID);
      expect(result.ID).to.equal(UUID_ENTITY);
      expect(result.IsActiveEntity).to.be.false;
    });

    after(() => {
      insertStub.restore();
      selectOneStub.restore();
      uuidStub.restore();
    });
  });
});
