const Generator = require("yeoman-generator"),
fileaccess = require("../../helpers/fileaccess");

module.exports = class extends Generator {

  prompting() {
    const modules = this.config.get("uimodules");
    var aPrompt = [{
      type: "list",
      name: "modulename",
      message: "To which module do you want to add a component?",
      choices: modules || [],
      when: modules && modules.length > 1
    }, {
      type: "input",
      name: "usagesName",
      message: "What is the name of your usage?",
      validate: (s) => {
        if (/^\d*[a-zA-Z][a-zA-Z0-9]*$/g.test(s)) {
          return true;
        }
        return "Please use alpha numeric characters only for the view name.";
      }
    },
    {
      type: "input",
      name: "componentName",
      message: "What is the name of the component you want to reference?",
      validate: (s) => {
        if (/^\d*[a-zA-Z][a-zA-Z0-9]*$/g.test(s)) {
          return true;
        }
        return "Please use alpha numeric characters only for the view name.";
      }
    },
    {
      type: "input",
      name: "componentData",
      message: "Write your component data as a json object"

    }, {
      type: "confirm",
      name: "lazy",
      message: "Should the component be lazy loaded?"
    }];

    return this.prompt(aPrompt).then((answers) => {
      this.options.oneTimeConfig = this.config.getAll();
      this.options.oneTimeConfig.usagesName = answers.usagesName;
      this.options.oneTimeConfig.componentName = answers.componentName;
      this.options.oneTimeConfig.componentData = answers.componentData;
      this.options.oneTimeConfig.lazy = answers.lazy;
      this.options.oneTimeConfig.modulename = answers.modulename || modules[0];

    });
  }

  async writing() {
    const sUsageName = this.options.oneTimeConfig.usagesName;
    const sComponentName = this.options.oneTimeConfig.componentName;
    const sComponentData = this.options.oneTimeConfig.componentData || {};
    const sLazy = this.options.oneTimeConfig.lazy;
    const sModuleName = this.options.oneTimeConfig.modulename;

    await fileaccess.manipulateJSON.call(this, "/" + sModuleName + "/webapp/manifest.json", {
      sap: {
        ui5: {
          componentUsages: {
            [sUsageName]: {
              name: sComponentName,
              settings: {},
              componentData: (sComponentData.length > 0) ? JSON.parse(sComponentData) : {},
              lazy: sLazy
            }
          }
        }
      }
    });

    this.log("Add the new usage in your view with the following code: \n '<core:ComponentContainer width='100%' usage='" + sUsageName + "' propagateModel='true' lifecycle='Container'></core:ComponentContainer>'");
  }
};
