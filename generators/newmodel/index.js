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
      this.options.oneTimeConfig.modulename = answers.modulename;

      if (answers.modelType === "OData") {
        this.options.oneTimeConfig.url = answers.url;
        this.options.oneTimeConfig.countMode = answers.countMode;
        this.log(this.options.oneTimeConfig.countMode);
      }

    });
  }

  async writing() {
    const sModelName = this.options.oneTimeConfig.modelName;
    const sUrl = this.options.oneTimeConfig.url;
    const sModuleName = this.options.oneTimeConfig.modulename;

    let override = {
      sap: {
        ui5: {
          models: {
            [sModelName]: {
              "type": "sap.ui.model.json.JSONModel",
              "settings": {}
            }
          }
        }
      }
    };
    if (this.options.oneTimeConfig.modelType === "OData") {
      let sDataSource;
      let sCountMode;
      if (sUrl) {
        sDataSource = sUrl.replace("/sap/opu/odata/sap/", "");
        sDataSource.replace("/", "");
        sCountMode = this.options.oneTimeConfig.countMode;
      }

      override = {
        sap: {
          ui5: {
            models: {
              [sModelName]: {
                type: "sap.ui.model.odata.v2.ODataModel",
                settings: {
                  defaultOperationMode: "Server",
                  defaultBindingMode: this.options.oneTimeConfig.bindingMode,
                  defaultCountMode: sCountMode,
                  preload: true
                },
                dataSource: sDataSource
              }
            }
          },
          app: {
            dataSources: {
              [sDataSource]: {
                uri: sUrl,
                type: this.options.oneTimeConfig.modelType,
                settings: {
                  localUri: "localService/" + sUrl + "/metadata.xml"
                }
              }
            }
          }
        }
      };
    }

    await fileaccess.manipulateJSON.call(this, "/" + sModuleName + "/webapp/manifest.json", override);

    this.log("Updated manifest file with the new model.");
  }
};
