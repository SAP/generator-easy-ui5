<% function upperFirst (str) { return str.charAt(0).toUpperCase() + str.substr(1);} %>sap.ui.require([
  "sap/ui/test/Opa5"<% if (action) { %>,
  "sap/ui/test/actions/Press"<% } %>
], function (Opa5<% if (action) { %>, Press<% } %>) {
  "use strict";

  var sViewName = "<%= appId %>.view.<%= upperFirst(poName) %>View";

  Opa5.createPageObjects({
    onThe<%= upperFirst(poName) %>Page: {
      viewName: sViewName,

      actions: {
        // add action functions here<% if (action) { %>
        <%= action %>: function () {
          return this.waitFor({
            controlType: "sap.m.Button",
            actions: new Press(),
            errorMessage: "App does not have a button"
          });
        }<% } %>
      },

      assertions: {
          // add assertion functions here<% if (assertion) { %>
          <%= assertion %>: function () {
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
        }<% } %>
      }

    }
  });

});
