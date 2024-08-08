sap.ui.define(['sap/fe/test/ObjectPage'], function (ObjectPage) {
  'use strict';

  const CustomPageDefinitions = {
    actions: {},
    assertions: {}
  };

  return new ObjectPage(
    {
      appId: 'visitors',
      componentId: 'VisitorsObjectPage',
      contextPath: '/Visitors'
    },
    CustomPageDefinitions
  );
});
