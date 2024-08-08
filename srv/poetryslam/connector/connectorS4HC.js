'use strict';

// Include super class
const Connector = require('./connector');

// Include cds libraries and reuse files
const cds = require('@sap/cds');

const {
  convertToArray,
  subtractDaysFormatRFC3339
} = require('../util/entityCalculations');

class ConnectorS4HC extends Connector {
  projectRecord;

  static DESTINATION = 's4hc';
  static DESTINATION_URL = 's4hc-url';
  static PROJECT_SYSTEM = 'S4HC';
  static PROJECT_SERVICE = 'S4HC_API_ENTERPRISE_PROJECT_SRV_0002';
  static PROCESSING_STATUS_SERVICE = 'S4HC_ENTPROJECTPROCESSINGSTATUS_0001';
  static PROFILE_CODE_SERVICE = 'S4HC_ENTPROJECTPROFILECODE_0001';

  // Constants Definition
  static GENERATED_ID_PREFIX = 'POETRYSLAM_';
  static GENERATED_ID_SUFFIX_PLAN = '-PLAN';
  static GENERATED_ID_SUFFIX_EXE = '-EXE';

  // -----------------------------------------------------------------------------------------------------
  // Project data for SAP S/4HANA Cloud; needs to be adopted according to SAP S/4HANA Cloud configuration
  // -----------------------------------------------------------------------------------------------------

  static RESPONSIBLE_COST_CENTER = '10101101';
  static PROFIT_CENTER = '9900000000';
  static PROJECT_PROFILE_CODE = 'YP03';
  static PROJECT_CURRENCY = 'EUR';

  constructor(data) {
    super(data);
  }

  // ----------------------------------------------------------------------------
  // SAP S/4HANA Cloud specific reuse functions
  // ----------------------------------------------------------------------------

  // Return json-payload to create SAP S/4HANA Cloud projects
  async projectDataRecord(
    poetrySlamIdentifier,
    poetrySlamTitle,
    poetrySlamDate
  ) {
    try {
      // Set project ID with pattern PRA-{{poetrySlam identifier}}
      const generatedID =
        ConnectorS4HC.GENERATED_ID_PREFIX + poetrySlamIdentifier;
      const generatedPLANID =
        generatedID + ConnectorS4HC.GENERATED_ID_SUFFIX_PLAN;
      const generatedEXEID =
        generatedID + ConnectorS4HC.GENERATED_ID_SUFFIX_EXE;

      const generatedStartDate = subtractDaysFormatRFC3339(poetrySlamDate, 30);
      const generatedEndDate = subtractDaysFormatRFC3339(poetrySlamDate);

      // Assemble project payload
      this.projectRecord = {
        Project: generatedID,
        ProjectDescription: poetrySlamTitle,
        ProjectStartDate: subtractDaysFormatRFC3339(poetrySlamDate, 30), // Set project start date 30 days before poetrySlam date
        ProjectEndDate: subtractDaysFormatRFC3339(poetrySlamDate),
        EntProjectIsConfidential: false,
        ResponsibleCostCenter: ConnectorS4HC.RESPONSIBLE_COST_CENTER,
        ProfitCenter: ConnectorS4HC.PROFIT_CENTER,
        ProjectProfileCode: ConnectorS4HC.PROJECT_PROFILE_CODE,
        ProjectCurrency: ConnectorS4HC.PROJECT_CURRENCY,
        to_EnterpriseProjectElement: [
          {
            ProjectElement: generatedPLANID,
            ProjectElementDescription: 'Event planning and preparations',
            PlannedStartDate: generatedStartDate,
            PlannedEndDate: subtractDaysFormatRFC3339(poetrySlamDate, 4)
          },
          {
            ProjectElement: generatedEXEID,
            ProjectElementDescription: 'Event administration and execution',
            PlannedStartDate: subtractDaysFormatRFC3339(poetrySlamDate, 1),
            PlannedEndDate: generatedEndDate
          }
        ]
      };
    } catch (error) {
      console.log(error);
    }
  }

  // Get the entity service (entity "S4HCProjects")
  determineDestinationURL() {
    // Set the URL of SAP S/4HANA Cloud project overview screen for UI navigation
    const remoteProjectExternalURL =
      '/ui#EnterpriseProject-planProject?EnterpriseProject=' +
      this.projectRecord.Project;
    return encodeURI(this.systemURL?.concat(remoteProjectExternalURL));
  }

