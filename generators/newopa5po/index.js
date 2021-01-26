const Generator = require("yeoman-generator");
const validFilename = require("valid-filename");
const fs = require("fs");

module.exports = class extends Generator {

  prompting() {
    let aPrompt = [];
    this.options.oneTimeConfig = this.config.getAll();

    if (this.options.isSubgeneratorCall) {
      this.options.oneTimeConfig.projectname = this.options.projectname;
      this.options.oneTimeConfig.namespaceInput = this.options.namespaceInput;
      this.options.oneTimeConfig.modulename = this.options.modulename;
    } else {
      if (!this.config.getAll().viewtype) {
        aPrompt = aPrompt.concat([{
          type: "input",
          name: "projectname",
          message: "Seems like this project has not been generated with Easy-UI5. Please enter the name of your project.",
          validate: (s) => {
            if (/^\d*[a-zA-Z][a-zA-Z0-9]*$/g.test(s)) {
              return true;
            }
            return "Please use alpha numeric characters only for the project name.";
          },
          default: "myUI5App"
        }, {
          type: "input",
          name: "namespaceInput",
          message: "Please enter the namespace you use currently",
          validate: (s) => {
            if (/^[a-zA-Z0-9_\.]*$/g.test(s)) {
              return true;
            }
            return "Please use alpha numeric characters and dots only for the namespace.";
          },
          default: "com.myorg"
        }]);
      }

      const modules = this.config.get("uimodules") || [];
      if (modules.length) {
        aPrompt.push({
          type: "list",
          name: "modulename",
          message: "To which module do you want to add an OPA5 page object?",
          choices: modules,
          when: modules.length
        });
      }
    }

    aPrompt = aPrompt.concat([{
      type: "input",
      name: "poName",
      message: "Page object name:",
      default: "Master",
      validate: validFilename
    }, {
      type: "input",
      name: "action",
      message: "Add action with name (empty string to skip actions):"
    }, {
      type: "input",
      name: "assertion",
      message: "Add assertion with name (empty string to skip assertions):"
    }]);

    return this.prompt(aPrompt).then((answers) => {
      for (var key in answers) {
        this.options.oneTimeConfig[key] = answers[key];
      }

      var appName = !this.options.oneTimeConfig.modulename || this.options.oneTimeConfig.modulename === "uimodule" ? this.options.oneTimeConfig.projectname : this.options.oneTimeConfig.modulename;
      this.options.oneTimeConfig.namespaceInput = this.options.oneTimeConfig.namespaceInput || this.options.oneTimeConfig.namespace;
      this.options.oneTimeConfig.poName = this.options.oneTimeConfig.poName.charAt(0).toUpperCase() + this.options.oneTimeConfig.poName.substr(1);
      this.options.oneTimeConfig.appId = this.options.oneTimeConfig.appId || this.options.oneTimeConfig.namespaceInput + "." + appName;

      const pos = this.config.get("opa5pos") || [];
      pos.push(this.options.oneTimeConfig.poName);
      this.config.set("opa5pos", pos);
      this.options.oneTimeConfig.opa5pos = pos;
    });
  }

  async writing() {
    const sModule = (this.options.oneTimeConfig.modulename ? this.options.oneTimeConfig.modulename + "/" : "") + "webapp/";
    const journeys = this.config.get("opa5Journeys") || [];

    this.fs.copyTpl(
      this.templatePath("test/integration/pages/$poFile.js"),
      this.destinationPath(sModule + "test/integration/pages/" + this.options.oneTimeConfig.poName + ".js"),
      this.options.oneTimeConfig
    );

    // add new po to existing journeys
    journeys.forEach((journey) => {
      const journeyFile = this.destinationPath(sModule + "test/integration/" + journey + "Journey.js");
      if (fs.existsSync(journeyFile)) {
        const content = fs.readFileSync(journeyFile, "utf8").replace(/sap.ui.define\(\[(.*)\s\]/gms,
          `sap.ui.define([$1,\n  "./pages/${this.options.oneTimeConfig.poName}"\n]`).replace(/\s,\s/, ",\n");
        fs.writeFileSync(journeyFile, content);
      }
    });
  }
};
