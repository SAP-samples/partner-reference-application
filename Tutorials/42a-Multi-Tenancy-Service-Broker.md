# Enable API Access to SAP BTP Applications Using Service Broker

In the multi-tenant setup, the OData services the UI is based on are not directly accessible. To enable access to application OData services, you make use of a service broker using tenant-specific credentials. It issues OAuth2 client credentials that are specific to the application tenant, and APIs that ensure tenant isolation. The OAuth2 client credentials can be used for inbound API integration scenarios, which enables integration between your SAP BTP application and third-party applications and SAP Build solutions.

> Note: Service broker is an implementation of the Open Service Broker API.

To try this feature with Poetry Slam Manager, you have two options:

A. Clone the repository of the Partner Reference Application. Check out the *main-multi-tenant* branch and enhance the application step-by-step.

B. Alternatively, check out the *main-multi-tenant-features* branch, in which the feature is already included.

The following section describes how you enhance the *main-multi-tenant* branch (option A).

## Optional: Add API-Specific Authorizations

When you want to have different access authorizations for APIs, for example, full access with all authorizations such as *PoetrySlamManagerRoleCollection* and read-only access for other integrations, introduce a new scope: 

1. Add a read-only scope to [*xs-security.json*](../../../blob/main-multi-tenant-features/xs-security.json) and add an entry to the *scopes* list:
     ```json
      {
        "name": "$XSAPPNAME.PoetrySlamReadonly",
        "description": "Read-only Access to PoetrySlams"
      }
     ```

2. Add the scope to the authorization annotations in [*poetrySlamManagerServiceAuthorizations.cds*](../../../blob/main-multi-tenant-features/srv/poetrySlamManagerServiceAuthorizations.cds):
   1. Add the scope to the *requires* list of the service.
      ```
      annotate PoetrySlamManager with @(requires: [
        'PoetrySlamFull',          // Full authorization for managers
        'PoetrySlamRestricted',    // Restricted access for visitors
        'PoetrySlamReadonly'       // Read-only access for APIs
      ]);
      ```
   2. Add the scope with the correct restriction to the different entities.
      ```
      {
        // Read-only access
        grant: ['READ'],
        to   : 'PoetrySlamReadonly'
      }
      ```

## Add a Service Broker to Your SAP BTP Applications

1. Add the line below to [*xs-security.json*](../../../blob/main-multi-tenant-features/xs-security.json).
    > Note: This line prevents technical internal scopes from being exposed through the service broker.
   ```json
   "authorities-inheritance": false
   ```

2. Create a service broker Node.js application:
   1. Create a new directory called `broker` in the project root folder.
   2. Run the command `npm init` in the new folder to initialize the Node.js project.
      > Note: You're prompted to answer several questions. You can use the values `psmbroker` as a package name and `Servicebroker for the Poetry Slam Manager sample application` as a description. Use the default values for all other fields. Once completed, this command creates a [*package.json*](../../../blob/main-multi-tenant-features/broker/package.json) file in the broker directory. Now, due to this file, SAP BTP Cloud Foundry runtime identifies it as a Node.js application.

3. Adopt the newly created *package.json*:
    Remove the line specifying the value for `main` in the newly created *package.json*. You can use [*package.json*](../../../blob/main-multi-tenant-features/broker/package.json) as a reference.

4. Add the service broker framework:
   
   Execute the command `npm install @sap/sbf` in the *broker* folder to download the *@sap/sbf* package and add it to your service broker.
     > Note: Make sure that you execute the commands above in the [*broker folder*](../../../blob/main-multi-tenant-features/broker). This will add a dependency in your *package.json*. It also creates a *node_modules* folder and a *package-lock.json*.

5. Add the service broker start script:
    
    Edit the [*package.json*](../../../blob/main-multi-tenant-features/broker/package.json) file of the *broker* folder and add the start command in the *scripts* section.
     ```json
       "scripts": {
         "start": "start-broker"
       }
     ```

6. Specify the required Node.js version:
   
   Add the following property in the [*package.json*](../../../blob/main-multi-tenant-features/broker/package.json) file to inform SAP BTP Cloud Foundry runtime that the service broker requires Node.js in a specific version.
     ```json
       "engines": {
          "node": ">=16.17.1 <19.0.0"
       }
     ```
7. Create the service catalog:
   1. Create a file called [*catalog.json*](../../../blob/main-multi-tenant-features/broker/catalog.json) in the current *broker* directory and describe the service catalog.
      > Note: The service catalog describes the services offered by this service broker. It's defined in a JSON format as described in the [SAP BTP Cloud Foundry runtime documentation](https://docs.cloudfoundry.org/services/api.html#catalog-management).

      > Note: The Partner Reference Application defines 3 different plans. The plans are used to define different authorization scopes, which is done in the `mta.yaml` further below.
    Here's an example of `catalog.json`:
      ```json
      {
        "services": [
          {
            "name": "psm-servicebroker",
            "description": "PSM service broker",
            "bindable": true,
            "plans": [
              { "name": "fullaccess", "description": "Full Access plan" },
              { "name": "readonlyaccess", "description": "Read-only Access plan" },
              { "name": "namedaccess", "description": "Access plan for named users" }
            ]
          }
        ]
      }
      ```
   2. Execute the command `npx gen-catalog-ids` to generate unique IDs for the services and their plans in the *catalog.json* file.
   3. After ID generation, your *catalog.json* looks like the [sample *catalog.json*](../../../blob/main-multi-tenant-features/broker/catalog.json).
   4. You can now delete the *node_modules* folder and the *package-lock.json* in the *broker* folder.

