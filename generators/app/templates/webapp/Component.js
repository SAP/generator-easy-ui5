sap.ui.define([
    "sap/ui/core/UIComponent",
    "./util/MessageManager",
    "<%= namespace.replace(/\./g, '/')%>/<%=projectname.replace('.', '/')%>/model/models"
], function(UIComponent, MessageManager, models) {
    "use strict";

    return UIComponent.extend("<%=namespace%>.<%=projectname%>.Component", {

        metadata: {
            manifest: "json"
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */
        init: function() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // enable routing
            this.getRouter().initialize();

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // load the Message Manager class
            this._loadMessageManager();
        },

        /**
         * Initialize the message manager
         * @private
         */
        _loadMessageManager: function() {
            this._oMessageManager = new MessageManager(this);
        }
    });
});