# Add Capabilities for Generative Artificial Intelligence (Gen AI)

Put yourself in the shoes of a poetry slam manager who uses a poetry slam management application to manage the events. You want to easily create events with creative titles and descriptions. 
For the title and description proposal, the Partner Reference Application uses [generative artificial intelligence (generative AI or genAI)](https://www.sap.com/products/artificial-intelligence/what-is-generative-ai.html) based on [large language models (LLM)](https://www.sap.com/resources/what-is-large-language-model). The [SAP AI Core service of the SAP BTP](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/what-is-sap-ai-core) and the [SAP Cloud SDK for AI](https://github.com/SAP/ai-sdk-js) offer easy consumption of generative AI features.

To explore this feature with the Poetry Slam Manager, you have two options: 

1. Clone the repository of the Partner Reference Application. Check out the [*main-multi-tenant*](../../../tree/main-multi-tenant) branch and enhance the application step by step. 

2. Alternatively, check out the [*main-multi-tenant-features*](../../../tree/main-multi-tenant-features) branch where the feature is already included. 

The following describes how to enhance the **main-multi-tenant** branch (option 1).

## AI Ethics

SAP has introduced a [certification program](https://community.sap.com/t5/technology-blogs-by-sap/certification-for-partner-ai-apps-on-sap-btp-ensuring-reliability/ba-p/13751165) for partner applications developed on SAP Business Technology Platform (BTP) using [SAP Generative AI Hub](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/generative-ai-hub-in-sap-ai-core-7db524ee75e74bf8b50c167951fe34a5) that includes checks for Responsible AI compliance. The certification program enables partners to offer trusted, compliant, and enterprise-ready applications powered by AI services, leveraging SAP’s expertise in business data insights.

## Application Enablement 

1. Enhance the poetry slam service.

    1. Enhance the [poetry slam service definition](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamService.cds).
        1. Add a new action *createWithAI* to the *PoetrySlams* entity. This action creates a new poetry slam event and uses generative AI to propose a title and description. 
            ```cds
            @(cds.odata.bindingparameter.collection)
            action createWithAI(
                @(
                    title:'{i18n>languageInput}',
                    mandatory:true,
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
                language : String,
                @(
                    title:'{i18n>tagsInput}',
                    UI.Placeholder:'{i18n>placeholder}',
                    mandatory:true
                )
                tags : String,
                @(
                    title:'{i18n>rhymeInput}',
                    UI.ParameterDefaultValue:true
                )
                rhyme : Boolean, ) returns PoetrySlams;
            ```

        2. Add the *Language* entity from the module *sap.common.Languages*.
            ```cds
            //Languages
            entity Language    as projection on sap.common.Languages;
            ```

    2. Copy the file [*srv/poetryslam/util/genAI.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/util/genAI.js) with the genAI util class to your project. The genAI class uses [SAP Cloud SDK for AI](https://github.com/SAP/ai-sdk-js) to leverage the generative AI hub features.

    3. Extend the service implementation file [*srv/poetryslam/poetrySlamServicePoetrySlamsImplementation.js*](../../../tree/main-multi-tenant-features/srv/poetryslam/poetrySlamServicePoetrySlamsImplementation.js) with the implementation of the action.

        1. Import the genAI class.

            ```js
            const GenAI = require('./util/genAI');
            ```

        2. Add the action implementation.

            ```js
            /// Entity action: Create a poetry slam with generative artificial intelligence
            srv.on('createWithAI', async (req) => {
                // GenAI constructor is synchronous
                // It returns a promise as soon as it is resolved the instance can be used
                const genAI = new GenAI();

                await genAI.initializeModels();

                // Check if the deployment does already exist if not create one
                if (!(await genAI.checkAndCreateDeployment(req))) {
                    return;
                }

                const response = await genAI.callAI(
                    req.data.tags,
                    req.data.language,
                    req.data.rhyme,
                    req
                );

                return GenAI.createPoetrySlamWithAI(response, req, srv, db);
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
        ACTION_AI_SETUP                                         = The AI feature is setting up. Please try again shortly.
        ACTION_AI_MISSING_PARAMETERS                            = Please enter a language and tags. 
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
    
    2. Run the command `npm add @sap-ai-sdk/ai-api`. The package provides tools to manage your scenarios and workflows in SAP AI Core.  

    3. Run the command `npm add @sap-ai-sdk/foundation-models`. The package incorporates generative AI foundation models into your AI activities in SAP AI Core. 

## SAP BTP Configuration and Deployment

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
    > Note: For detailed instructions on how to deploy, refer to the section [Deploy the Multi-Tenant Application to a Provider Subaccount](./24-Multi-Tenancy-Deployment.md).

## Unit Tests

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

2. Copy the file [*test/srv/poetryslam/util/genAI.test.js*](../../../tree/main-multi-tenant-features/test/srv/poetryslam/util/genAI.test.js) to your project. This file tests the genAI util class.

3. To run the automated SAP Cloud Application Programming Model tests:

    1. Enter the command `npm install` in a terminal in SAP Business Application Studio.
    2. Enter the command `npm run test`. All tests are carried out and the result is shown afterwards.

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

The use of models in the generative AI hub of the SAP AI Core service is metered using genAI tokens. For more information, refer to the documentation on [SAP Help Portal](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/metering-and-pricing-for-generative-ai-hub). 

In case you want to estimate how many input and output tokens are required for the use case of the Partner Reference Application, the method `callAI` of class `genAI` shows how to determine the used tokens per genAI request. On this basis, you can make an assumption for your use case.

> Note: Additionally, content filtering, data masking, and non-generative AI components come into account. In the Partner Reference Application, these features are not used.
