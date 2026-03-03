# Add Capabilities for Generative Artificial Intelligence (Gen AI)

Put yourself in the shoes of a poetry slam manager who uses a poetry slam management application to manage the events. You want to easily create events with creative titles and descriptions. 
For the title and description proposal, the Partner Reference Application uses [generative artificial intelligence (generative AI or genAI)](https://www.sap.com/products/artificial-intelligence/what-is-generative-ai.html) based on [large language models (LLM)](https://www.sap.com/resources/what-is-large-language-model). The [SAP AI Core service of the SAP BTP](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/what-is-sap-ai-core) and the [SAP Cloud SDK for AI](https://github.com/SAP/ai-sdk-js) offer easy consumption of generative AI features. For information about getting started with the JavaScript SDK, see the [Getting Started](https://sap.github.io/ai-sdk/docs/js/getting-started) documentation.
You can find information on security, data protection, and privacy aspects of the SAP AI Core service in the [Security](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/security) chapter of the service documentation.

## AI Ethics

SAP has introduced a [certification program](https://community.sap.com/t5/technology-blogs-by-sap/certification-for-partner-ai-apps-on-sap-btp-ensuring-reliability/ba-p/13751165) for partner applications developed on SAP Business Technology Platform (BTP) using the [generative AI hub](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/generative-ai-hub-in-sap-ai-core-7db524ee75e74bf8b50c167951fe34a5). This program includes checks for Responsible AI compliance. It enables partners to offer trusted, compliant, and enterprise-ready applications powered by AI services, leveraging SAP’s expertise in business data insights. Additionally, the [SAP Global AI Ethics Policy](https://www.sap.com/documents/2022/01/a8431b91-117e-0010-bca6-c68f7e60039b.html) and the [SAP AI Ethics Handbook](https://www.sap.com/documents/2023/03/7211ee96-647e-0010-bca6-c68f7e60039b.html) provide guidance on applying the SAP AI Policies. 

Furthermore, the SAP Generative AI Hub offers capabilities like [Data Masking](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/data-masking-d9a54d9ca54b40beacbd24e1663ec3b4) to support data protection and privacy implementation.

## Bill of Materials

### Entitlements
In addition to the entitlements listed for the [multitenancy version](./20-Multi-Tenancy-BillOfMaterials.md), the list shows the entitlements that are required in the different subaccounts to add generative artificial intelligence. 

| Subaccount    |  Entitlement Name                         | Service Plan          | Type          | Quantity                  | 
| ------------- |  ---------------------------------------- | -----------------     | ------------- | ------------------------- |
| Provider      |                                           |                       |               |                           |
|               | SAP AI Core                               | extended              | Service       | 1                         | 

## Guide How to Enhance the Application Step by Step

To explore this feature with the Poetry Slam Manager, you have two options: 

1. Clone the repository of the Partner Reference Application. Check out the [*main-multi-tenant*](../../../tree/main-multi-tenant) branch and enhance the application step by step. 

2. Alternatively, check out the [*main-multi-tenant-features*](../../../tree/main-multi-tenant-features) branch where the feature is already included. 

The following describes how to enhance the **main-multi-tenant** branch (option 1).

### Application Enablement 

1. Enhance the poetry slam service.

    1. Enhance the [poetry slam service definition](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamService.cds).
        1. Add a new action *createWithAI* to the *PoetrySlams* entity. This action creates a new poetry slam event and uses generative AI to propose a title and description. 
            ```cds
            @(cds.odata.bindingparameter.collection)
            @(UI.IsAIOperation: true) // Add the AI Icon to the action button
            action createWithAI(
                @(
                    title: '{i18n>languageInput}',
                    mandatory: true,
                    Common:{
                        ValueListWithFixedValues: false,
                        ValueList               : {
                            $Type         : 'Common.ValueListType',
                            CollectionPath: 'Language',
                            Parameters    : [
                                {
                                    $Type            : 'Common.ValueListParameterInOut',
                                    ValueListProperty: 'name',
                                    LocalDataProperty: language,
                                },
                                {
                                    $Type            : 'Common.ValueListParameterDisplayOnly',
                                    ValueListProperty: 'code'
                                },
                                {
                                    $Type            : 'Common.ValueListParameterDisplayOnly',
                                    ValueListProperty: 'descr'
                                }
                            ]
                        },
                    }
                )
                language : String(50),
                @(
                    title: '{i18n>tagsInput}',
                    UI.Placeholder: '{i18n>placeholder}',
                    mandatory: true
                )
                tags : String(100),
                @(
                    title: '{i18n>rhymeInput}',
                    UI.ParameterDefaultValue: true
                )
                rhyme : Boolean, ) returns PoetrySlams;
            ```

        2. Add the *Language* entity from the module *sap.common.Languages*.
            ```cds
            //Languages
            entity Language    as projection on sap.common.Languages;
            ```

    2. Copy the [*srv/lib/genAI.js*](../../../tree/main-multi-tenant-features/srv/lib/genAI.js) file with the genAI class to your project. The genAI class uses [SAP Cloud SDK for AI](https://github.com/SAP/ai-sdk-js) with the orchestration and prompt-registry package to leverage the generative AI hub features. Additionally, it defines which large language model is used for the proposal generation and defines the system prompt.

        > Note: The implementation uses the [Azure content filter](https://sap.github.io/ai-sdk/docs/js/orchestration/chat-completion#content-filtering) for restricting content that is passed to and received from a generative AI model. Only safe content for input and output of different categories (such as hate) are allowed. 

        > Note: The implementation uses the [masking module](https://sap.github.io/ai-sdk/docs/js/orchestration/chat-completion#data-masking) of the orchestration client to mask sensitive information in the prompt. It adds the masking provider [SAP Data Privacy Integration](https://sap.github.io/ai-sdk/docs/js/orchestration/chat-completion#sap-data-privacy-integration), which anonymizes or pseudonymizes sensitive information depending on the replacement strategy.

    3. Extend the service implementation file [*srv/poetryslam/poetrySlamServicePoetrySlamsImplementation.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamServicePoetrySlamsImplementation.js) with the implementation of the action.

        1. Import the genAI class.

            ```js
            const GenAI = require('../lib/genAI');
            ```

        2. Add the action implementation.

            ```js
            // Entity action: Create a poetry slam with generative artificial intelligence
            srv.on('createWithAI', async (req) => {
                const genAI = await GenAI.init();
            
                const response = await genAI.callOrchestrationChatCompletion(
                  req.data.tags,
                  req.data.language,
                  req.data.rhyme,
                  req
                );

                // In case the orchestration call could not be started, no draft will be created
                if (!response) return null;
            
                const poetrySlamDraft = await GenAI.createPoetrySlamWithAI(
                  response,
                  req,
                  srv,
                  db
                );
                return poetrySlamDraft;
            });
            ```

    4. Add UI texts for the action parameter dialog into the file [*srv/i18n/i18n.properties*](../../../tree/main-multi-tenant-features/srv/i18n/i18n.properties).

        ```
        # -------------------------------------------------------------------------------------
        # AI 

        languageInput           = Select the language in which you want the title and description to be generated
        tagsInput               = Add some tags to describe the generated title and description
        rhymeInput              = Generate the description in rhymes
        placeholder             = For example: creative, funny
        ```

        > Note: In the reference example, the file [*srv/i18n/i18n_de.properties*](../../../tree/main-multi-tenant-features/srv/i18n/i18n_de.properties) with the German texts is available, too. You can adopt them accordingly.

    5. Add the message texts for the action error handling into the file [*srv/i18n/messages.properties*](../../../tree/main-multi-tenant-features/srv/i18n/messages.properties).

        ```
        ACTION_AI_NO_ACCESS                                     = Access to SAP AI Core service isn’t possible. Please reach out to your application provider.
        ACTION_AI_MISSING_PARAMETERS                            = Please enter a language and tags. 
        ACTION_AI_INVALID_PARAMETERS                            = Invalid parameters. Please check your input.
        ACTION_AI_ORCHESTRATION_ERROR                           = An error occurred during AI orchestration. Check the logs for more details.
        ACTION_AI_FILTER_VIOLATION                              = This content doesn't meet our safety guidelines. Please revise your input and try again.
        ```

        > Note: In the reference example, the file [*srv/i18n/messages_de.properties*](../../../tree/main-multi-tenant-features/srv/i18n/messages_de.properties) with the German texts is available, too. You can adopt them accordingly.

2. Enhance the SAP Fiori elements UI of the *Poetry Slams* application. 

    1. Enhance the section *LineItem* of the file [*app/poetryslams/annotations*](../../../tree/main-multi-tenant-features/app/poetryslams/annotations.cds) to add a button that triggers the action to create the poetry slam with generative AI. 
    
        ```cds
        {
            $Type : 'UI.DataFieldForAction',
            Action: 'PoetrySlamService.createWithAI',
            Label : '{i18n>createWithAI}'
        },
        ```      

    2. Add the UI text for the button into the file [*/app/poetryslams/i18n/i18n.properties*](../../../tree/main-multi-tenant-features/app/poetryslams/i18n/i18n.properties).

        ```
        createWithAI            = Create with Slamtastic AI
        ```

        > Note: In the reference example, the file [*/app/poetryslams/i18n/i18n_de.properties*](../../../tree/main-multi-tenant-features/app/poetryslams/i18n/i18n_de.properties) with the German texts is available, too. You can adopt them accordingly.

3. Add the required npm modules as dependencies to the *package.json* of your project. Refer to the file [*package.json*](../../../tree/main-multi-tenant-features/package.json) of the sample application.
    
    1. Open a terminal.
    
    2. Run the command `npm add @sap-ai-sdk/orchestration`. This package incorporates generative AI orchestration capabilities into your AI activities in SAP AI Core. It is part of the SAP Cloud SDK for AI, which is the official Software Development Kit (SDK) for SAP AI Core, the generative AI hub, and orchestration workflow.

    3. Run the command `npm add @sap-ai-sdk/prompt-registry`. This package incorporates generative AI prompt registry capabilities into your AI activities in SAP AI Core. It is also part of the SAP Cloud SDK for AI.

### SAP BTP Configuration and Deployment

1. Open the SAP BTP cockpit of the provider subaccount and add the required entitlements:
    
    - *SAP AI Core* with the *extended* plan to access the SAP AI Core service.

2. Add the SAP AI Core service as a resource in the file [*mta.yaml*](../../../tree/main-multi-tenant-features/mta.yaml). Besides this, the resource is required as dependency in the service module and the mtx module. 

    ```yaml
    modules:
        - name: poetry-slams-srv
          requires:
            - name: poetry-slams-aicore

        - name: poetry-slams-mtx
          requires:
            - name: poetry-slams-aicore

    resources:
        # AI Core Service
        - name: poetry-slams-aicore
            type: org.cloudfoundry.managed-service
            parameters:
            service: aicore
            service-plan: extended
    ```


1. Run the command `npm install` in your project root folder to install the required npm modules. 

2. Build and deploy the application.
    > Note: For detailed instructions on how to deploy, refer to [Deploy Your SAP BTP Multi-Tenant Application](./24-Multi-Tenancy-Deployment.md).

### Unit Tests

Unit tests are available to test the artificial intelligence feature:

1. Enhance the file [*test/srv/poetryslam/poetrySlamServicePoetrySlams.test.js*](../../../tree/main-multi-tenant-features/test/srv/poetryslam/poetrySlamServicePoetrySlams.test.js) with a test to check the action.

    ```js
    it('should reject createWithAI action without running SAP BTP AI Core service', async () => {
        await expect(
            ACTION(`/odata/v4/poetryslamservice/PoetrySlams`, `createWithAI`, {
                language: 'English',
                tags: 'funny',
                rhyme: false
            })
        ).to.rejectedWith();
    });
    ```

2. Copy the file [*test/srv/lib/genAI.test.js*](../../../tree/main-multi-tenant-features/test/srv/lib/genAI.test.js) to your project. This file tests the genAI class.

3. To run the automated SAP Cloud Application Programming Model tests:

    1. Enter the following command in a terminal in SAP Business Application Studio to install all required node modules.
        ```
        npm install
        ```

    2. Enter the following command to run all tests. The result is shown afterwards.
        ```
        npm run test
        ```

## A Guided Tour to Explore the Generative Artificial Intelligence Feature

Now it is time to take you on a guided tour through the generative artificial Intelligence feature of the Poetry Slam Manager: 

1. Open the SAP BTP cockpit of the customer subaccount.

2. Open the Poetry Slams application.

3. Choose *Create with Slamtastic AI* to create a new poetry slam with a proposed title and description from generative artificial intelligence.

4. Select a language.

5. Add one or more tags that describe the content and style of the proposed title and description. Examples are *funny* and *creative*. 

6. The parameter *rhyme* is defaulted. Stay with the default to get a text that is a rhyme. 

> Note: The object page with the newly created poetry slam is opened. The title and description are proposed accordingly.

## Metering genAI Usage

The use of models in the generative AI hub of the SAP AI Core service is metered using genAI tokens. For more information, refer to the documentation on [SAP Help Portal](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/metering-and-pricing-for-generative-ai). 

In case you want to estimate how many input and output tokens are required for the use case of the Partner Reference Application, the method `callOrchestrationChatCompletion` of class `genAI` shows how to determine the used tokens per genAI request. On this basis, you can make an assumption for your use case.
