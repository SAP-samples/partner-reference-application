# Enable Multitenancy

Multitenancy is the ability to serve multiple tenants through single clusters of microservice instances, while serving the tenants from a single deployment and strictly isolating the tenants' data. This significantly reduces costs and efforts. You can find further information in the [SAP Cloud Application Programming Model documentation on multitenancy](https://cap.cloud.sap/docs/guides/multitenancy). 

In this approach of progressive development from a customer-specific single-tenant application to a multi-customer application, you keep the core of your single-tenant application (as contained in the branch [main-single-tenant](../../../tree/main-single-tenant)) and add changes to enable the deployment as a multi-tenant application (as contained in the branch [main-multi-tenant](../../../tree/main-multi-tenant)). You can easily compare both branches using [git comparison](../../../compare/main-single-tenant...main-multi-tenant). 

> Note: The comparison contains both the multi-tenant enablement and the enhancement for the integration with different ERP back ends.

Both the single tenant and the multi-tenant applications use the same names and IDs and, therefore, cannot be deployed into the same SAP BTP subaccount. Hence, we create new SAP BTP provider and consumer subaccounts for the multi-tenant version of Poetry Slam Manager to avoid name clashes.

## Procedure

The enablement of multitenancy requires the following steps:
1. Replace the managed application router provided by SAP Build Work Zone by a custom application router, which is set up as a separate module. 
2. Add and configure the multi-tenant extension module (mtx module) which handles the subscription and tenant lifecycle processes.
3. Add SAP BTP resources such as the SAP Service Manager service and the SAP Software-as-a-Service Provisioning service to manage and provision multi-tenant applications.
4. Define tenant URL patterns and reconfigure routes and destinations accordingly.
5. Adapt the web app entry point to run independently from SAP Build Work Zone.

As a result, the application has three separate major modules running on separated workloads:
- the **application services module**, which processes the application services and the web app (the web app can be outsourced in a separate module later as well),
- the **mtxs module**, which processes tenant onboarding and other lifecycle operations, and
- the **application router** as a single entry point and to manage access to all modules and used services.

> Note:  The branch [main-multi-tenant](../../../tree/main-multi-tenant) is the basis of this section of the tutorial.  Refer to it when accessing files.

### Add Custom Application Router 

In this setup, you simplify your application and replace the usage of a subaccount-specific SAP Build Work Zone instance (which includes a managed application router) by a custom application router.

1. Open the dev space in SAP Business Application Studio where your single tenant application is available that you want to enhance.

2. Add the application router folder to the root of the project: In Poetry Slam Manager, it's named *approuter*. Create a file named *package.json* in the newly created folder and add the content of the [file from Poetry Slam Manager](../../../tree/main-multi-tenant/approuter/package.json).

