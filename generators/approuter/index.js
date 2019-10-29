const Generator = require('yeoman-generator'),
    path = require('path'),
    glob = require('glob');

module.exports = class extends Generator {

    prompting() {
        debugger
        if (this.options.isSubgeneratorCall) {
            this.destinationRoot(this.options.cwd);
            this.options.oneTimeConfig = this.config.getAll();
            return;
        }
    }

    writing() {
        this.sourceRoot(path.join(__dirname, 'templates'));
        glob.sync('**', {
            cwd: this.sourceRoot(),
            nodir: true
        }).forEach((file) => {
            debugger
            const sOrigin = this.templatePath(file);
            const sTarget = this.destinationPath(file.replace(/^_/, '').replace(/\/_/, '/'));

            this.fs.copyTpl(sOrigin, sTarget, this.config.getAll());
        });
    }

    end() {
        if (this.options.isSubgeneratorCall) {
            return;
        }
    }
};
