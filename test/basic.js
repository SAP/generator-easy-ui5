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

    it("should create an installable project", function () {
      return execa.commandSync("npm install");
    });

    it("should create valid code (run inner test suite)", async function () {
      try {
        await execa.commandSync("npm run test");
      } catch (e) {
        throw new Error(e.stdout + "\n" + e.stderr);
      }
    });

    if (!!oPrompt.platform && oPrompt.platform !== "Static webserver") {
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

    { viewtype: "XML" },
    { viewtype: "JS", platform: "Application Router @ Cloud Foundry" },
    { viewtype: "JSON", ui5libs: "Local resources (SAPUI5)" },
    { viewtype: "HTML", ui5libs: "Local resources (OpenUI5)", platform: "Application Router @ Cloud Foundry" },
    { viewtype: "JSON", platform: "Fiori Launchpad on Cloud Foundry" },
    { viewtype: "XML", platform: "Cloud Foundry HTML5 Application Repository" },
    { viewtype: "XML", platform: "Application Router @ SAP HANA XS Advanced" },
    { viewtype: "JS", ui5libs: "Local resources (SAPUI5)", platform: "Cloud Foundry HTML5 Application Repository" },
    { viewtype: "JSON", ui5libs: "Local resources (OpenUI5)", platform: "Application Router @ SAP HANA XS Advanced" },
    { viewtype: "HTML", platform: "Cloud Foundry HTML5 Application Repository" },
    { viewtype: "JS", platform: "Cloud Foundry HTML5 Application Repository" },
    { viewtype: "JSON", ui5libs: "Local resources (SAPUI5)", platform: "Application Router @ SAP HANA XS Advanced" },
    { viewtype: "HTML", ui5libs: "Local resources (OpenUI5)", platform: "Application Router @ SAP HANA XS Advanced" },
    { viewtype: "JS", ui5libs: "Local resources (OpenUI5)", platform: "Cloud Foundry HTML5 Application Repository" }
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
