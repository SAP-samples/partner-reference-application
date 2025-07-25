'use strict';
// Implementation of generated AI reuse functions
// Include utility files
const { httpCodes } = require('./codes');

class GenAI {
  chatClient;
  static AI_PROMPT_INTRO =
    'You work in the marketing department of a company that organizes Poetry Slams. For these events, propose a title and description to attract a large audience. ' +
    "Your task is to convince people to attend as spectators. For each Poetry Slam, you're given tags that should be incorporated into the title and description. " +
    'The title should be short and eye-catching, and the description should be maximum six lines long. ' +
    'The title and the description may have line breaks but not written as control characters, like \\n. ';
  static AI_PROMPT_RHYME = 'The description should be written in rhymes.';
  static AI_PROMPT_LANGUAGE =
    'The title and the description should be in language: ';

  // Defines the large language model that is used
  static MODEL_NAME = 'gpt-4o';
  static AI_RESOURCE_GROUP = 'default';

  async initializeModels() {
    const { AzureOpenAiChatClient } = await import(
      '@sap-ai-sdk/foundation-models'
    );

    // For a chat client
    this.chatClient = new AzureOpenAiChatClient({ modelName: 'gpt-4o' });
  }

  // Creates a configuration for a SAP AI Core service deployment
  async createConfiguration(req) {
    const { ConfigurationApi } = await import('@sap-ai-sdk/ai-api');
    const configurationBaseData = {
      name: GenAI.MODEL_NAME,
      executableId: 'azure-openai',
      scenarioId: 'foundation-models',
      parameterBindings: [
        {
          key: 'modelName',
          value: GenAI.MODEL_NAME
        },
        {
          key: 'modelVersion',
          value: 'latest'
        }
      ],
      inputArtifactBindings: []
    };

    try {
      const configurationCreationResponse =
        await ConfigurationApi.configurationCreate(configurationBaseData, {
          'AI-Resource-Group': GenAI.AI_RESOURCE_GROUP
        }).execute();
      return configurationCreationResponse;
    } catch (errorData) {
      console.error(
        'CREATE_WITH_AI: Configuration creation not possible: ',
        errorData.message
      );
      req.error(
        httpCodes.internal_server_error,
        `Configuration creation failed: ${errorData.message}`
      );
    }
  }

  // Creates a deployment of the SAP AI Core service
  async createDeployment(configId, req) {
    if (!configId) {
      console.error(
        'CREATE_WITH_AI: Deployment creation failed: Configuration ID missing'
      );
      req.error(
        httpCodes.internal_server_error,
        `Deployment creation failed: Configuration ID missing`
      );
    }
    const { DeploymentApi } = await import('@sap-ai-sdk/ai-api');
    const deploymentCreationRequest = {
      configurationId: configId
    };

    try {
      const deploymentCreationResponse = await DeploymentApi.deploymentCreate(
        deploymentCreationRequest,
        { 'AI-Resource-Group': GenAI.AI_RESOURCE_GROUP }
      ).execute();
      return deploymentCreationResponse;
    } catch (errorData) {
      console.error(
        'CREATE_WITH_AI: Deployment creation not possible: ',
        errorData.message
      );
      req.error(
        httpCodes.internal_server_error,
        `Deployment creation failed: ${errorData.message}`
      );
    }
  }

  // Reads the SAP AI Core service deployments
  async getDeployments(req) {
    const { DeploymentApi } = await import('@sap-ai-sdk/ai-api');
    try {
      const response = await DeploymentApi.deploymentQuery(
        { executableIds: ['azure-openai'], scenarioId: 'foundation-models' },
        { 'AI-Resource-Group': GenAI.AI_RESOURCE_GROUP }
      ).execute();
      return JSON.stringify(response.resources);
    } catch (errorData) {
      console.error(
        'CREATE_WITH_AI: Deployments cannot be read: ',
        errorData.message
      );
      req.error(
        httpCodes.internal_server_error,
        `Deployments cannot be read: ${errorData.message}`
      );
    }
  }

  // Check if the deployment does already exist if not create one
  async checkAndCreateDeployment(req) {
    try {
      const deployment = JSON.parse(await this.getDeployments(req));

      if (deployment.length === 0) {
        const config = await this.createConfiguration(req);
        await this.createDeployment(config.id, req);
        req.info(httpCodes.internal_server_error, 'ACTION_AI_SETUP');
        console.log('CREATE_WITH_AI: Deployment will be created.');
        return false;
      } else if (deployment[0].status !== 'RUNNING') {
        req.info(httpCodes.internal_server_error, 'ACTION_AI_SETUP');
        console.log('CREATE_WITH_AI: Deployment not yet running.');
        return false;
      }
    } catch {
      return false;
    }

    return true;
  }

