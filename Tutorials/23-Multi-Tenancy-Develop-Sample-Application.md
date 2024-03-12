# Enhance the Core Application for Multitenancy

With this tutorial, you learn how to create a multi-tenant application based on the core application as described in the first tutorials for a one-off solution.

## (Optional) Fast Forward 
If you want to start right away with a working multi-tenant implementation, you can clone the branch [*main-multi-tenant*](../../../tree/main-multi-tenant) and start deploying it. 

Alternatively, you can enhance the one-off solution to a multi-tenant solution following the step-by-step guide below.  

To fast forward:

1. In the provider subaccount SAP BTP cockpit (subaccount level), navigate to *Instances and Subscriptions*, open *SAP Business Application Studio*, and open the dev space *PoetrySlamsProvider* created during the [preparation of the provider subaccount](./22-Multi-Tenancy-Prepare-Deployment.md).

2. Use the tile *Clone from Git* on the *Welcome* view to clone this GitHub repository (https://github.com/SAP-samples/partner-reference-application) and switch to the branch *main-multi-tenant*.

3. You can now [deploy the multi-tenant application to the provider SAP BTP account](./24-Multi-Tenancy-Deployment.md).

## Develop the Multi-Tenant Application

The core application behavior is unchanged from the [*main-single-tenant*](../../../tree/main-single-tenant), so this is the starting point on which the step-by-step guide is based. You add the multitenancy and app router features to the project and make some alterations to allow the project to seamlessly deploy to Cloud Foundry runtime.   

Find detailed information at
- the [CAP Multitenancy Documentation](https://cap.cloud.sap/docs/guides/multitenancy/)
- the [SAP BTP Implemented Application Router Documentation](https://help.sap.com/docs/btp/sap-business-technology-platform/application-router)

### Add the Multitenancy and App Router Features 
In your terminal in SAP Business Application Studio, use the `cds add <feature>` command to add multitenancy and the app router.
```console
cds add multitenancy,approuter --for production
```

This creates the following:
 - *mtx* folder with subfolder *sidecar*, containing a [*package.json*](../../../tree/main-multi-tenant/mtx/sidecar/package.json).
 - [*package.json*](../../../tree/main-multi-tenant/app/package.json) within the already existing *app* folder.
 - [*xs-app.json*](../../../tree/main-multi-tenant/app/xs-app.json) within the already existing *app* folder.

It also makes adjustments to the following:
  - In the root [*mta.yaml*](../../../tree/main-multi-tenant/mta.yaml) file, several changes are made related to the new modules and resources.
  - In the root [*package.json*](../../../tree/main-multi-tenant/package.json) file, changes are made related to the addition of the multitenancy feature.
  - In the root [*xs-security.json*](../../../tree/main-multi-tenant/xs-security.json) file, the scope mtcallback is added.
 
Now, follow the next steps to make the required changes: 
 1. Go to the root [*mta.yaml*](../../../tree/main-multi-tenant/mta.yaml) file.

    1. As a prerequisite, find and replace the string `partner-reference-application` and change it to `poetry-slams`. This makes the names of the created service instances more consistent. 

    2. Go to the `poetry-slams-srv` module and add the service `poetry-slams-html5-runtime` to the list of required services:
        ```yaml
          requires:
            - name: poetry-slams-html5-runtime
        ```
    3. Remove the module `poetry-slams-desination-content` as this module is no longer required with the implemented app router.

    4. Go to the `poetry-slams-mtx` module and add the service `poetry-slams-registry` to the list of required services. Change the `SUBSCRIPTION_URL` delimiter (-) to (.), which allows you to use generic routes for all tenants:
        ```yaml
          requires:
            - name: poetry-slams-registry
            - name: app-api
              properties:
                SUBSCRIPTION_URL: ~{app-protocol}://\${tenant_subdomain}.~{app-uri}
          ```
    5. Go to the `poetry-slams` module (app router).
        1. Add routes to support the generic tenant routing (with (.) delimiter) and access to the app router to provide dependencies during subscriptions:
            ```yaml
              parameters:
                keep-existing-routes: true
                routes:
                  - route: approuter-${default-uri}
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
        3. Add the services `poetry-slams-registry`, `poetry-slams-html5-runtime`, and `poetry-slams-destination-service` to the list of required services:
            ```yaml
              requires:
                - name: poetry-slams-registry
                - name: poetry-slams-html5-runtime
                - name: poetry-slams-destination-service
            ```
        4. Add the properties `app-url` and `redirect-uris` to the properties of the provided function `app-api`:
            ```yaml
              provides:
                - name: app-api
                  properties:
                    app-protocol: ${protocol}
                    app-uri: ${default-uri}
                    app-url: ${protocol}://approuter-${default-uri}
                    redirect-uris: ${protocol}://*.${default-uri}/** # Redirect URI to connect modules running on different Cloud Foundry landscapes (e.g. eu10 / eu10-004)
            ```

    6. In the `poetry-slams-destination-service` resource, you can remove in `parameters`-`config` the `init_data` and `version` sections. Those were only needed for the single-tenant implementation using SAP Build Work Zone. 

    7. Go to the `poetry-slams-auth` resource.
        1. add `app-api` to the `requires` list:
            ```yml
              requires:
                - name: app-api
            ```
        2. As `xsappname` needs to correspond to the config of the `poetry-slams-registry` resource, change this value to `poetry-slams-${org}-${space}` here. In addition the `oauth2` configuration needs to support requests from other Cloud Foundry landscapes (for example, `eu10` and `eu10-004`):
            ```yml
              parameters:
                config:
                  xsappname: poetry-slams-${org}-${space}
                  oauth2-configuration:
                    redirect-uris:
                      - ~{app-api/redirect-uris} # Redirect to connect modules running on different Cloud Foundry landscapes (e.g. eu10 / eu10-004)
            ```
        3. The `service-plan` parameter must be `broker` as you want to use features of the broker plan for later tutorials:
            ```yaml
              parameters:
                service-plan: broker
            ``` 

    8. Go to the `poetry-slams-registry` resource.
        1. Add `app-api` to the list of required information:
            ```yaml
              requires:
                - name: app-api
            ```
        2. Change the `displayName`, `description`, and `category` configurations. These are used by subscriber subaccounts to find the application:
            ```yaml
              parameters:
                config:
                  displayName: Poetry Slam Manager
                  description: Manage poetry slam events and register artists and visitors.
                  category: 'Applications / Multi-Customer Partner Solutions'
            ```
        3. Change the value of the `appUrls` called `getDependencies` so that dependencies are provided by the app router:
            ```yaml
              parameters:
                config:
                  appUrls:
                    getDependencies: ~{app-api/app-url}/-/cds/saas-provisioning/dependencies
            ```

    9. Add a resource `poetry-slams-html5-runtime` of the service `html5-apps-repo` to the *mta.yaml* file to replace SAP Build Work Zone and add the following to the `resources` section:
        ```yml
        -  name: poetry-slams-html5-runtime
            type: org.cloudfoundry.managed-service
            parameters:
              service: html5-apps-repo
              service-plan: app-runtime
        ```

  2. Go to the app router config file, which is located in the *app* folder ([*xs-app.json*](../../../tree/main-multi-tenant/app/xs-app.json)) and route the app router to the `poetryslammanager` application as default. This will forward requests to the app router directly to the application. Ensure that the file is as follows:

          ```json
            {
              "welcomeFile": "poetryslammanager/",
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

  3. In the Poetry Slam Manager application routing config file, which is located in the *app/poetryslammanager* folder ([xs-app.json](../../../tree/main-multi-tenant/app/poetryslammanager/xs-app.json)), route the default path to the `index.html` file and offer a path to the OData service. 
  Ensure that the application [*xs-app.json*](../../../tree/main-multi-tenant/app/poetryslammanager/xs-app.json) config file is as follows: 

            ```json
            {
              "welcomeFile": "/index.html",
              "authenticationMethod": "route",

              "routes": [
                {
                  "source": "^/odata/v4/poetryslammanager/(.*)$",
                  "target": "/odata/v4/poetryslammanager/$1",
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

  4. Go to the *index.html* file located in */app/poetryslammanager/webapp/* folder. In the project, an implemented app router is used to serve the web page now instead of the managed app router provided by SAP Build Work Zone, so the file needs to be reverted back to the originally generated HTML file. Besides this, the style information is put into a separate file ([*initAppStyle.css*](../../../tree/main-multi-tenant/app/poetryslammanager/webapp/util/initAppStyle.css)) to avoid inline style definitions. 

      1. Copy the file [*initAppStyle.css*](../../../tree/main-multi-tenant/app/poetryslammanager/webapp/util/initAppStyle.css) into the folder */app/poetryslammanager/webapp/util/* of your project.
      2. Delete the files *setContent.js* and *setShellConfig.js* in the folder */app/poetryslammanager/webapp/util/*. They were only needed in the one-off deployment with SAP Build Work Zone.
      3. Ensure that your [*index.html*](../../../tree/main-multi-tenant/app/poetryslammanager/webapp/index.html) is as follows:
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
                  src="https://sapui5.hana.ondemand.com/1.120.7/resources/sap-ui-core.js"
                  data-sap-ui-libs="sap.uxap"
                  data-sap-ui-theme="sap_horizon"
                  data-sap-ui-resourceroots='{
                            "poetryslammanager": "./"
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
                  data-name="poetryslammanager"
                  data-id="container"
                  data-settings='{"id" : "poetryslammanager"}'
                  data-handle-validation="true"
                ></div>
              </body>
            </html>
          ```

  5. In the root [*package.json*](../../../tree/main-multi-tenant/package.json): Unit tests that were dependant on the in-memory SQLite database for development testing were affected by the predefined *with-mtx-sidecar* profile values that are added with the multitenancy feature. Add the following section to the [*package.json*](../../../tree/main-multi-tenant/package.json) to ensure that Mocha testing works:
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
  6. In the [*xs-security.json*](../../../tree/main-multi-tenant/xs-security.json), add the `mtdeployment` and `Callback` scope and authority so that you can redeploy the solution in future and allow the subscribers to gain access to the updated schemas. Ensure that the following section is added to [*xs-security.json*](../../../tree/main-multi-tenant/xs-security.json):
        ```json
              "scopes": [
                    {
                      "name": "$XSAPPNAME.mtdeployment",
                      "description": "Scope to trigger a re-deployment of the database artifacts"
                    },
                    {
                      "name": "$XSAPPNAME.Callback",
                      "description": "Multi Tenancy Callback Access (approuter)",
                      "grant-as-authority-to-apps": [
                        "$XSAPPNAME(application,sap-provisioning,tenant-onboarding)"
                      ]
                    }
                ],
              "authorities": [
                "$XSAPPNAME.mtdeployment"
              ]
        ```


Now, your project is consistent with the [*main-multi-tenant*](../../../tree/main-multi-tenant) branch.  You can [deploy the multi-tenant application to the provider SAP BTP account](./24-Multi-Tenancy-Deployment.md).