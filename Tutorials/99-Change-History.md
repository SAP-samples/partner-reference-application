# Changes

## Current Version - May 2025

The current version is available in three branches:
- Tutorials: [*main*](../../../)
- Multi-tenant deployment: [*main-multi-tenant*](../../../tree/main-multi-tenant)
- Additional features and ERP integration (based on the multi-tenant version): [*main-multi-tenant-features*](../../../tree/main-multi-tenant-features)

The current version includes:
- [SAP Business One Integration Using a Cloud Connector](33c-B1-Integration-With-Cloud-Connector.md): Use a Cloud Connector to establish a secure connection between an application deployed to SAP Business Technology Platform and SAP Business One.
- [Enable Key User Flexibility Using SAP Build Work Zone](51-Multi-Tenancy-Features-Tenant-Key-User-Flexibility.md): Add UI adaptation to an application using the capabilities of SAP Build Work Zone.
- [Upgrading Multi-Tenant SaaS Applications](61-Operations-SubscriptionUpgrade.md): Describe key considerations to ensure seamless upgrades of a multi-tenant SaaS application.
- [Schedule Jobs and Add Background Execution](46-Multi-Tenancy-Features-Job-Scheduling.md): Provide an example on how to use the SAP Job Scheduling service.
- [Capabilities of BTP Continuous Integration and Delivery Service](46-Multi-Tenancy-Features-Job-Scheduling.md): Configure and run predefined continous integration and delivery (CI/CD) pipelines.
- Smaller corrections, improvements, and updates

## Older Versions

### February 2025

Includes
- The one-off deployment has been removed from the tutorial and the ERP integration is now part of the feature-branch. This removes some detours and simplifies the learning journey.
- Work Zone integration: Provide launchpad and shell header for the multi-tenant application.
- [Extensibility enablement](50-Multi-Tenancy-Features-Tenant-Extensibility.md): Enable consumer-specific extensions to meet the unique needs of individual customers without impacting others.
- [Cloud Foundry scaling](28-CF-Environment-Scaling.md): Detailed tutorial on estimating the required Cloud Foundry environment configuration for your multi-tenant application.
- Smaller corrections, improvements, and updates

Corresponding Tags
- Tutorials: [release-tutorial-2502](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-tutorial-2502)
- Multitenancy: [release-multi-tenant-2502](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-multi-tenant-2502)
- ERP/Features: [release-multi-tenant-features-2502](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-multi-tenant-features-2502)

### December 2024

Includes
- [Example](45-Multi-Tenancy-Features-GenAI.md) for using generative artificial intelligence using large language models (genAI using LLMs)
- Changes in the ERP integration to avoid issues with extended data validations introduced with CDS 8
- Smaller corrections, improvements and updates

Corresponding Tags
- Tutorials: [release-tutorial-2412](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-tutorial-2412)
- One-off deployment: [release-single-tenant-2412](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-single-tenant-2412)
- Multitenancy/ERP: [release-multi-tenant-2412](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-multi-tenant-2412)
- Features: [release-multi-tenant-features-2412](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-multi-tenant-features-2412)

### October 2024

Includes
- Output management: [forms](44a-Multi-Tenancy-Features-Forms.md), [print](44b-Multi-Tenancy-Features-Print.md), [email](44c-Multi-Tenancy-Features-EMail.md)
- Tutorial on [SAP HANA Cloud Tools](27-Hana-DB-Scaling.md#sap-hana-cloud-tools) and [SAP HANA Cloud size estimation](27-Hana-DB-Scaling.md)
- Switch to CDS8 including subscription handling by the MTX sidecar module
- Creation of test data using action instead of csv-files
- Description how to [unsubscribe service broker instances](42b-Multi-Tenancy-Provisioning-Service-Broker.md#unsubscribe-the-service-broker-in-a-consumer-sap-btp-subaccount)
- Extended explanation of the [SAP Custom Domain Service](24-Multi-Tenancy-Deployment.md#configure-the-application-subdomain-custom-domain)
- Smaller corrections and updates

Corresponding Tags
- Tutorials: [release-tutorial-2410](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-tutorial-2410)
- One-off deployment: [release-single-tenant-2410](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-single-tenant-2410)
- Multitenancy/ERP: [release-multi-tenant-2410](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-multi-tenant-2410)
- Features: [release-multi-tenant-features-2410](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-multi-tenant-features-2410)

### August 2024

Includes
- Support for a second application (CDS service and Fiori Elements UIs including UI Custom Actions and UI navigation) to maintain visitors
- Additional feature: SAP BTP Cloud Logging service for observability
- Cleanup, corrections, dependency updates

Corresponding Tags
- Tutorials: [release-tutorial-2408](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-tutorial-2408)
- One-off deployment: [release-single-tenant-2408](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-single-tenant-2408)
- Multitenancy/ERP: [release-multi-tenant-2408](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-multi-tenant-2408)
- Features: [release-multi-tenant-features-2408](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-multi-tenant-features-2408)

### May 2024

Includes
- Dependency updates
- Increased test coverage
- Restructured implementation with better separation of concerns
- Smaller corrections and clarifications of the tutorial

Corresponding Tags
- Tutorials: [release-tutorial-2405](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-tutorial-2405)
- One-off deployment: [release-single-tenant-2405](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-single-tenant-2405)
- Multitenancy/ERP: [release-multi-tenant-2405](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-multi-tenant-2405)
- Features: [release-multi-tenant-features-2405](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-multi-tenant-features-2405)

### March 2024

Includes
- Integration with SAP Business One (on premise)
- Simplified multi-tenancy configuration
- Unit test enhancements
- Cleanup and corrections

Corresponding Tags
- Tutorials: [release-tutorial-2403](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-tutorial-2403)
- One-off deployment: [release-single-tenant-2403](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-single-tenant-2403)
- Multitenancy/ERP: [release-multi-tenant-2403](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-multi-tenant-2403)
- Features: [release-multi-tenant-features-2403](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-multi-tenant-features-2403)

### January 2024
 
Initial release

Corresponding Tags
- Tutorials: [release-tutorial-2401](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-tutorial-2401)
- One-off deployment: [release-single-tenant-2401](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-single-tenant-2401)
- Multitenancy/ERP: [release-multi-tenant-2401](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-multi-tenant-2401)
- Features: [release-multi-tenant-features-2401](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-multi-tenant-features-2401)
