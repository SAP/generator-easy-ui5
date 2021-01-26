sap.ui.define([
  "sap/ui/test/opaQunit",
  // "./pages/<%= journey %>"<% opa5pos.forEach(function (po) { %>,
  "./pages/<%= po %>"<% }) %>
], function (opaTest) {
  "use strict";

  opaTest("Should see the page", function (Given, When, Then) {

    // Arrangements
    Given.iStartMyApp();

    // Actions
    // When.onThe<%= journey %>Page.iPressTheButton();

    // Assertions
    Then.onThe<%= journey %>Page.iShouldSeeTheTitle();

    // Cleanup
    Then.iTeardownMyApp();
  });

});
