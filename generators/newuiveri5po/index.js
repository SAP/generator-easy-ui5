var Generator = require("yeoman-generator");
var validFilename = require("valid-filename");
var fs = require("fs");

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
      this.options.oneTimeConfig.poFile = this.options.oneTimeConfig.poName.charAt(0).toLowerCase() + this.options.oneTimeConfig.poName.substr(1);

      this.options.oneTimeConfig.dirname = "";
      if (this.options.dirname) {
        this.options.oneTimeConfig.dirname = this.options.dirname + "/";
      } else if (this.options.oneTimeConfig.uiveri5Tests) {
        this.options.oneTimeConfig.dirname = this.options.oneTimeConfig.uiveri5Tests + "/";
      }

      const pos = this.config.get("uiveri5pos") || {};
      pos[this.options.oneTimeConfig.poFile] = {
        action: this.options.oneTimeConfig.action,
        assertion: this.options.oneTimeConfig.assertion
      };
      this.config.set("uiveri5pos", pos);
      this.options.oneTimeConfig.uiveri5pos = pos;
    }.bind(this));
  }

  writing() {
    const specs = this.config.get("uiveri5specs") || [];

    this.fs.copyTpl(
      this.templatePath("pages/$poFile.js"),
      this.destinationPath(this.options.oneTimeConfig.dirname + "pages/" + this.options.oneTimeConfig.poFile + ".js"),
      this.options.oneTimeConfig
    );

    // add new po to existing specs
    specs.forEach((spec) => {
      const specFile = this.destinationPath(this.options.oneTimeConfig.dirname + spec + ".spec.js");
      if (fs.existsSync(specFile)) {
        let content = fs.readFileSync(specFile, "utf8");
        content = `require("./pages/${this.options.oneTimeConfig.poFile}");\n` + content.substr(0, content.lastIndexOf("});"));
        Object.keys(this.options.oneTimeConfig.uiveri5pos).forEach(function (poFile) {
          const poName = poFile.charAt(0).toUpperCase() + poFile.substr(1);
          content += `  it("should see the ${poName} page", function () {\n    // call the page object's actions and assertions:\n` +
            `    // When.onThe${poName}Page.iDoSomething();\n` +
            `    // Then.onThe${poName}Page.iAssertSomething();\n`;
          if (this.options.oneTimeConfig.uiveri5pos[poFile].action) {
            content += `    When.onThe${poName}Page.${this.options.oneTimeConfig.uiveri5pos[poFile].action}();\n`;
          }
          if (this.options.oneTimeConfig.uiveri5pos[poFile].assertion) {
            content += `    Then.onThe${poName}Page.${this.options.oneTimeConfig.uiveri5pos[poFile].assertion}();\n`;
          }
          content += "  });\n\n";
        }.bind(this));
        content += "});\n";

        fs.writeFileSync(specFile, content);
      }
    });
  }
};
