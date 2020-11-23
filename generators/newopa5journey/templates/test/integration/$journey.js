sap.ui.define([
  "sap/ui/test/opaQunit",
  // "<%= appURI %>/test/integration/pages/<%= journey %>"<% opa5pos.forEach(function (po) { %>,
  "<%= appURI %>/test/integration/pages/<%= po %>"<% }) %>
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
