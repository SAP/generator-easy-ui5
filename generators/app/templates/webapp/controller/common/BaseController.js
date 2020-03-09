sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/base/strings/formatMessage",
    "../../util/Formatter"
], function(Controller, JSONModel, formatMessage, Formatter) {

    return Controller.extend("<%= namespace%>.<%=projectname%>.controller.common.BaseController", {
        formatter: Formatter,

        getRouter: function() {
            return this.getOwnerComponent().getRouter();
        },

        getModel: function(sName) {
            return this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);
        },

        getFragment: function(sName) {
            this.fragments = (typeof this.fragments != "undefined" && this.fragments instanceof Array) ? this.fragments : [];
            if (this.fragments[sName] === undefined) {
                this.fragments[sName] = sap.ui.xmlfragment(sName);
            }
            return this.fragments[sName];
        },
        getViewModel: function() {
            var oViewModel = this.getModel("view");
            if (!oViewModel) {
                oViewModel = new JSONModel({
                    busy: false,
                    delay: 0
                });
                this.setModel(oViewModel, "view");
            }
            return oViewModel;
        },

        setModel: function(oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        getResourceBundle: function() {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        onNavToHome: function() {
            return this.getRouter().navTo("home", true);
        },

        onNavBack: function() {
            var oHistory = sap.ui.core.routing.History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            //The history contains a previous entry
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                // otherwise we go backwards with a forward history
                this.getRouter().navTo("home", {}, true);
            }
        },

        i18n: function(sId, aTexts) {
            return formatMessage(this.getOwnerComponent().getModel("i18n").getProperty(sId), aTexts);
        }
    });

});