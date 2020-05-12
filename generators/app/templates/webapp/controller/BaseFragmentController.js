sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/core/Fragment"
], function(BaseObject, Fragment) {

    var BaseFragmentController = BaseObject.extend("<%= namespace%>.<%=projectname%>.controller.BaseFragmentController", {

        _sFragmentId: null,

        _oCallingController: null,

        constructor: function(sFragmentId, oCallingController) {
            this._sFragmentId = sFragmentId;
            this._oCallingController = oCallingController;
        },

        /**
         * Getter for the calling controller (the controller which instantiated this fragment)
         * @retuns {cimco.smartapp.controller.BaseController} the calling controller.
         */
        getCallingController: function() {
            return this._oCallingController;
        },

        /**
         * Returns the ID of the fragment handled by this controller.
         * @retuns {string} the fragment ID
         */
        getFragmentId: function() {
            return this._sFragmentId;
        },

        /**
         * Convenience method to get a the callers view
         * @returns {sap.ui.core.mvc.View} the View
         */
        getView: function() {
            return this._oCallingController.getView();
        },

        /**
         * Convenience method to get a control by it's ID
         * @param {string} sId the control ID
         * @returns {sap.ui.core.Control} the control
         */
        byId: function(sId) {
            return Fragment.byId(this._sFragmentId, sId);
        },

        /**
         * Convenience method to create an ID for this fragment.
         * @param {string} sId the given ID
         * @returns {string} the ID for this fragment.
         */
        createId: function(sId) {
            return Fragment.createId(this._sFragmentId, sId);
        },

        /**
         * Convenience method that returns a model of the calling controller
         * @param {string} [sName] the name of the model.
         * @returns {sap.ui.model.json.JSONModel} the model.
         */
        getModel: function(sName) {
            return this._oCallingController.getModel(sName);
        },

        /**
         * Convenience method that sets a model of the calling controller
         * @param {sap.ui.model.Model} the model
         * @param {string} [sName] the name of the model.
         */
        setModel: function(oModel, sName) {
            this._oCallingController.setModel(oModel, sName);
        },

        /**
         * Convenience method that returns the view model of the calling controller
         * @returns {sap.ui.model.json.JSONModel} the view model.
         */
        getViewModel: function() {
            return this._oCallingController.getViewModel();
        },

        /**
         * Convenience method for text from the i18n model
         * @param {string} sId ID of the text
         * @param {array} [aTexts] string array which format the message (optional)
         * @returns {string} i18n string of the ID
         */
        i18n: function(sId, aTexts) {
            return this._oCallingController.i18n(sId, aTexts);
        },

        /**
         * Convenience method to retrieve the owner component
         * @returns {sap.ui.core.Component} the component.
         */
        getOwnerComponent: function() {
            return this._oCallingController.getOwnerComponent();
        }

    });

    return BaseFragmentController;

});