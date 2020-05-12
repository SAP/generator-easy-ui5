sap.ui.define([
    "./BaseController",
    "<%= controllerToExtend%>"
], function(Controller) {
    "use strict";

    return Controller.extend("<%= namespace%>.<%=projectname%>.controller.<%=viewname%>", {});
});