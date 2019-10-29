const Generator = require('yeoman-generator'),
    path = require('path'),
    glob = require('glob');

module.exports = class extends Generator {

    prompting() {
        if (this.options.isSubgeneratorCall) {
            this.destinationRoot(this.options.cwd);
            this.options.oneTimeConfig = this.config.getAll();
            return;
        }
        return this.prompt([{
            type: 'input',
            name: 'viewname',
            message: 'What is the name of the new view?',
            validate: (s) => {
                if (/^[a-zA-Z0-9_-]*$/g.test(s)) {
                    return true;
                }
                return 'Please use alpha numeric characters only for the view name.';
            }
        }, {
            type: 'confirm',
            name: 'createcontroller',
            message: 'Would you like to create a corresponding controller as well?'
        }]).then((answers) => {
            this.options.oneTimeConfig = this.config.getAll();
            this.options.oneTimeConfig.viewname = answers.viewname;
            this.options.oneTimeConfig.createcontroller = answers.createcontroller;
        });
    }

    writing() {
        const sViewFileName = "webapp/view/$ViewName.view.$ViewEnding"
        const sControllerFileName = "webapp/controller/$ViewName.controller.js"

        const sViewType = this.options.oneTimeConfig.viewtype;
        const sViewName = this.options.oneTimeConfig.viewname;

        var sOrigin = this.templatePath(sViewFileName);
        var sTarget = this.destinationPath(sViewFileName.replace(/\$ViewEnding/, sViewType.toLowerCase()).replace(/\$ViewName/, sViewName));
        this.fs.copyTpl(sOrigin, sTarget, this.options.oneTimeConfig);

        if (this.options.oneTimeConfig.createcontroller || this.options.isSubgeneratorCall) {
            sOrigin = this.templatePath(sControllerFileName);
            sTarget = this.destinationPath(sControllerFileName.replace(/\$ViewEnding/, sViewType.toLowerCase()).replace(/\$ViewName/, sViewName));
            this.fs.copyTpl(sOrigin, sTarget, this.options.oneTimeConfig);
        }
    }

    end() {
        if (this.options.isSubgeneratorCall) {
            return;
        }
        this.log('Created a new view!');
    }
};
