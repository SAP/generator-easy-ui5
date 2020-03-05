sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/core/message/Message",
	"sap/ui/core/MessageType"
], function (Object, Message, MessageType) {
	"use strict";
	return Object.extend("<%= namespace%>.<%=projectname%>.util.MessageManager", {
		constructor: function (oContext) {
			this._oComponent = oContext;
			this._initMessageModel();
			this._initGetter();
		},

		_initMessageModel: function () {
			this._oMessageManager = sap.ui.getCore().getMessageManager();
			this._oComponent.setModel(this._oMessageManager.getMessageModel(), "message");
		},

		_initGetter: function () {
			this._oComponent.getMessageManager = () => this;
		},

		/* =========================================================== */
		/* Message Manager methods / events                            */
		/* =========================================================== */

		/**
		 * Adds an error message to the MessageManager.
		 * @param {object} mSettings settings object with the following values:
		 * <ul>
		 * <li> context: {sap.ui.model.Context} the context object
		 * <li> property: {string} the property name in the given context
		 * <li> message: {string} the error message
		 * <li> description: {string} optional description
		 * </ul>
		 */
		addError: function (mSettings) {
			var sId = this.removeMessage(mSettings);

			this._oMessageManager.addMessages(new Message({
				id: sId,
				message: mSettings.message,
				description: mSettings.description,
				type: MessageType.Error,
				target: this._getMessageTarget(mSettings),
				processor: mSettings.context.getModel()
			}));
		},

		_getMessageTarget: function (mSettings) {
			var sTarget = mSettings.context.getPath();
			if (sTarget.length > 1) {
				sTarget += "/";
			}
			return sTarget + mSettings.property;
		},

		/**
		 * Adds a warning message to the MessageManager.
		 * @param {object} mSettings settings object with the following values:
		 * <ul>
		 * <li> context: {sap.ui.model.Context} the context object
		 * <li> property: {string} the property name in the given context
		 * <li> message: {string} the error message
		 * <li> description: {string} optional description
		 * </ul>
		 */
		addWarning: function (mSettings) {
			var sId = this.removeMessage(mSettings);

			this._oMessageManager.addMessages(new Message({
				id: sId,
				message: mSettings.message,
				description: mSettings.description,
				type: MessageType.Warning,
				target: this._getMessageTarget(mSettings),
				processor: mSettings.context.getModel()
			}));
		},

		/**
		 * Removes an error message from the MessageManager.
		 * @param {object} mSettings settings object with the following values:
		 * <ul>
		 * <li> context: {sap.ui.model.Context} the context object
		 * <li> property: {string} the property name in the given context
		 * </ul>
		 */
		removeMessage: function (mSettings) {
			var sId = this._createMessageId(mSettings);
			var oMessage = this._oMessageManager.getMessageModel().getProperty("/").find(function (o) {
				return o.getId() === sId;
			});
			if (oMessage) {
				this._oMessageManager.removeMessages(oMessage);
			}
			return sId;
		},

		/**
		 * Generates the message ID.
		 * @private
		 * @param {object} mSettings settings object with the following values:
		 * <ul>
		 * <li> context: {sap.ui.model.Context} the context object
		 * <li> property: {string} the property name in the given context
		 * </ul>
		 */
		_createMessageId: function (mSettings) {
			var oContext = mSettings.context;
			var sBasePath = oContext.getPath();
			if (sBasePath.length > 1) {
				sBasePath += "/";
			}
			return sBasePath + mSettings.property + (mSettings.id || "");
		},

		/**
		 * Convenience method that removes all messages from the message manager.
		 * @param {string} [sStartsWith] if provided will remove all messages that starts with given id.
		 */
		removeAllMessages: function (sStartsWith) {
			var oMessageManager = this._oMessageManager;
			if (sStartsWith) {

				this._oMessageManager.getMessageModel().getProperty("/").forEach(function (oMessage) {
					if (oMessage.getId().startsWith(sStartsWith)) {
						oMessageManager.removeMessages(oMessage);
					}
				});
			} else {
				oMessageManager.removeAllMessages();
			}
		},

		/**
		 * Event triggered when the message button is pressed.
		 * Displays the message popover.
		 * @param {sap.ui.base.Event} oEvent the control's event.
		 */
		onMessagePopoverPress: function (oEvent) {
			if (!this._oMessagePopover) {
				this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(), "com.toromont.sales.createdoc.view.MessagePopover", this);
				this.getView().addDependent(this._oMessagePopover);
			}
			this._oMessagePopover.openBy(oEvent.getSource());
		}

	});
});