sap.ui.define([
  "./common/BaseController",
  "<%= controllerToExtend%>"
], function(Controller) {
  "use strict";

  return Controller.extend("<%= namespace%>.<%=projectname%>.controller.<%=viewname%>", {});
});
