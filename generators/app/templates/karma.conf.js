module.exports = function(config) {
	config.set({

		frameworks: ["ui5"],

		browsers: ["Chrome"],

		browserConsoleLogOptions: {
			level: "error"
		}

	});
};
