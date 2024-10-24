sap.ui.define(['sap/ui/core/library'], function () {
  'use strict';
  return {
    /**
     * @param oContext the binding context of the current entity
     * @param aSelectedContexts contains an array of binding contexts corresponding to selected items in case of table actions
     */
    navigatePoetrySlamList: function () {
      let linkPoetrySlam = window.location.href
        .replace('/visitors/', '/poetryslams/')
        .replace('visitors-', 'poetryslams-');

      // Locally the path to the app is different to the path in workzone or multi tenancy deployment
      const path = linkPoetrySlam.includes('&/Visitors')
        ? '&/Visitors'
        : '/Visitors';
      window.location.href = encodeURI(linkPoetrySlam.split(path)[0]);
    }
  };
});
