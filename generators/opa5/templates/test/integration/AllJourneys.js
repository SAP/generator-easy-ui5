sap.ui.define([
  "sap/ui/test/Opa5",
  "<%= appURI %>/test/integration/arrangements/Startup"<% opa5Journeys.forEach(function (journey) { %>,
  "<%= appURI %>/test/integration/<%=journey%>Journey"<% }) %>
], function(Opa5, Startup) {
  "use strict";

  Opa5.extendConfig({
    arrangements: new Startup(),
    autoWait: true
  });

});
