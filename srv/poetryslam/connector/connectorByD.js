'use strict';

// Include super class
const Connector = require('./connector');

const {
  convertToArray,
  subtractDaysFormatRFC3339
} = require('../util/entityCalculations');

// Include cds libraries and reuse files
const cds = require('@sap/cds');

class ConnectorByD extends Connector {
  projectRecord;

  static DESTINATION = 'byd';
  static DESTINATION_URL = 'byd-url';
  static PROJECT_SYSTEM = 'ByD';
  static PROJECT_SERVICE = 'byd_khproject';

  // Constants Definition
  static GENERATED_ID_PREFIX = 'POETRYSLAM_';
  static GENERATED_ID_SUFFIX_PREP = '-PREP';
  static GENERATED_ID_SUFFIX_EXE = '-EXE';

  // -------------------------------------------------------------------------------------------------------------
  // Project data for SAP Business ByDesign; needs to be adopted according to SAP Business ByDesign configuration
  // -------------------------------------------------------------------------------------------------------------

  static RESPONSIBLE_COST_CENTER = 'S1111';
  static PROJECT_TYPE_CODE = '10';
  static PROJECT_LANGUAGE_CODE = 'EN';
  static RESPONSIBLE_EMPLOYEE_ID = 'E0202';

  constructor(data) {
    super(data);
  }

  // ----------------------------------------------------------------------------
  // SAP Business ByDesign specific reuse functions
  // ----------------------------------------------------------------------------

  // Return json-payload to create SAP Business ByDesign projects
  projectDataRecord(poetrySlamIdentifier, poetrySlamTitle, poetrySlamDate) {
    try {
      // Set project ID with pattern AR-{{Poetry Slam identifier}}
      const generatedID =
        ConnectorByD.GENERATED_ID_PREFIX + poetrySlamIdentifier;

      // Assemble project payload
      this.projectRecord = {
        ProjectID: generatedID,
        EstimatedCompletionPercent: 10,
        ResponsibleCostCentreID: ConnectorByD.RESPONSIBLE_COST_CENTER,
        ProjectTypeCode: ConnectorByD.PROJECT_TYPE_CODE,
        ProjectLanguageCode: ConnectorByD.PROJECT_LANGUAGE_CODE,
        PlannedStartDateTime: subtractDaysFormatRFC3339(poetrySlamDate, 40), // Set project start date 40 days before Poetry Slam date
        PlannedEndDateTime: poetrySlamDate,
        ProjectSummaryTask: {
          ProjectName: poetrySlamTitle,
          ResponsibleEmployeeID: ConnectorByD.RESPONSIBLE_EMPLOYEE_ID
        },
        Task: [
          {
            TaskID: generatedID + ConnectorByD.GENERATED_ID_SUFFIX_PREP,
            TaskName: 'Event planning and preparations',
            PlannedDuration: 'P30D',
            TaskRelationship: [
              {
                DependencyTypeCode: '2',
                SuccessorTaskID:
                  generatedID + ConnectorByD.GENERATED_ID_SUFFIX_EXE,
                LagDuration: 'P2D'
              }
            ]
          },
          {
            TaskID: generatedID + ConnectorByD.GENERATED_ID_SUFFIX_EXE,
            TaskName: 'Event administration and execution',
            PlannedDuration: 'P5D',
            ConstraintEndDateTime: subtractDaysFormatRFC3339(poetrySlamDate, 4), //4 days
            ScheduleActivityEndDateTimeConstraintTypeCode: '2'
          }
        ]
      };
    } catch (error) {
      console.error('ConnectorByD - projectDataRecord:', error);
    }
  }

  // Get the entity service (entity "ByDProjects")
  determineDestinationURL() {
    // Set the URL of SAP Business ByDesign project overview screen for UI navigation
    const remoteProjectExternalURL =
      '/sap/ap/ui/runtime?bo_ns=http://sap.com/xi/AP/ProjectManagement/Global&bo=Project&node=Root&operation=OpenByProjectID&object_key=' +
      this.projectRecord.ProjectID +
      '&key_type=APC_S_PROJECT_ID';
    return encodeURI(this.systemURL?.concat(remoteProjectExternalURL));
  }

  // Enhance poetry slam with data of remote project
  async readProject(poetrySlams) {
    try {
      // Read Project ID's related to SAP Business ByDesign
      let projectIDs = [];
      for (const poetrySlam of convertToArray(poetrySlams)) {
        // Check if the Project ID exists in the Poetry Slam record AND backend ERP is SAP Business ByDesign => then read project information from SAP Business ByDesign
        if (
          poetrySlam.projectSystem == ConnectorByD.PROJECT_SYSTEM &&
          poetrySlam.projectID
        ) {
          projectIDs.push(poetrySlam.projectID);
        }
      }

      if (!projectIDs.length) {
        return poetrySlams;
      }

      // Read SAP Business ByDesign projects data
      const bydProjectService = await cds.connect.to('byd_khproject');

      // Request all associated projects
      // Use the remote service but select from the projection as defined in the PoetrySlamService; CAP takes care of the attribute mapping
      const projects = await bydProjectService.run(
        SELECT.from('PoetrySlamService.ByDProjects').where({
          ProjectID: projectIDs
        })
      );

      // Assemble result
      for (const poetrySlam of convertToArray(poetrySlams)) {
        poetrySlam.toByDProject = projects.find(
          (project) => project.projectID === poetrySlam.projectID
        );
      }

      return poetrySlams;
    } catch (error) {
      // App reacts error tolerant in case of calling the remote service, mostly if the remote service is not available of if the destination is missing
      console.error('ACTION_READ_PROJECT_CONNECTION' + '; ' + error);
    }
  }

  // Get the project record
  async getRemoteProjectData(srv) {
    const { ByDProjects } = srv.entities;

    // GET service call on projection of remote project entity
    const remoteProject = await srv.run(
      SELECT.one.from(ByDProjects).where({
        projectID: this.projectRecord.ProjectID
      })
    );

    // Determine project ID and UUID and return it as object
    return {
      projectID: remoteProject?.projectID,
      projectObjectID: remoteProject?.ID
    };
  }

  // POST request to create the project via remote service
  // The request is executed with the remote service and the remote entity definition avoiding CDS data type assertions and a complete model copy of the remote entity and its composition associations
  async insertRemoteProjectData() {
    const bydProjectService = await cds.connect.to('byd_khproject');

    const remoteProject = await bydProjectService.run(
      INSERT.into(bydProjectService.entities.ProjectCollection).entries(
        this.projectRecord
      )
    );

    // Determine project ID and UUID and return it as object
    return {
      projectID: remoteProject?.ProjectID,
      projectObjectID: remoteProject?.ObjectID
    };
  }

  // Created a connector instance with destinations
  static async createConnectorInstance(req) {
    const data = await Connector.createConnectorData(
      req,
      ConnectorByD.DESTINATION,
      ConnectorByD.DESTINATION_URL
    );
    const connector = new ConnectorByD(data);
    console.log(
      `SAP Business ByDesign connector created - connected: ${data.isConnectedIndicator}`
    );

    return connector;
  }
}

// Publish class
module.exports = ConnectorByD;