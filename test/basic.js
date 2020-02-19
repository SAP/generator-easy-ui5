const assert = require("yeoman-assert");
const path = require("path");
const helpers = require("yeoman-test");
const execa = require("execa");

function createTest(oPrompt) {
	describe(Object.values(oPrompt).join("-"), function () {
		this.timeout(200000);

		it("should be able to create the project", function () {
			return helpers.run(path.join(__dirname, "../generators/app")).withPrompts(oPrompt);
		});


		it("should create the necessary ui5 files", function () {
			return assert.file(["ui5.yaml", `webapp/view/MainView.view.${oPrompt.viewtype.toLowerCase()}`, "webapp/index.html", "webapp/manifest.json"]);
		});

		it("should create an installable project", function () {
			return execa.commandSync("npm install");
		});

		it("should create valid code (run inner test suite)", function () {
			return execa.commandSync("npm run test");
		});

		if (!!oPrompt.platform && oPrompt.platform !== "Static webserver") {
			it("should create an buildable project", function () {
				return execa.commandSync("npm run build:mta");
			});
		}

	});
}

describe("Basic project capabilities", function () {

	createTest({ viewtype: "XML", platform: "Application Router @ Cloud Foundry" });
	createTest({ viewtype: "JSON", ui5libs: "Local resources (OpenUI5)" });
	createTest({ viewtype: "JS" });
	createTest({ viewtype: "HTML", ui5libs: "Local resources (OpenUI5)", platform: "Application Router @ Cloud Foundry" });
	createTest({ viewtype: "XML", platform: "Application Router @ SAP HANA XS Advanced" });
	createTest({ viewtype: "JSON", ui5libs: "Local resources (OpenUI5)", platform: "Application Router @ SAP HANA XS Advanced" });
	createTest({ viewtype: "HTML", platform: "Cloud Foundry HTML5 Application Repository" });
	createTest({ viewtype: "JS", platform: "Cloud Foundry HTML5 Application Repository" });
	createTest({ viewtype: "HTML", ui5libs: "Local resources (OpenUI5)", platform: "Application Router @ SAP HANA XS Advanced" });

});
