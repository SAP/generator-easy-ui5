var Generator = require("yeoman-generator");
var fs = require("fs");
var path = require("path");

class UIVeri5Generator extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.answers = {};
		this.reportersMap = {
			JSON: "jsonReporter",
			JUNIT: "junitReporter",
			SauceLabs: "saucelabsReporter"
		};
		this.authMap = {
			basic: "basic",
			"Fiori form": "fiori-form",
			"SAP CP form": "sapcloud-form",
			"GitHub form": "github-form"
		};
		this.option("base");
		this.option("po");
	}

	// TODO validate prompt
	async prompting() {
		if (this.options.base) {
			this.answers = await this.prompt([{
				type: "input",
				name: "root",
				message: "UIVeri5 test folder:",
				default: "uiveri5"
			}, {
				type: "input",
				name: "baseUrl",
				message: "URL to the app under test:",
				default: "http://localhost:8080"
			}, {
				type: "input",
				name: "suiteName",
				message: "Name for the suite (describe block):",
				default: "masterdetail"
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
				type: "list",
				name: "auth",
				message: "Choose authentication:",
				choices: Object.keys(this.authMap).concat("none"),
				default: "none"
			}]);

		} else if (this.options.po) {
			this.answers = await this.prompt([{
				type: "input",
				name: "root",
				message: "UIVeri5 test folder:",
				default: "uiveri5"
			}, {
				type: "input",
				name: "poName",
				message: "Page object name:",
				default: "Master"
			}, {
				type: "input",
				name: "poFile",
				message: "Page object file name:",
				default: "master"
			}, {
				type: "input",
				name: "action",
				message: "Add action with name (empty string to skip actions):"
			}, {
				type: "input",
				name: "assertion",
				message: "Add assertion with name (empty string to skip assertions):"
			}]);

		}
	}

	writing() {
		if (this.options.base) {
			this.fs.copyTpl(
				this.templatePath("base/$specName.spec.js"),
				this.destinationPath(this.answers.root + "/" + this.answers.suiteName + ".spec.js"),
				this.answers
			);
			this.fs.copyTpl(
				this.templatePath("./base/*"),
				this.destinationPath(this.answers.root + "/"),
				Object.assign({}, this.answers, {
					reportersMap: this.reportersMap,
					authMap: this.authMap
				}),
				null, {
					globOptions: {
						dot: true
					}
				}
			);
			this.fs.delete(this.answers.root + "/$specName.spec.js");

		} else if (this.options.po) {
			this.fs.copyTpl(
				this.templatePath("po/pages/$poFile.js"),
				this.destinationPath(this.answers.root + "/pages/" + this.answers.poFile + ".js"),
				this.answers
			);
			this.fs.copyTpl(
				this.templatePath("./po/*.spec.js"),
				this.destinationPath(this.answers.root + "/"),
				this.answers,
				null, {
					globOptions: {
						dot: true
					}
				}
			);

		}
	}
};

module.exports = UIVeri5Generator;
