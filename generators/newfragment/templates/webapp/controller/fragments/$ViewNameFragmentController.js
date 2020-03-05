/* eslint-disable strict */
sap.ui.define([
		"../common/BaseFragmentController"
	],
	function (BaseFragmentController) {
		"use strict";

		return BaseFragmentController.extend(
			"<%= namespace%>.<%=projectname%>.fragments.<%=viewname%>FragmentController", {

				constructor: function (oCallingController) {
					BaseFragmentController.apply(this, ["<%=viewname%>", oCallingController]);
				},

				getFragment: function () {
					if (!this._oFragment) {
						this._oFragment = sap.ui.xmlfragment("MessagePopover", "<%= namespace%>.<%=projectname%>.view.fragments.<%=viewname%>",
							this);
						this.getView().addDependent(this._oFragment);
					}

					return this._oFragment;
				},

				/**
				 * Opens the dialog.
				 * @param {any} oEvent Event from the view
				 */
				open: function (oEvent) {
					this.getFragment().openBy(oEvent.getSource());
				},

				/**
				 * Closes the dialog.
				 */
				onClose: function () {
					this.getFragment().close();
				}
			}
		);
	}
);
