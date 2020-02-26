const Generator = require("yeoman-generator");

module.exports = class extends Generator {

    prompting() {
        var aPrompt = [{
            type: "input",
            name: "controlname",
            message: "What is the name of the new control?",
            validate: (s) => {
                if (/^[a-zA-Z0-9]*$/g.test(s)) {
                    return true;
                }
                return "Please use alpha numeric characters only for the control name.";
            }
        }, {
            type: "input",
            name: "supercontrol",
            message: "Which control would you like to extend?",
            validate: (s) => {
                if (/^[a-zA-Z0-9\.]*$/g.test(s)) {
                    return true;
                }
                return "Please use alpha numeric characters and dots only to specifiy the super control.";
            },
            default: "sap.ui.core.Control"
        }];
        if (!this.config.getAll().viewtype) {
            aPrompt = aPrompt.concat([{
                type: "input",
                name: "projectname",
                message: "Seems like this project has not been generated with Easy-UI5. Please enter the name your project.",
                validate: (s) => {
                    if (/^[a-zA-Z0-9_-]*$/g.test(s)) {
                        return true;
                    }
                    return "Please use alpha numeric characters only for the project name.";
                },
                default: "myUI5App"
            }, {
                type: "input",
                name: "namespace",
                message: "Please enter the namespace you use currently",
                validate: (s) => {
                    if (/^[a-zA-Z0-9_\.]*$/g.test(s)) {
                        return true;
                    }
                    return "Please use alpha numeric characters and dots only for the namespace.";
                },
                default: "com.myorg"
            }]);
        }
        return this.prompt(aPrompt).then((answers) => {
            this.options.oneTimeConfig = this.config.getAll();
            this.options.oneTimeConfig.controlname = answers.controlname;
            this.options.oneTimeConfig.supercontrol = answers.supercontrol;
            if (answers.projectname) {
                this.options.oneTimeConfig.projectname = answers.projectname;
                this.options.oneTimeConfig.namespace = answers.namespace;
            }
        });
    }

    writing() {
        const sOrigin = this.templatePath("webapp/control/template.js");
        const sTarget = `webapp/control/${this.options.oneTimeConfig.controlname}.js`;

        this.fs.copyTpl(sOrigin, sTarget, this.options.oneTimeConfig);
    }

    end() {
        this.log("Created a new control!");
    }
};