const Generator = require("yeoman-generator"),
  fileaccess = require("../../helpers/fileaccess"),
  path = require("path"),
  glob = require("glob");

module.exports = class extends Generator {

  prompting() {
    if (this.options.isSubgeneratorCall) {
      return this.prompt([{
        type: "input",
        name: "tilename",
        message: "What name should be displayed on the Fiori Launchpad tile?",
        default: "Fiori App",
        when: this.options.platform === "Fiori Launchpad on Cloud Foundry"
      }]).then((answers) => {
        this.destinationRoot(this.options.cwd);
        this.options.oneTimeConfig = this.config.getAll();
        this.options.oneTimeConfig.modulename = this.options.modulename;
        this.options.oneTimeConfig.tilename = answers.tilename;
      });
    }
    var aPrompt = [{
      type: "input",
      name: "modulename",
      message: "What is the name the module?",
      validate: (s) => {
        if (/^[a-zA-Z0-9_-]*$/g.test(s)) {
          return true;
        }
        return "Please use alpha numeric characters only for the module name.";
      }
    }, {
      type: "input",
      name: "viewname",
      message: "What is the name of the new view?",
      validate: (s) => {
        if (/^[a-zA-Z0-9_-]*$/g.test(s)) {
          return true;
        }
        return "Please use alpha numeric characters only for the view name.";
      }
    }, {
      type: "input",
      name: "tilename",
      message: "What name should be displayed on the Fiori Launchpad tile?",
      default: "Fiori App",
      when: this.options.oneTimeConfig.platform === "Fiori Launchpad on Cloud Foundry"
    }];

    if (!this.config.getAll().viewtype) {
      aPrompt = aPrompt.concat([{
        type: "input",
        name: "projectname",
        message: "Seems like this project has not been generated with Easy-UI5. Please enter the name your project.",
        validate: (s) => {
          if (/^[a-zA-Z0-9_-]*$/g.test(s)) {
            return true;
          }
          return "Please use alpha numeric characters only for the project name.";
        },
        default: "myUI5App"
      }, {
        type: "input",
        name: "namespace",
        message: "Please enter the namespace you use currently",
        validate: (s) => {
          if (/^[a-zA-Z0-9_\.]*$/g.test(s)) {
            return true;
          }
          return "Please use alpha numeric characters and dots only for the namespace.";
        },
        default: "com.myorg"
      }, {
        type: "list",
        name: "viewtype",
        message: "Which view type do you use?",
        choices: ["XML", "JSON", "JS", "HTML"],
        default: "XML"
      }]);
    }


    return this.prompt(aPrompt).then((answers) => {

      this.options.oneTimeConfig = this.config.getAll();
      this.options.oneTimeConfig.viewname = answers.viewname;
      this.options.oneTimeConfig.modulename = answers.modulename;
      this.options.oneTimeConfig.tilename = answers.tilename;

      if (answers.projectname) {
        this.options.oneTimeConfig.projectname = answers.projectname;
        this.options.oneTimeConfig.namespace = answers.namespace;
        this.options.oneTimeConfig.viewtype = answers.viewtype;
      }
    });
  }

  async writing() {
    const sModuleName = this.options.oneTimeConfig.modulename;

    // Write files in new module folder
    this.sourceRoot(path.join(__dirname, "templates"));
    glob.sync("**", {
      cwd: this.sourceRoot(),
      nodir: true
    }).forEach((file) => {
      const sOrigin = this.templatePath(file);
      const sTarget = this.destinationPath(file.replace("uimodule", sModuleName).replace(/\/_/, "/"));
      this.fs.copyTpl(sOrigin, sTarget, this.options.oneTimeConfig);
    });
    if (this.options.oneTimeConfig.platform === "Cloud Foundry HTML5 Application Repository" || this.options.oneTimeConfig.platform === "Fiori Launchpad on Cloud Foundry") {
      await fileaccess.manipulateJSON.call(this, sModuleName + "/webapp/xs-app.json", {
        "welcomeFile": this.options.oneTimeConfig.platform === "Cloud Foundry HTML5 Application Repository" ? "index.html" : "/flpSandbox.html",
        "routes": [{
          "source": "^(.*)",
          "target": "$1",
          "authenticationType": "xsuaa",
          "service": "html5-apps-repo-rt"
        }]
      });


      if (this.options.oneTimeConfig.platform === "Fiori Launchpad on Cloud Foundry") {

        await fileaccess.manipulateJSON.call(this, "/" + sModuleName + "/webapp/manifest.json", {
          ["sap.app"]: {
              crossNavigation: {
                inbounds: {
                  intent1: {
                    "signature": {
                      "parameters": {},
                      "additionalParameters": "allowed"
                    },
                    "semanticObject": "data", // TODO replace with modulename
                    "action": "display",
                    "title": this.options.oneTimeConfig.tilename,
                    "description": "App Description",
                    "icon": "sap-icon://add"
                  }
                }
              }
          }
        });
      }
    }

    // Append to master package.json
    const additionalBuildOption = (this.options.oneTimeConfig.ui5libs === "Local resources (OpenUI5)" || this.options.oneTimeConfig.ui5libs === "Local resources (SAPUI5)") ? "--a" : "--clean-dest --dest approuter/webapp";
    const platformIsCF = this.options.oneTimeConfig.platform.includes("Cloud Foundry");
    await fileaccess.manipulateJSON.call(this, "/package.json", function (packge) {
      packge.scripts["serve:" + sModuleName] = "ui5 serve --config=" + sModuleName + "/ui5.yaml";
      packge.scripts["build:ui"] += "build:" + sModuleName;
      if (platformIsCF) {
        packge.scripts["build:" + sModuleName] = "ui5 build --config=" + sModuleName + "/ui5.yaml --clean-dest --include-task=generateManifestBundle --dest deployer/resources/webapp";
      } else {
        packge.scripts["build:" + sModuleName] = "ui5 build --config=" + sModuleName + "/ui5.yaml " + additionalBuildOption;
      }
      return packge;
    });

    const oSubGen = Object.assign({}, this.options.oneTimeConfig);
    oSubGen.isSubgeneratorCall = true;
    oSubGen.cwd = this.destinationRoot();
    this.composeWith(require.resolve("../newview"), oSubGen);
  }

  end() {
    const modules = this.config.get("uimodules") || [];
    modules.push(this.options.oneTimeConfig.modulename);
    this.config.set("uimodules", modules);
  }

};
