sap.ui.define([
  "sap/ui/test/Opa5"
], function(Opa5) {
  "use strict";

  return Opa5.extend("<%=namespace%>.<%=projectname%>.test.integration.arrangements.Startup", {

    iStartMyApp: function () {
      this.iStartMyUIComponent({
        componentConfig: {
          name: "<%=namespace%>.<%=projectname%>",
          async: true,
          manifest: true
        }
      });
    }

  });
});
