sap.ui.require(
  [
    'sap/fe/test/JourneyRunner',
    'poetryslams/test/integration/FirstJourney',
    'poetryslams/test/integration/pages/PoetrySlamsList',
    'poetryslams/test/integration/pages/PoetrySlamsObjectPage'
  ],
  function (JourneyRunner, opaJourney, PoetrySlamsList, PoetrySlamsObjectPage) {
    'use strict';
    JourneyRunner = new JourneyRunner({
      // start index.html in web folder
      launchUrl: sap.ui.require.toUrl('poetryslams') + '/index.html'
    });

    JourneyRunner.run(
      {
        pages: {
          onThePoetrySlamsList: PoetrySlamsList,
          onThePoetrySlamsObjectPage: PoetrySlamsObjectPage
        }
      },
      opaJourney.run
    );
  }
);
