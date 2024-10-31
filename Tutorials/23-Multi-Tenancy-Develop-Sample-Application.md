# Enhance the Core Application for Multitenancy

With this tutorial, you learn how to create a multi-tenant application based on the core application as described in the first tutorials for a one-off solution. You can either enhance the one-off solution to a multi-tenant solution following the step-by-step guide below or you can fast-forward and deploy the *main-multi-tenant* branch.   

## Option 1: Fast-Forward 
If you want to start right away with a working multi-tenant implementation, clone the branch [*main-multi-tenant*](../../../tree/main-multi-tenant) and start deploying it. 

To fast-forward:

1. In the development subaccount SAP BTP cockpit (subaccount level), navigate to *Instances and Subscriptions*, open *SAP Business Application Studio*, and open the dev space *PoetrySlams* created during the [Prepare Your SAP Business Technology Platform Account for Development](./11-Prepare-BTP-Account.md).

2. Use the tile *Clone from Git* on the *Welcome* view to clone this GitHub repository (https://github.com/SAP-samples/partner-reference-application) and switch to the branch *main-multi-tenant*.

3. You can now [deploy the multi-tenant application to the provider SAP BTP account](./24-Multi-Tenancy-Deployment.md).

## Option 2: Develop the Multi-Tenant Application

In this approach, you keep the core of your single-tenant application (as contained in the branch [*main-single-tenant*](../../../tree/main-single-tenant)) and add changes to enable deployment as a multi-tenant application (as contained in the branch [*main-multi-tenant*](../../../tree/main-multi-tenant)). You can easily compare both branches using [GitHub comparison](https://github.tools.sap/erp4sme/partner-reference-application/compare/main-single-tenant..main-multi-tenant). 

> Note: The comparison contains both the multi-tenant enablement and the enhancement for the integration with different ERP back ends.

Therefore, clone the Partner Reference Application and switch to the branch *main-single-tenant* in the SAP Business Application Studio of your development account. 

Follow the steps described in this section to enhance your application. Additionally, find detailed information in
- the [CAP Multitenancy Documentation](https://cap.cloud.sap/docs/guides/multitenancy/)
- the [SAP BTP Implemented Application Router Documentation](https://help.sap.com/docs/btp/sap-business-technology-platform/application-router).

### Add the Multitenancy and App Router Features 
In your terminal in SAP Business Application Studio, use the `cds add <feature>` command to add multitenancy and the app router.
```console
cds add multitenancy,approuter --for production
```

This creates the following:
 - *mtx* folder with subfolder *sidecar*, containing a [*package.json*](../../../tree/main-multi-tenant/mtx/sidecar/package.json).
 - *router* folder within the preexisting *app* folder.
 - [*package.json*](../../../tree/main-multi-tenant/app/router/package.json) within the newly created *router* folder.
   > Note: You can remove the field „engines“ from the originally created file. It sets the node version which is not required since the available node version during runtime is defined by SAP Cloud Foundry and updated automatically on a regular basis.
 - [*xs-app.json*](../../../tree/main-multi-tenant/app/router/xs-app.json) within the newly created *router* folder.

It also makes adjustments to the following:
  - In the root [*mta.yaml*](../../../tree/main-multi-tenant/mta.yaml) file, several changes are made related to the new modules and resources.
  - In the root [*package.json*](../../../tree/main-multi-tenant/package.json) file, changes are made related to the addition of the multitenancy feature.
 
Now, follow the next steps to make further required changes: 
 1. Go to the root [*mta.yaml*](../../../tree/main-multi-tenant/mta.yaml) file.

    1. As a prerequisite, find the string `partner-reference-application` and replace it with `poetry-slams`. This makes the names of the created service instances more consistent.

    2. Remove the module `poetry-slams-destination-content` as it is no longer required with the implemented app router.

    3. Go to the `poetry-slams-mtx` module.
        1. Change the `SUBSCRIPTION_URL` delimiter from (-) to (.), which allows you to use generic routes for all tenants:

            ```yaml
            requires:
              - name: app-api
                properties:
                  SUBSCRIPTION_URL: ~{app-protocol}://\${tenant_subdomain}.~{app-uri}
            ```
            
         2. Add `poetry-slams-auth`, `poetry-slams-html5-runtime`, `poetry-slams-registry` and `poetry-slams-destination-service` to the list of required services:
            
            ```yaml
            requires:
              - name: poetry-slams-auth
              - name: poetry-slams-html5-runtime
              - name: poetry-slams-registry
              - name: poetry-slams-destination-service
            ```

    4. Go to the `poetry-slams` module (app router).

        1. Add a route to support the generic tenant routing (with (.) delimiter):

            ```yaml
            parameters:
              keep-existing-routes: true
              routes:
                - route: '*.${default-uri}'
            ```

        2. Adopt the `TENANT_HOST_PATTERN` to fit the (.) delimiter and add properties for Content-Security-Policy and Cross-Origin Resource Sharing (CORS):

            ```yaml
            properties:
              TENANT_HOST_PATTERN: "^(.*).${default-uri}"
              # prettier-ignore 
              httpHeaders: "[{ \"Content-Security-Policy\": \"default-src 'self' https://sapui5.hana.ondemand.com; frame-ancestors 'self' https://*.hana.ondemand.com; object-src 'none';\"}]"
              CORS:
                - uriPattern: .*
                  allowedOrigin:
                    - host: '*.${default-uri}'
                      protocol: 'https'
            ```
        3. Add `poetry-slams-auth`, `poetry-slams-html5-runtime`, and `poetry-slams-destination-service` to the list of required services:
            ```yaml
            requires:
              - name: poetry-slams-auth
              - name: poetry-slams-html5-runtime
              - name: poetry-slams-destination-service
            ```
        4. Add `redirect-uris` to the properties of the provided function `app-api`:
            ```yaml
            provides:
              - name: app-api
                properties:
                  app-protocol: ${protocol}
                  app-uri: ${default-uri}
                  redirect-uris: ${protocol}://*.${default-uri}/** # Redirect URI to connect modules running on different Cloud Foundry landscapes (e.g. eu10 / eu10-004)
            ```

    5. In the `poetry-slams-destination-service` resource, remove all the settings that are handled by the application router in the multi-tenant application. These were only needed for the single-tenant implementation with a managed application router using SAP Build Work Zone. Therefore, replace the service with the following definition. 
          ```yaml
          - name: poetry-slams-destination-service
            type: org.cloudfoundry.managed-service
            parameters:
              service: destination
              service-plan: lite
          ```

    6. Go to the `poetry-slams-auth` resource.
        1. add `app-api` to the `requires` list:
            ```yaml
            requires:
              - name: app-api
            ```
        2. As `xsappname` needs to correspond to the config of the `poetry-slams-registry` resource, change this value to `poetry-slams-${org}-${space}`. Also, change the `tenant-mode` from `dedicated`to `shared`. In addition, the `oauth2` configuration needs to support requests from other Cloud Foundry landscapes (for example, `eu10` and `eu10-004`):
            ```yaml
            parameters:
              config:
                xsappname: poetry-slams-${org}-${space}
                tenant-mode: shared
                oauth2-configuration:
                  redirect-uris:
                    - ~{app-api/redirect-uris} # Redirect to connect modules running on different Cloud Foundry landscapes (e.g. eu10 / eu10-004)
            ```
        3. Ensure that the `service-plan` parameter is `broker` so that you can use features of the broker plan for later tutorials:
            ```yaml
            parameters:
              service-plan: broker
            ```

    7. Go to the `poetry-slams-registry` resource.
        1. Change the `displayName`, `description`, and `category` configurations. These are used by subscriber subaccounts to find the application:
           
           ```yaml
           parameters:
             config:
               displayName: Poetry Slam Manager
               description: Manage poetry slam events and bookings of artists and visitors.
               category: 'Applications / Multi-Customer Partner Solutions'
            ```

    8. Add the resource `poetry-slams-html5-runtime` of the service `html5-apps-repo` to the *mta.yaml* file to replace SAP Build Work Zone and add the following to the `resources` section:
        
        ```yaml
        -  name: poetry-slams-html5-runtime
           type: org.cloudfoundry.managed-service
           parameters:
             service: html5-apps-repo
             service-plan: app-runtime
        ```

  2. Go to the app router config file, which is located in the *app/router* folder ([*xs-app.json*](../../../tree/main-multi-tenant/app/router/xs-app.json)) and route the app router to the `poetryslams` application as the default. This will forward requests to the app router directly to the *Poetry Slams* application. Ensure that the file is as follows:

        ```json
        {
          "welcomeFile": "poetryslams/",
          "routes": [
            {
              "source": "^(.*)$",
              "target": "$1",
              "service": "html5-apps-repo-rt",
              "authenticationType": "xsuaa"
            }
          ]
        }
        ```

  3. In the *Poetry Slams* application routing config file, which is located in the *app/poetryslams* folder ([xs-app.json](../../../tree/main-multi-tenant/app/poetryslams/xs-app.json)), route the default path to the `index.html` file and offer a path to the OData service. 
  Ensure that the application [*xs-app.json*](../../../tree/main-multi-tenant/app/poetryslams/xs-app.json) config file is as follows: 

        ```json
        {
          "welcomeFile": "/index.html",
          "authenticationMethod": "route",

          "routes": [
            {
              "source": "^/odata/v4/poetryslamservice/(.*)$",
              "target": "/odata/v4/poetryslamservice/$1",
              "destination": "srv-api",
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

  4. Go to the *index.html* file located in the */app/poetryslams/webapp/* folder. In the project, an implemented app router is used to serve the web page now instead of the managed app router provided by the SAP Build Work Zone, so the file needs to be reverted back to the originally generated HTML file. Also, the style information is put into a separate file ([*initAppStyle.css*](../../../tree/main-multi-tenant/app/poetryslams/webapp/util/initAppStyle.css)) to avoid inline style definitions. 

      1. Copy the file [*initAppStyle.css*](../../../tree/main-multi-tenant/app/poetryslams/webapp/util/initAppStyle.css) into the folder */app/poetryslams/webapp/util/* of your project.
      2. Delete the files *setContent.js* and *setShellConfig.js* in the folder */app/poetryslams/webapp/util/*. They were only needed in the one-off deployment with SAP Build Work Zone.
      3. Ensure that your [*index.html*](../../../tree/main-multi-tenant/app/poetryslams/webapp/index.html) is as follows:

          ```html
          <!doctype html>
          <html>
            <head>
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta charset="UTF-8" />
              <meta name="viewport" content="E=edge" />
              <title>Poetry Slam Manager</title>
              <link type="text/css" rel="stylesheet" href="util/initAppStyle.css" />

              <!-- Replacement for Launchpad sandbox; load UI5 library -->
              <script
                id="sap-ui-bootstrap"
                src="https://sapui5.hana.ondemand.com/1.120.20/resources/sap-ui-core.js"
                data-sap-ui-libs="sap.uxap"
                data-sap-ui-theme="sap_horizon"
                data-sap-ui-resourceroots='{
                  "poetryslams": "./"
                }'
                data-sap-ui-oninit="module:sap/ui/core/ComponentSupport"
                data-sap-ui-compatVersion="edge"
                data-sap-ui-async="true"
              ></script>
            </head>
            <body class="sapUiBody sapUiSizeCompact" id="content">
              <!-- Render the app UI -->
              <div
                data-sap-ui-component
                data-name="poetryslams"
                data-id="container"
                data-settings='{"id" : "poetryslams"}'
                data-handle-validation="true"
              ></div>
            </body>
          </html>
          ```

  5. Repeat steps 3 and 4 for the *Visitors* application.

  6. In the root [*package.json*](../../../tree/main-multi-tenant/package.json): With the multitenancy feature, the predefined *with-mtx-sidecar* profile is added automatically. Unit tests that are dependent on the in-memory SQLite database for development testing are affected by this profile. Add the following section to the [*package.json*](../../../tree/main-multi-tenant/package.json) to ensure that Mocha testing works:

        ```json
        "cds": {
          "requires": {
            "[development]":{
              "db":{
                "kind":"sqlite",
                "credentials" : {"url" : ":memory:"}
              }
            }
          }
        }
        ```

  7. In the [*xs-security.json*](../../../tree/main-multi-tenant/xs-security.json), add the scope `mtcallback` to [*xs-security.json*](../../../tree/main-multi-tenant/xs-security.json):

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
        > Documentation: [XSUAA](https://cap.cloud.sap/docs/java/multitenancy-classic#xsuaa-mt-configuration)

  8. Adjust the newly created [*package.json*](../../../tree/main-multi-tenant/xs-security.json) of the *mtx-sidecar* by adding the following dependencies in section *requires* of the cds configuration:

        ```json
        "cds": {
          "profile": "mtx-sidecar",
          "requires": {
            "auth": "xsuaa",
            "destinations": true,
            "html5-repo": true
          }
        }
        ```
      > Documentation: [SaaS Registry Dependencies](https://cap.cloud.sap/docs/guides/multitenancy/#saas-registry-dependencies)

Your project is now consistent with the [*main-multi-tenant*](../../../tree/main-multi-tenant) branch. You can [deploy the multi-tenant application to the provider SAP BTP account](./24-Multi-Tenancy-Deployment.md).
