sap.ui.require(
  [
    'sap/fe/test/JourneyRunner',
    'visitors/test/integration/FirstJourney',
    'visitors/test/integration/pages/VisitorsList',
    'visitors/test/integration/pages/VisitorsObjectPage'
  ],
  function (JourneyRunner, opaJourney, VisitorsList, VisitorsObjectPage) {
    'use strict';
    JourneyRunner = new JourneyRunner({
      // start index.html in web folder
      launchUrl: sap.ui.require.toUrl('visitors') + '/index.html'
    });

    JourneyRunner.run(
      {
        pages: {
          onTheVisitorsList: VisitorsList,
          onTheVisitorsObjectPage: VisitorsObjectPage
        }
      },
      opaJourney.run
    );
  }
);
