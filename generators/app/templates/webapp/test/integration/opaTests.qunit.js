/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"<%=namespace.replace(/\./g, '/')%>/<%=projectname%>/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});
