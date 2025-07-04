# Partner Reference Application 'Poetry Slam Manager'

[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/partner-reference-application)](https://api.reuse.software/info/github.com/SAP-samples/partner-reference-application)

## Description

This Partner Reference Application repository provides you with a “golden path” to becoming a SaaS provider of multi-tenant applications based on the SAP Business Technology Platform (SAP BTP).

The guidance covers building, running, and integrating scalable full-stack cloud applications. 
It includes an ERP-agnostic design that lets you deliver your application as a side-by-side extension to consumers using any SAP solution, such as SAP S/4HANA Cloud, SAP Business One, and SAP Business ByDesign. 

By using SAP BTP services and the SAP Cloud Application Programming Model (CAP), your application meets SAP standards for enterprise-class business solutions. It offers a harmonized user experience and seamless integration, including:
-	centralized identity and access management,
-	a common launchpad,
-	cross-application front-end navigation,
-	and secure back-channel integration.

The repository includes the “Poetry Slam Manager” application as a ready-to-run example. It also provides tutorials on how to build the application from scratch using an incremental development approach. 

Based on this sample application, you will find the bill of materials and a sizing example. This addresses the question "Which BTP resources do I need to subscribe to and in what quantities?" and serves as a basis for cost calculation.

<p align="center">
    <img src="./Tutorials/images/00_Partner-Persona.png" width="40%">  
</p>

### About the Sample Application *Poetry Slam Manager*

Imagine you're an event manager, for example, Peter, and your job is to organize and host poetry slams. 

As your company runs its business on a cloud ERP system provided by SAP, you use its project management component to plan and staff events, to collect costs, and to purchase equipment.
Additionally, an SAP partner provided you with a side-by-side application called Poetry Slam Manager (PSM) to publish poetry slam events and to manage bookings of visitors and artists such as Julie.

<p align="center">
    <img src="./Tutorials/images/00_End-User_Flow-Persona.png" width="80%">  
</p>

For security and compliance reasons, it's crucial to you that event publishing and visitor registration are clearly separated from your ERP system. Nevertheless, as a power user working in both systems, you asked the partner to ensure a seamless user experience and navigation between the SAP system and Poetry Slam Manager.

<p align="center">
    <img src="./Tutorials/images/00_readme_sample-use-case.png" width="100%">
</p>

The sample showcases how a side-by-side application benefits from using SAP BTP. The qualities relevant for enterprise-grade partner applications, supported by SAP BTP services and programming models, include:

<p align="center">
    <img src="./Tutorials/images/00_End-User_Flow-Peter-Part1.png" width="80%">  
</p>

Upcoming versions of the sample application might include further features provided by the SAP BTP:

<p align="center">
    <img src="./Tutorials/images/00_End-User_Flow-Peter-Part2-and-Julie.png" width="80%">  
</p>

### Features and Values

- Create and change poetry slam events, publish, and cancel poetry slams.
- Maintain, add, and remove visitors, cancel bookings.
- Calculate the number of free seats and block overbookings.
- Create projects for poetry slam events with one click and preview project information on the Poetry Slam Manager UI (here, ERP authorizations apply in the partner application as well).
- Create and print a guest list.
- Utilize artificial intelligence capabilities to generate innovative titles and descriptions for poetry slams.
- As an ERP user, start Poetry Slam Manager from your ERP launchpad and navigate from Poetry Slam Manager to the associated project in the ERP system.
- Make use of a standardized online development environment using SAP Business Application Studio.
- Use a state-of-the-art web application architecture based on HTML5, Node.js, and SAP HANA Cloud.
- Make use of a model-driven development based on the SAP Cloud Application Programming (CAP) Model, core data services (CDS), and SAP Fiori elements.
- Offer a user experience that matches the SAP standard due to standard floorplan patterns, and out-of-the-box theming and personalization.
- Provide a centralized launchpad that streamlines access to applications, offering a consistent user experience through predefined layout templates and navigation patterns.
- Use a draft concept to allow users to change data in multiple steps without having to publish incomplete changes.
- Benefit from enterprise-grade security by authentication and role-based authorizations in line with SAP product standards and technology alignments.
- Have enterprise-ready compliance by personal data management and audit log.
- Offer seamless and secure front-end and back-channel integration with SAP ERP solutions.
- Deliver open solutions by integration-ready OData APIs and business events following SAP technology alignments.
- Deploy the app as a multi-customer solution.
- Analyze and monitor logging data of the customer deployment.

**Join our community!**

Would you like to share your own ideas and best practices? Join our discussions about the Partner Reference Application in our [SAP Community](https://blogs.sap.com/2022/06/03/build-and-run-cloud-applications-on-the-sap-btp/).

## Requirements

The application is based on SAP Business Technology Platform (SAP BTP) and SAP ERP solutions. Therefore, here's what you need:

- An SAP BTP account, which includes SAP Business Application Studio as a standardized development environment,  
- GitHub as your code repository, and 
- an SAP ERP system.

To get a more detailed list of the required entitlements, the proposed structure of subaccounts for the deployed Partner Reference Application, and the scaling effects of the multi-tenant solution, go to the [Bill of Materials](./Tutorials/01-BillOfMaterials.md).

## Overview

This repository explains the development journey along the path from
1. development of the core application, 
2. enhancement to a multi-customer ("multi-tenant") solution,
3. integration with different ERP back ends,
4. extension with additional features,
5. enablement of the application for third-party integrations and extensibility.

<p align="center">
    <img src="./Tutorials/images/00_Dev_Journey.png" width="80%">  
</p>

A complete and working implementation of the above steps is available in separate branches:
1. Core application and multi-tenant deployment: branch [*main-multi-tenant*](../../tree/main-multi-tenant)
2. Additional features (based on the multi-tenant implementation): branch [*main-multi-tenant-features*](../../tree/main-multi-tenant-features)

This allows you to check out those branches and directly work with the respective implementation. You can use GitHub comparisons to understand the changes required along the development journey.

The tutorials are provided in the ([*main*](../../)) branch. If you prefer a quick start with a deployment of the poetry slam manager application including all features without further explanation, follow the [quick start guide](./Tutorials/02-Quickstart.md).

Updates to this repository are documented in the [change history](./Tutorials/99-Change-History.md).

## Tutorials

1. Develop the **core application** focusing on business models, business logic, and UI:
    1. [Prepare your SAP BTP account for development](./Tutorials/11-Prepare-BTP-Account.md) 
    2. [Develop the core of the SAP BTP application](./Tutorials/14-Develop-Core-Application.md)
    3. [Go on a guided tour to explore the capabilities of the sample application](./Tutorials/17-Guided-Tour.md)
    4. [Test and troubleshoot the application](./Tutorials/16-Test-Trace-Debug.md)

2. Enhance the application for **multi-tenant deployments** to support multiple customers using shared SAP BTP resources:
    1. [Learn about multitenancy and get an overview of the bill of materials](./Tutorials/20-Multi-Tenancy-BillOfMaterials.md)
    2. [Prepare your SAP BTP account for multi-tenant deployment](./Tutorials/22-Multi-Tenancy-Prepare-Deployment.md)
    3. [Enhance the core application for deployment](./Tutorials/23-Multi-Tenancy-Develop-Sample-Application.md)
    4. [Deploy your SAP BTP multi-tenant application](./Tutorials/24-Multi-Tenancy-Deployment.md)
    5. [Provision your multi-tenant application to consumer subaccounts](./Tutorials/25-Multi-Tenancy-Provisioning.md)
    6. [Go on a guided tour to explore the capabilities of the deployed sample application](./Tutorials/25a-Guided-Tour-Deployed.md)
    7. [Test and troubleshoot multitenancy](./Tutorials/26-Test-Trace-Debug-Multi-Tenancy.md)
    
3. Integrate the application with **SAP ERP solutions**:   
    1. SAP Business One:
        1. [Learn more about the prerequisites and the purpose of SAP Business One integration](./Tutorials/33-B1-Prerequisites.md)
        2. [Integrate the SAP BTP application with SAP Business One](./Tutorials/33a-B1-Integration.md)
        3. [Configure the integration with SAP Business One](./Tutorials/33b-Multi-Tenancy-Provisioning-Connect-B1.md)
    2. SAP S/4HANA Cloud Public Edition: 
        1. [Learn more about the prerequisites and the purpose of SAP S/4HANA Cloud Public Edition integration](./Tutorials/34-S4HC-Prerequisites.md)
        2. [Integrate the SAP BTP application with SAP S/4HANA Cloud Public Edition](./Tutorials/34a-S4HC-Integration.md)
        3. [Configure the integration with SAP S/4HANA Cloud Public Edition](./Tutorials/34b-Multi-Tenancy-Provisioning-Connect-S4HC.md)
    3. SAP Business ByDesign:
        1. [Learn more about the prerequisites and the purpose of SAP Business ByDesign integration](./Tutorials/35-ByD-Prerequisites.md)
        2. [Integrate the SAP BTP application with SAP Business ByDesign](./Tutorials/35a-ByD-Integration.md)
        3. [Configure the integration with SAP Business ByDesign](./Tutorials/35b-Multi-Tenancy-Provisioning-Connect-ByD.md)
    4. [Test and troubleshoot an ERP integration](./Tutorials/32-Test-Trace-Debug-ERP.md)
    5. [Go on a guided tour to explore the ERP integration](./Tutorials/31-Guided-Tour-ERP-Integration.md)

4. Add **additional features and capabilities** to your SAP BTP application:
    1. [Manage data privacy](./Tutorials/41-Multi-Tenancy-Features-Data-Privacy.md)
    2. [Observability: logging, metrics, and tracing](./Tutorials/43-Multi-Tenancy-Features-Observability.md)
    3. Add capabilities for output management to your application:
        1. [Manage forms](./Tutorials/44a-Multi-Tenancy-Features-Forms.md)
        2. [Print documents](./Tutorials/44b-Multi-Tenancy-Features-Print.md)
        3. [Send emails](./Tutorials/44c-Multi-Tenancy-Features-EMail.md)
    4. [Add capabilities for generative artificial intelligence (GenAI)](./Tutorials/45-Multi-Tenancy-Features-GenAI.md)
    5. [Schedule jobs and add background execution](./Tutorials/46-Multi-Tenancy-Features-Job-Scheduling.md)

5. Enable the application for **third-party integrations and extensibility**:
    1. Open the APIs of the SAP BTP application for third-party integrations:
        1. [Enable API access to SAP BTP applications using service broker](./Tutorials/42a-Multi-Tenancy-Service-Broker.md)
        2. [Configure and consume the APIs of the SAP BTP application](./Tutorials/42b-Multi-Tenancy-Provisioning-Service-Broker.md) 
    2. [Enable consumer-specific extensions](./Tutorials/50-Multi-Tenancy-Features-Tenant-Extensibility.md)
    3. [Enable key user flexibility using SAP Build Work Zone](./Tutorials/51-Multi-Tenancy-Features-Tenant-Key-User-Flexibility.md)

6. **Operational aspects** of multi-tenant SaaS applications
    1. [Upgrading multi-tenant SaaS applications](./Tutorials/61-Operations-SubscriptionUpgrade.md)
    2. [Estimate the required size of the SAP HANA Cloud database](./Tutorials/27-Hana-DB-Scaling.md)
    3. [Estimate the required Cloud Foundry environment configuration](./Tutorials/28-CF-Environment-Scaling.md)
    4. [Capabilities of SAP Continuous Integration and Delivery Service](./Tutorials/62-Multi-Tenancy-Features-CICD.md)

## More Information
- [SAP BTP Developer’s Guide](https://help.sap.com/docs/btp/btp-developers-guide/what-is-btp-developers-guide)
- [SAP Cloud Application Programming Model](https://cap.cloud.sap/docs/)
- [SAP Cloud SDK](https://sap.github.io/cloud-sdk/)
- [SAP Discovery Center](https://discovery-center.cloud.sap/missionssearch)
- [What's New for SAP Business Technology Platform](https://help.sap.com/whats-new/cf0cb2cb149647329b5d02aa96303f56?clear=all&locale=en-US)
- [SAP HANA Cloud Administration Guide](https://help.sap.com/docs/hana-cloud/sap-hana-cloud-administration-guide/sap-hana-cloud-administration-guide)

## Known Issues

There aren't any known issues.

## Get Support 

This repository is provided "as-is", we don't offer support. For questions and comments, [join the SAP Community](https://answers.sap.com/questions/ask.html).

## License

Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
