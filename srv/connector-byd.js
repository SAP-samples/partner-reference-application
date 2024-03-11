'use strict';

// Include cds libraries and reuse files
const cds = require('@sap/cds');

// Constants Definition
const generatedIDPrefix = 'POETRYSLAM_';
const generatedIDSuffixPrep = '-PREP';
const generatedIDSuffixExe = '-EXE';
const BYD_DESTINATION = 'byd';
const BYD_DESTINATION_URL = 'byd-url';
const BYD_PROJECT_SYSTEM = 'ByD';

// Project data for SAP Business ByDesign; needs to be adopted according to SAP Business ByDesign configuration
const responsibleCostCenter = 'S1111';
const projectTypeCode = '10';
const projectLanguageCode = 'EN';
const responsibleEmployeeID = 'E0202';

// ----------------------------------------------------------------------------
// SAP Business ByDesign specific reuse functions
// ----------------------------------------------------------------------------

// Delegate OData requests to remote SAP Business ByDesign project entities
async function delegateODataRequests(req, remoteService) {
  try {
    const bydProject = await cds.connect.to(remoteService);
    return await bydProject.run(req.query);
  } catch (error) {
    console.log(error);
  }
}

// Return json-payload to create SAP Business ByDesign projects
async function projectDataRecord(
  poetrySlamIdentifier,
  poetrySlamTitle,
  poetrySlamDate
) {
  try {
    // Set project ID with pattern AR-{{Poetry Slam identifier}}
    const generatedID = generatedIDPrefix + poetrySlamIdentifier;
    // Set project start date 40 days before Poetry Slam date
    const moment = require('moment');
    const generatedStartDate =
      moment(poetrySlamDate)
        .subtract(40, 'days')
        .toISOString()
        .substring(0, 10) + 'T00:00:00.0000000Z';

    const generatedTaskEndDate =
      moment(poetrySlamDate)
        .subtract(4, 'days')
        .toISOString()
        .substring(0, 10) + 'T00:00:00.0000000Z';

    // Assemble project payload based the sample data provided by *SAP Business ByDesign Partner Demo Tenants* (reference systems)
    const projectRecord = {
      ProjectID: generatedID,
      EstimatedCompletionPercent: 10,
      ResponsibleCostCentreID: responsibleCostCenter,
      ProjectTypeCode: projectTypeCode,
      ProjectLanguageCode: projectLanguageCode,
      PlannedStartDateTime: generatedStartDate,
      PlannedEndDateTime: poetrySlamDate,
      ProjectSummaryTask: {
        ProjectName: poetrySlamTitle,
        ResponsibleEmployeeID: responsibleEmployeeID
      },
      Task: [
        {
          TaskID: generatedID + generatedIDSuffixPrep,
          TaskName: 'Event planning and preparations',
          PlannedDuration: 'P30D',
          TaskRelationship: [
            {
              DependencyTypeCode: '2',
              SuccessorTaskID: generatedID + generatedIDSuffixExe,
              LagDuration: 'P2D'
            }
          ]
        },
        {
          TaskID: generatedID + generatedIDSuffixExe,
          TaskName: 'Event administration and execution',
          PlannedDuration: 'P5D',
          ConstraintEndDateTime: generatedTaskEndDate,
          ScheduleActivityEndDateTimeConstraintTypeCode: '2'
        }
      ]
    };
    return projectRecord;
  } catch (error) {
    console.log(error);
  }
}

// Expand Poetry Slam to remote projects
async function readProject(poetrySlams) {
  try {
    const bydProject = await cds.connect.to('byd_khproject');
    let isProjectIDs = false;
    const asArray = (x) => (Array.isArray(x) ? x : [x]);

    // Read Project ID's related to SAP Business ByDesign
    let projectIDs = [];
    for (const poetrySlam of asArray(poetrySlams)) {
      // Check if the Project ID exists in the Poetry Slam record AND backend ERP is SAP Business ByDesign => then read project information from SAP Business ByDesign
      if (
        poetrySlam.projectSystem == BYD_PROJECT_SYSTEM &&
        poetrySlam.projectID
      ) {
        projectIDs.push(poetrySlam.projectID);
        isProjectIDs = true;
      }
    }

    // Read SAP Business ByDesign projects data
    if (isProjectIDs) {
      // Request all associated projects
      const projects = await bydProject.run(
        SELECT.from('PoetrySlamManager.ByDProjects').where({
          projectID: projectIDs
        })
      );

      // Convert in a map for easier lookup
      const projectsMap = {};
      for (const project of projects) projectsMap[project.projectID] = project;

      // Assemble result
      for (const poetrySlam of asArray(poetrySlams)) {
        poetrySlam.toByDProject = projectsMap[poetrySlam.projectID];
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
  delegateODataRequests,
  BYD_DESTINATION,
  BYD_DESTINATION_URL,
  BYD_PROJECT_SYSTEM
};
