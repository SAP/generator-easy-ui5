sap.ui.require([
  "sap/ui/test/Opa5",
  "sap/ui/test/matchers/AggregationLengthEquals"
], function (Opa5, AggregationLengthEquals) {
  "use strict";

  var sViewName = "<%=appId%>.view.<%=viewname%>";
  var sAppId = "idAppControl";

  Opa5.createPageObjects({
    onTheAppPage: {

      assertions: {

        iShouldSeePageCount: function(iItemCount) {
          return this.waitFor({
            id: sAppId,
            viewName: sViewName,
            matchers: [new AggregationLengthEquals({
              name: "pages",
              length: iItemCount
            })],
            success: function() {
              Opa5.assert.ok(true, "The app contains one page");
            },
            errorMessage: "App does not have expected number of pages '" + iItemCount + "'."
          });
        }
      }

    }
  });

});
