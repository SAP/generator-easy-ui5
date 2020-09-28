var Generator = require("yeoman-generator");
var validUrl = require("valid-url");
var validFilename = require("valid-filename");

class UIVeri5Generator extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.answers = {};
		this.reportersMap = {
			JUNIT: "junitReporter",
			SauceLabs: "saucelabsReporter"
		};
		this.authMap = {
			"Fiori form": "fiori-form",
			"SAP CP form": "sapcloud-form"
		};
	}

	prompting() {
		var poPromptConfig = [{
			type: "input",
			name: "poName",
			message: "Page object name:",
			default: "Master",
			validate: function (poName) {
				return validFilename(poName);
			}
		}, {
			type: "input",
			name: "action",
			message: "Add action with name (empty string to skip actions):"
		}, {
			type: "input",
			name: "assertion",
			message: "Add assertion with name (empty string to skip assertions):"
		}];
		var conditionalPoPromptConfig = [];
		poPromptConfig.forEach(function (obj) {
			var conditionalObj = Object.assign({}, obj);
			conditionalObj.when = function (answers) {
				return answers.addPO;
			};
			conditionalPoPromptConfig.push(conditionalObj);
		});

		var promptConfig = this.options.po ? poPromptConfig : [{
			type: "input",
			name: "baseUrl",
			message: "URL to the app under test:",
			default: "http://localhost:8080"
		}, {
			type: "list",
			name: "auth",
			message: "Choose authentication:",
			choices: Object.keys(this.authMap).concat("none"),
			default: "none"
		}, {
			type: "input",
			name: "suiteName",
			message: "Name for the suite (describe block):",
			default: "masterdetail",
			validate: function (suiteName) {
				return validFilename(suiteName);
			}
		}, {
			type: "input",
			name: "specName",
			message: "Name for the spec (it block):",
			default: "should see the app"
		}, {
			type: "checkbox",
			name: "chosenReporters",
			message: "Choose additional reporters:",
			choices: Object.keys(this.reportersMap),
			default: ["JSON"]
		}, {
			type: "confirm",
			name: "addPO",
			message: "Do you want to add a page object?",
			default: true
		}].concat(conditionalPoPromptConfig);

		return this.prompt(promptConfig).then(function (answers) {
			this.options.oneTimeConfig = this.config.getAll();
			for (var key in answers) {
				this.options.oneTimeConfig[key] = answers[key];
			}
		}.bind(this));
	}

	writing() {
		if (this.options.po || this.options.oneTimeConfig.addPO) {
			var poFile = this.options.oneTimeConfig.poName.charAt(0).toLowerCase() + this.options.oneTimeConfig.poName.substr(1);
			this.fs.copyTpl(
				this.templatePath("po/pages/$poFile.js"),
				this.destinationPath("pages/" + poFile + ".js"),
				this.options.oneTimeConfig
			);
			this.fs.copyTpl(
				this.templatePath("./po/$example.spec.js"),
				this.destinationPath(poFile + "Example.spec.js"),
				Object.assign({}, this.options.oneTimeConfig, {
					poFile: poFile
				}),
				null, {
					globOptions: {
						dot: true
					}
				}
			);
		}

		if (!this.options.po) {
			this.fs.copyTpl(
				this.templatePath("base/$specName.spec.js"),
				this.destinationPath(this.options.oneTimeConfig.suiteName + ".spec.js"),
				this.options.oneTimeConfig
			);
			this.fs.copyTpl(
				this.templatePath("./base/**/!(*.spec.js)"),
				this.destinationRoot(),
				Object.assign({}, this.options.oneTimeConfig, {
					reportersMap: this.reportersMap,
					authMap: this.authMap
				}),
				null, {
					globOptions: {
						dot: true
					}
				}
			);
			this.fs.delete("$specName.spec.js");
		}
	}
};

module.exports = UIVeri5Generator;
