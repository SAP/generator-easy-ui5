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
			name: 'usagesName',
			message: 'What is the name of your usage?',
			validate: (s) => {
				if (/^[a-zA-Z0-9_-]*$/g.test(s)) {
					return true;
				}
				return 'Please use alpha numeric characters only for the view name.';
			}
		},
		{
			type: 'input',
			name: 'componentName',
			message: 'What is the name of the component you want to reference?',
			validate: (s) => {
				if (/^[a-zA-Z0-9_-]*$/g.test(s)) {
					return true;
				}
				return 'Please use alpha numeric characters only for the view name.';
			}
		},
		{
			type: 'input',
			name: 'componentData',
			message: 'Write your component data as a json object'
			
		}, {
			type: 'confirm',
			name: 'lazy',
			message: 'Should the component be lazy loaded?'
		}];
		
		return this.prompt(aPrompt).then((answers) => {
			this.options.oneTimeConfig = this.config.getAll();
			this.options.oneTimeConfig.usagesName = answers.usagesName;
			this.options.oneTimeConfig.componentName = answers.componentName;
			this.options.oneTimeConfig.componentData = answers.componentData;
			this.options.oneTimeConfig.lazy = answers.lazy;


		});
	}

	writing() {
		

		

	}

	end() {
		if (this.options.isSubgeneratorCall) {
			return;
        }
        const sUsageName = this.options.oneTimeConfig.usagesName;
		const sComponentName = this.options.oneTimeConfig.componentName;
		const sComponentData = this.options.oneTimeConfig.componentData || {};
		const sLazy = this.options.oneTimeConfig.lazy;
        const localOptions = this.options;
     	async function f() {

			let promise = new Promise((resolve, reject) => {
					const filePath = process.cwd() + '/webapp/manifest.json';
					try {
						fs.readFile(filePath, function (err, data) {
							let json = JSON.parse(data)
							let ui5Config = json['sap.ui5'],
								usages = ui5Config.componentUsages || {};
	
							usages[sUsageName] = {
								"name": sComponentName,
								"settings": {},
								"componentData": (sComponentData.length > 0) ? JSON.parse(sComponentData) : {},
								"lazy": sLazy
							}
	
							ui5Config.componentUsages = usages;
							json['sap.ui5'] = ui5Config;
	
							fs.writeFile(filePath, JSON.stringify(json, null, 4), function (err) {
								if (err) throw err;
								resolve('Add the new usage in your view with the following \
								\n<core:ComponentContainer width="100%" usage="'+sUsageName +'" propagateModel="true" lifecycle="Container"></core:ComponentContainer> \
								');
							});
						})
					}
					catch(err) {
						reject(err);
					}
				
			});

			let result = await promise; // wait until the promise resolves (*)

			this.log(result); // "done!"
		}
	
	f().catch((err) => {
		this.log(err)
	}).finally(() => {
		this.log('Updated manifest file with the new usage');
	})

}
};
