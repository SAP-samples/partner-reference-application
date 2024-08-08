sap.ui.define(['sap/ui/test/opaQunit'], function (opaTest) {
  'use strict';

  const Journey = {
    run: function () {
      QUnit.module('First journey');

      opaTest('Start application', function (Given, When, Then) {
        Given.iStartMyApp();
        Then.onThePoetrySlamsList.iSeeThisPage();
      });

      opaTest('Navigate to ObjectPage', function (Given, When, Then) {
        // Note: this test will fail if the ListReport page doesn't show any data
        When.onThePoetrySlamsList.onFilterBar().iExecuteSearch();
        Then.onThePoetrySlamsList.onTable().iCheckRows();

        When.onThePoetrySlamsList.onTable().iPressRow(0);
        Then.onThePoetrySlamsObjectPage.iSeeThisPage();
      });

      opaTest('Teardown', function (Given) {
        // Cleanup
        Given.iTearDownMyApp();
      });
    }
  };

  return Journey;
});
