const Generator = require('yeoman-generator');
const fs = require('fs');

module.exports = class extends Generator {

	prompting() {
		if (this.options.isSubgeneratorCall) {
			this.destinationRoot(this.options.cwd);
			this.options.oneTimeConfig = this.config.getAll();
			return;
		}
		var aPrompt = [{
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
		}];
		if (!this.config.getAll().viewtype) {

			aPrompt = aPrompt.concat([{
				type: 'input',
				name: 'projectname',
				message: 'Seems like this project has not been generated with Easy-UI5. Please enter the name your project.',
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
				message: 'Please enter the namespace you use currently',
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
				message: 'Which view type do you use?',
				choices: ['XML', 'JSON', 'JS', 'HTML'],
				default: 'XML'
			}]);
		}
		aPrompt = aPrompt.concat([{
			type: 'confirm',
			name: 'addToRoute',
			message: 'Would you like to create a route in the manifest?'
		}]);
		return this.prompt(aPrompt).then((answers) => {
			this.options.oneTimeConfig = this.config.getAll();
			this.options.oneTimeConfig.viewname = answers.viewname;
			this.options.oneTimeConfig.createcontroller = answers.createcontroller;
			this.options.oneTimeConfig.addToRoute = answers.addToRoute;

			if (answers.projectname) {
				this.options.oneTimeConfig.projectname = answers.projectname;
				this.options.oneTimeConfig.namespace = answers.namespace;
				this.options.oneTimeConfig.viewtype = answers.viewtype;
			}

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
        
        const localOptions = this.options;
        const sViewType = this.options.oneTimeConfig.viewtype;
		const sViewName = this.options.oneTimeConfig.viewname;
		async function f() {

			let promise = new Promise((resolve, reject) => {
				if (localOptions.oneTimeConfig.addToRoute) {
					const filePath = process.cwd() + '/webapp/manifest.json';
					fs.readFile(filePath, function (err, data) {
						let json = JSON.parse(data)
						let ui5Config = json['sap.ui5'],
							routing = ui5Config.routing,
							routes = routing.routes;

						const routeName = 'Route' + sViewName,
							targetName = 'Target' + sViewName;

						let route = {
							name: sViewName,
							pattern: routeName,
							target: [targetName]
						}
						routes.push(route);

						routing.targets[targetName] = {
							viewType: sViewType,
							viewName: sViewName
						};

						ui5Config.routing = routing;
						json['sap.ui5'] = ui5Config;

						fs.writeFile(filePath, JSON.stringify(json, null, 4), function (err) {
							if (err) throw err;
							resolve('Updated manifest file with routing, remember to update the pattern');
						});
					})
				} else {
					reject();
				}
			});

			let result = await promise; // wait until the promise resolves (*)

			this.log(result); // "done!"
		}
	
	f().catch(() => {}).finally(() => {
		this.log('Created a new view!');
	})

}
};
