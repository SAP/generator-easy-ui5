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
        when: this.options.platform === "SAP Launchpad service"
      }]).then((answers) => {
        this.destinationRoot(this.options.cwd);
        this.options.oneTimeConfig = this.config.getAll();
        this.options.oneTimeConfig.modulename = this.options.modulename;
        this.options.oneTimeConfig.tilename = answers.tilename;

        this.options.oneTimeConfig.appId = this.options.oneTimeConfig.namespace + "." + (this.options.modulename === "uimodule" ? this.options.oneTimeConfig.projectname : this.options.modulename);
        this.options.oneTimeConfig.appURI = this.options.oneTimeConfig.namespaceURI + "/" + (this.options.modulename === "uimodule" ? this.options.oneTimeConfig.projectname : this.options.modulename);
      });
    }

    var aPrompt = [{
      type: "input",
      name: "modulename",
      message: "What is the name the module?",
      validate: (s) => {
        if (/^\d*[a-zA-Z][a-zA-Z0-9]*$/g.test(s)) {
          return true;
        }
        return "Please use alpha numeric characters only for the module name.";
      }
    }, {
      type: "input",
      name: "viewname",
      message: "What is the name of the new view?",
      validate: (s) => {
        if (/^\d*[a-zA-Z][a-zA-Z0-9]*$/g.test(s)) {
          return true;
        }
        return "Please use alpha numeric characters only for the view name.";
      },
      default: "MainView"
    }, {
      type: "input",
      name: "tilename",
      message: "What name should be displayed on the Fiori Launchpad tile?",
      default: "Fiori App",
      when: this.config.get("platform") === "SAP Launchpad service"
    }, {
      type: "confirm",
      name: "addOPA5",
      message: "Do you want to add OPA5 tests?",
      default: true
    }];

    if (!this.config.getAll().viewtype) {
      aPrompt = aPrompt.concat([{
        type: "input",
        name: "projectname",
        message: "Seems like this project has not been generated with Easy-UI5. Please enter the name your project.",
        validate: (s) => {
          if (/^\d*[a-zA-Z][a-zA-Z0-9]*$/g.test(s)) {
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
        this.options.oneTimeConfig.namespaceURI = answers.namespace.split(".").join("/");
        this.options.oneTimeConfig.viewtype = answers.viewtype;
      }

      this.options.oneTimeConfig.appId = this.options.oneTimeConfig.namespace + "." + (answers.modulename === "uimodule" ? this.options.oneTimeConfig.projectname : answers.modulename);
      this.options.oneTimeConfig.appURI = this.options.oneTimeConfig.namespaceURI + "/" + (answers.modulename === "uimodule" ? this.options.oneTimeConfig.projectname : answers.modulename);

      if (answers.addOPA5) {
        this.composeWith(require.resolve("../opa5"), Object.assign({}, this.options.oneTimeConfig, {
          isSubgeneratorCall: true,
          namespaceInput: this.options.oneTimeConfig.namespace
        }));
      }
    });
  }

  async writing() {
    const sModuleName = this.options.oneTimeConfig.modulename;
    const localResources = (this.options.oneTimeConfig.ui5libs === "Local resources (OpenUI5)" || this.options.oneTimeConfig.ui5libs === "Local resources (SAPUI5)");
    const platformIsAppRouter = this.options.oneTimeConfig.platform.includes("Application Router");
    const netweaver = this.options.oneTimeConfig.platform.includes("SAP NetWeaver");

    // Write files in new module folder
    this.sourceRoot(path.join(__dirname, "templates"));
    glob.sync("**", {
      cwd: this.sourceRoot(),
      nodir: true
    }).forEach((file) => {
      const sOrigin = this.templatePath(file);
      const sTarget = this.destinationPath(file.replace("uimodule", sModuleName).replace(/\/_/, "/"));

      const isUnneededFlpSandbox = sTarget.includes("flpSandbox") && this.options.oneTimeConfig.platform !== "SAP Launchpad service";
      const isUnneededXsApp = sTarget.includes("xs-app") && !(this.options.oneTimeConfig.platform === "SAP Launchpad service" || this.options.oneTimeConfig.platform === "SAP HTML5 Application Repository service for SAP BTP");

      if (isUnneededXsApp || isUnneededFlpSandbox) {
        return;
      }

      this.fs.copyTpl(sOrigin, sTarget, this.options.oneTimeConfig);
    });

    if (this.options.oneTimeConfig.platform.includes("Application Router")) {
      await fileaccess.manipulateJSON.call(this, "/approuter/xs-app.json", {
        "routes": [{
          "source": "^/" + sModuleName + "/(.*)$",
          "target": "$1",
          "authenticationType": "none",
          "localDir": sModuleName + "/webapp"
        }]
      });

    }

    if (this.options.oneTimeConfig.platform === "SAP HTML5 Application Repository service for SAP BTP" || this.options.oneTimeConfig.platform === "SAP Launchpad service") {
      if (this.options.oneTimeConfig.platform === "SAP Launchpad service") {
        await fileaccess.manipulateJSON.call(this, "/" + sModuleName + "/webapp/manifest.json", {
          ["sap.cloud"]: {
            "service": this.options.oneTimeConfig.projectname + ".service"
          },
          ["sap.app"]: {
            crossNavigation: {
              inbounds: {
                intent1: {
                  "signature": {
                    "parameters": {},
                    "additionalParameters": "allowed"
                  },
                  "semanticObject": sModuleName,
                  "action": "display",
                  "title": this.options.oneTimeConfig.tilename,
                  "icon": "sap-icon://add"
                }
              }
            }
          }
        });
      }
    }

    // Append to master package.json
    await fileaccess.manipulateJSON.call(this, "/package.json", function (packge) {
      packge.scripts["serve:" + sModuleName] = "ui5 serve --config=" + sModuleName + "/ui5.yaml";
      packge.scripts["build:ui"] += " build:" + sModuleName;
      let buildCommand = "ui5 build --config=" + sModuleName + "/ui5.yaml --clean-dest";
      if (localResources) {
        buildCommand += " --a";
      }
      if (platformIsAppRouter) {
        buildCommand += ` --dest approuter/${sModuleName}/webapp`;
      } else if (!netweaver) {
        buildCommand += ` --dest ${sModuleName}/dist`;
        buildCommand += " --include-task=generateManifestBundle";
      } else {
        buildCommand += " --dest dist/" + sModuleName;
      }
      packge.scripts["build:" + sModuleName] = buildCommand;
      return packge;
    });

    if (this.options.oneTimeConfig.platform === "SAP HTML5 Application Repository service for SAP BTP" || this.options.oneTimeConfig.platform === "SAP Launchpad service") {
      await fileaccess.writeYAML.call(this, "/mta.yaml", (mta) => {

        const deployer = mta.modules.find((module) => module.name === "webapp_deployer");


        deployer["build-parameters"]["requires"].push({
          name: sModuleName,
          artifacts: [`dist/${sModuleName}.zip`],
          ["target-path"]: "resources/"
        });

        mta.modules.push({
          "name": sModuleName,
          "type": "html5",
          "path": sModuleName,
          "build-parameters": {
            "builder": "custom",
            "commands": [`npm run build:${sModuleName} --prefix ..`],
            "supported-platforms": []
          }
        });
        return mta;
      });
    }


    const oSubGen = Object.assign({}, this.options.oneTimeConfig);
    oSubGen.isSubgeneratorCall = true;
    oSubGen.cwd = this.destinationRoot();
    this.composeWith(require.resolve("../newview"), oSubGen);

    const modules = this.config.get("uimodules") || [];
    modules.push(this.options.oneTimeConfig.modulename);
    this.config.set("uimodules", modules);
  }
};
