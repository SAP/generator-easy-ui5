const Generator = require("yeoman-generator"),
  path = require("path"),
  yosay = require("yosay"),
  glob = require("glob");

module.exports = class extends Generator {
  static displayName = "This name should be displayed";

  async writing() {
    if (!this.options.embedded) {
      this.log(
        yosay(`Welcome to the ${chalk.red("easy-ui5-project")} generator!`)
      );
    }

    const oConfig = this.config.getAll();

    this.sourceRoot(path.join(__dirname, "templates"));
    glob
      .sync("**", {
        cwd: this.sourceRoot(),
        nodir: true,
      })
      .forEach((file) => {
        const sOrigin = this.templatePath(file);
        const sTarget = this.destinationPath(
          file.replace(/^_/, "").replace(/\/_/, "/")
        );

        this.fs.copyTpl(sOrigin, sTarget, oConfig);
      });
  }
};
