const Generator = require("yeoman-generator"),
    glob = require("glob");

module.exports = class extends Generator {

    prompting() {
        if (this.options.isSubgeneratorCall) {
            this.destinationRoot(this.options.cwd);
            this.options.oneTimeConfig = this.config.getAll();
            return;
        }
        throw ("This subgenerator is only intended for internal use. Please don\"t call it directly.")
    }

    writing() {
        glob.sync("**", {
            cwd: this.sourceRoot(),
            nodir: true
        }).forEach(file => {
            this.fs.copy(this.templatePath(file), this.destinationPath(file));
        });
    }
};
