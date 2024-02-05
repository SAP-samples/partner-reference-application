# Develop the Core of the SAP BTP Application

## Create a New Project Based on SAP Cloud Application Programming Model
1. To start a new development project, go to the settings in SAP Business Application Studio and open the *Command Palette...*.

   <img src="./images/BAS_CommandPalette.png" width="30%">

2. Search for `SAP Business Application Studio - New Project from Template`.

3. Create a new SAP Cloud Application Programming Model (CAP) project. Make sure the target folder path is set to `home/user/projects`.

   <img src="./images/BAS_Choose_CAP_Project.png" width="80%">

4. Add the following attributes to the SAP Cloud Application Programming Model (CAP) project:
    - As *project name*, enter `partner-reference-application`.
    - Select `Node.js` as your *runtime*.
    - As *productive runtime capabilities*, select *SAP HANA Cloud* and *User Authentication via XSUAA*.
    - For the deployment, select *Clound Foundry: MTA Deployment*. As a result, support for multi-target applications (MTA) is added. 

    As a result, a folder called `partner-reference-application` is created, which includes a set of files to start an SAP Cloud Application Programming Model project.

5. To add dependent node modules, perform `npm install` in a terminal.

Looking for more information? Go to the [SAP Cloud Application Programming Model documentation on command line interface](https://cap.cloud.sap/docs/tools/#command-line-interface-cli).

## Define the Domain Models

The domain model represents the relational database model of the application. All entities (tables), their relations (associations), and additional metadata (annotations) are maintained in the domain model. 

For more information on domain modeling, go to the [SAP Cloud Application Programming Model documentation on domain modeling](https://cap.cloud.sap/docs/guides/domain-modeling).

Following the SAP Cloud Application Programming Model, all domain models must be stored in the */db* folder of the project. You create a new file (in this example, [*/db/poetrySlamManagerModel.cds*](../../../tree/main-single-tenant/db/poetrySlamManagerModel.cds)) and add your application entities. In a CDS file, specify a namespace, which is used to structure the entities of the domain model. 
We recommend that you avoid names that are too long. To include reuse components, add a *using* statement. You can define as many entities as required by using the *entity* keyword.

To add entities, use the core data services graphical modeler for SAP Business Application Studio or the code line:
- If you want to create a completely new domain model, we recommend that you use the CDS graphical modeler.
- However, if you want to make some adjustments on top of an already existing domain model, we recommend the code line. 

To open the CDS graphical modeler, open the context menu in the created CDS file and select *Open With > CDS Graphical Modeler*.  

To add additional metadata to the entities, annotate them by using the *annotate* keyword. To make it as easy as possible to read the code, use different files to separate the entity definition and additional metadata. If you want to read up on adding annotations, go to the [SAP Cloud Application Programming Model documentation on data annotations](https://cap.cloud.sap/docs/advanced/odata#annotations).

Copy [Tutorial Domain Model Entity Definitions](../../../tree/main-single-tenant/db/poetrySlamManagerModel.cds) into your project.

## Create an Initial Data Set

Create an [initial data set](https://cap.cloud.sap/docs/guides/databases#providing-initial-data), which will be available after you've started the application. You can specify the data in SAP Cloud Application Programming Model by creating a set of CSV files in the */db/data* folder of the project.

The corresponding entity is encoded in the file name by concatenating the namespace and the entity name (for example, *sap.samples.poetryslams-Visitors.csv*).

Copy the [initial data set](../../../tree/main-single-tenant/db/data/) into your project.

## Define Services

After you've defined the domain model with its entities, define a set of [SAP Cloud Application Programming Model services](https://cap.cloud.sap/docs/guides/providing-services) to add business logic and external APIs of the application. All service definitions must be located in the */srv* folder.

Copy the service definition from [*/srv/poetrySlamManagerService.cds*](../../../tree/main-single-tenant/srv/poetrySlamManagerService.cds) into your project.

## Create Business Logic

To add behavior to the domain model, you can implement a set of exits in form of event handlers. Create a file */srv/poetrySlamManagerServiceImplementation.js* as referenced from the */srv/poetrySlamManagerService.cds* definition. Within this file, you can implement all required event handlers. Every entity defined in the domain model definition comes with a set of generic event handlers for CRUD (create, read, update, delete) operations. Additionally, you can register one event handler per action (for example, *cancel* or *publish*). Note that for draft-enabled entities, you need to decide if the logic is required for the draft, the activated entity, or for both. 

Note that some code functions have been defined in a separate file. These are constants for code list values.

Copy the [Poetry Slam Manager service implementation](../../../tree/main-single-tenant/srv/poetrySlamManagerServiceImplementation.js) into the *srv* folder and the [code functions](../../../tree/main-single-tenant/srv/util/codes.js) into the *srv/util* folder of your project.

### Readable IDs
In addition to technical UUIDs, this solution generates readable IDs that end users can use to uniquely identify poetry slam documents. Compared to randomly generated UUIDs, these readable IDs are user-friendlier as they are easier to remember. One common approach for generating readable IDs is to use a combination of meaningful words and numbers. In this example, the poetry slam number is a combination of a prefix and a generated number, for example, *PS-10*.

The number generation depends on the database that you use. For local testing, we use an SQLite database and, for deployed solutions, SAP HANA Cloud. In SQLite, we use the AUTOINCREMENT feature. In SAP HANA Cloud, we use a HANA sequence. This distinction is implemented in the function [getNextNumber of class uniqueNumberGenerator](../../../tree/main-single-tenant/srv/util/uniqueNumberGenerator.js), which is called in the [Poetry Slam Manager service implementation](../../../tree/main-single-tenant/srv/poetrySlamManagerServiceImplementation.js) when the poetry slam is created (which is the first time a draft is saved).

The sequence used by SAP HANA Cloud is defined in the [poetrySlamNumber.hdbsequence](../../../tree/main-single-tenant/db/src/poetrySlamNumber.hdbsequence). Note that, for SAP HANA Cloud sequences, the generated numbers can't be rolled back. So, if a transaction is not committed, a number is lost from the sequence.

Copy the [poetrySlamNumber.hdbsequence](../../../tree/main-single-tenant/db/src/poetrySlamNumber.hdbsequence) and the [class uniqueNumberGenerator](../../../tree/main-single-tenant/srv/util/uniqueNumberGenerator.js) into your project.

### Input Validation
Input validation ensures that the entered data is correct. Input validations can either be achieved via annotations in the entity definition or via implementation in the service handler. 

You can find an example of input validation via an annotation in the [visitors entity definition](../../../tree/main-single-tenant/db/poetrySlamManagerModel.cds). It defines an assertion about the format of the e-mail address via regular expression. 

```cds
//Visitors table
entity Visitors : cuid, managed {
    ...
    // Regex annotation to validate the input of the e-mail 
    e-mail  : String @assert.format: '^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$';
    ...
}
```
Find more details in the [SAP Cloud Application Programming Model documentation on input validation](https://cap.cloud.sap/docs/guides/providing-services#input-validation).

### Calculations and Enrichments
Data can be calculated and enriched in the service. Poetry Slam Manager includes examples of different types of calculations: calculated elements, virtual elements, and calculations of stored and read-only attributes.
- A [calculated element](https://cap.cloud.sap/docs/cds/cdl#calculated-elements) is calculated on the basis of other elements, for example, the *bookedSeats* of the PoetrySlam entity. It's not stored in the database, but calculated when requested from the user interface.
- An example of a calculation of a stored entity is the attribute *freeVisitorSeats*, which is calculated based on the visits that were created and booked. 
- A [virtual element](https://cap.cloud.sap/docs/cds/cdl#virtual-elements) is shown with the *statusCriticality* attribute, which is read-only and calculated after the read event of the PoetrySlam entity.

```cds
    entity PoetrySlams as select from poetrySlamManagerModel.PoetrySlams  {
        ...
        maxVisitorsNumber - freeVisitorSeats as bookedSeats : Integer @title : '{i18n>bookedSeats}', //calculated element
        // Relevant for color-coding the status on the UI to show priority
        virtual null as statusCriticality : Integer, 
    }
```

### Status Handling
A status is defined as a codelist with code, text, and a description. The values of the codelist can be added by [providing initial data](https://cap.cloud.sap/docs/guides/databases#providing-initial-data). As a reference, you can use the [PoetrySlamStatusCodes](../../../tree/main-single-tenant/db/data).

To initialize the status, set a default in the entity definition. The following example shows the entity *PoetrySlamStatusCodes*:

```cds
entity PoetrySlamStatusCodes : sap.common.CodeList {
    // Set the default status code to 1 (in preparation)
    key code : Integer default 1
        ...
}
```
You handle the status transitions of an instance in the event handlers of the [service implementation](../../../tree/main-single-tenant/srv/poetrySlamManagerServiceImplementation.js). 
- In Poetry Slam Manager, the PoetrySlam entity uses *PoetrySlamStatusCodes*. After an instance has been created, the status is set to the default *In Preparation*.
- With the *Publish* action of the PoetrySlam entity, a PoetrySlam instance is published as soon as the user calls the action. 
- The status *Cancel* is set as soon as the *Cancel* action is called.
- The status *Booked* is calculated and can only be applied when the PoetrySlam entity is published and fully booked, which means when there are no free visitor seats left. The calculation is done during the update of the PoetrySlam and the visit entities. The *cancelVisit* and *confirmVisit* actions require a recalculation, too.

## Add a Web Application with SAP Fiori Elements
Next, you add an SAP Fiori element-based user interface.

### Use the SAP Fiori Element Application Wizard
1. To start the wizard, search for *Create MTA Module from Template* in the *Command Palette...*.

   <img src="./images/FE-Wizard-open.png" width="80%">

2. Select the *SAP Fiori application* module template. 
3. Select *List Report Page*.
4. Select the data source and the OData service as follows:
   - *Data source*: *Use a Local CAP Project*
   - Choose your CAP project: *partner-reference-application*
   - *OData Service*: `PoetrySlamManager (Node.js)`
5. Select the main entity from the list:
   - *Main entity*: *PoetrySlams*
   - *Navigation entity*: *None*
   - *Automatically add table columns*: *Yes*
6. Add further project attributes:
   - *Module name*: `poetryslammanager`
   - *Application title*: `Poetry Slam Manager`
   - *Application namespace*: leave empty
   - *Description*: `Application to create and manage poetry slams`
   - *Add deployment configuration*: *Yes*
   - *Add FLP configuration*: *Yes*
   - *Configure Advanced Options*: *No*
7. Select *Cloud Foundry* as target of the deployment configuration. 
8. For now, the destination name is set to *none* because you'll configure it in a later step of this tutorial. 
9. Enter information on the SAP Fiori launchpad configuration:
   - *Semantic Object*: `poetryslammanager`
   - *Action*: `display`
   - *Title*: `Poetry Slams`
   - *Subtitle* (optional): `Manage Poetry Slams`
10. Choose *Finish*. The wizard creates the */app* folder, which contains all files related to the user interface.

### Fine-Tune the User Interface
To adapt the generated user interface to your needs, you can either use the [SAP Fiori tools, application modeler](https://help.sap.com/docs/SAP_FIORI_tools/17d50220bcd848aa854c9c182d65b699/a9c004397af5461fbf765419fc1d606a.html?locale=en-US) or you can change the generated files manually.

The SAP Fiori tools, application modeler includes two tools, which are helpful when creating new pages or adjusting existing ones:
- [Page Editor](https://help.sap.com/docs/SAP_FIORI_tools/17d50220bcd848aa854c9c182d65b699/047507c86afa4e96bb3d284adb9f4726.html?locale=en-US): Create and maintain annotation-based UI elements
- [Page Map](https://help.sap.com/docs/SAP_FIORI_tools/17d50220bcd848aa854c9c182d65b699/bae38e6216754a76896b926a3d6ac3a9.html?locale=en-US): Change the structure of pages and application-wide settings

The most relevant files are the following:
- [`app/poetryslammanager/annotations.cds`](../../../tree/main-single-tenant/app/poetryslammanager/annotations.cds): Configure the annotations to change the appearance of UI elements.
- [`app/poetryslammanager/webapp/manifest.json`](../../../tree/main-single-tenant/app/poetryslammanager/webapp/manifest.json): Define the information about the application (for example, application names, routes, navigations, and so on).
- [`app/poetryslammanager/webapp/index.html`](../../../tree/main-single-tenant/app/poetryslammanager/webapp/index.html): Define the appearance of the first UI of your application that is opened via a managed app router or local testing. This can either be a single component or a [sandbox environment for the SAP Fiori launchpad](https://help.sap.com/docs/SAP_NETWEAVER_AS_ABAP_FOR_SOH_740/9765143c554c4ec3951fb17ff80d8989/896efc419d994463a7c148b6904760a8.html?locale=en-US). In this example, the generated file is adopted as described in the section about [sandbox environment for the SAP Fiori launchpad](https://help.sap.com/docs/SAP_NETWEAVER_AS_ABAP_FOR_SOH_740/9765143c554c4ec3951fb17ff80d8989/896efc419d994463a7c148b6904760a8.html?locale=en-US).

Replace the content of the generated annotations.cds, manifest.json, and index.html from the example implementation ([annotations.cds](../../../tree/main-single-tenant/app/poetryslammanager/annotations.cds), [manifest.json](../../../tree/main-single-tenant/app/poetryslammanager/webapp/manifest.json), and [index.html](../../../tree/main-single-tenant/app/poetryslammanager/webapp/index.html)). 

#### Annotation Examples

| Functionality | Description   | Example       |
| ------------- | ------------- | ------------- |
| [Semantic Key](https://sapui5.hana.ondemand.com/sdk/#/topic/4c2d17aec55b4162b19f1b573b5a4f99.html) | Display the editing status of a column in the list report | [annotations.cds > service.PoetrySlams](../../../tree/main-single-tenant/app/poetryslammanager/annotations.cds) |
| [Side Effects](https://sapui5.hana.ondemand.com/sdk/#/topic/18b17bdd49d1436fa9172cbb01e26544.html)  | Reload data, permissions, or messages, or trigger determine actions based on data changes in UI scenarios | [annotations.cds > service.Visits](../../../tree/main-single-tenant/app/poetryslammanager/annotations.cds) |
| [Value List](https://sapui5.hana.ondemand.com/sdk/#/topic/16d43eb0472c4d5a9439ca1bf92c915d.html)  | Enable the selection of a value in a column with the help of a value list | [annotations.cds > service.Visits](../../../tree/main-single-tenant/app/poetryslammanager/annotations.cds) |

#### Sandbox Environment for the SAP Fiori Launchpad
After the SAP Fiori application is created by the wizard, a single component is loaded when the application is started via managed app router or when locally executed. In the Partner Reference Application, the loaded single component is the SAP Fiori elements *ListReportPage* named *PoetrySlamsList*. If an SAP Fiori launchpad is loaded to show tiles for several applications, some changes are required in the *app/poetryslammanager/webapp/index.html*. 

You can find further details in the [documentation on the sandbox environment for the SAP Fiori launchpad](https://help.sap.com/docs/SAP_NETWEAVER_AS_ABAP_FOR_SOH_740/9765143c554c4ec3951fb17ff80d8989/896efc419d994463a7c148b6904760a8.html).

> Note: The [*manifest.json*](../../../tree/main-single-tenant/app/poetryslammanager/webapp/manifest.json) defines which component is loaded initially by setting `initialLoad: true` as an option of the component.

Replace the SAPUI5 bootstraping script with a script to configure an SAPUI5 shell [setShellConfig.js](../../../tree/main-single-tenant/app/poetryslammanager/webapp/util/setShellConfig.js), to load the sandbox and SAPUI5. Additionally, the shell needs to be rendered and placed on the HTML body as soon as the SAPUI5 core is initialized ([*setContent.js*](../../../tree/main-single-tenant/app/poetryslammanager/webapp/util/setContent.js)).

```html
    <script type="text/javascript" src="util/setShellConfig.js"></script>

    <script src="https://sapui5.hana.ondemand.com/1.120.4/test-resources/sap/ushell/bootstrap/sandbox.js"></script>
    <script
      src="https://sapui5.hana.ondemand.com/1.120.4/resources/sap-ui-core.js"
      data-sap-ui-libs="sap.m, sap.ushell, sap.fe.templates, sap.uxap"
      data-sap-ui-compatVersion="edge"
      data-sap-ui-theme="sap_horizon"
      data-sap-ui-frameOptions="allow"
      data-sap-ui-bindingSyntax="complex"
      data-sap-ui-async="true"
    ></script>
    <script type="text/javascript" src="util/setContent.js"></script>
```

Additionally, replace the body tag to remove the component loading.

```html
  <body class="sapUiBody" id="content"></body>
```

#### Autoload Data
By default, lists aren't automatically prefilled when the *List Report* is displayed. However, you can change this behavior by enabling the autoload feature. To do so, simply go to */app/poetryslammanager/webapp/manifest.json* and add the following parameters:

```json
{
    "sap.ui5": {
        "routing": {
            "targets": {
                "PoetrySlamsList": {
                    "options": {
                        "settings": {
                            "initialLoad": true
                        }
                    }
                }
            }
        }
    }
}
```

#### Color-Coding
To implement a color-coding system for specific columns on the user interface, add a hidden column *statusCriticality* that contains color-coding information. Note that the column is not part of the database model, but only added in the service definition and filled dynamically at READ of the entity.

- Field definition in [*poetrySlamManagerService.cds*](../../../tree/main-single-tenant/srv/poetrySlamManagerService.cds)
- Logic to fill it in [*poetrySlamManagerServiceImplementation.js*](../../../tree/main-single-tenant/srv/poetrySlamManagerServiceImplementation.js)
    ```javascript
    const status = poetrySlam.status?.code || poetrySlam.status_code;
    switch (status) {
        case codes.poetrySlamStatusCode.inPreparation:
            poetrySlam.statusCriticality = codes.color.grey; // New poetry slams are grey
            break;
        case codes.poetrySlamStatusCode.published:
            poetrySlam.statusCriticality = codes.color.green; // Published poetry slams are green
            break;
        case codes.poetrySlamStatusCode.booked:
            poetrySlam.statusCriticality = codes.color.yellow; // Booked poetry slams are yellow
            break;
        case codes.poetrySlamStatusCode.canceled:
            poetrySlam.statusCriticality = codes.color.red; // Canceled poetry slams are red
            break;
        default:
    }
    
    ```
- Entries in the i18n files to set the column headers
- An entry in the [*annotations.cds*](../../../tree/main-single-tenant/app/poetryslammanager/annotations.cds) to use the field on the user interface

The color values, as defined in the codes constants, are fixed values that the UI interpretes automatically.

> Note: *statusCriticality* is modeled as a **[virtual element](https://cap.cloud.sap/docs/cds/cdl#virtual-elements)** and must be initialized in the application code. Otherwise, the READ request will be sent again and again until the application crashes.

### Draft Concept
The SAP Cloud Application Programming Model / SAP Fiori elements stack supports a *Draft Concept* out of the box. This enables users to store inconsistent data without having to publish them to others users. 

You can find more details in the [SAP Cloud Application Programming Model documentation on draft support](https://cap.cloud.sap/docs/advanced/fiori#draft-support). In Poetry Slam Manager, the entity *PoetrySlams* is draft-enabled.

### CDS Common Content
The node module [@sap/cds-common-content](https://www.npmjs.com/package/@sap/cds-common-content) includes code lists based on the ISO specification of the following CDS common definitions:

- sap.common.Countries: ISO 3166-1
- sap.common.Currencies: ISO 4217
- sap.common.Languages: ISO 639-1

The codes names and descriptions are translated into the most important SAP supported languages.

In this application, the module to import all default currencies is used. There is no need to manually maintain a list of currencies and their translations.

The following steps are required to use the module in the project:

1. Install the node module _@sap/cds-common-content_ ([*package.json*](../../../tree/main-single-tenant/package.json))
2. Import the module in the CDS definition ([*poetrySlamManagerModel.cds*](../../../tree/main-single-tenant/db/poetrySlamManagerModel.cds)): `using from '@sap/cds-common-content';`
3. If not already present, add `hdbtabledata` to the [*undeploy.json*](../../../tree/main-single-tenant/db/undeploy.json). Since the language-dependent tables are reimported with each deployment, remove the tables in the undeployment to prevent deployment issues.

## Add Translations

Translations of UI labels and texts are stored in properties-files in i18n-folders.

The app is based on the SAP Cloud Application Programming Model default settings:
- All labels used in the domain model are stored in *i18n.properties* files in the folder *../db/i18n*.
- All service model and system message texts are stored in the *i18n.properties* and *messages.properties* files in the folder *../srv/i18n*.
- All web application texts are stored in *i18n.properties* files in the folder *../app/poetryslammanager/webapp/i18n/*.
- All web application texts specific to the *manifest.json* are stored in the *i18n.properties* files in the folder *../app/poetryslammanager/i18n/*.

For non-default languages, add the ISO code of the language to the file name, for example, *i18n_de.properties* and *messages_de.properties*.

Copy the [domain model-i18n files](../../../tree/main-single-tenant/db/i18n), [service model and message-i18n files](../../../tree/main-single-tenant/srv/i18n), [web application texts](../../../tree/main-single-tenant/app/poetryslammanager/webapp/i18n), and [web application texts for the manifest](../../../tree/main-single-tenant/app/poetryslammanager/i18n) into your project.

## Add Authentication and Role-Based Authorization
To protect the application against unauthorized access, add user-based authentication and authorizations to the application. Broadly speaking, the application defines roles and assigns them statically to service operations such as reading or writing of a certain entity. The customer creates role templates that group a set of roles, which are assigned to the customer's users. You can find further details in the [SAP Cloud Application Programming Model documentation on authorization and access control](https://cap.cloud.sap/docs/guides/authorization).

First, you define the *Roles* as part of the application definition concept. For the Poetry Slam Manager application, two roles are defined: *PoetrySlamManager* and *PoetrySlamVisitor*.

The authorization is always defined on the service level, in this application on the level of the */srv/poetrySlamManagerService.cds*. For better readability, separate the authorization definitions from the service definitions by creating a new file */srv/poetrySlamManagerServiceAuthorizations.cds* that contains all authorization-relevant model parts. Copy the content from the example implementation [srv/poetrySlamManagerServiceAuthorizations.cds](../../../tree/main-single-tenant/srv/poetrySlamManagerServiceAuthorizations.cds).

The wizard created all runtime-relevant security settings of our application. It generated the *xs-security.json*. Open the generated file and replace it. It defines two role collections according to the described roles.

```json
{
    "scopes": [
        {
            "name": "$XSAPPNAME.PoetrySlamFull",
            "description": "Full Read/Write Access to PoetrySlams"
        },
        {
            "name": "$XSAPPNAME.PoetrySlamRestricted",
            "description": "Restricted Read/Write Access to PoetrySlams"
        } 
    ],
    "attributes": [],
    "role-templates": [
        {
            "name": "PoetrySlamManagerRole",
            "description": "Full Access to PoetrySlams",
            "scope-references": [
                "$XSAPPNAME.PoetrySlamFull"
            ],
            "attribute-references": []
        },
        {
            "name": "PoetrySlamVisitorRole",
            "description": "Restricted Access to PoetrySlams for Visitors",
            "scope-references": [
                "$XSAPPNAME.PoetrySlamRestricted"
            ],
            "attribute-references": []
        }          
    ],
    "role-collections": [
        {
            "name": "PoetrySlamManagerRoleCollection",
            "description": "Poetry Slam Manager",
            "role-template-references": [
                "$XSAPPNAME.PoetrySlamManagerRole"
            ]
        },
        {
            "name": "PoetrySlamVisitorRoleCollection",
            "description": "Poetry Slam Visitor",
            "role-template-references": [
                "$XSAPPNAME.PoetrySlamVisitorRole"
            ]
        }
    ]
}
```
		
> Note: In case of multiple deployments, uniqueness of role collections becomes an issue (role collections must be unique within a subaccount). To fix this, prefix namespaces.

Additionally, replace the CDS section in the *package.json*. It tells the CDS framework that you use the cloud security services integration library service of SAP Business Technology Platform. Additionally, it adds *assert integrity* on the database layer, which generates foreign-key constraints. 

For details, refer to the [SAP Cloud Application Programming Model documentation on database constraints](https://cap.cloud.sap/docs/guides/databases#db-constraints).

```json
 "cds": {
    "features": {
        "fetch_csrf": true,
        "assert_integrity": "db"
    },
    "requires": {
        "db": {
            "kind": "sql"
        },
        "uaa": {
            "kind": "xsuaa"
        }
    },
    "hana": {
        "deploy-format": "hdbtable"
    }
}
```

Last but not least, in the *.cdsrc.json*, define users and their roles for local testing. Here's an example of how you define three users with names, passwords, and assigned roles: 

```json
{
    "requires": {
        "[development]": {
            "auth": {
                "kind": "mocked",
                "users": {
                    "Peter": {
                        "password": "welcome",
                        "id": "peter",
                        "roles": [
                            "PoetrySlamFull",
                            "authenticated-user"
                        ]
                    },
                    "Julie": {
                        "password": "welcome",
                        "id": "julie",
                        "roles": [
                            "PoetrySlamRestricted",
                            "authenticated-user"
                        ]
                    },
                    "Denise": {
                        "password": "welcome",
                        "id": "denise",
                        "roles": [
                            "authenticated-user"
                        ]
                    },
                    "*": true
                }
            }
        }
    }    
}
```

## Update Project Dependencies

To keep the project up-to-date, update a few dependencies on a regular basis:

- Node Modules:
  - package.json
  - app/poetryslammanager/package.json
  - approuter/package.json (_Only Multi-Tenancy_)
- SAPUI5 version:
  - app/poetryslammanager/webapp/manifest.json
  - app/poetryslammanager/webapp/index.html
  - app/poetryslammanager/webapp/test/flpSandbox.html
  - app/poetryslammanager/webapp/test/integration/opaTests.qunit.html
  - [@sap/ux-specification](https://www.npmjs.com/package/@sap/ux-specification?activeTab=versions): Keep the node modul in sync with the currently used SAPUI5 version. For more details on mapping between the node module version and the SAPUI5 version, see this [overview](https://www.npmjs.com/package/@sap/ux-specification?activeTab=versions).

## Test the App

Now, you can start the web application and test it locally in SAP Business Application Studio:
1. Open a terminal in SAP Business Application Studio. 
2. Run the command `npm install` to ensure all modules are loaded and installed.
3. Use the run command `cds watch` to start the app. A success message indicates that the runtime has been started: *A service is listening to port 4004*.
4. To open the test environment, choose *Open in a New Tab* in the pop-up message or click on the link http://localhost:4004 in the terminal. As a result, a browser tab opens with the web applications and OData service endpoints. 
5. Now it's time to test the web app: 
    1. Click on the *Web Application* */poetryslammanager/webapp/index.html*.
    2. A log-on message appears. Use the test users as listed in the file *.cdsrc.json*.
    3. The SAP Fiori launchpad including the generated tile appears. To launch the app, choose *Manage Poetry Slams*.
    
        <img src="./images/FLP1.png">

> Note: If you would like to switch users, clear the browser cache first. For example, in Google Chrome, press `CTRL+SHIFT+DEL`, go to *Advanced*, and choose a time range and *Passwords and other sign-in data*. 

If you want to get more details about the application implementation, go to [Test, Trace, Debug](./16-Test-Trace-Debug.md).

In the next step, you'll enhance the application in such a way that you can [deploy it to your SAP Business Technology Platform Account](./15-One-Off-Deployment.md). 
