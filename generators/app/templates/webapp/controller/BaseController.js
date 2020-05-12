sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "<%= namespaceURI%>/<%=projectname%>/util/formatter"
], function(Controller, History, UIComponent, formatter) {
    "use strict";

    return Controller.extend("<%= namespace%>.<%=projectname%>.controller.BaseController", {

        formatter: formatter,

        /**
         * Convenience method for getting the view model by name in every controller of the application.
         * @public
         * @param {string} sName the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function(sName) {
            return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model in every controller of the application.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel: function(oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        /**
         * Convenience method for getting the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle: function() {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        /**
         * Method for navigation to specific view
         * @public
         * @param {string} sTarget Parameter containing the string for the target navigation
         * @param {mapping} mParameters? Parameters for navigation
         * @param {boolean} bReplace? Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
         */
        navTo: function(sTarget, mParameters, bReplace) {
            this.getRouter().navTo(sTarget, mParameters, bReplace);
        },

        /**
         * Event triggered when the message button is pressed (usually in the footer toolbar of Sematic Pages in Fiori apps).
         * Opens the message popover above the message indicator.
         * @see https://experience.sap.com/fiori-design-web/semantic-page/
         * @param {sap.ui.core.Event} oEvent the control's event
         */
        onMessagesButtonPress: function(oEvent) {
            var oMessagesButton = oEvent.getSource();

            if (!this._oMessagePopover) {
                this._oMessagePopover = new MessagePopover({
                    items: {
                        path: "message>/",
                        template: new MessagePopoverItem({
                            description: "{message>description}",
                            type: "{message>type}",
                            title: "{message>message}"
                        })
                    }
                });
                oMessagesButton.addDependent(this._oMessagePopover);
            }
            this._oMessagePopover.toggle(oMessagesButton);
        },

        getRouter: function() {
            return UIComponent.getRouterFor(this);
        },

        onNavBack: function() {
            var sPreviousHash = History.getInstance().getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.back();
            } else {
                this.getRouter().navTo("appHome", {}, true /*no history*/ );
            }
        }

    });

});