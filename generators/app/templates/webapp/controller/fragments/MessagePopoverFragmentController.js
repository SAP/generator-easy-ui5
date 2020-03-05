sap.ui.define([
		"../common/BaseFragmentController"
	],
	function (BaseFragmentController) {
		"use strict";

		return BaseFragmentController.extend(
			"<%= namespace%>.<%=projectname%>.fragments.MessagePopoverFragmentController", {

				constructor: function (oCallingController) {
					BaseFragmentController.apply(this, ["MessagePopover", oCallingController]);
				},

				getFragment: function () {
					if (!this._oFragment) {
						this._oFragment = sap.ui.xmlfragment("MessagePopover", "<%= namespace%>.<%=projectname%>.view.fragments.MessagePopover",
							this);
						this.getView().addDependent(this._oFragment);
					}

					return this._oFragment;
				},

				/**
				 * Opens the dialog.
				 */
				open: function (oEvent) {
					this.getFragment().openBy(oEvent.getSource());
				},

				/**
				 * Closes teh dialog.
				 */
				onClose: function () {
					this.getFragment().close();
				}
			}
		);
	}
);