const Generator = require("yeoman-generator"),
  fileaccess = require("../../helpers/fileaccess"),
  path = require("path"),
  glob = require("glob");

module.exports = class extends Generator {

  prompting() {
    if (this.options.isSubgeneratorCall) {
      this.destinationRoot(this.options.cwd);
      this.options.oneTimeConfig = this.config.getAll();
      this.options.oneTimeConfig.modulename = this.options.modulename;
      return [];
    }
    var aPrompt = [ {
      type: "input",
      name: "modulename",
      message: "What is the name the module?",
      validate: (s) => {
        if (/^[a-zA-Z0-9_-]*$/g.test(s)) {
          return true;
        }
        return "Please use alpha numeric characters only for the module name.";
      }
    },{
      type: "input",
      name: "viewname",
      message: "What is the name of the new view?",
      validate: (s) => {
        if (/^[a-zA-Z0-9_-]*$/g.test(s)) {
          return true;
        }
        return "Please use alpha numeric characters only for the view name.";
      }
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
      this.options.oneTimeConfig.modulename = answers.modulename

      if (answers.projectname) {
        this.options.oneTimeConfig.projectname = answers.projectname;
        this.options.oneTimeConfig.namespace = answers.namespace;

    // this.config.set("namespaceURI", this.config.get("namespace").split(".").join("/"));
        // save in
        this.options.oneTimeConfig.viewtype = answers.viewtype;
      }
    });
  }

  async writing() {
    const sModuleName = this.options.oneTimeConfig.modulename;

    this.sourceRoot(path.join(__dirname, "templates"));
    glob.sync("**", {
      cwd: this.sourceRoot(),
      nodir: true
    }).forEach((file) => {
      const sOrigin = this.templatePath(file);
      const sTarget = this.destinationPath(file.replace("uimodule", sModuleName).replace(/\/_/, "/"));

      this.fs.copyTpl(sOrigin, sTarget, this.options.oneTimeConfig);
    });

    const oSubGen = Object.assign({}, this.options.oneTimeConfig);
    oSubGen.isSubgeneratorCall = true;
    oSubGen.cwd = this.destinationRoot();

    const additionalBuildOption = (this.options.oneTimeConfig.ui5libs === "Local resources (OpenUI5)" || this.options.oneTimeConfig.ui5libs === "Local resources (SAPUI5)") ? "--a" : "--clean-dest --dest approuter/webapp";
    const platformIsCF = this.options.oneTimeConfig.platform.includes("Cloud Foundry");
    await fileaccess.manipulateJSON.call(this, "/package.json", function (packge) {
      packge.scripts.start =  "ui5 serve --config=" + sModuleName + "/ui5.yaml  --open index.html";
      packge.scripts["serve:" + sModuleName] = "ui5 serve--config=" + sModuleName + "/ui5.yaml";
      if (platformIsCF) {
        packge.scripts["build:" + sModuleName] = "ui5 build --config=" + sModuleName + "/ui5.yaml --clean-dest --include-task=generateManifestBundle --dest deployer/resources/webapp";
      } else {
        packge.scripts["build:" + sModuleName] = "ui5 build --config=" + sModuleName + "/ui5.yaml " + additionalBuildOption;
      }
      return packge;
    });


    this.composeWith(require.resolve("../newview"), oSubGen);
    // const selectedPlatform = this.config.get("platform");
    // if (selectedPlatform !== "Static webserver") {
    //     this.composeWith(require.resolve("../approuter"), oSubGen);
    //     if (selectedPlatform === "Cloud Foundry HTML5 Application Repository") {
    //         this.composeWith(require.resolve("../deployer"), oSubGen);
    //     }
    //     if (selectedPlatform === "Fiori Launchpad on Cloud Foundry") {
    //         this.composeWith(require.resolve("../deployer"), oSubGen);
    //         this.composeWith(require.resolve("../launchpad"), oSubGen);
    //     }
    // }
  }

  end() {
    const modules = this.config.get("uimodules") || [];
    modules.push(this.options.oneTimeConfig.modulename);
    this.config.set("uimodules", modules);
  }

};
