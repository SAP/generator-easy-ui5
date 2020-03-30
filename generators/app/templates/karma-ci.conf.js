module.exports = function (config) {
	"use strict";

	require("./karma.conf")(config);
	config.set({

		// test results reporter to use
		// possible values: "dots", "progress", "coverage"
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ["progress"],

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ["ChromeHeadless"],
		customLaunchers: {
			ChromeHeadlessNoSandbox: {
				base: "ChromeHeadless",
				flags: [
					"--no-sandbox", // required to run without privileges in docker
					"--user-data-dir=/tmp/chrome-test-profile",
					"--disable-web-security"
				]
			}
		},

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true

	});
};
