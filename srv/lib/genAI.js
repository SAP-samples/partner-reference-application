'use strict';
// Implementation of generated AI reuse functions
// Include utility files
const { httpCodes } = require('./codes');

class GenAI {
  static AI_PROMPT_INTRO =
    'You work in the marketing department of a company that organizes Poetry Slams. For these events, propose a title and description to attract a large audience. ' +
    "Your task is to convince people to attend as spectators. For each Poetry Slam, you're given tags that should be incorporated into the title and description. " +
    'The title should be short and eye-catching, and the description should be maximum six lines long. ' +
    'The title and the description may have line breaks but not written as control characters, like \\n. ';
  static AI_PROMPT_RHYME = 'The description should be written in rhymes: ';
  static AI_PROMPT_LANGUAGE =
    'The title and the description should be in language: ';
  static MODEL_NAME = 'gpt-4.1-mini';

  orchestration; // The @sap-ai-sdk/orchestration module
  orchestrationConfigsApi; // The API for managing orchestration configurations of the @sap-ai-sdk/prompt-registry module
  orchestrationConfig; // Stores the orchestration configuration

  // Always call the init function to create an instance of the GenAI class, since the constructor needs to be async to load the orchestration module
  constructor(orchestration, orchestrationConfigsApi, orchestrationConfig) {
    this.orchestration = orchestration;
    this.orchestrationConfigsApi = orchestrationConfigsApi;
    this.orchestrationConfig = orchestrationConfig;
  }

  static async init() {
    const orchestration = await import('@sap-ai-sdk/orchestration');
    const orchestrationConfigsApi = (
      await import('@sap-ai-sdk/prompt-registry')
    ).OrchestrationConfigsApi;

    const orchestrationConfig = {
      scenario: 'poetry-slam-creation',
      name: 'PoetrySlamCreationConfig',
      version: '1.0.0',
      spec: {
        modules: {
          prompt_templating: {
            model: {
              name: GenAI.MODEL_NAME,
              params: {
                temperature: 0.5,
                max_tokens: 300
              }
            },
            prompt: {
              template: [
                {
                  role: 'user',
                  content: [
                    {
                      type: 'text',
                      text:
                        `Tags: {{?tags}}.` +
                        `\n${GenAI.AI_PROMPT_RHYME} {{?rhyme}}.` +
                        `\n${GenAI.AI_PROMPT_LANGUAGE} {{?language}}.`
                    }
                  ]
                },
                {
                  role: 'system',
                  content: [
                    {
                      type: 'text',
                      text: `${GenAI.AI_PROMPT_INTRO}`
                    }
                  ]
                }
              ],
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
              }
            }
          },
          filtering: {
            input: {
              filters: [
                orchestration.buildAzureContentSafetyFilter('input', {
                  hate: 'ALLOW_SAFE',
                  self_harm: 'ALLOW_SAFE',
                  sexual: 'ALLOW_SAFE',
                  violence: 'ALLOW_SAFE',
                  prompt_shield: true
                })
              ]
            },
            output: {
              filters: [
                orchestration.buildAzureContentSafetyFilter('output', {
                  hate: 'ALLOW_SAFE',
                  self_harm: 'ALLOW_SAFE',
                  sexual: 'ALLOW_SAFE',
                  violence: 'ALLOW_SAFE',
                  protected_material_code: true
                })
              ]
            }
          },
          masking: {
            providers: [
              orchestration.buildDpiMaskingProvider({
                method: 'anonymization',
                entities: [
                  {
                    type: 'profile-email',
                    replacement_strategy: {
                      method: 'fabricated_data'
                    }
                  },
                  {
                    type: 'profile-person',
                    replacement_strategy: {
                      method: 'constant',
                      value: 'REDACTED_PERSON'
                    }
                  }
                ]
              })
            ]
          }
        }
      }
    };

    return new GenAI(
      orchestration,
      orchestrationConfigsApi,
      orchestrationConfig
    );
  }

  // Call an orchestration client with the given orchestrationConfig and parameters and return an object with title and description for the Poetry Slam
  async callOrchestrationChatCompletion(tags, language, rhyme, req) {
    if (
      typeof tags !== 'string' ||
      typeof language !== 'string' ||
      typeof rhyme !== 'boolean'
    ) {
      console.error('CREATE_WITH_AI: Invalid parameters provided.');
      req.error(httpCodes.bad_request, 'ACTION_AI_INVALID_PARAMETERS');
      return null;
    }

    if (!tags?.trim() || !language || tags?.trim().length <= 0) {
      console.error(
        'CREATE_WITH_AI: Mandatory parameters language or tags missing.'
      );
      req.error(httpCodes.bad_request, 'ACTION_AI_MISSING_PARAMETERS');
      return null;
    }

    const orchestrationClient = await this.getOrchestrationClient(
      this.orchestrationConfig.scenario,
      this.orchestrationConfig.name,
      this.orchestrationConfig.version
    );

    let response;
    try {
      response = await orchestrationClient.chatCompletion({
        placeholderValues: {
          tags: tags,
          language: language,
          rhyme: rhyme.toString()
        }
      });
    } catch (error) {
      const errorData = error?.cause?.response?.data?.error;

      // Specific error handling for content safety input filter violations
      if (errorData?.location === 'Filtering Module - Input Filter') {
        console.error(
          `CREATE_WITH_AI: Orchestration client returned an error: ${errorData.message}`
        );
        req.error(httpCodes.bad_request, 'ACTION_AI_FILTER_VIOLATION');

        return null;
      }

      // Generic error handling for orchestration client errors
      console.error(
        `CREATE_WITH_AI: Error while calling the orchestration client: ${error.message}`
      );
      req.error(
        httpCodes.internal_server_error,
        'ACTION_AI_ORCHESTRATION_ERROR'
      );
      return null;
    }

    const tokenUsage = response.getTokenUsage();
    const responseObject = JSON.parse(response.getContent());

    console.info(
      `createWithAI: Total tokens consumed by the request: ${tokenUsage.total_tokens}\n` +
        `Input prompt tokens consumed: ${tokenUsage.prompt_tokens}\n` +
        `Output text completion tokens consumed: ${tokenUsage.completion_tokens}\n`
    );

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

  // Returns an orchestration client based on the orchestrationConfig
  // If no orchestration configuration is found, it creates a new one based on the orchestrationConfig
  async getOrchestrationClient(scenario, name, version) {
    const orchestrationConfigList = await this.orchestrationConfigsApi
      .listOrchestrationConfigs({
        scenario: scenario,
        name: name,
        version: version
      })
      .execute();

    let orchestrationConfigId;
    if (orchestrationConfigList.count >= 1) {
      if (orchestrationConfigList.count > 1) {
        console.warn(
          `CREATE_WITH_AI: More than one orchestration configuration found. Using the first one.`
        );
      }
      orchestrationConfigId = orchestrationConfigList.resources[0].id;
    } else {
      orchestrationConfigId = (
        await this.orchestrationConfigsApi
          .createUpdateOrchestrationConfig(this.orchestrationConfig)
          .execute()
      ).id;
    }

    return new this.orchestration.OrchestrationClient({
      id: orchestrationConfigId
    });
  }

  // Creates a poetry slam with AI data and shows it as draft
  static async createPoetrySlamWithAI(data, req, srv, db) {
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
        title: data.title,
        description: data.description,
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