  // Enhance poetry slam with data of remote project
  async readProject(poetrySlams) {
    try {
      const s4hcProject = await cds.connect.to(
        'S4HC_API_ENTERPRISE_PROJECT_SRV_0002'
      );
      const s4hcProjectsProjectProfileCode = await cds.connect.to(
        'S4HC_ENTPROJECTPROFILECODE_0001'
      );
      const s4hcProjectsProcessingStatus = await cds.connect.to(
        'S4HC_ENTPROJECTPROCESSINGSTATUS_0001'
      );
      let isProjectIDs = false;

      // Read Project ID's related to SAP S/4HANA Cloud
      let projectIDs = [];
      for (const poetrySlam of convertToArray(poetrySlams)) {
        // Check if the Project ID exists in the poetryslam record AND backend ERP is SAP S/4HANA Cloud => then read project information from SAP S/4HANA Cloud
        if (
          poetrySlam.projectSystem == ConnectorS4HC.PROJECT_SYSTEM &&
          poetrySlam.projectID
        ) {
          projectIDs.push(poetrySlam.projectID);
          isProjectIDs = true;
        }
      }

      // Read SAP S/4HANA Cloud projects data
      if (!isProjectIDs) {
        return poetrySlams;
      }

      // Request all associated projects
      const projects = await s4hcProject.run(
        SELECT.from('PoetrySlamService.S4HCProjects').where({
          project: projectIDs
        })
      );

      // Convert in a map for easier lookup
      const projectsMap = {};
      for (const project of projects) projectsMap[project.project] = project;

      // Assemble result
      for (const poetrySlam of convertToArray(poetrySlams)) {
        poetrySlam.toS4HCProject = projectsMap[poetrySlam.projectID];

        // Get Project Profile Code Text from SAP S/4HANA Cloud
        const projectProfileCode = poetrySlam.toS4HCProject.projectProfileCode;
        const S4HCProjectsProjectProfileCodeRecords =
          await s4hcProjectsProjectProfileCode.run(
            SELECT.from(
              'PoetrySlamService.S4HCProjectsProjectProfileCode'
            ).where({ ProjectProfileCode: projectProfileCode })
          );
        for (const S4HCProjectsProjectProfileCodeRecord of S4HCProjectsProjectProfileCodeRecords) {
          poetrySlam.projectProfileCodeText =
            S4HCProjectsProjectProfileCodeRecord.projectProfileCodeText;
        }

        // Get Project Processing Status Text from SAP S/4HANA Cloud
        const processingStatus = poetrySlam.toS4HCProject.processingStatus;
        const S4HCProjectsProcessingStatusRecords =
          await s4hcProjectsProcessingStatus.run(
            SELECT.from('PoetrySlamService.S4HCProjectsProcessingStatus').where(
              {
                ProcessingStatus: processingStatus
              }
            )
          );
        for (const S4HCProjectsProcessingStatusRecord of S4HCProjectsProcessingStatusRecords) {
          poetrySlam.processingStatusText =
            S4HCProjectsProcessingStatusRecord.processingStatusText;
        }
      }
      return poetrySlams;
    } catch (error) {
      // App reacts error tolerant in case of calling the remote service, mostly if the remote service is not available of if the destination is missing
      console.log('ACTION_READ_PROJECT_CONNECTION' + '; ' + error);
    }
  }

  // Get the project record
  async getRemoteProjectData(srv) {
    const { S4HCProjects } = srv.entities;

    // GET service call on remote project entity; remote calls shall use srv.run to run in the root transaction with the correct cds.context
    const remoteProject = await srv.run(
      SELECT.one.from(S4HCProjects).where({
        project: this.projectRecord.Project
      })
    );

    // Determine project ID and UUID and return it as object
    return {
      projectID: remoteProject?.project,
      projectObjectID: remoteProject?.projectUUID
    };
  }

  // POST request to create the project via remote service; remote calls shall use srv.run to run in the root transaction with the correct cds.context
  async insertRemoteProjectData(srv) {
    const { S4HCProjects } = srv.entities;

    // GET service call on remote project entity; remote calls shall use srv.run to run in the root transaction with the correct cds.context
    const remoteProject = await srv.run(
      INSERT.into(S4HCProjects).entries(this.projectRecord)
    );

    // Determine project ID and UUID and return it as object
    return {
      projectID: remoteProject?.project,
      projectObjectID: remoteProject?.projectUUID
    };
  }

  // Created a connector instance with destinations
  static async createConnectorInstance(req) {
    const data = await Connector.createConnectorData(
      req,
      ConnectorS4HC.DESTINATION,
      ConnectorS4HC.DESTINATION_URL
    );
    const connector = new ConnectorS4HC(data);
    console.log(
      `SAP S/4HANA Cloud connector created - connected: ${data.isConnectedIndicator}`
    );
    return connector;
  }
}
// Publish class
module.exports = ConnectorS4HC;
