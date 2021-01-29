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
      return assert.file(["uimodule/ui5.yaml", `uimodule/webapp/view/MainView.view.${oPrompt.viewtype.toLowerCase()}`, "uimodule/webapp/index.html", "uimodule/webapp/manifest.json"]);
    });

    it("should reference the base controller", function () {
      return assert.fileContent("uimodule/webapp/controller/MainView.controller.js", "controller/BaseController");
    });

    if (!!oPrompt.platform && oPrompt.platform !== "Static webserver" && oPrompt.platform !== "SAP NetWeaver" && oPrompt.platform !== "Application Router @ SAP HANA XS Advanced") {
      it("ui5.yaml middleware should point to the right xs-app.json file", function () {
        return assert.fileContent("uimodule/ui5.yaml", oPrompt.platform === "Application Router @ Cloud Foundry" ? "xsappJson: approuter/xs-app.json" : "xsappJson: uimodule/webapp/xs-app.json");
      });
    }

    if (!!oPrompt.platform && (oPrompt.platform === "SAP HTML5 Application Repository service for SAP BTP" && oPrompt.platform === "SAP Launchpad service")) {
      it("ui5.yaml should leverage the ui5 zipper task", function () {
        return assert.fileContent("uimodule/ui5.yaml", "name: ui5-task-zipper");
      });
    }

    it("should create an installable project", function () {
      return execa.commandSync("npm install");
    });

    if (!!oPrompt.platform && oPrompt.platform !== "Static webserver" && oPrompt.platform !== "SAP NetWeaver") {
      it("should create an buildable project", async function () {
        try {
          await execa.commandSync("npm run build:mta");
        } catch (e) {
          throw new Error(e.stdout + "\n" + e.stderr);
        }
      });
    }
  });
}

describe("Basic project capabilities", function () {
  const testConfigurations = [
    { viewtype: "XML", addOPA5: false },
    { viewtype: "JS", platform: "Application Router @ Cloud Foundry", addOPA5: false },
    { viewtype: "JSON", ui5libs: "Local resources (SAPUI5)", addOPA5: false },
    { viewtype: "JSON", ui5libs: "Local resources (SAPUI5)", platform: "SAP NetWeaver", addOPA5: false },
    { viewtype: "HTML", ui5libs: "Local resources (OpenUI5)", platform: "Application Router @ Cloud Foundry", addOPA5: false },
    { viewtype: "JSON", platform: "SAP Launchpad service", addOPA5: false },
    { viewtype: "XML", platform: "SAP HTML5 Application Repository service for SAP BTP", addOPA5: false },
    { viewtype: "XML", platform: "SAP NetWeaver", addOPA5: false },
    { viewtype: "XML", platform: "Application Router @ SAP HANA XS Advanced", addOPA5: false },
    { viewtype: "JS", ui5libs: "Local resources (SAPUI5)", platform: "SAP HTML5 Application Repository service for SAP BTP", addOPA5: false },
    { viewtype: "JSON", ui5libs: "Local resources (OpenUI5)", platform: "Application Router @ SAP HANA XS Advanced", addOPA5: false },
    { viewtype: "HTML", platform: "SAP HTML5 Application Repository service for SAP BTP", addOPA5: false },
    { viewtype: "JS", platform: "SAP HTML5 Application Repository service for SAP BTP", addOPA5: false },
    { viewtype: "JSON", ui5libs: "Local resources (SAPUI5)", platform: "Application Router @ SAP HANA XS Advanced", addOPA5: false },
    { viewtype: "JSON", ui5libs: "Local resources (SAPUI5)", platform: "SAP NetWeaver", addOPA5: false },
    { viewtype: "HTML", ui5libs: "Local resources (OpenUI5)", platform: "Application Router @ SAP HANA XS Advanced", addOPA5: false },
    { viewtype: "JS", ui5libs: "Local resources (OpenUI5)", platform: "SAP HTML5 Application Repository service for SAP BTP", addOPA5: false }
  ];

  const runningInCircleCI = process.env.CI;

  testConfigurations.forEach((testConfig, index) => {
    if (!runningInCircleCI) {
      createTest(testConfig);
      return;
    }
    const totalNodes = Number(process.env.CIRCLE_NODE_TOTAL);
    const nodeIdx = Number(process.env.CIRCLE_NODE_INDEX);
    const testsPerNode = Math.ceil(testConfigurations.length / totalNodes);
    const lowerBound = testsPerNode * nodeIdx;
    const upperBound = testsPerNode * (nodeIdx + 1);

    if ((lowerBound <= index) && (index < upperBound)) {
      createTest(testConfig);
    }
  });
});

describe("OPA5 tests", function () {
  this.timeout(200000);

  it("should add OPA5 tests and run them with karma", function () {
    var appDir;
    return helpers.run(path.join(__dirname, "../generators/app")).withPrompts({
      viewtype: "XML",
      addOPA5: false
    }).then(function (dir) {
        appDir = path.join(dir, "com.myorg.myUI5App");
        return helpers.run(path.join(__dirname, "../generators/opa5")).cd(appDir).withPrompts({
          modulename: "uimodule",
          addJourney: false,
          addPO: false
        });
      }).then(function () {
        return helpers.run(path.join(__dirname, "../generators/newopa5journey")).cd(appDir).withPrompts({
          modulename: "uimodule",
          journey: "Main"
        });
      }).then(function () {
        return helpers.run(path.join(__dirname, "../generators/newopa5po")).cd(appDir).withPrompts({
          modulename: "uimodule",
          poName: "Main",
          action: "iPressTheButton",
          assertion: "iShouldSeeTheTitle"
        });
      }).then(function () {
        return execa.command("npm install").then(function () {
          return execa.command("npm run test", { cdw: appDir }).catch(function (e) {
            throw new Error(e.stdout + "\n" + e.stderr);
          });
        });
      });
  });
});
