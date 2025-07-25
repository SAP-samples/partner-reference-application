# Enhance the Core Application for Deployment

With this tutorial, you learn how to enhance the core application as described in the first tutorials for deployment. You can either enhance the core application to a deployable multi-tenant solution following the step-by-step guide below or you can fast-forward and deploy the *main-multi-tenant* branch.   

## Option 1: Fast-Forward 
If you want to start right away with a working multi-tenant implementation, clone the branch [*main-multi-tenant*](../../../tree/main-multi-tenant) and start deploying it. 

To fast-forward:

1. In the development subaccount SAP BTP cockpit (subaccount level), navigate to *Instances and Subscriptions*, open *SAP Business Application Studio*, and open the dev space *PoetrySlams* created during the [Prepare Your SAP Business Technology Platform Account for Development](./11-Prepare-BTP-Account.md).

2. Use the tile *Clone from Git* on the *Welcome* view to clone this GitHub repository (https://github.com/SAP-samples/partner-reference-application) and switch to the branch *main-multi-tenant*.

3. You can now [deploy the multi-tenant application to the provider SAP BTP account](./24-Multi-Tenancy-Deployment.md).

## Option 2: Develop the Multi-Tenant Application

In this approach, you use the core application as developed in the previous parts of this tutorial and add changes to enable deployment as a multi-tenant application (as contained in the branch [*main-multi-tenant*](../../../tree/main-multi-tenant)). 

Therefore, open the Partner Reference Application you developed before in the SAP Business Application Studio of your development account. 

Follow the steps described in this section to enhance your application. Additionally, find detailed information in
- the [CAP Multitenancy Documentation](https://cap.cloud.sap/docs/guides/multitenancy/)
- the [SAP BTP Implemented Application Router Documentation](https://help.sap.com/docs/btp/sap-business-technology-platform/application-router).

### Prepare Your Project Configuration for Cloud Foundry Deployments

Make some adjustments to ensure that the application can be deployed to SAP BTP Cloud Foundry runtime as a central launchpad component.

1. Adopt the [*./app/poetryslams/webapp/manifest.json*](../../../tree/main-multi-tenant/app/poetryslams/webapp/manifest.json).
  
    1. Ensure that the service name is defined in the web app configuration file [*./app/poetryslams/webapp/manifest.json*](../../../tree/main-multi-tenant/app/poetryslams/webapp/manifest.json). 

        > Note: This service name must be unique within your account and will appear in the runtime URL of the application.

        ```json
        "sap.cloud": {
          "service": "poetryslammanager",
          "public": true
        }
        ```

    2. In the *dataSources* section, adopt the `uri` by removing the `/` before `odata`. The URI of the data sources is changed now to a relative path.

        ```json
        "dataSources": {
          "mainService": {
            "uri": "odata/v4/poetryslamservice/",
            "type": "OData",
            "settings": {
              "annotations": [],
              "odataVersion": "4.0"
            }
          }
        }
        ```

2. Do the same for the [*./app/visitors/webapp/manifest.json*](../../../tree/main-multi-tenant/app/visitors/webapp/manifest.json) of the *Visitors* application accordingly.

### Adjust the Multitenancy and App Router Features 
When creating the CAP project using the wizard in the tutorial [Develop the Core of the SAP BTP Application](14-Develop-Core-Application.md), several files were created that include the configuration for modules and resources required for multi-tenancy:

- The folder [*app/router*](../../../tree/main-multi-tenant/app/router) containing an implemented approuter (also called standalone approuter).
- The file [*mtx/sidecar/package.json*](../../../tree/main-multi-tenant/mtx/sidecar/package.json) providing a module to handle [multitenancy, feature toggles and extensibility](https://cap.cloud.sap/docs/guides/multitenancy/mtxs).
- The file [*mta.yaml*](../../../tree/main-multi-tenant/mta.yaml) in the root folder, containing required modules and resources.
- The [*package.json*](../../../tree/main-multi-tenant/package.json) file in the root folder.

Now, follow the next steps to make further required changes: 
1. Go to the [*mta.yaml*](../../../tree/main-multi-tenant/mta.yaml) file in the root folder. Note that a correct indentation is important in this file.

    1. Replace all occurrences of the string `partner-reference-application` with `poetry-slams`. This makes the names of the created service instances more consistent. You can also create a meaningful description.

    2. Enhance the build parameters to install the node modules with the CDS development kit and copy the common data model json which is required for SAP Build Work Zone before the build.
        ```yml
        build-parameters:
          before-all:
            #  Defines the build parameter
            - builder: custom
              commands:
                - npm ci --omit=dev
                # [Workzone] Create resources folder and copy cdm.json
                - mkdir -p resources
                - cp workzone/cdm.json resources/cdm.json
                - npx -p @sap/cds-dk cds build --production
        ```

    3. Add and configure the destination content module. This is where you define destinations and service keys for the destinations that are automatically created in the provider subaccount. 

        > Note that the subpath *poetryslammanager* in the attribute `URL` of the destination `poetry-slams-cdm` below must match the value in the field `service` of the object `sap.cloud` defined in the files [*./app/poetryslams/webapp/manifest.json*](../../../tree/main-multi-tenant/app/poetryslams/webapp/manifest.json) [*./app/visitors/webapp/manifest.json*](../../../tree/main-multi-tenant/app/visitors/webapp/manifest.json).

        ```yml
        modules:
          # Destinations
          # Creates destination in subaccount of type OAuth2ClientCredentials to access HTML5 repo
          - name: poetry-slams-destinations-content
            type: com.sap.application.content
            requires:
              - name: poetry-slams-html5-runtime
                parameters:
                  service-key:
                    name: poetry-slams-html5-runtime-key
              - name: poetry-slams-destination
                parameters:
                  content-target: true
            build-parameters:
              no-source: true
            parameters:
              content:
                subaccount:
                  existing_destinations_policy: update
                  destinations:
                    - Name: poetry-slams-cdm
                      Description: Destination for the workzone configuration of solution poetryslammanager
                      ServiceInstanceName: poetry-slams-html5-runtime
                      ServiceKeyName: poetry-slams-html5-runtime-key
                      URL: https://html5-apps-repo-rt.${default-domain}/applications/cdm/poetryslammanager # Adds workzone configuration of solution poetryslammanager
        ```

    4. Go to the `poetry-slams-srv` module.
        1. Replace the `builder` module *npm* with *npm-ci*.
        2. Replace the name `srv-api` in "`provides`" with `poetry-slams-srv-api`.

    5. Replace the `poetry-slams-app-deployer` module with the following content:
     
        ```yaml
          # App UI content deployer module
          # Uploads the static content of the HTML5 application and deploys it to the HTML5 repository
          - name: poetry-slams-app-content
            type: com.sap.application.content
            path: .
            requires:
              - name: poetry-slams-srv-api
              - name: poetry-slams-auth
              - name: poetry-slams-html5-repo-host
                parameters:
                  content-target: true
            parameters:
              config:
                destinations:
                  - forwardAuthToken: true
                    name: poetry-slams-srv-api
                    url: ~{poetry-slams-srv-api/srv-url}
            build-parameters:
              build-result: resources
              requires:
                - artifacts:
                    - poetryslams.zip
                  name: poetryslams
                  target-path: resources/
                - artifacts:
                    - visitors.zip
                  name: visitors
                  target-path: resources/
        ```

    6. Go to the `poetry-slams-mtx` module and replace the list with the required services by the following services. This does two things: It enables the mtx module to handle the subscription of the required services and changes the `SUBSCRIPTION_URL` delimiter from (-) to (.), which allows you to use generic routes for all tenants.

        ```yaml
            requires:
              - name: poetry-slams-db
              - name: poetry-slams-auth
              - name: poetry-slams-registry
              - name: poetry-slams-destination
              - name: poetry-slams-html5-repo-host
              - name: app-api
                properties:
                  SUBSCRIPTION_URL: ~{app-protocol}://\${tenant_subdomain}.~{app-uri}
        ```

    7. Go to the `poetry-slams` module (app router).

        1. Add a route to support the generic tenant routing (with (.) delimiter):

            ```yaml
                parameters:
                  keep-existing-routes: true
                  routes:
                    - route: '*.${default-uri}' # generic route for all subscriptions
            ```

        2. Adjust the properties to adopt the `TENANT_HOST_PATTERN` to fit the (.) delimiter and add properties for Content-Security-Policy and Cross-Origin Resource Sharing (CORS):

            ```yaml
                properties:
                  TENANT_HOST_PATTERN: '^(.*).${default-uri}'
                  # prettier-ignore
                  httpHeaders: "[{ \"Content-Security-Policy\": \"default-src 'self' https://sapui5.hana.ondemand.com; frame-ancestors 'self' https://*.hana.ondemand.com; object-src 'none';\"}]"
                  CORS:
                    - uriPattern: .*
                      allowedOrigin:
                        - host: '*.${default-uri}'
                          protocol: 'https'
            ```

        3. Replace `srv-api` in the "`requires`" section with `poetry-slams-srv-api` (2 occurrences).

            > Note: This name must be identical to the destination name defined in the [*./app/poetryslams/xs-app.json*](../../../tree/main-multi-tenant/app/poetryslams/xs-app.json).  

        4. Add `redirect-uris` to the properties of the provided function `app-api`:

            ```yaml
                provides:
                  - name: app-api
                    properties:
                      app-protocol: ${protocol}
                      app-uri: ${default-uri}
                      redirect-uris: ${protocol}://*.${default-uri}/** # Redirect URI to connect modules running on different Cloud Foundry landscapes (e.g. eu10 / eu10-004)
            ```

    8. Adjust the destination service resource (*poetry-slams-destination*). This includes the *poetry-slams-srv-api* as defined in the *destination* for the route as defined in the web application configuration files [*./app/poetryslams/xs-app.json*](../../../tree/main-multi-tenant/app/poetryslams/xs-app.json) and [*./app/visitors/xs-app.json*](../../../tree/main-multi-tenant/app/visitors/xs-app.json) in the `requires` section.

        > Note: There will be two destinations created that are required for the SAP Build Work Zone integration: the runtime destination of the launchpad and the destination to access the poetry slams service module.

        ```yml
        resources:
          # Destination service
          # Offers a predefined configuration that simplifies connecting to the service
          - name: poetry-slams-destination
            type: org.cloudfoundry.managed-service
            requires:
              - name: poetry-slams-srv-api
              - name: poetry-slams-auth
            parameters:
              service: destination
              service-plan: lite
              config:
                init_data:
                  subaccount:
                    existing_destinations_policy: update
                    destinations:
                      - Name: poetry-slams-rt
                        Description: Runtime destination of the launchpad, required for workzone
                        Authentication: NoAuthentication
                        ProxyType: Internet
                        Type: HTTP
                        URL: https://${org}.launchpad.${default-domain} # Runtime destination of launchpad, required for workzone
                        CEP.HTML5contentprovider: true
                      - Name: poetry-slams-srv-api
                        Description: Destination to access the poetry slams service module, required for workzone
                        Authentication: NoAuthentication
                        ProxyType: Internet
                        Type: HTTP
                        URL: https://${org}-${space}-poetry-slams-srv.${default-domain} # Destination to access the poetry slams service module, required for workzone
                        HTML5.DynamicDestination: true
                        HTML5.ForwardAuthToken: true
                HTML5Runtime_enabled: false
        ```

    9. Go to the `poetry-slams-auth` resource. 

        1. Change the service plan from `application` to `broker`. This will give you more flexibility when extending the application functionality later.

            ```yaml
                parameters:
                  service-plan: broker
            ```
      
        2. Add `app-api` to the `requires` list:
            ```yaml
                requires:
                  - name: app-api
            ```

        3. In case the approuter and the authorization service are running in different Cloud Foundry landscapes (for example, `eu10` and `eu10-004`), the `oauth2` configuration needs to support this:
            ```yaml
                parameters:
                  config:
                    oauth2-configuration:
                      redirect-uris:
                        - ~{app-api/redirect-uris} # Redirect for approuter, required if xsuaa and approuter are running on different Cloud Foundry landscapes (e.g. eu10 / eu10-004)
            ```            

    10. Go to the `poetry-slams-registry` resource and change the `displayName`, `description`, and `category` configurations. These are used by subscriber subaccounts to find the application:
        ```yaml
            parameters:
              config:
                displayName: Poetry Slam Manager
                description: Manage poetry slam events and bookings of artists and visitors.
                category: 'Applications / Multi-Customer Partner Solutions'
        ```

    11. After you've applied the changes described above in the file *mta.yml*, this is what the file will look like: [the MTA file of the sample application](../../../tree/main-multi-tenant/mta.yaml).
        > Note: There can be differences in comments or the sequence of entries. However, be aware that a correct indentation is required.

2. In the folder [*app/router*](../../../tree/main-multi-tenant/app/router):
    1. *default-env.json*: You can delete this file. It is intended for local testing but not required. It is ignored by the *.gitignore* file of this repository anyway.
    2. Go to the app router config file located in the *app/router* folder ([*xs-app.json*](../../../tree/main-multi-tenant/app/router/xs-app.json)). Ensure that the file is as follows:

        ```json
        {
          "welcomeFile": "poetryslams/",
          "routes": [
            {
              "source": "^/-/cds/.*",
              "destination": "mtx-api",
              "authenticationType": "none"
            },
            {
              "source": "^(.*)$",
              "target": "$1",
              "service": "html5-apps-repo-rt",
              "authenticationType": "xsuaa"
            }
          ]
        }
        ```

3. In the *Poetry Slams* application routing config file that is located in the *app/poetryslams* folder ([xs-app.json](../../../tree/main-multi-tenant/app/poetryslams/xs-app.json)), route the default path to the `index.html` file and offer a path to the OData service. Remove the routes that are not required. You defined the destination *poetry-slams-srv-api* before as part of the project configuration *mta.yml* file. Ensure that the application [*xs-app.json*](../../../tree/main-multi-tenant/app/poetryslams/xs-app.json) config file is as follows: 

    ```json
    {
      "welcomeFile": "/index.html",
      "authenticationMethod": "route",
      "routes": [
        {
          "source": "^/odata/v4/poetryslamservice/(.*)$",
          "target": "/odata/v4/poetryslamservice/$1",
          "destination": "poetry-slams-srv-api",
          "authenticationType": "xsuaa",
          "csrfProtection": true
        },
        {
          "source": "^(.*)$",
          "target": "$1",
          "service": "html5-apps-repo-rt",
          "authenticationType": "xsuaa"
        }
      ]
    }
    ```

    > Note: The order of routes is crucial as the most specific one must come first.

4. In this project, the implemented approuter uses the [*index.html*](../../../tree/main-multi-tenant/app/poetryslams/webapp/index.html) file located in the */app/poetryslams/webapp/* folder to serve the web page. Copy the files [*initAppStyle.css*](../../../tree/main-multi-tenant/app/poetryslams/webapp/util/initAppStyle.css) and [*index.html*](../../../tree/main-multi-tenant/app/poetryslams/webapp/index.html) into the folder */app/poetryslams/webapp/util/* of your project to avoid inline style definitions and content security policy violations: 

5. Repeat steps 3 and 4 for the *Visitors* application (see [*index.html*](../../../tree/main-multi-tenant/app/visitors/webapp/index.html), [*initAppStyle.css*](../../../tree/main-multi-tenant/app/visitors/webapp/util/initAppStyle.css) and [*xs-app.json*](../../../tree/main-multi-tenant/app/visitors/xs-app.json)).

6. Ensure that the scope `mtcallback` is available in the [*xs-security.json*](../../../tree/main-multi-tenant/xs-security.json). Check the documentation for more details: [XSUAA](https://cap.cloud.sap/docs/java/multitenancy-classic#xsuaa-mt-configuration).:

    ```json
      "scopes": [
        {
          "name": "$XSAPPNAME.mtcallback",
          "description": "Subscription via SaaS Registry",
          "grant-as-authority-to-apps": [
            "$XSAPPNAME(application,sap-provisioning,tenant-onboarding)"
          ]
        }
      ]
    ```
        
7. Adjust the [*package.json*](../../../tree/main-multi-tenant/package.json) in the *root* folder.

    1. Ensure that the profile *mtx-sidecar* is available. For more information, check the documentation: [SaaS Registry Dependencies](https://cap.cloud.sap/docs/guides/multitenancy/#saas-registry-dependencies):

      ```json
      "cds": {
        "profile": "mtx-sidecar"
      }
      ```

    2. Additionally, rename `partner-reference-application` in the *undeploy* step to `poetry-slams`.

8. Adjust the [*package.json*](../../../tree/main-multi-tenant/mtx/sidecar/package.json) of the mtx module by adding the required services:

    ```json
      "cds": {
        "profile": "mtx-sidecar",
        "requires": {
          "auth": "xsuaa",
          "destinations": true,
          "html5-host": {
            "vcap": {
              "label": "html5-apps-repo",
              "plan": "app-host"
            },
            "subscriptionDependency": {
              "uaa": "xsappname"
            }
          }
        }
      }
    ```

### Adopt NPM Modules
The CDS libraries are offered as npm modules in the *package.json*. After the creation of the SAP Cloud Application Programming Model (CAP) project using the wizard, the npm *rimraf* module is added to the [*./package.json*](../../../tree/main-multi-tenant/package.json) as a development dependency. Move this module to the *dependencies* section. This facilitates the handling of the command `npm run build`.

### Enhance the Application with the Common Data Model for SAP Build Work Zone
SAP Build Work Zone is used as a central launchpad for the Partner Reference Application. To be content provider for [SAP Build Work Zone](https://help.sap.com/docs/build-work-zone-advanced-edition/sap-build-work-zone-advanced-edition/integrating-business-content), a [common data model (CDM)](https://help.sap.com/docs/cloud-portal-service/sap-cloud-portal-service-on-cloud-foundry/creating-cdm-json-file-for-multi-tenancy-html5-app) needs to be defined. The common data model defines the design-time business content of the application.

To add the CDM to your application, follow these steps:

1. Create a folder under the root folder of your project named *workzone*.

2. Copy the [*cdm.json*](../../../tree/main-multi-tenant/workzone/cdm.json) into the newly created *workzone* folder. This creates a group with the applications *poetryslams* and *visitors* and two roles during the SAP Build Work Zone configuration that is done during the provisiong of a customer subaccount. The *texts*-sections are required for translation.
  
Your project is now consistent with the [*main-multi-tenant*](../../../tree/main-multi-tenant) branch. You can [deploy the multi-tenant application to the provider SAP BTP account](./24-Multi-Tenancy-Deployment.md).
