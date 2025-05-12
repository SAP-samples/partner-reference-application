'strict';

const sinon = require('sinon');

const cds = require('@sap/cds');
const { expect } = cds.test(__dirname + '/../../..');

// Code to test
const GenAI = require('../../../srv/lib/genAI');

describe('Util GenAI', () => {
  let genAIInstance;

  const genAITokens = {
    completion_tokens: 72,
    prompt_tokens: 165,
    total_tokens: 237
  };

  beforeEach(async () => {
    genAIInstance = new GenAI();
  });

  describe('GenAI', () => {
    let stubConsoleError;
    let stubConsoleInfo;
    let reqStub;
    let req;

    beforeEach(() => {
      stubConsoleError = sinon.stub(console, 'error');
      stubConsoleInfo = sinon.stub(console, 'info');
      req = {
        error: function () {
          return;
        }
      };

      reqStub = sinon.stub(req, 'error');
    });

    afterEach(() => {
      if (stubConsoleError) {
        stubConsoleError.restore();
        stubConsoleError = undefined;
      }

      if (stubConsoleInfo) {
        stubConsoleInfo.restore();
        stubConsoleInfo = undefined;
      }

      if (reqStub) {
        reqStub.restore();
        reqStub = undefined;
      }
    });

    it('should initialize the chat client and set the model GPT 4o in constructor', async () => {
      await genAIInstance.initializeModels();
      expect(genAIInstance.chatClient).exist;
      expect(genAIInstance.chatClient.modelDeployment.modelName).eql('gpt-4o');
    });

    it('should test response of callAI function', async () => {
      let paramToTest;

      const expectedConsoleLog =
        'createWithAI: Total tokens consumed by the request: 237\n' +
        'Input prompt tokens consumed: 165\n' +
        'Output text completion tokens consumed: 72';

      // Mocking of chat client to test chat response
      genAIInstance.chatClient = {
        run: async function (param) {
          paramToTest = param;
          return {
            getContent: function () {
              return '{"title":"tilte test", "description": "description test"}';
            },
            getTokenUsage: function () {
              return genAITokens;
            }
          };
        }
      };

      let respone = await genAIInstance.callAI(
        'tagsTest',
        'languageTest',
        true,
        req
      );
      expect(respone.title).eql('tilte test');
      expect(respone.description).eql('description test');
      expect(paramToTest.messages.length).eql(2);
      expect(paramToTest.messages[0].role).eql('user');
      expect(paramToTest.messages[0].content).eql('tags: tagsTest');
      sinon.assert.calledOnceWithMatch(stubConsoleInfo, expectedConsoleLog);

      expect(paramToTest.messages[1].role).eql('system');
      expect(paramToTest.messages[1].content.startsWith('You work')).to.be.true;
      expect(paramToTest.messages[1].content).contains('rhyme');
      expect(paramToTest.messages[1].content).contains('languageTest');

      await genAIInstance.callAI('tagsTest', 'languageTest', false);
      expect(paramToTest.messages[1].content.startsWith('You work')).to.be.true;
      expect(paramToTest.messages[1].content).does.not.contain('rhyme');
      expect(paramToTest.messages[1].content).contains('languageTest');

      await genAIInstance.callAI('tagsTest', 'EN', false);
      expect(paramToTest.messages[1].content.startsWith('You work')).to.be.true;
      expect(paramToTest.messages[1].content).does.not.contain('rhyme');
      expect(paramToTest.messages[1].content).contains('EN');
    });

    it('should throw error when AI result does not have a JSON format', async () => {
      // Mocking of chat client to test chat response
      genAIInstance.chatClient = {
        run: async function () {
          return {
            getContent: function () {
              return 'test';
            },
            getTokenUsage: function () {
              return genAITokens;
            }
          };
        }
      };

      let respone = await genAIInstance.callAI(
        'tagsTest',
        'languageTest',
        true,
        req
      );
      expect(respone.title).eql('');
      expect(respone.description).eql('');
      sinon.assert.calledOnce(reqStub);
    });

    it('should throw error when AI result does not have a correct JSON format (missing title)', async () => {
      // Mocking of chat client to test chat response
      genAIInstance.chatClient = {
        run: async function () {
          return {
            getContent: function () {
              return '{"description": "description test"}';
            },
            getTokenUsage: function () {
              return genAITokens;
            }
          };
        }
      };

      let respone = await genAIInstance.callAI(
        'tagsTest',
        'languageTest',
        true,
        req
      );
      expect(respone.title).eql('');
      expect(respone.description).eql('');
      sinon.assert.calledOnce(reqStub);
    });

    it('should test mandatory parameters of callAI function', async () => {
      await genAIInstance.callAI('tagsTest', null, false, req);
      sinon.assert.calledOnce(reqStub);

      reqStub.resetHistory();

      await genAIInstance.callAI(null, 'languageTest', false, req);
      sinon.assert.calledOnce(reqStub);
    });

    it('should fail creating configuration without credentials', async () => {
      await expect(genAIInstance.createConfiguration()).to.rejectedWith();
      sinon.assert.calledOnce(stubConsoleError);
    });

    it('should fail creating deployment without credentials', async () => {
      await expect(
        genAIInstance.createDeployment('configIdTest')
      ).to.rejectedWith();
      sinon.assert.calledOnce(stubConsoleError);
    });

    it('should fail creating deployment without configuration ID', async () => {
      await expect(genAIInstance.createDeployment()).to.rejectedWith();
      sinon.assert.calledOnce(stubConsoleError);
    });

    it('should fail reading deployments without configuration ID', async () => {
      await expect(genAIInstance.getDeployments()).to.rejectedWith();
      sinon.assert.calledOnce(stubConsoleError);
    });
  });

  describe('Create Poetry Slam with GenAI', () => {
    let stubINSERT;
    let dataPoetrySlam;

    beforeEach(() => {
      dataPoetrySlam = [];
      stubINSERT = sinon.stub(INSERT, 'into').returns({
        entries: (poetrySlam) => {
          dataPoetrySlam.push(poetrySlam);
          return poetrySlam;
        }
      });
    });

    afterEach(() => {
      if (stubINSERT) {
        stubINSERT.restore();
        stubINSERT = undefined;
      }
    });

    it('should create a poetry slam with title and description generated by AI', async () => {
      const paramAI = {
        description: 'AI generated Description',
        title: 'AI generated Title'
      };

      const paramSrv = {
        entities: {
          DraftAdministrativeData: '',
          PoetrySlams: { drafts: { name: 'Test Name' } }
        }
      };

      const paramReq = {
        context: {
          timestamp: new Date(),
          user: {
            id: 'User ID'
          }
        }
      };

      const paramDB = {
        run: () => {
          return [{ DraftUUID: 'Test UUID' }];
        }
      };

      const result = await GenAI.createPoetrySlamWithAI(
        paramAI,
        paramReq,
        paramSrv,
        paramDB
      );
      expect(result[0].DraftUUID).eql('Test UUID');
      expect(dataPoetrySlam.length).eql(2);

      expect(dataPoetrySlam[0][0].CreatedByUser).eql('User ID');
      expect(dataPoetrySlam[0][0].DraftIsCreatedByMe).eql(true);
      expect(dataPoetrySlam[0][0].DraftIsProcessedByMe).eql(true);
      expect(dataPoetrySlam[0][0].InProcessByUser).eql('User ID');
      expect(dataPoetrySlam[0][0].LastChangedByUser).eql('User ID');

      expect(dataPoetrySlam[1].description).eql('AI generated Description');
      expect(dataPoetrySlam[1].DraftAdministrativeData_DraftUUID).eql(
        'Test UUID'
      );
      expect(dataPoetrySlam[1].HasActiveEntity).eql(false);
      expect(dataPoetrySlam[1].HasDraftEntity).eql(false);
      expect(dataPoetrySlam[1].title).eql('AI generated Title');
      sinon.assert.calledTwice(stubINSERT);
    });
  });
});
