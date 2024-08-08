'use strict';
window['sap-ushell-config'] = {
  defaultRenderer: 'fiori2',
  applications: {
    'fe-lrop-v4': {
      title: 'Manage Visitors',
      description: 'An application to create and manage visitors.',
      additionalInformation: 'SAPUI5.Component=visitors',
      applicationType: 'URL',
      url: './',
      navigationMode: 'embedded'
    }
  }
};
