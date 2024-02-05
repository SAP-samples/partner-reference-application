'use strict';

// Include cds libraries and reuse files
const cds = require('@sap/cds');

// ----------------------------------------------------------------------------
// S4HC specific reuse functions
// ----------------------------------------------------------------------------

// Delegate OData requests to remote S4HC project entities
async function delegateODataRequests(req, remoteService) {
  try {
    const s4hcProject = await cds.connect.to(remoteService);
    return await s4hcProject.run(req.query);
  } catch (error) {
    console.log(error);
  }
}

// Return json-payload to create S4HC projects
async function projectDataRecord(
  poetrySlamIdentifier,
  poetrySlamTitle,
  poetrySlamReadingDate
) {
  try {
    // Set project ID with pattern PRA-{{poetrySlam identifier}}
    const generatedID = 'POETRYSLAM_' + poetrySlamIdentifier;
    const generatedPLANID = generatedID + '-PLAN';
    const generatedEXEID = generatedID + '-EXE';

    // Set project start date 30 days before poetrySlam date
    const moment = require('moment');
    const generatedStartDate =
      moment(poetrySlamReadingDate)
        .subtract(30, 'days')
        .toISOString()
        .substring(0, 10) + 'T00:00:00.0000000Z';
    const generatedEndDate =
      moment(poetrySlamReadingDate).toISOString().substring(0, 10) +
      'T00:00:00.0000000Z';
    const generatedTask1EndDate =
      moment(poetrySlamReadingDate)
        .subtract(4, 'days')
        .toISOString()
        .substring(0, 10) + 'T00:00:00.0000000Z';
    const generatedTask2StartDate =
      moment(poetrySlamReadingDate)
        .subtract(1, 'days')
        .toISOString()
        .substring(0, 10) + 'T00:00:00.0000000Z';

    // Assemble project payload
    const projectRecord = {
      Project: generatedID,
      ProjectDescription: poetrySlamTitle,
      ProjectStartDate: generatedStartDate,
      ProjectEndDate: generatedEndDate,
      EntProjectIsConfidential: false,
      ResponsibleCostCenter: '10101101',
      ProfitCenter: '9900000000',
      ProjectProfileCode: 'YP03',
      ProjectCurrency: 'EUR',
      to_EnterpriseProjectElement: [
        {
          ProjectElement: generatedPLANID,
          ProjectElementDescription: 'Event planning and preparations',
          PlannedStartDate: generatedStartDate,
          PlannedEndDate: generatedTask1EndDate
        },
        {
          ProjectElement: generatedEXEID,
          ProjectElementDescription: 'Event administration and execution',
          PlannedStartDate: generatedTask2StartDate,
          PlannedEndDate: generatedEndDate
        }
      ]
    };
    return projectRecord;
  } catch (error) {
    console.log(error);
  }
}

// Expand poetrySlam to remote projects
async function readProject(poetrySlams) {
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
    const asArray = (x) => (Array.isArray(x) ? x : [x]);

    // Read Project ID's related to S4HC
    let projectIDs = [];
    for (const poetrySlam of asArray(poetrySlams)) {
      // Check if the Project ID exists in the poetryslam record AND backend ERP is S4HC => then read project information from S4HC
      if (poetrySlam.projectSystem == 'S4HC' && poetrySlam.projectID) {
        projectIDs.push(poetrySlam.projectID);
        isProjectIDs = true;
      }
    }

    // Read S4HC projects data
    if (!isProjectIDs) {
      return poetrySlams;
    }

    // Request all associated projects
    const projects = await s4hcProject.run(
      SELECT.from('PoetrySlamManager.S4HCProjects').where({
        Project: projectIDs
      })
    );

    // Convert in a map for easier lookup
    const projectsMap = {};
    for (const project of projects) projectsMap[project.Project] = project;

    // Assemble result
    for (const poetrySlam of asArray(poetrySlams)) {
      poetrySlam.toS4HCProject = projectsMap[poetrySlam.projectID];

      // Get Project Profile Code Text from S4HC
      const projectProfileCode = poetrySlam.toS4HCProject.ProjectProfileCode;
      const S4HCProjectsProjectProfileCodeRecords =
        await s4hcProjectsProjectProfileCode.run(
          SELECT.from('PoetrySlamManager.S4HCProjectsProjectProfileCode').where(
            { ProjectProfileCode: projectProfileCode }
          )
        );
      for (const S4HCProjectsProjectProfileCodeRecord of S4HCProjectsProjectProfileCodeRecords) {
        poetrySlam.projectProfileCodeText =
          S4HCProjectsProjectProfileCodeRecord.ProjectProfileCodeText;
      }

      // Get Project Processing Status Text from S4HC
      const processingStatus = poetrySlam.toS4HCProject.ProcessingStatus;
      const S4HCProjectsProcessingStatusRecords =
        await s4hcProjectsProcessingStatus.run(
          SELECT.from('PoetrySlamManager.S4HCProjectsProcessingStatus').where({
            ProcessingStatus: processingStatus
          })
        );
      for (const S4HCProjectsProcessingStatusRecord of S4HCProjectsProcessingStatusRecords) {
        poetrySlam.processingStatusText =
          S4HCProjectsProcessingStatusRecord.ProcessingStatusText;
      }
    }
    return poetrySlams;
  } catch (error) {
    // App reacts error tolerant in case of calling the remote service, mostly if the remote service is not available of if the destination is missing
    console.log('ACTION_READ_PROJECT_CONNECTION' + '; ' + error);
  }
}

// Publish constants and functions
module.exports = {
  readProject,
  projectDataRecord,
  delegateODataRequests
};
