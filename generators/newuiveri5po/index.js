var Generator = require("yeoman-generator");
var validFilename = require("valid-filename");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.answers = {};
  }

  prompting() {
    return this.prompt([{
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
    }.bind(this));
  }

  writing() {
    var poFile = this.options.oneTimeConfig.poName.charAt(0).toLowerCase() + this.options.oneTimeConfig.poName.substr(1);
    this.fs.copyTpl(
      this.templatePath("pages/$poFile.js"),
      this.destinationPath(this.options.oneTimeConfig.dirname + "pages/" + poFile + ".js"),
      this.options.oneTimeConfig
    );
    this.fs.copyTpl(
      this.templatePath("./$example.spec.js"),
      this.destinationPath(this.options.oneTimeConfig.dirname + poFile + "Example.spec.js"),
      Object.assign({}, this.options.oneTimeConfig, {
        poFile: poFile
      }),
      null, {
      globOptions: {
        dot: true
      }
    });
  }
};
