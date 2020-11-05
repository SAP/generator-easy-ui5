sap.ui.require([
  "sap/ui/test/Opa5"
], function (Opa5) {
  "use strict";

  var sViewName = "<%=appId%>.view.<%=viewname%>";
  var sAppId = "idAppControl";

  Opa5.createPageObjects({
    onThe<%=viewname%>Page: {
      viewName: sViewName,

      assertions: {

        iShouldSeeTheTitle: function() {
          return this.waitFor({
            controlType: "sap.m.Title",
            properties: {
              text: "<%=appId%>"
            },
            success: function() {
              Opa5.assert.ok(true, "The page shows the correct title");
            },
            errorMessage: "App does not show the expected title <%=appId%>"
          });
        }
      }

    }
  });

});
