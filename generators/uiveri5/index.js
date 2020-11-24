var Generator = require("yeoman-generator");
var fileaccess = require("../../helpers/fileaccess");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.answers = {};
    this.reportersMap = {
      JUNIT: "junitReporter",
      SauceLabs: "saucelabsReporter"
    };
    this.authMap = {
      "SAP Fiori": "fiori-form",
      "SAP Cloud Platform": "sapcloud-form"
    };
  }

  prompting() {
    var aPrompt = [];
    if (this.config.getAll().viewtype) {
      aPrompt = aPrompt.concat([{
        type: "input",
        name: "dirname",
        message: "Name of the UIVeri5 tests folder:",
        default: "uiveri5"
      }]);
    } else {
      aPrompt = aPrompt.concat([{
        type: "input",
        name: "dirname",
        message: "Seems like this project has not been generated with Easy-UI5. Please enter the name of your project:",
        default: "uiveri5"
      }]);
    }

    aPrompt = aPrompt.concat([{
      type: "input",
      name: "baseUrl",
      message: "URL to the app under test:",
      default: "http://localhost:8080"
    }, {
      type: "list",
      name: "auth",
      message: "Choose authentication:",
      choices: Object.keys(this.authMap).concat("none"),
      default: "none"
    }, {
      type: "checkbox",
      name: "chosenReporters",
      message: "Choose additional reporters:",
      choices: Object.keys(this.reportersMap),
      default: ["JSON"]
    }, {
      type: "confirm",
      name: "addPO",
      message: "Do you want to add a page object?",
      default: true
    }, {
      type: "confirm",
      name: "addSpec",
      message: "Do you want to add a spec?",
      default: true
    }]);

    return this.prompt(aPrompt).then(function (answers) {
      this.options.oneTimeConfig = this.config.getAll();
      for (var key in answers) {
        this.options.oneTimeConfig[key] = answers[key];
      }
    }.bind(this));
  }

  main() {
    if (this.options.oneTimeConfig.addPO) {
      this.composeWith(require.resolve("../newuiveri5po"), {
        dirname: this.options.oneTimeConfig.dirname
      });
    }
    if (this.options.oneTimeConfig.addSpec) {
      this.composeWith(require.resolve("../newuiveri5spec"), {
        dirname: this.options.oneTimeConfig.dirname
      });
    }
  }

  async writing() {
     // get values from subgeneratos
     const specs = this.config.get("uiveri5specs") || [];
     this.config.set("uiveri5specs", specs);
     this.options.oneTimeConfig.uiveri5specs = specs;

     const pos = this.config.get("uiveri5pos") || {};
     this.config.set("uiveri5pos", pos);
     this.options.oneTimeConfig.uiveri5pos = pos;

    this.fs.copyTpl(
      this.templatePath("./**/*"),
      this.destinationPath(this.options.oneTimeConfig.dirname),
      Object.assign({}, this.options.oneTimeConfig, {
        reportersMap: this.reportersMap,
        authMap: this.authMap,
        viewtype: this.options.oneTimeConfig.viewtype
      }),
      null, {
        globOptions: {
          dot: true
        }
    });

    this.config.set("uiveri5Tests", this.options.oneTimeConfig.dirname);

    if (this.options.oneTimeConfig.viewtype) {
      await fileaccess.manipulateJSON.call(this, "/package.json", function (packge) {
        packge.scripts.uiveri5 = "uiveri5 --v ./" + this.options.oneTimeConfig.dirname + "/conf.js";
        packge.devDependencies["@ui5/uiveri5"] = "*";
        return packge;
      }.bind(this));
    } else {
      let packge = {
        "name": this.options.oneTimeConfig.dirname,
        "version": "0.0.1",
        "scripts": {
          "uiveri5": "uiveri5 --v ./conf.js"
        },
        "devDependencies": {
          "@ui5/uiveri5": "*"
        }
      };
      await fileaccess.writeJSON.call(this, "/" + this.options.oneTimeConfig.dirname + "/package.json", packge);
    }
  }

  install() {
    this.config.set("setupCompleted", true);
    process.chdir(this.destinationPath(this.options.oneTimeConfig.dirname));
    this.installDependencies({
      bower: false,
      npm: true,
      callback: function() {
        process.chdir(this.destinationRoot());
      }
    });
  }

};
