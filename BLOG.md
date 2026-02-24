In my previous Blog series i explained how to turn Kyma in to a native Runtime for Cloud Application Programming Model based solutions. In this blog I would like to show you now how you can add to a existing CAP application the required deployment artifacts. Therefore I wil use  Partner Reference Application (PRA) which is a great example of a SaaS Mulititenant Solutions applicable for Partners and Customers.

1. Preparation

You have setup a Kyma cluster with the CAP Operator as described in my Blog Series ...
You have created a dedicated BTP Provider subaccount and corresponding Kyma namespace according to my Blog Post ....


2. Steps to add the additional components to for the deplyoments

2.1 Checkout the Partner Reference Application multitenant branch

Create a dedicated branch prakyma 

Go to the project root folder and install the CAP Operator Plugin as dev dependency

npm add @cap-js/cap-operator-plugin -D

Now you can use the CAP Operator plugins to create the necessary resources for the deployment.


2.1. Add Docker build to your project. 

As Docker is meanwhile as well the recommended approach for Cloud Foundry deployment you might have already done this for you project, however we will need to add this to the PRA.
Therefore you need to have Docker installed on your Laptop and need to have access to a Docker Registry. 
We need to create Dockerfiles for the following parts:
1. The Application Approuter under folder app/router we add the Dockerfile

2. The CAP MTXS application which will be used for the provider and subscriber tenant lifecycle operations we add the Dockerfile
3. For the CAP Application Server we add the Dockerfile to the Root
4. The poetryslams und vistitors app Content Deployment to the HTML5 Repository we add the Dockerfile to the app folder. You need as well to adjust the package.json files of the poetryslams and the visitors application. 

...
    "build:copy": "npm run build && npm run copy",
    "build": "ui5 build preload --clean-dest --config ui5-deploy.yaml --include-task=generateCachebusterInfo",
    "copy": "shx mkdir -p ../html5-deployer/resources/ && shx cp -rf ./dist/*.zip ../html5-deployer/resources/"
---

and adding
 npm install shx -D in both application folders.


 This will trigger the HTML5 content build and will copy the dist output to a folder which will be used to upload the conent to the HTML5 Repository.


Adjust your package.json to add the commands for the dockerbuild 


npm install cross-env  -D
npm install cross-var  -D

Export the variables according to your setup to the environement before you runn the docker scripts for build and push

Example windows powershell
$Env:IMAGE_PREFIX = "espchris"
$Env:IMAGE_TAG = "0.0.1"

Trigger the docker build and push







