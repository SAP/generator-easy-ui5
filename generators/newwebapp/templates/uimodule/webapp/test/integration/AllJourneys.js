sap.ui.define([
  "sap/ui/test/Opa5",
  "<%=appURI%>/test/integration/arrangements/Startup",
  "<%=appURI%>/test/integration/BasicJourney"
], function(Opa5, Startup) {
  "use strict";

  Opa5.extendConfig({
    arrangements: new Startup(),
    autoWait: true
  });

});
