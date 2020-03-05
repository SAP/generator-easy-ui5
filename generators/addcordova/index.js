const Generator = require('yeoman-generator');
	// path = require('path'),
	// glob = require('glob');

module.exports = class extends Generator {

	prompting() {
		if (this.options.isSubgeneratorCall) {
			this.destinationRoot(this.options.cwd);
			this.options.oneTimeConfig = this.config.getAll();
			return;
		}
	}
	writing() {
        this.createApplication();
		// this.sourceRoot(path.join(__dirname, 'templates'));
		// glob.sync('**', {
		// 	cwd: this.sourceRoot(),
		// 	nodir: true
		// }).forEach((file) => {
		// 	const sOrigin = this.templatePath(file);
		// 	const sTarget = this.destinationPath(file.replace(/^_/, '').replace(/\/_/, '/'));

		// 	this.fs.copyTpl(sOrigin, sTarget, this.config.getAll());
		// });
	}

	install() {
		if (process.platform !== "win32") {
            // eslint-disable-next-line no-console
            console.warn("Install cordova => `sudo npm install --global cordova`");
        } else {
            this.npmInstall(["cordova"], {
				"global": true
			});
        }
	}

	end() {
		if (this.options.isSubgeneratorCall) {
			return;
		}
	}

    createApplication() {
		let nameSpace = this.config.get('namespace')
		const projectName = this.config.get('projectname')
		if (!nameSpace.includes(".")) {
			nameSpace = `${this.config.get('namespace')}.${projectName}`
		}
        this.spawnCommandSync('cordova', ['create', 'cordova_app', nameSpace, projectName]);
    }
};
