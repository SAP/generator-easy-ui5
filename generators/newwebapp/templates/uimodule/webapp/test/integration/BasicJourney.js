sap.ui.define([
  "sap/ui/test/opaQunit",
  "<%=appURI%>/test/integration/pages/<%=viewname%>"
], function (opaTest) {
  "use strict";

  opaTest("Should see the page", function (Given, When, Then) {

    // Arrangements
    Given.iStartMyApp();

    // Assertions
    Then.onThe<%=viewname%>Page.iShouldSeeTheTitle();

    // Cleanup
    Then.iTeardownMyApp();
  });

});