8. Reuse the SAP Authorization and Trust Management service instance previously created (nothing to do here).
   - The service broker can use different services to generate and store credentials that are needed later on by applications to access your reusable service. In this example, the existing SAP Authorization and Trust Management service (_XSUAA service_) is used as a credentials provider.
   - An SAP Authorization and Trust Management service (_XSUAA service_) instance with _service-plan: broker_ is already configured to be created via configuration in the project deployment descriptor file [*mta.yaml*](../../../blob/main-multi-tenant-features/mta.yaml).

9. Reuse the instance of the SAP Audit Log service (see [Manage Data Privacy](./41-Manage-Data-Privacy.md)).
   - The service broker is configured by default to audit log every operation. It needs information to connect to the SAP Audit Log service.
   - A _service: auditlog_ instance is created via configuration in the project deployment descriptor file [*mta.yaml*](../../../blob/main-multi-tenant-features/mta.yaml).

10. Generate a secure broker password (nothing to do here).
    - Later, you create instances of the service broker service per consumer tenant. To do so, you need to authenticate the consumer instance against the provider instance with credentials that you define in the provider.
    - You can execute the command `npx hash-broker-password -b` to generate a random password hash, which you can use as specified credentials. However, this would mean that the credentials are stored in the *mta.yaml* in the next step. Instead, use credentials that are automatically generated during deployment.

11. Create a service broker application manifest:
    
    Add a module in _poetry-slams-servicebroker_ in the deployment descriptor [*mta.yaml*](../../../blob/main-multi-tenant-features/mta.yaml) file.

    Here's a sample configuration:
      ```yml
      - name: poetry-slams-servicebroker
        type: nodejs
        path: broker
        parameters:
          disk-quota: 1024M
          memory: 128M
          health-check-timeout: 180
        requires:
          - name: poetry-slams-auth
          - name: poetry-slams-auditlog
          - name: srv-api
        build-parameters:
          builder: npm
        properties:
          SBF_CATALOG_SUFFIX: ${space}  # Make the service broker unique in the deployed space
          SBF_ENABLE_AUDITLOG: true
          SBF_BROKER_CREDENTIALS: '{ "${generated-user}": "${generated-password}" }'    # use a random password that is generated during deployment (not that this will change the password with every deplyoment)
          SBF_SERVICE_CONFIG:
            psm-servicebroker:
              extend_xssecurity:
                per_plan:
                  fullaccess:
                    authorities:
                      - "$XSMASTERAPPNAME.PoetrySlamFull"
                  readonlyaccess:
                    authorities:
                      - "$XSMASTERAPPNAME.PoetrySlamReadonly"
                  namedaccess:
                    authorities:
              extend_credentials:
                shared:
                  endpoints:
                    psm-servicebroker: "~{srv-api/srv-url}" # Tenant-specific OData endpoint for remote integrations
      ```

    - The additional service configuration (SBF_SERVICE_CONFIG) is a JSON object that provides additional deploy-time configuration. Usually, this is used for configurations which are not known in advance such as URLs. 
    - See [the documentation of the `@sap/sbf` module](https://www.npmjs.com/package/@sap/sbf#additional-service-configuration) for more details.
    - Each key in this object matches a service name in the [*catalog.json*](../../../blob/main-multi-tenant-features/broker/catalog.json). In the Partner Reference Application, this is *psm-servicebroker*.
      Its value is an object with the following properties:
        - `extend_xssecurity`: an object that contains the property `per_plan`. It consists of objects for each plan as defined in the [*catalog.json*](../../../blob/main-multi-tenant-features/broker/catalog.json). The Partner Reference Application has the plans `fullaccess` and `readonlyaccess` for **technical-user access**. The object for each plan contains the property `authorities`, which includes values that match the scope as defined in the [*xs-security.json*](../../../blob/main-multi-tenant-features/xs-security.json). In addition, the plan `namedaccess` has no authorities. It's used for **named-user access** to make sure that the authorization scopes will be the ones of the user that is logged on. You can find more information on how to use technical and named users in the next section.
        - `extend_credentials`: An object that contains the property `shared`. It consists of an object where service end points are defined. The service name `psm-servicebroker` matches the name of the service in [*catalog.json*](../../../blob/main-multi-tenant-features/broker/catalog.json).

12. To test with named users, you need an authorization code. For this code, you will need a `callback url`. 

In the tests provided in the next chapter, `http://localhost` will be used as `callback url`. You must declare this to the authorization service to ensure that this service accepts corresponding authorization request. For this purpose, add it to the configuration in the [*mta.yaml*](../../../blob/main-multi-tenant-features/mta.yaml) file.

    Here is the corresponding addition:
  
      ```yml
      resources:
        - name: poetry-slams-auth
          parameters:
            config:
              oauth2-configuration:
                redirect-uris:
                  - http://localhost # Redirect for local testing with the service broker
      ```

13. Build and deploy the multi-tenant application to the provider SAP BTP subaccount.

In the next step, you create an instance of the service broker in a consumer subaccount and use it to access the OData service of the application. Go to [Configure and Consume the APIs of the SAP BTP Application](./42b-Multi-Tenancy-Provisioning-Service-Broker.md).