3. To add the route configuration of the web application, create an *xs-app.json* file in the application router folder. Copy the content into the file. 

    ```json
    {
        "authenticationMethod": "route",
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

    As a reference, you can have a look at the [*xs-app.json* of our example](../../../tree/main-multi-tenant/approuter/xs-app.json).

    The *xs-app.json* only contains generic routes that apply for all web applications. In this example, there are app-specific routes only. However, for project consistency, you have to keep the *xs-app.json* for the application router.
    
4. Add the application router module to the MTA development descriptor (*mta.yaml*) in the root folder of your project. You can copy the *poetry-slams-approuter* module from the reference [*mta.yaml*](../../../tree/main-multi-tenant/mta.yaml) to the modules section. The module, as it is defined, uses two parameters for easier replication, which need to be defined in the parameters section of your *mta.yaml* file. Copy the parameters *app-url* and *approuter-url* from the reference [mta.yaml](../../../tree/main-multi-tenant/mta.yaml).     

    > Note: The application router module refers to the mtxs module that you add in the next step; so there's no need to worry about the reference error here.
    
    > Note: With this step, you run and configure the application router centrally in such a way that it can be **reused** by multiple web applications (for example, if you create a second app for poetry slam participants later on). Furthermore, the appplication router is now ready for **exit implementations** (for example, to set specific environment variables, properties, http response header with a Content Security Policy, URL header properties such as access origins for Cross-Origin Resource Sharing (CORS) checks, write log for tracing, and so on). Find more details about the approuter in the [official documentation](https://www.npmjs.com/package/@sap/approuter) and in an SAP [blog post](https://blogs.sap.com/2020/04/03/sap-application-router/).

5. The *xs-app.json* file of your web application needs to be adopted for multitenancy. It defines the route configuration to access the service APIs and HTML5 UI module of your web application. To do so, replace the file with the following content:

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

    You can refer to the [*xs-app.json* in Poetry Slam Manager](../../../tree/main-multi-tenant/app/poetryslammanager/xs-app.json).

The content of your approuter folder now looks exactly like the content in the [Partner Reference Application](../../../tree/main-multi-tenant/approuter).

### Add Configuration for Multitenancy 

In this step, the project deployment configuration is refactored to run a multi-tenant application with subscriptions.

1. Open a terminal and navigate to your project root folder in SAP Business Application Studio.

2. Run the command `npm add @sap/cds-mtxs` to add the mtxs node module as dependency to your project.

3. Open the file *package.json* on project root level. Change the CDS configuration to multitenancy by replacing the *cds requires* section with this code:

	```json
       "requires": {
           "[development]": {
               "db": {
                    "kind": "sql"
                },
                "uaa": {
                    "kind": "xsuaa"
                }
            },
            "[production]": {
                "db": {
                    "kind": "hana-mt"
                },
                "auth": {
                    "kind": "xsuaa",
                    "strategy": "JWT"
                },
                "multitenancy": true
            }
       }
	```
    > Note: You can check the [package.json of the example](../../../tree/main-multi-tenant/package.json) as reference.
        
2. Open the file *mta.yaml* on the project root level and apply the following changes:

    i. Add the follwing parameters in the *parameters* section for better readablility.

    ```yml
    parameters:
        displayname: SAP Partner Reference Sample Application
        xsappname: poetry-slams-${org}-${space}
        app-url: ${org}-${space}
        approuter-url: ${app-url}-approuter
        srv-url: ${app-url}-srv
        mtx-srv-url: ${app-url}-mtx-srv
    ```

    ii. Add the `poetry-slams-mtx-srv` into the *modules* section. In this way, mtxs is defined as a separate node module. It separates tenant lifecycle operations from the application. They don't interfere with the workload of app users. The goal of this configuration is to separate the workloads of front-end, back-end, and tenant lifecycle operations.

    ```yml
        # MTXs (Multitenancy, Toggles, Extensibility) Module (Onboarding, Upgrading)
        - name: poetry-slams-mtx-srv
          type: nodejs
          path: gen/srv
          requires:
          - name: poetry-slams-auth
          - name: poetry-slams-destination-service
          - name: poetry-slams-service-manager
            properties:
                SUBSCRIPTION_URL: ${protocol}://\${tenant_subdomain}.${app-url}.${domain}/poetryslammanager # ${default-url}
          parameters:
            memory: 1024M
            disk-quota: 1024M
            routes:
            - route: ${mtx-srv-url}.${domain}
          provides:
          - name: mtx-binding
            properties:
                app-fqdn: ${mtx-srv-url}.${domain}
                app-url: ${protocol}://${mtx-srv-url}.${domain}
          - name: poetry-slams-mtx-srv-destination
            public: true
            properties:
                name: mtx-srv-api
                url: ${protocol}://${mtx-srv-url}.${domain}
                forwardAuthToken: true
          - name: mtx-srv-api # required by consumers of CAP services (e.g. approuter)
            properties:
               mtx-srv-url: ${protocol}://${mtx-srv-url}.${domain} # ${default-url}
    ```

    iv. Add the `poetry-slams-approuter` for multitenancy (already done when adding the custom application router) as a new module to the *modules* section.

    ```yml
            # Application Router
            # Standalone Custom Application Router
            - name: poetry-slams-approuter
              type: approuter.nodejs
              path: approuter
              parameters:
                disk-quota: 512M
                memory: 512M
                routes:
                 - route: ${approuter-url}.${domain}
                 - route: '*.${app-url}.${domain}'
              provides:
                - name: approuter-binding
                  properties:
                     app-fqdn: ${approuter-url}.${domain}
                     app-url: ${protocol}://${approuter-url}.${domain}
              requires:
                - name: srv-api
                  group: destinations
                  properties:
                    name: srv-api # must be used in xs-app.json as well
                    url: ~{srv-url}
                    forwardAuthToken: true
                - name: poetry-slams-auth
                - name: poetry-slams-destination-service
                - name: poetry-slams-registry
                - name: poetry-slams-html5-runtime
                  properties:
                    TENANT_HOST_PATTERN: '^(.*).${app-url}.${domain}'
                    httpHeaders: '[{ "Content-Security-Policy": "frame-ancestors ''self'' https://*.hana.ondemand.com" }]' # Allow the SAP launchpad to host the app in-place
                    CORS:
                        - uriPattern: .*
                          allowedOrigin:
                            - host: '*.${app-url}.${domain}'
                              protocol: 'https'
    ```

    ii. Add the `poetry-slams-registry` as a new resource to the *resources* section, which is required for subscription and tenant provisioning.

    ```yml
        # Application Registry
        # Registers application for use by subscribers
        - name: poetry-slams-registry
          type: org.cloudfoundry.managed-service
          requires:
            - name: mtx-binding
            - name: approuter-binding
          parameters:
            service: saas-registry
            service-plan: application
            config:
                xsappname: ${xsappname}
                appName: ${xsappname}
                displayName: ${displayname}
                description: ${displayname}
                category: 'Category'
                appUrls:
                    getDependencies: ~{approuter-binding/app-url}/-/cds/saas-provisioning/dependencies
                    onSubscription: ~{mtx-binding/app-url}/-/cds/saas-provisioning/tenant/{tenantId}
                    callbackTimeoutMillis: 300000
    ```

    iii. Add the `poetry-slams-service-manager` to the *resource* section. It's required as it manages service instances and service bindings for applications. It replaces the database resource for multitenancy creating the database schemas on subscription.

     ```yml
        # Service Manager
        - name: poetry-slams-service-manager
          type: org.cloudfoundry.managed-service
          parameters:
            service: service-manager
            service-plan: container
          properties:
            hdi-service-name: ${service-name}
    ```  

    v. Add the HTML5 repository runtime *resource* to manage and execute your HTML5 application. It's used by the application router.

     ```yml
            # HTML5 Runtime (HTML5 Application Repository Service)
            - name: poetry-slams-html5-runtime
              type: org.cloudfoundry.managed-service
              parameters:
                service: html5-apps-repo
                service-plan: app-runtime
    ``` 

    vi. Replace the `poetry-slams-srv` module. It will adopt the required resources, the redirect URLs for the subscriber subaccounts, and some more parameters.
    
    ```yml

        # Service module
        # Defines the microservice or application that will be serviced.
        # Contract between the service and the used microservices, and the rest of the application. It specifies what is required from the environment, and what it provides to the environment.
      - name: poetry-slams-srv
        type: nodejs
        path: gen/srv
        requires:
        - name: poetry-slams-auth
        - name: poetry-slams-destination-service
        - name: poetry-slams-service-manager
        - name: poetry-slams-registry
        provides:
        - name: srv-api
          properties:
            srv-url: ${protocol}://${srv-url}.${domain} # ${default-url}
            redirect-uris: ${protocol}://*.${app-url}.${domain}/** # Redirect URI to connect modules running on different Cloud Foundry landscapes
        - name: srv-multi-tenancy
          properties:
            tenant-delimiter: '.'
        parameters:
            buildpack: nodejs_buildpack
            disk-quota: 1024M
            memory: 512M
            routes:
                - route: ${srv-url}.${domain}
        properties:
            SUBSCRIPTION_URL: ${protocol}://\${tenant_subdomain}.${srv-url}.${domain} # ${default-url}
    ``` 

    vii. Replace the `poetry-slams-app-content`. 

     ```yml

            # App UI content deployer module
            # Uploads the static content of the HTML5 application and deploys it to the HTML5 repository
          - name: poetry-slams-app-content
            type: com.sap.application.content
            path: gen
            requires:
              - name: poetry-slams-repo-host
                parameters:
                    content-target: true
              - name: poetry-slams-auth
            build-parameters:
                build-result: resources
                requires:
                  - artifacts:
                        - poetryslammanager.zip
                    name: poetryslammanager
                    target-path: resources/
    ``` 

    viii. Replace the UAA `poetry-slams-auth` for multitenancy (tenant-mode) by replacing the *resource* with the following code:

     ```yml
        # Authorization XSUAA service
        # Manages authentication, single sign-on (SSO), user management, and provides a way to manage authorizations based on scopes and role collections
        - name: poetry-slams-auth
          type: org.cloudfoundry.managed-service
          requires:
            - name: srv-api
          parameters:
            config:
              tenant-mode: shared
              xsappname: ${xsappname}
              oauth2-configuration:
                redirect-uris:
                  - ~{srv-api/redirect-uris} # Redirect to connect modules running on different Cloud Foundry landscapes
                  - http://localhost # Redirect for local testing using Postman
            path: ./xs-security.json
            service: xsuaa
            service-name: poetry-slams-auth
            service-plan: broker
        
    ```

    ix. Replace the destination service `poetry-slams-destination-service` resource.

    ```yml
    
    # Destination service
    # Offers a predefined configuration that simplifies connecting to the service
    # Destination Service
    - name: poetry-slams-destination-service
      type: org.cloudfoundry.managed-service
      parameters:
        service: destination
        service-plan: lite
        config:
            HTML5Runtime_enabled: true
    
    ```

    x. Remove the modules *poetry-slams-db-deployer*, *poetry-slams-destination-content*, and *poetry-slams-db*. [See git comparison for *mta.yaml*](../../../compare/main-single-tenant...main-multi-tenant).

    > Note: You can check the [mta.yaml of Poetry Slam Manager](../../../tree/main-multi-tenant/mta.yaml) for comparison.

3. Open the file *xs-security.json* on the project root level and apply the following changes:

    i. Add scope definitions for multi-tenant lifecycle management (*mtcallback*, *mtdeployment*) to the **scopes* array:

    ```json
        {
            "name": "$XSAPPNAME.mtcallback",
            "description": "Subscribe to applications",
            "grant-as-authority-to-apps": [
                "$XSAPPNAME(application,sap-provisioning,tenant-onboarding)"
            ]
        },
        {
          "name": "$XSAPPNAME.Callback",
          "description": "Multi Tenancy Callback Access (approuter)",
          "grant-as-authority-to-apps": [
            "$XSAPPNAME(application,sap-provisioning,tenant-onboarding)"
          ]
        },
        {
            "name": "$XSAPPNAME.mtdeployment",
            "description": "Deploy applications"
        }  

    ```

    ii. Add authorities for tenant lifecycle operations:

    ```json
        "authorities": [
            "$XSAPPNAME.mtdeployment",
            "$XSAPPNAME.mtcallback"
        ]            
    ```
> Note: The scopes, role templates, and role collections of the application user roles for Poetry Slam Manager and Poetry Slam Visitor don't change.

> Note: You can check the [xs-security.json](../../../tree/main-multi-tenant/xs-security.json) for comparison.

4. To verify your modifications, check the files in Poetry Slam Manager on the [main-multi-tenant](../../../tree/main-multi-tenant/) branch:
- [mta.yaml](../../../tree/main-multi-tenant/mta.yaml)
- [package.json](../../../tree/main-multi-tenant/package.json)
- [xs-security.json](../../../tree/main-multi-tenant/xs-security.json)


### Adapt the Web App Entry Point 

The web app entry point [/app/poetryslammanager/webapp/index.html](../../../tree/main-multi-tenant/app/poetryslammanager/webapp/index.html), as generated by the SAP Fiori element application wizard *Create MTA Module from Template*, assumes that the the web app is to be embedded in SAP Build Work Zone as an HTML app. However, in our multitenancy use case, the subscription of the SAP BTP application needs to be embedded in SAP Build Work Zone as a URL app. As a result, the web app runs in an iFrame of the SAP Build Work Zone launchpad.  

For this setup, adapt the web app *index.html* file to run as a single component (without the launchpad shell) or in-place as URL mashup in an iFrame:
Copy the file [*index.html*](../../../tree/main-multi-tenant/app/poetryslammanager/webapp/index.html) from Poetry Slam Manager into the folder *app/app/poetryslammanager/webapp/*. 

This file contains three main parts:

- The styles of the different UI areas [*initAppStyle.css*](../../../tree/main-multi-tenant/app/poetryslammanager/webapp/util/initAppStyle.css) .
- A script in the head section to load the SAP UI5 libraries and to initialize the UI component.
- A body section to render the application UI.

> Note: You can change the default UI theme using the attribute *data-sap-ui-theme*. In Poetry Slam Manager, the theme SAP Morning Horizon (*data-sap-ui-theme="sap_horizon*) is set. 
