sap.ui.define([
  "sap/ui/test/Opa5",
  "./arrangements/Startup"<% opa5Journeys.forEach(function (journey) { %>,
  "./<%=journey%>Journey"<% }) %>
], function(Opa5, Startup) {
  "use strict";

  Opa5.extendConfig({
    arrangements: new Startup(),
    autoWait: true
  });

});
