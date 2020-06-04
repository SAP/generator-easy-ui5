sap.ui.define([
  "sap/ui/test/Opa5",
  "<%=namespace.replace(/\./g, '/')%>/<%=projectname%>/test/integration/arrangements/Startup",
  "<%=namespace.replace(/\./g, '/')%>/<%=projectname%>/test/integration/BasicJourney"
], function(Opa5, Startup) {
  "use strict";

  Opa5.extendConfig({
    arrangements: new Startup(),
    pollingInterval: 1
  });

});
