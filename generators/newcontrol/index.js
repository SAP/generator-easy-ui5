const Generator = require('yeoman-generator'),
    path = require('path'),
    glob = require('glob');

module.exports = class extends Generator {

    prompting() {
        return this.prompt([{
            type: 'input',
            name: 'controlname',
            message: 'What is the name of the new control?',
            validate: (s) => {
                if (/^[a-zA-Z0-9]*$/g.test(s)) {
                    return true;
                }
                return 'Please use alpha numeric characters only for the control name.';
            }
        }, {
            type: 'input',
            name: 'supercontrol',
            message: 'Which control would you like to extend?',
            validate: (s) => {
                if (/^[a-zA-Z0-9\.]*$/g.test(s)) {
                    return true;
                }
                return 'Please use alpha numeric characters and dots only to specifiy the super control.';
            },
            default: 'sap.ui.core.Control'
        }]).then((answers) => {
            this.options.oneTimeConfig = this.config.getAll();
            this.options.oneTimeConfig.controlname = answers.controlname;
            this.options.oneTimeConfig.supercontrol = answers.supercontrol;
        });
    }

    writing() {
        const sOrigin = this.templatePath(`webapp/control/template.js`);
        const sTarget = `webapp/control/${this.options.oneTimeConfig.controlname}.js`

        this.fs.copyTpl(sOrigin, sTarget, this.options.oneTimeConfig);
    }

    end() {
        this.log('Created a new control!');
    }
};
