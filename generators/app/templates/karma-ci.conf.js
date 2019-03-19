// Karma configuration
// Generated on Wed Jun 13 2018 14:38:44 GMT+0200 (CEST)

module.exports = function(config) {
	require("./karma.conf")(config);
	config.set({

		client: {
			qunit: {
				showUI: false
			}
		},

		// test results reporter to use
		// possible values: 'dots', 'progress', 'coverage'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress'],

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['ChromeHeadless'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true

	});
};
