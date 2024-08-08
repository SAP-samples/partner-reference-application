'use strict';
window['sap-ushell-config'] = {
  defaultRenderer: 'fiori2',
  applications: {
    'fe-lrop-v4': {
      title: 'Manage Poetry Slams',
      description: 'An application to create and manage poetry slams.',
      additionalInformation: 'SAPUI5.Component=poetryslams',
      applicationType: 'URL',
      url: './',
      navigationMode: 'embedded'
    }
  }
};
