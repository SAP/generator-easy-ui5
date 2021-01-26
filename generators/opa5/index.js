const Generator = require("yeoman-generator");
const path = require("path");
const glob = require("glob");

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
          message: "To which module do you want to add OPA5 tests?",
          choices: modules,
          when: modules.length
        });
      }
    }

    aPrompt = aPrompt.concat({
      type: "confirm",
      name: "addPO",
      message: "Do you want to add a page object?",
      default: true
    }, {
      type: "confirm",
      name: "addJourney",
      message: "Do you want to add a journey?",
      default: true
    });

    return this.prompt(aPrompt).then((answers) => {
      for (var key in answers) {
        this.options.oneTimeConfig[key] = answers[key];
      }

      var appName = !this.options.oneTimeConfig.modulename || this.options.oneTimeConfig.modulename === "uimodule" ? this.options.oneTimeConfig.projectname : this.options.oneTimeConfig.modulename;
      this.options.oneTimeConfig.namespaceInput = this.options.oneTimeConfig.namespaceInput || this.options.oneTimeConfig.namespace;
      this.options.oneTimeConfig.namespaceURI = this.options.oneTimeConfig.namespaceInput.split(".").join("/");
      this.options.oneTimeConfig.appId = this.options.oneTimeConfig.namespaceInput + "." + appName;
      this.options.oneTimeConfig.appURI = this.options.oneTimeConfig.namespaceURI + "/" + appName;
      this.options.oneTimeConfig.title = appName;
    });
  }

  main() {
    if (this.options.oneTimeConfig.addPO) {
      this.composeWith(require.resolve("../newopa5po"), Object.assign({}, this.options.oneTimeConfig, {
        isSubgeneratorCall: true
      }));
    }
    if (this.options.oneTimeConfig.addJourney) {
      this.composeWith(require.resolve("../newopa5journey"), Object.assign({}, this.options.oneTimeConfig, {
        isSubgeneratorCall: true
      }));
    }
  }

  async writing() {
    // get values from subgeneratos
    const journeys = this.config.get("opa5Journeys") || [];
    this.config.set("opa5Journeys", journeys);
    this.options.oneTimeConfig.opa5Journeys = journeys;

    const pos = this.config.get("opa5pos") || [];
    this.config.set("opa5pos", pos);
    this.options.oneTimeConfig.opa5pos = pos;

    const sModule = (this.options.oneTimeConfig.modulename ? this.options.oneTimeConfig.modulename + "/" : "") + "webapp/";
    this.sourceRoot(path.join(__dirname, "templates"));
    glob.sync("**", {
      cwd: this.sourceRoot(),
      nodir: true
    }).forEach((file) => {
      this.fs.copyTpl(this.templatePath(file), this.destinationPath(sModule + file), this.options.oneTimeConfig);
    });

  }
};
