# Test and Troubleshoot the Application

When developing a productive application, quality assurance and the detection of issues are essential.

## Manual Test

You can manually test the application on your local machine:  

1. Run the command `npm install` on the command line interface to install the node modules defined in *package.json*.
2. [Optional] Only in the *main-multi-tenant-features* branch, run command `npm run prebuild`. This generates access classes to external APIs and is required to avoid syntax errors in the application and unit tests.
3. Run the command `cds watch`. This will start a Node.js server including the web application. The server uses an SQLight database which makes local testing easy. 

## Automated Tests

For quality assurance to check if the application still works as expected, it's important to use automated tests that are executed when changes to the data model, services, or the user interface have been made.

### SAP Cloud Application Programming Model Unit Tests

The data model and services can be tested with the SAP Cloud Application Programming Model unit test framework. The framework uses standard JavaScript libraries such as Chai and Mocha. A reference test implementation can be found in the folder */test/*. There are tests available for the entity model (folder */db/*) and for the service (folder */srv/*).

There are two ways to test the services in SAP Cloud Application Programming Model, either through service APIs or through HTTP APIs. For more details, go to the [SAP Cloud Application Programming Model documentation on testing with cds.test](https://cap.cloud.sap/docs/node.js/cds-test). 

#### Example of a Service API

The service API is used to test the Poetry Slam Manager entity model in [poetrySlamManagerModel.test.js](../../../tree/main-multi-tenant/test/db/poetrySlamManagerModel.test.js).

In the following example, a visit is selected from the database and is to be recreated. However, the creation must be rejected due to uniqueness of the pair *poetrySlam_ID* and *visitor_ID*. 

```javascript
it('should ensure the uniqueness of the combination of visitor ID and poetry slam ID', async () => {
  const { Visits } = db.model.entities;
  const result = await SELECT.one
    .from(Visits)
    .columns('parent_ID', 'visitor_ID');

  await expect(db.create(Visits).entries(result)).to.rejected;
});
```

#### Example of an HTTP API

The HTTP API is used to test the Poetry Slam Manager service. There is one test file for each entity and a file to test the OData function of the service. Axios is used as HTTP client in the tests. The authorization is set to the user *Peter*.

In the following example, in the *beforeEach* function, the [sample data is reset](https://cap.cloud.sap/docs/node.js/cds-test#test-data-reset) and newly created. Besides this, all poetry slams are read using an OData GET call. In the test, a published poetry slam is selected and the *Cancel* action is executed using OData. It checks if the status is correctly set to *Canceled*. Afterwards, the entry is read and the status code and criticality are checked. You can find the tests in [poetrySlamServicePoetrySlams.test.js](../../../tree/main-multi-tenant/test/srv/poetryslam/poetrySlamServicePoetrySlams.test.js).

> Note: In the *beforeEach* function, the OData action *createTestData* is called. The action creates sample data for the entities *poetryslams*, *visitors* and *visits*. This is for demo purposes only.

```javascript

const ACTION = (url, name, parameters = {}) => POST (url+ `/PoetrySlamService.${name}`,parameters); 

axios.defaults.auth = { username: 'peter', password: 'welcome' };

describe('Poetryslams in PoetrySlamService', () => {
  let poetrySlams;

  beforeEach(async () => {
    await test.data.reset();
    await POST(`/odata/v4/poetryslamservice/createTestData`);

    // Read all poetry slams for usage in the tests
    poetrySlams = await GET(`/odata/v4/poetryslamservice/PoetrySlams`, {
      params: { $select: `ID,status_code,statusCriticality` }
    });
    expect(poetrySlams.data.value.length).to.greaterThan(0);
  });

  it('should change the status of poetry slams in action cancel on published entities', async () => {
      const id = poetrySlams.data.value.find(
        (poetrySlam) => poetrySlam.status_code === poetrySlamStatusCode.published
      ).ID;

      const actionResult = await ACTION(
        `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
        'cancel'
      );
      expect(actionResult.data.status_code).to.eql(poetrySlamStatusCode.canceled);

      // Read the status of the poetry slam and check that it was canceled
      const result = await GET(
        `/odata/v4/poetryslamservice/PoetrySlams(ID=${id},IsActiveEntity=true)`,
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

1. Copy the [entity unit tests](../../../tree/main-multi-tenant/test/db) to your project.
2. Copy the [service unit tests](../../../tree/main-multi-tenant/test/srv) to your project.
3. Add the Mocha, Chai, and Axios devDependencies to your *package.json*:
  
    1. Run command `npm add mocha -D`.
    2. Run command `npm add chai -D`.
    3. Run command `npm add chai-as-promised -D`.
    4. Run command `npm add chai-subset -D`.
    5. Run command `npm add axios -D`.
  
    > Note: You can compare this with the [*package.json* of the example implementation](../../../tree/main-multi-tenant/package.json). 

4. Copy the script with the name *test* to your *package.json*. 
5. Copy the Mocha configuration file [*.mocharc.json*](../../../tree/main-multi-tenant/.mocharc.json) to your project.

To run the automated SAP Cloud Application Programming Model tests:

1. Run the command `npm install` in a terminal in SAP Business Application Studio.
2. [Optional] Only in *main-multi-tenant-features* branch, run command `npm run prebuild`. This generates access classes to external APIs and is required to avoid syntax errors in the application and unit tests.
3. Enter the command `npm run test`. All tests will be executed and the result will be shown afterwards.

### One Page Acceptance (OPA5) Tests

You can execute user interface and integration testing with the help of One Page Acceptance Tests (OPA5). A minimalist test setup is created by default when you first create an SAP Fiori application with the wizard as described in [Develop the Core of the SAP BTP Application](./14-Develop-Core-Application.md).

OPA5 tests are built on the QUnit testing framework. They simulate and check user interaction with the UI.

The tests are located in the directories [*app/poetryslams/webapp/test*](../../../tree/main-multi-tenant/app/poetryslams/webapp/test) and [*app/visitors/webapp/test*](../../../tree/main-multi-tenant/app/visitors/webapp/test).

> Note: Before you can execute the file **opaTests.qunit.html**, adjust it manually. To run the tests, add `https://sapui5.hana.ondemand.com/<version>/` in front of the referenced resources in the file. You can have a look at the [*app/poetryslams/webapp/test/integration/opaTests.qunit.html*](../../../tree/main-multi-tenant/app/poetryslams/webapp/test/integration/opaTests.qunit.html) of the reference application. 

1. Start the local server: `npm run start`
2. To execute OPA5 tests for the *Poetry Slams* application, open: `<host>/poetryslams/webapp/test/integration/opaTests.qunit.html` and open `<host>/visitors/webapp/test/integration/opaTests.qunit.html` for the *Visitors* application.

#### More Information

- [Integration Testing with One Page Acceptance Tests (OPA5)](https://sapui5.hana.ondemand.com/sdk/#/topic/2696ab50faad458f9b4027ec2f9b884d.html)
- [A First OPA Test](https://sapui5.hana.ondemand.com/sdk/#/topic/1b47457cbe4941ee926317d827517acb)
- [Test Suite and Automated Testing](https://sapui5.hana.ondemand.com/sdk/#/topic/07c97a2e497d443eb6fa74bb9445ab9c)
- API:
  - [sap.fe.test](https://sapui5.hana.ondemand.com/#/api/sap.fe.test)
  - [sap.ui.test](https://sapui5.hana.ondemand.com/#/api/sap.ui.test)

## Testing Your Application During Development

When developing your application in SAP Business Application Studio, you can always start your application using `cds watch` or `cds serve` (refer to [Jumpstarting a CAP project](https://cap.cloud.sap/docs/get-started/in-a-nutshell#jumpstart)).

> Note: In case you get the error "port 4004 already used" and you cannot close a previously started `cds watch` (because the corresponding terminal is already closed), you can stop this process using terminal commands. To achieve this, you can find the process using port 4004 with the command `netstat -nlp | grep 4004` in the terminal to find the process ID, and stop that process using `kill -2 <process id>`.

## Troubleshoot Your Application

There are several out-of-the-box tools that can be used to troubleshoot your application. Besides the options explained in the [CAP documentation on troubleshooting](https://cap.cloud.sap/docs/get-started/troubleshooting), a few general approaches are described below that can help identify where an issue originates from.

### Debug

You can debug locally with the standard Node.js debugging tools.
See also the [SAP Cloud Application Programming Model documentation on debugging](https://cap.cloud.sap/docs/tools/#debugging-with-cds-watch).

### Use Browser Development Tools

If you open the UI of your application and it doesn't look as expected, the browser development tools can help you identify the root cause of the issue in the application.

1. Open the browser development tools.

2. Check the requests and responses sent by the application (you may need to reload the page to see the errors). 

## Code Quality

Besides automated testing, code quality includes readability, maintainability, and compliance. There are several automated tools that help you to format your files in a consistent way, check for possible implementation, license or security issues, and update the included external packages. To keep your application up to date, you should configure such tools. See also [Update Project Dependencies](./14-Develop-Core-Application.md#update-project-dependencies).

## Test Multi-Tenant Applications

The information above refers to the locally running application. You can also refer to [Test and Troubleshoot Multitenancy](26-Test-Trace-Debug-Multi-Tenancy.md) for the deployed application and [Test and Troubleshoot the ERP Integration](32-Test-Trace-Debug-ERP.md).
