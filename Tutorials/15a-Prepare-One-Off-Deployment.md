# Enhance Your SAP BTP Application for Deployment

After you developed your application, this tutorial guides you through the steps to enhance the application for deployment.

## Prepare Your Project Configuration for Cloud Foundry Deployments

Make some adjustments to ensure that the application can be deployed to SAP BTP Cloud Foundry runtime as a central launchpad component.

1. Configure the web app to connect to the app services: 
  1. To define a route in the web app, open the file [*./app/poetryslammanager/xs-app.json*](../../../tree/main-single-tenant/app/poetryslammanager/xs-app.json).
  2. Add the following route at position 1 (Note that the order is cruial as the most specific one must come first.)

     >  Note: You'll define the destination *launchpad* later as part of project configuration *mta.yml* file. 

      ```json
        {
          "authenticationType": "none",
          "csrfProtection": false,
          "source": "^/odata/v4/poetryslammanager/",
          "destination": "launchpad"
        }
      ```

2. In the file [*./app/poetryslammanager/xs-app.json*](../../../tree/main-single-tenant/app/poetryslammanager/xs-app.json), define a Content Security Policy (CSP). The CSP allows you to restrict which resources can be loaded.
   > Note: This is just an example of a CSP. Check your use case and your security settings carefully.

      ```json  
        "responseHeaders": [
          {
            "name": "Content-Security-Policy",
            "value": "default-src 'self' https://sapui5.hana.ondemand.com; frame-ancestors 'self' https://*.hana.ondemand.com;  object-src 'none';"
          }
        ]
      ```

> Note: If you copied the *manifest.json* during the development of the core application, you can skip the next two steps.

3. Add the service name to the web app configuration file [*./app/poetryslammanager/webapp/manifest.json*](../../../tree/main-single-tenant/app/poetryslammanager/webapp/manifest.json). 

    > Note: This service name must be unique within your account and will appear in the runtime URL of the application.

      ```json
      "sap.cloud": {
        "service": "poetryslammanager",
        "public": true
      }
      ```

4. In the *dataSources* section, adopt the `uri` by removing the `/` before `odata`. The URI of the data sources is changed now to a relative path.

      ```json
      "dataSources": {
        "mainService": {
          "uri": "odata/v4/poetryslammanager/",
          "type": "OData",
          "settings": {
            "annotations": [],
            "odataVersion": "4.0"
          }
        }
      }
      ```

5. In the file [*./app/poetryslammanager/ui5-deploy.yaml*](../../../tree/main-single-tenant/app/poetryslammanager/ui5-deploy.yaml), the packaging of the web UI application is defined. Replace the line `afterTask: replaceVersion` with `beforeTask: generateCachebusterInfo` to ensure that the package is created correctly for the deployment.

## Rename the Application in the Config Files

The wizard for creating a new SAP Cloud Application Programming Model project generated the *mta.yaml* file, which contains all deployment-relevant information. 

The application had been created with the name *partner-reference-application*, but the module and service names in the [*./mta.yaml*](../../../tree/main-single-tenant/mta.yaml) file were renamed from `partner-reference-application-*` to `poetry-slams-*`.

Additionally, rename `partner-reference-application` in the *undeploy* step of the [*./package.json*](../../../tree/main-single-tenant/package.json) to `poetry-slams`.

## Configure the Project Deployment Config Files

Adjust the [*./mta.yaml*](../../../tree/main-single-tenant/mta.yaml) file. 

1. Enhance the build parameters to install the node modules before the build with the CDS development kit.
    ```yml
      build-parameters:
        before-all:
          #  Defines the build parameter
          - builder: custom
            commands:
              - npm ci --omit=dev
              - npx -p @sap/cds-dk cds build --production
    ```

2. Add and configure the destination content module. This is where you define destinations and service keys for the destinations. After the MTA app has been deployed, you'll see two destinations *html_repo_host* and *…_uaa_fiori* in your subaccount.

    > Note that the service name *poetryslammanager* of the web app must match the service name used in the file *manifest.json* of the web app.

    ```yml
      modules:
      - name: poetry-slams-destination-content
        type: com.sap.application.content
        requires:
        - name: poetry-slams-repo-host
          parameters:
            service-key:
              name: poetry-slams-repo-host-key
        - name: poetry-slams-auth
          parameters:
            service-key:
              name: poetry-slams-auth-key
        - name: poetry-slams-destination-service
          parameters:
            content:
              instance:
                destinations:
                - Name: poetryslammanager-repo-host-dest
                  ServiceInstanceName: poetry-slams-html5-srv
                  ServiceKeyName: poetry-slams-repo-host-key
                  sap.cloud.service: poetryslammanager
                - Authentication: OAuth2UserTokenExchange
                  Name: poetryslammanager-uaa-fiori-dest
                  ServiceInstanceName: poetry-slams-auth
                  ServiceKeyName: poetry-slams-auth-key
                  sap.cloud.service: poetryslammanager
                existing_destinations_policy: update
            content-target: true
        build-parameters:
          no-source: true
    ```

3. Adjust the destination service resource in the file *mta.yaml*. Define the destination resource for the route as defined in the web application configuration file *./app/poetryslammanager/xs-app.json*.

    > Note that the name *launchpad* of the route in *xs-app.json* must match the destination service resource name in the file *mta.yaml*. Enable the HTML5 runtime and add the service API as a required dependency of the destination:

    ```yml
      resources:
      - name: poetry-slams-destination-service
        type: org.cloudfoundry.managed-service
        parameters:
          config:
            HTML5Runtime_enabled: true
            init_data:
              instance:
                destinations:
                - Authentication: NoAuthentication
                  Name: ui5
                  ProxyType: Internet
                  Type: HTTP
                  URL: https://ui5.sap.com
                - Authentication: NoAuthentication
                  HTML5.DynamicDestination: true
                  HTML5.ForwardAuthToken: true
                  Name: launchpad
                  ProxyType: Internet
                  Type: HTTP
                  URL: ~{srv-api/srv-url}
                existing_destinations_policy: update
            version: 1.0.0
          service: destination
          service-name: poetry-slams-destination-service
          service-plan: lite
        requires:
        - name: srv-api
    ```
  
4. After you've applied the changes described above in the file *mta.yml*, this is what the file looks like: [the MTA file of the sample application](../../../tree/main-single-tenant/mta.yaml).

    > Note that a correct indentation is required.

## Adopt NPM Modules
The CDS libraries are offered as npm modules in the *package.json*. After the creation of the SAP Cloud Application Programming Model (CAP) project via the wizard, the npm @sap/cds-dk module is added to the [*./package.json*](../../../tree/main-single-tenant/package.json) as a development dependency. Move this module to the *dependencies* section. You can check the [*package.json*](../../../tree/main-single-tenant/package.json) of the sample implementation to view the result.

Now that you've prepared your application for deployment, continue with the next step and [deploy your SAP BTP application](./15b-One-Off-Deployment.md). 