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
      name: "modelName",
      message: "What is the name of your model, press enter if it is the default model?",
      validate: (s) => {
        if (/^[a-zA-Z0-9_-]*$/g.test(s)) {
          return true;
        }
        return "Please use alpha numeric characters only for the view name.";
      },
      default: ""
    },
    {
      type: "list",
      name: "modelType",
      message: "Which type of model do you want to add?",
      choices: ["OData", "JSON"],
      default: "OData"
    },
    {
      type: "list",
      name: "bindingMode",
      message: "Which binding mode do you want to use?",
      choices: ["TwoWay", "OneWay"],
      default: "TwoWay"
    },
    {
      when: function (props) {
        return props.modelType === "OData";
      },
      type: "input",
      name: "url",
      message: "What is the data source url?"
    },
    {
      when: function (props) {
        return props.modelType === "OData";
      },
      type: "list",
      name: "countMode",
      message: "Which count mode do you want to use?",
      choices: ["Inline", "Request"],
      default: "Inline"
    }];

    return this.prompt(aPrompt).then((answers) => {
      this.options.oneTimeConfig = this.config.getAll();
      this.options.oneTimeConfig.modelName = answers.modelName;
      this.options.oneTimeConfig.modelType = answers.modelType;
      this.options.oneTimeConfig.bindingMode = answers.bindingMode;
      if (answers.modelType === "OData") {
        this.options.oneTimeConfig.url = answers.url;
        this.options.oneTimeConfig.countMode = answers.countMode;
        this.log(this.options.oneTimeConfig.countMode);
      }

    });
  }

  async writing() {
    if (this.options.isSubgeneratorCall) {
      return;
    }

    const sModelType = this.options.oneTimeConfig.modelType;
    const sModelName = this.options.oneTimeConfig.modelName;
    const sBindingMode = this.options.oneTimeConfig.bindingMode;
    const sUrl = this.options.oneTimeConfig.url;
    let sDataSource;
    let sCountMode;
    if (sUrl) {
      sDataSource = sUrl.replace("/sap/opu/odata/sap/", "");
      sDataSource.replace("/", "");
      sCountMode = this.options.oneTimeConfig.countMode;
    }

    try {
      const filePath = process.cwd() + "/webapp/manifest.json";
      const json = await this.fs.readJSON(filePath);
      const ui5Config = json["sap.ui5"],
        appConfig = json["sap.app"];

      ui5Config.models = ui5Config.models || {};
      appConfig.dataSources = appConfig.dataSources || {};

      if (sModelType === "OData") {
        ui5Config.models[sModelName] = {
          "type": "sap.ui.model.odata.v2.ODataModel",
          "settings": {
            "defaultOperationMode": "Server",
            "defaultBindingMode": sBindingMode,
            "defaultCountMode": sCountMode,
            "preload": true
          },
          "dataSource": sDataSource
        };
        appConfig.dataSources[sDataSource] = {
          "uri": sUrl,
          "type": sModelType,
          "settings": {
            "localUri": "localService/" + sUrl + "/metadata.xml"
          }
        };
      } else {
        ui5Config.models[sModelName] = {
          "type": "sap.ui.model.json.JSONModel",
          "settings": {}
        };
      }

      this.fs.writeJSON(filePath, json);
    } catch (e) {
      this.log("Error during the manipulation of the manifest: " + e);
      throw e;
    }

    this.log("Updated manifest file with the new model.");
  }
};
