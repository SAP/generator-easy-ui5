const Generator = require("yeoman-generator");

module.exports = class extends Generator {

  prompting() {
    if (this.options.isSubgeneratorCall) {
      this.destinationRoot(this.options.cwd);
      this.options.oneTimeConfig = this.config.getAll();
      return [];
    }
    var aPrompt = [{
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
      type: "confirm",
      name: "createcontroller",
      message: "Would you like to create a corresponding controller as well?"
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
    aPrompt = aPrompt.concat([{
      type: "confirm",
      name: "addToRoute",
      message: "Would you like to create a route in the manifest?"
    }]);
    return this.prompt(aPrompt).then((answers) => {
      this.options.oneTimeConfig = this.config.getAll();
      this.options.oneTimeConfig.viewname = answers.viewname;
      this.options.oneTimeConfig.createcontroller = answers.createcontroller;
      this.options.oneTimeConfig.addToRoute = answers.addToRoute;

      if (answers.projectname) {
        this.options.oneTimeConfig.projectname = answers.projectname;
        this.options.oneTimeConfig.namespace = answers.namespace;
        this.options.oneTimeConfig.viewtype = answers.viewtype;
      }
    });
  }

  async writing() {
    const sViewFileName = "webapp/view/$ViewName.view.$ViewEnding";
    const sControllerFileName = "webapp/controller/$ViewName.controller.js";

    const sViewType = this.options.oneTimeConfig.viewtype;
    const sViewName = this.options.oneTimeConfig.viewname;
    this.options.oneTimeConfig.isSubgeneratorCall = this.options.isSubgeneratorCall;

    const bBaseControllerExists = await this.fs.exists("webapp/controller/BaseController.js");
    var sControllerToExtend = "sap/ui/core/mvc/Controller";
    if (bBaseControllerExists) {
      sControllerToExtend = this.config.get("namespace").split(".").join("/") + "/" + this.options.oneTimeConfig.projectname + "/controller/BaseController";
    }
    this.options.oneTimeConfig.controllerToExtend = sControllerToExtend;

    var sOrigin = this.templatePath(sViewFileName);
    var sTarget = this.destinationPath(sViewFileName.replace(/\$ViewEnding/, sViewType.toLowerCase()).replace(/\$ViewName/, sViewName));
    this.fs.copyTpl(sOrigin, sTarget, this.options.oneTimeConfig);

    if (this.options.oneTimeConfig.createcontroller || this.options.isSubgeneratorCall) {
      sOrigin = this.templatePath(sControllerFileName);
      sTarget = this.destinationPath(sControllerFileName.replace(/\$ViewEnding/, sViewType.toLowerCase()).replace(/\$ViewName/, sViewName));
      this.fs.copyTpl(sOrigin, sTarget, this.options.oneTimeConfig);
    }

    if (this.options.isSubgeneratorCall) {
      return;
    }

    if (this.options.oneTimeConfig.addToRoute) {
      try {
        const filePath = process.cwd() + "/webapp/manifest.json";
        const json = await this.fs.readJSON(filePath);
        const ui5Config = json["sap.ui5"];
        const targetName = "Target" + sViewName;

        ui5Config.routing.routes.push({
          name: sViewName,
          pattern: "Route" + sViewName,
          target: [targetName]
        });
        ui5Config.routing.targets[targetName] = {
          viewType: sViewType,
          viewId: sViewName,
          viewName: sViewName
        };

        this.fs.writeJSON(filePath, json);
      } catch (e) {
        this.log("Error during the manipulation of the manifest: " + e);
        throw e;
      }
    }
    this.log("Created a new view.");
  }
};