  // Calls AI LLM
  async callAI(tags, language, rhyme, req) {
    if (!tags?.trim() || !language || tags?.trim().length <= 0) {
      console.error(
        'CREATE_WITH_AI: Mandatory parameters language or tags missing.'
      );
      req.error(httpCodes.bad_Request, 'ACTION_AI_MISSING_PARAMETERS');
      return;
    }

    const response = await this.chatClient.run(
      {
        messages: [
          {
            role: 'user',
            content: `tags: ${tags}`
          },
          {
            role: 'system',
            content:
              `${GenAI.AI_PROMPT_INTRO} ${rhyme ? GenAI.AI_PROMPT_RHYME : ''} ` +
              `${GenAI.AI_PROMPT_LANGUAGE}${language}.`
          }
        ],
        // The response format json_schema sets the output response to a given JSON schema
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'PRA',
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' }
              },
              required: ['title', 'description'],
              additionalProperties: false
            }
          }
        },
        // The temperature defines how deterministic AI is (lower value more deterministic, higher value more creative).
        temperature: 0.5,
        max_tokens: 300
      },
      {
        params: {
          // Use the newer API version to support the JSON schema in the response format
          'api-version': '2024-10-21'
        }
      }
    );

    const tokenUsage = response.getTokenUsage();

    console.info(
      `createWithAI: Total tokens consumed by the request: ${tokenUsage.total_tokens}\n` +
        `Input prompt tokens consumed: ${tokenUsage.prompt_tokens}\n` +
        `Output text completion tokens consumed: ${tokenUsage.completion_tokens}\n`
    );

    let responseObject;
    try {
      responseObject = JSON.parse(response.getContent());
    } catch (error) {
      req.error(httpCodes.internal_server_error, 'ACTION_AI_NO_ACCESS');
      console.error(
        `CREATE_WITH_AI: AI response has not the correct JSON format: ${error}`
      );
      return { title: '', description: '' };
    }

    if (
      !Object.prototype.hasOwnProperty.call(responseObject, 'title') ||
      !Object.prototype.hasOwnProperty.call(responseObject, 'description')
    ) {
      req.error(httpCodes.internal_server_error, 'ACTION_AI_NO_ACCESS');
      console.error(
        `CREATE_WITH_AI: AI response has not the correct JSON format`
      );
      return { title: '', description: '' };
    }

    return responseObject;
  }

  // Creates a poetry slam with AI data and shows it as draft
  static async createPoetrySlamWithAI(aiResult, req, srv, db) {
    const { DraftAdministrativeData } = srv.entities;
    const { PoetrySlams } = srv.entities;

    const insertResult = await db.run(
      INSERT.into(DraftAdministrativeData).entries([
        {
          DraftUUID: cds.utils.uuid(),
          CreationDateTime: req.context.timestamp,
          CreatedByUser: req.context.user.id,
          DraftIsCreatedByMe: true,
          LastChangeDateTime: req.context.timestamp,
          LastChangedByUser: req.context.user.id,
          InProcessByUser: req.context.user.id,
          DraftIsProcessedByMe: true
        }
      ])
    );

    // Calculate a date three month from now and 8 a.m.
    const proposedEventDate = new Date();
    proposedEventDate.setMonth(proposedEventDate.getMonth() + 3);
    proposedEventDate.setHours(20, 0, 0, 0);

    const [{ DraftUUID }] = [...insertResult];
    const ID = cds.utils.uuid();
    await db.run(
      INSERT.into(PoetrySlams.drafts.name).entries({
        ID: ID,
        title: aiResult.title,
        description: aiResult.description,
        maxVisitorsNumber: 100,
        visitorsFeeAmount: 42,
        dateTime: proposedEventDate,
        visitorsFeeCurrency_code: 'EUR',
        DraftAdministrativeData_DraftUUID: DraftUUID,
        HasActiveEntity: false,
        HasDraftEntity: false
      })
    );
    const result = await db.run(
      SELECT.one.from(PoetrySlams.drafts).where({ ID: ID })
    );
    result.IsActiveEntity = false;
    return result;
  }
}

// Publish class
module.exports = GenAI;
