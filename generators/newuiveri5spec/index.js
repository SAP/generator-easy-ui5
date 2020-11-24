var Generator = require("yeoman-generator");
var validFilename = require("valid-filename");

module.exports = class extends Generator {

  prompting() {
    return this.prompt([{
      type: "input",
      name: "suiteName",
      message: "Name for the suite (describe block):",
      default: "masterdetail",
      validate: validFilename
    }, {
      type: "input",
      name: "specName",
      message: "Name for the spec (it block):",
      default: "should see the app"
    }]).then(function (answers) {
      this.options.oneTimeConfig = this.config.getAll();
      for (var key in answers) {
        this.options.oneTimeConfig[key] = answers[key];
      }

      this.options.oneTimeConfig.dirname = "";
      if (this.options.dirname) {
        this.options.oneTimeConfig.dirname = this.options.dirname + "/";
      } else if (this.options.oneTimeConfig.uiveri5Tests) {
        this.options.oneTimeConfig.dirname = this.options.oneTimeConfig.uiveri5Tests + "/";
      }

      const specs = this.config.get("uiveri5specs") || [];
      specs.push(this.options.oneTimeConfig.suiteName);
      this.config.set("uiveri5specs", specs);
      this.options.oneTimeConfig.uiveri5specs = specs;

      // set default value for uiveri5pos if empty
      const pos = this.config.get("uiveri5pos") || {};
      this.config.set("uiveri5pos", pos);
      this.options.oneTimeConfig.uiveri5pos = pos;
    }.bind(this));
  }

  async writing() {
    this.fs.copyTpl(
      this.templatePath("$specName.spec.js"),
      this.destinationPath(this.options.oneTimeConfig.dirname + "/" + this.options.oneTimeConfig.suiteName + ".spec.js"),
      this.options.oneTimeConfig
    );
  }

};
