const Generator = require("yeoman-generator"),
  fileaccess = require("../../helpers/fileaccess");

module.exports = class extends Generator {

  prompting() {
    const modules = this.config.get("uimodules");
    var aPrompt = [{
      type: "list",
      name: "modulename",
      message: "To which module do you want to add a model?",
      choices: modules || [],
      when: modules && modules.length > 1
    }, {
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
      choices: ["OData v2", "OData v4", "JSON"],
      default: "OData v4"
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
        return props.modelType.includes("OData");
      },
      type: "input",
      name: "url",
      message: "What is the data source url?"
    },
    {
      when: function (props) {
        return props.modelType === "OData v2";
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
      this.options.oneTimeConfig.modulename = answers.modulename || modules[0];

      if (answers.modelType.includes("OData")) {
        this.options.oneTimeConfig.url = answers.url;
        if (answers.modelType === "OData v2") {
          this.options.oneTimeConfig.countMode = answers.countMode;
        }
      }
    });
  }

  async writing() {

    let override;

    if (this.options.oneTimeConfig.modelType.includes("OData")) {
      let sDataSource = this.options.oneTimeConfig.url.replace("/sap/opu/odata/sap/", "");
      sDataSource = sDataSource.replace(/\//ig, "");

      const sourceSettings = this.options.oneTimeConfig.modelType === "OData v2" ? {
        localUri: "localService/" + this.options.oneTimeConfig.url + "/metadata.xml"
      } : {
          localUri: "localService/" + this.options.oneTimeConfig.url + "/metadata.xml",
          odataVersion: "4.0"
        };
      const modelType = this.options.oneTimeConfig.modelType === "OData v2" ? "sap.ui.model.odata.v2.ODataModel" : "sap.ui.model.odata.v4.ODataModel";
      const modelSettings = this.options.oneTimeConfig.modelType === "OData v2" ? {
        defaultOperationMode: "Server",
        defaultBindingMode: this.options.oneTimeConfig.bindingMode,
        defaultCountMode: this.options.oneTimeConfig.countMode,
        preload: true
      } : {
          synchronizationMode: "None",
          operationMode: "Server",
          autoExpandSelect: true,
          earlyRequests: true,
          groupProperties: {
            default: {
              submit: "Auto"
            }
          }
        };

      override = {
        ["sap.app"]: {
          dataSources: {
            [sDataSource]: {
              uri: this.options.oneTimeConfig.url,
              type: "OData",
              settings: sourceSettings
            }
          }
        },
        ["sap.ui5"]: {
          models: {
            [this.options.oneTimeConfig.modelName]: {
              type: modelType,
              settings: modelSettings,
              dataSource: sDataSource
            }
          }
        }
      };
    } else {
      override = {
        ["sap.ui5"]: {
          models: {
            [this.options.oneTimeConfig.modelName]: {
              "type": "sap.ui.model.json.JSONModel",
              "settings": {}
            }
          }
        }
      };
    }

    await fileaccess.manipulateJSON.call(this, "/" + this.options.oneTimeConfig.modulename + "/webapp/manifest.json", override);
  }
};
