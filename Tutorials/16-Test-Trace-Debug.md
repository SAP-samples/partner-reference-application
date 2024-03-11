# Test, Trace, and Debug

When developing a productive application, quality assurance and the detection of issues are essential.

To keep things simple, here's a high-level summary of what it's all about: 

## Manual Test

You can manually test the application on your local machine. 

Run the command `cds watch` on the command line interface. This will start a Node.js server including the web application. The server uses an SQLight database, which makes local testing easy. 

## Automated Tests

For quality assurance, it's important to use automated tests that are executed when changes to the data model, services, or the user interface have been made, to check if the application still works as expected.

### SAP Cloud Application Programming Model Unit Tests

The data model and services can be tested with the SAP Cloud Application Programming Model unit test framework. The framework uses standard JavaScript libraries such as Chai and Mocha. A reference test implementation can be found in the folder */test/*. There are tests available for the entitiy model (folder */db/*) and for the service (folder */srv/*).

There are two ways to test the services in SAP Cloud Application Programming Model, either via service APIs or via HTTP APIs. For more details, go to the [SAP Cloud Application Programming Model documentation on testing with cds.test](https://cap.cloud.sap/docs/node.js/cds-test). 

#### Example of a Service API

The service API is used to test the Poetry Slam Manager entity model in [poetrySlamManagerModel.test.js](../../../tree/main-single-tenant/test/db/poetrySlamManagerModel.test.js).

In the following example, a visit is selected from the database and is to be recreated. However, the creation must be rejected due to uniqueness of the pair *poetrySlam_ID* and *visitor_ID*. 

```javascript
it('should ensure the uniquness of combination of visitor ID and poetry slam ID', async () => {
  const { Visits } = db.model.entities;
  const result = await SELECT.one
    .from(Visits)
    .columns('parent_ID', 'visitor_ID');

  // Asynchronous calls require a return to be checked correclty
  return expect(db.create(Visits).entries(result)).to.rejected;
});
```

#### Example of an HTTP API

The HTTP API is used to test the Poetry Slam Manager service. There is one test file for each entity and a file to test the OData function of the service. Axios is used as HTTP client in the tests. The authorization is set to the user Peter.

In the following example, all poetry slams are read via OData GET call in the *before* function. In the test, a published poetry slam is selected and the *Cancel* action is executed via OData. It checks if the status is correctly set to *Canceled*. Afterwards, the entry is read and the status code and statusCriticality are checked. You can find the tests in [poetrySlamManagerService-PoetrySlams.test.js](../../../tree/main-single-tenant/test/srv/poetrySlamManagerService-PoetrySlams.test.js).

```javascript

const ACTION = (url, name, parameters = {}) => POST (url+ `/PoetrySlamManager.${name}`,parameters); 

axios.defaults.auth = { username: 'peter', password: 'welcome' };

describe('Poetryslams in PoetrySlamManager Service', () => {
    let poetrySlams;

    before(async () => {
      // Connect to the database of the current project
      db = await cds.connect.to('db');
      expect(db).to.exist;

      test.data.reset;

      // Read all poetry slams for usage in the tests
      poetrySlams = await GET(`/odata/v4/poetryslammanager/PoetrySlams`, {
        params: { $select: `ID,status_code,statusCriticality` }
      });
      expect(poetrySlams.data.value.length).to.greaterThan(0);
    });

    beforeEach(async () => {
      await test.data.reset();
    });

    it('changes the status of poetryslams during action cancel on published entities', async () => {
      const id = poetrySlams.data.value.find(
        (poetrySlam) => poetrySlam.status_code === poetrySlamStatusCode.published
      ).ID;

      const actionResult = await ACTION(
        `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=true)`,
        'cancel'
      );
      expect(actionResult.data.status_code).to.eql(poetrySlamStatusCode.canceled);

      // Read the status of the poetry slam and check that it was canceled
      const result = await GET(
        `/odata/v4/poetryslammanager/PoetrySlams(ID=${id},IsActiveEntity=true)`,
        {
          params: { $select: `ID,status_code` }
        }
      );
      expect(result.data.status_code).to.eql(poetrySlamStatusCode.canceled);
    });
});
```

#### Unit Test Setup and Execution

To take over the unit tests and the configuration from the example implementation, take the following steps:

1. Copy the [entity unit tests](../../../tree/main-single-tenant/test/db) into your project.
2. Copy the [service unit tests](../../../tree/main-single-tenant/test/srv) into your project.
3. Add the Mocha, Chai, and Axios devDependencies to your *package.json*. You can take them over from the [*package.json* of the example implementation](../../../tree/main-single-tenant/package.json). 
4. Copy the script with the name *test* into your *package.json*. 
5. Run the command `npm install`.
6. Copy the Mocha configuration file [*.mocharc.json*](../../../tree/main-single-tenant/.mocharc.json) into your project.

To run the automated SAP Cloud Application Programming Model tests, enter the command `npm run test` in a terminal in SAP Business Application Studio. All tests will be executed and the result will be shown afterwards.

### One Page Acceptance (OPA5) Tests

You can execute user interface and integration testing with the help of One Page Acceptance Tests (OPA5). A minimalist test setup is created by default when you first create an SAP Fiori application with the wizard as described in [Develop the Core of the SAP BTP Application](./14-Develop-Core-Application.md).

OPA5 tests are built on the QUnit testing framework. They simulate and check user interaction with the UI.

The tests are located in the directory [*app/poetryslammanager/webapp/test*](../../../tree/main-single-tenant/app/poetryslammanager/webapp/test).

> Note: The directory **app/poetryslammanager/webapp/localService/** was created by the wizard, but it was deleted from this project as there was no usage in this application and, to keep it up-to-date with the service definition, manual adjustments would have been necessary.

> Note: Before you can execute the file **opaTests.qunit.html**, adjust it manually. To run the tests, add `https://sapui5.hana.ondemand.com/<version>` in front of the referenced resources in the file. You can have a look at the [*app/poetryslammanager/webapp/test/integration/opaTests.qunit.html*](../../../tree/main-single-tenant/app/poetryslammanager/webapp/test/integration/opaTests.qunit.html) of the reference application.

> Note: Before you can execute the file **FirstJourney.js**, adjust it manually. Add  `When.onTheShell.iPressTile('fe-lrop-v4');` in the `opaTest` method after the app is started. You can have a look at the [*app/poetryslammanager/webapp/test/integration/FirstJourney.js*](../../../tree/main-single-tenant/app/poetryslammanager/webapp/test/integration/FirstJourney.js) of the reference application.

1. Start the local server: `npm run start`
2. To execute OPA5 tests, open: `<host>/poetryslammanager/webapp/test/integration/opaTests.qunit.html`

#### More Information

- [Integration Testing with One Page Acceptance Tests (OPA5)](https://sapui5.hana.ondemand.com/sdk/#/topic/2696ab50faad458f9b4027ec2f9b884d.html)
- [A First OPA Test](https://sapui5.hana.ondemand.com/sdk/#/topic/1b47457cbe4941ee926317d827517acb)
- [Test Suite and Automated Testing](https://sapui5.hana.ondemand.com/sdk/#/topic/07c97a2e497d443eb6fa74bb9445ab9c)
- API:
  - [sap.fe.test](https://sapui5.hana.ondemand.com/#/api/sap.fe.test)
  - [sap.ui.test](https://sapui5.hana.ondemand.com/#/api/sap.ui.test)

## Trace

Consider adding log statements to the service implementations, for example: 
```javascript
console.log("Poetry Slam " + PoetrySlamIdentifier +" is canceled");
```
The log statements are written during the usage of your deployed application. Use the command `cf logs poetry-slams-srv --recent` in the SAP Business Application Studio terminal to review your own log messages or the ones created by others. You need to be logged in to your SAP BTP Cloud Foundry runtime space.

## Debug

You can debug locally with the standard Node.js debugging tools.
See also the [SAP Cloud Application Programming Model documentation on debugging](https://cap.cloud.sap/docs/tools/#debugging-with-cds-watch).

## Hybrid Testing
As described, your local environment will run with an SQLite database. If you want to connect your local test environment with an SAP HANA Cloud database to run your test against the same database technology as the deployed solution does, follow the instructions in this section.

For general guidelines on how to connect your local test against services in the Cloud, refer to the [SAP Cloud Application Programming Model documentation on hybrid testing](https://cap.cloud.sap/docs/advanced/hybrid-testing).

### Prerequisites
When this project was created, the SAP HANA Cloud capability was included. As a result, the dependency @sap/cds_hana is listed in the file *package.json* and the
file *[.hdiconfig](../../../tree/main-single-tenant/db/src/.hdiconfig)* has been added to the project.

Now, you need to provide the credentials to connect to the SAP HANA Cloud database.

### Step-By-Step Procedure
1. Log on to SAP BTP Cloud Foundry runtime and select the *org* and *space* of the instance where your application is deployed. 

2. You need to create a service key for your SAP HANA HDI Container service instance and add the key information to your local development environment. This can be achieved by executing the CDS command in your terminal: `cds deploy --to hana:<HDI Container service instance name> --profile hybrid --store-credentials`.

    For the Poetry Slam Manager application, this would be `cds deploy --to hana:poetry-slams-db --profile hybrid --store-credentials`.

    Now, the files *default-env.json* and *cdsrc-private.json* are created at the root level of your project:
    - The *default-env.json* has the service key information with the credentials to connect to the SAP HANA Cloud database. 
    - The *cdsrc-private.json* stores the binding information. 
    
    Add both files to *.gitignore* because they contain confidential data.

3. Adapt the *package.json* file with new CDS profile hybrid:

    ```json
    "cds": {
      "requires": {
        "db": {
          "kind": "sql"
        },
        "[hybrid]": {
          "db": {
            "kind": "hana"
          }
        }
      }
    }
    ```

4. To run your application using the SAP HANA Cloud database, execute: `cds serve --profile hybrid`.
5. To run your unit tests, execute: `cds bind --exec --profile hybrid npm test`.
