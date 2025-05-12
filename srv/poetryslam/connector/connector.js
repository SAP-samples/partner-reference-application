'use strict';

const destinationUtil = require('../../lib/destination');

class Connector {
  destination;
  destinationURL;
  isConnectedIndicator;
  systemName;
  systemURL;

  constructor(data) {
    this.destination = data.destination;
    this.destinationURL = data.destinationURL;
    this.systemURL = data.systemURL;
    this.systemName = data.systemName;
    this.isConnectedIndicator = data.isConnectedIndicator;
  }

  // Delegate OData requests to remote ERP system project entities
  async delegateODataRequests(req, remoteService) {
    try {
      const project = await cds.connect.to(remoteService);
      return await project.run(req.query);
    } catch (error) {
      console.error('Connector - delegateODataRequests:', error);
    }
  }

  getSystemName() {
    return this.systemName;
  }

  isConnected() {
    return this.isConnectedIndicator;
  }

  static async createConnectorData(req, destinationName, destinationURLName) {
    const data = { isConnectedIndicator: false };
    data.destination = await destinationUtil.readDestination(
      req,
      destinationName
    );

    if (!data.destination) {
      console.log(`Check ERP destination: ${destinationName} not found`);
      return data;
    }

    console.log(`Check ERP destination: ${destinationName} found`);

    data.isConnectedIndicator = true;

    data.destinationURL = await destinationUtil.readDestination(
      req,
      destinationURLName
    );

    if (!data.destinationURL) {
      console.log(`Check ERP destination: ${destinationURLName} not found`);
      return data;
    }

    console.log(`Check ERP destination: ${destinationURLName} found`);

    data.systemURL = await destinationUtil.getDestinationURL(
      data.destinationURL
    );

    data.systemName = await destinationUtil.getDestinationDescription(
      data.destinationURL
    );
    return data;
  }
}

module.exports = Connector;
