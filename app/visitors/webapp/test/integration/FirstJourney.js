sap.ui.define(['sap/ui/test/opaQunit'], function (opaTest) {
  'use strict';

  const Journey = {
    run: function () {
      QUnit.module('First journey');

      opaTest('Start application', function (Given, When, Then) {
        Given.iStartMyApp();
        // onTheShell event added due to sap-ushell-config in webapp/index.html
        When.onTheShell.iPressTile('fe-lrop-v4');
        Then.onTheVisitorsList.iSeeThisPage();
      });

      opaTest('Navigate to ObjectPage', function (Given, When, Then) {
        // Note: this test will fail if the ListReport page doesn't show any data
        When.onTheVisitorsList.onFilterBar().iExecuteSearch();
        Then.onTheVisitorsList.onTable().iCheckRows();

        When.onTheVisitorsList.onTable().iPressRow(0);
        Then.onTheVisitorsObjectPage.iSeeThisPage();
      });

      opaTest('Teardown', function (Given) {
        // Cleanup
        Given.iTearDownMyApp();
      });
    }
  };

  return Journey;
});
