# Changes

## Current Version - February 2025

The current version is available in three branches:
- Tutorials: [*main*](../../../)
- Multi-tenant deployment: [*main-multi-tenant*](../../../tree/main-multi-tenant)
- Additional features and ERP integration (based on the multi-tenant version): [*main-multi-tenant-features*](../../../tree/main-multi-tenant-features)

The current version includes:
- The one-off deployment has been removed from the tutorial and the ERP integration is now part of the feature-branch. This removes some detours and simplifies the learning journey.
- Work Zone integration: Provide launchpad and shell header for the multi-tenant application.
- [Extensibility enablement](50-Multi-Tenancy-Features-Tenant-Extensibility.md): Enable consumer-specific extensions to meet the unique needs of individual customers without impacting others.
- [Cloud Foundry scaling](28-CF-Environment-Scaling.md): Detailed tutorial on estimating the required Cloud Foundry environment configuration for your multi-tenant application.
- Smaller corrections, improvements, and updates

## Older Versions

## December 2024

Includes
- [Example](45-Multi-Tenancy-Features-GenAI.md) for using generative artificial intelligence using large language models (genAI using LLMs)
- Changes in the ERP integration to avoid issues with extended data validations introduced with CDS 8
- Smaller corrections, improvements and updates

Corresponding Tags
- Tutorials: [release-tutorial-2412](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-tutorial-2412)
- One-off deployment: [release-single-tenant-2412](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-single-tenant-2412)
- Multitenancy/ERP: [release-multi-tenant-2412](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-multi-tenant-2412)
- Features: [release-multi-tenant-features-2412](https://github.com/SAP-samples/partner-reference-application/releases/tag/release-multi-tenant-features-2412)

## October 2024

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
