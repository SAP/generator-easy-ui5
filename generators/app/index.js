const Generator = require('yeoman-generator'),
    path = require('path'),
    glob = require('glob');

module.exports = class extends Generator {

    prompting() {
        return this.prompt([{
            type: 'input',
            name: 'projectname',
            message: 'How do you want to name this project?',
            validate: (s) => {
                if (/^[a-zA-Z0-9_-]*$/g.test(s)) {
                    return true;
                }
                return 'Please use alpha numeric characters only for the project name.';
            },
            default: 'myUI5App'
        }, {
            type: 'input',
            name: 'namespace',
            message: 'Which namespace do you want to use?',
            validate: (s) => {
                if (/^[a-zA-Z0-9_\.]*$/g.test(s)) {
                    return true;
                }
                return 'Please use alpha numeric characters and dots only for the namespace.';
            },
            default: 'com.myorg'
        }, {
            type: 'list',
            name: 'viewtype',
            message: 'Which view type do you want to use?',
            choices: ['XML', 'JSON', 'JS', 'HTML'],
            default: 'XML'
        }, {
            type: 'list',
            name: 'ui5libs',
            message: 'Where should your UI5 libs be served from?',
            choices: ['Content delivery network (OpenUI5)', 'Content delivery network (SAPUI5)', 'Local resources (OpenUI5)'],
            default: 'Content delivery network (OpenUI5)'
        }, {
            type: 'input',
            name: 'viewname',
            message: 'How do you want to name your main view?',
            validate: (s) => {
                if (/^[a-zA-Z0-9_\.]*$/g.test(s)) {
                    return true;
                }
                return 'Please use alpha numeric characters only for the view name.';
            },
            default: 'MainView'
        }]).then((answers) => {
            this.destinationRoot(`${answers.namespace}.${answers.projectname}`);
            this.config.set(answers)
        });
    }

    writing() {
        const sViewName = this.config.get('viewname');
        const sViewType = this.config.get('viewtype');

        this.sourceRoot(path.join(__dirname, 'templates'));
        glob.sync('**', {
            cwd: this.sourceRoot(),
            nodir: true
        }).forEach((file) => {
            const sOrigin = this.templatePath(file);
            const sTarget = this.destinationPath(file.replace(/^_/, '').replace(/\/_/, '/').replace(/\$ViewType/, sViewType).replace(/\$ViewEnding/, sViewType.toLowerCase()).replace(/\$ViewName/, sViewName));

            this.fs.copyTpl(sOrigin, sTarget, this.config.getAll());
        });

        const oSubGen = Object.assign({}, this.config.getAll());
        oSubGen.isSubgeneratorCall = true;
        oSubGen.cwd = this.destinationRoot();

        this.composeWith(require.resolve('../newview'), oSubGen);

    }

    install() {
        this.installDependencies({
            bower: false,
            npm: true
        });
    }

    end() {
        this.spawnCommandSync('git', ['init', '--quiet'], {
            cwd: this.destinationPath()
        });
        this.spawnCommandSync('git', ['add', '.'], {
            cwd: this.destinationPath()
        });
        this.spawnCommandSync('git', ['commit', '--allow-empty', '-m', 'Initialize repository with easy-ui5'], {
            cwd: this.destinationPath()
        });
    }
};
