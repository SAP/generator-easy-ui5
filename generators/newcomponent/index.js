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
      name: "usagesName",
      message: "What is the name of your usage?",
      validate: (s) => {
        if (/^[a-zA-Z0-9_-]*$/g.test(s)) {
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
        if (/^[a-zA-Z0-9_-]*$/g.test(s)) {
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
    });
  }

  async writing() {
    if (this.options.isSubgeneratorCall) {
      return;
    }
    const sUsageName = this.options.oneTimeConfig.usagesName;
    const sComponentName = this.options.oneTimeConfig.componentName;
    const sComponentData = this.options.oneTimeConfig.componentData || {};
    const sLazy = this.options.oneTimeConfig.lazy;

    try {
      const filePath = process.cwd() + "/webapp/manifest.json";
      const json = await this.fs.readJSON(filePath);
      const ui5Config = json["sap.ui5"];

      ui5Config.componentUsages = ui5Config.componentUsages || {};
      ui5Config.componentUsages[sUsageName] = {
        "name": sComponentName,
        "settings": {},
        "componentData": (sComponentData.length > 0) ? JSON.parse(sComponentData) : {},
        "lazy": sLazy
      }

      this.fs.writeJSON(filePath, json)
    } catch (e) {
      this.log("Error during the manipulation of the manifest: ", e)
      throw e
    }

    this.log("Add the new usage in your view with the following code: \n '<core:ComponentContainer width='100%' usage='" + sUsageName + "' propagateModel='true' lifecycle='Container'></core:ComponentContainer>'")
    this.log("Updated manifest file with the new usage.")
  }
};