sap.ui.require(
  [
    'sap/fe/test/JourneyRunner',
    'poetryslammanager/test/integration/FirstJourney',
    'poetryslammanager/test/integration/pages/PoetrySlamsList',
    'poetryslammanager/test/integration/pages/PoetrySlamsObjectPage'
  ],
  function (JourneyRunner, opaJourney, PoetrySlamsList, PoetrySlamsObjectPage) {
    'use strict';
    JourneyRunner = new JourneyRunner({
      // start index.html in web folder
      launchUrl: sap.ui.require.toUrl('poetryslammanager') + '/index.html'
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
