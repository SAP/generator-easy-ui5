sap.ui.define([
    "./BaseController"
], function(Controller) {
    "use strict";

    return Controller.extend("<%= namespace%>.<%=projectname%>.controller.App", {
        onInit: function() {
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
        }
    });
});