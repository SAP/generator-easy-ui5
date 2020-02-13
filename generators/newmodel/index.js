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
				name: 'modelName',
				message: 'What is the name of your model, press enter if it is the default model?',
				validate: (s) => {
					if (/^[a-zA-Z0-9_-]*$/g.test(s)) {
						return true;
					}
					return 'Please use alpha numeric characters only for the view name.';
				},
				default: ""
			},
			{
				type: 'list',
				name: 'modelType',
				message: 'Which type of model do you want to add?',
				choices: ['OData', 'JSON'],
				default: 'OData'
			},
			{
				type: 'list',
				name: 'bindingMode',
				message: 'Which binding mode do you want to use?',
				choices: ['TwoWay', 'OneWay'],
				default: 'TwoWay'
			},
			{
				when: function (props) {
					return props.modelType === "OData";
				},
				type: 'input',
				name: 'url',
				message: 'What is the data source url?'
			},
			{
				when: function (props) {
					return props.modelType === "OData";
				},
				type: 'list',
				name: 'countMode',
				message: 'Which count mode do you want to use?',
				choices: ['Inline', 'Request'],
				default: 'Inline'
			}
		];



		return this.prompt(aPrompt).then((answers) => {
			this.options.oneTimeConfig = this.config.getAll();
			this.options.oneTimeConfig.modelName = answers.modelName;
			this.options.oneTimeConfig.modelType = answers.modelType;
			this.options.oneTimeConfig.bindingMode = answers.bindingMode;
			if (answers.modelType === 'OData') {

				this.options.oneTimeConfig.url = answers.url;
				this.options.oneTimeConfig.countMode = answers.countMode;
				this.log(this.options.oneTimeConfig.countMode)
			}


		});
	}

	writing() {




	}

	end() {
		if (this.options.isSubgeneratorCall) {
			return;
		}
		const sModelType = this.options.oneTimeConfig.modelType;
		const sModelName = this.options.oneTimeConfig.modelName;
		const sBindingMode = this.options.oneTimeConfig.bindingMode;
		const sUrl = this.options.oneTimeConfig.url;
		let sDataSource;
		let sCountMode;
		if (sUrl) {
			sDataSource = sUrl.replace("/sap/opu/odata/sap/", "");
			sDataSource.replace("/", "");
			sCountMode = this.options.oneTimeConfig.countMode;
		}

		const localOptions = this.options;
		async function f() {

			let promise = new Promise((resolve, reject) => {
				const filePath = process.cwd() + '/webapp/manifest.json';
				try {
					fs.readFile(filePath, function (err, data) {
						let json = JSON.parse(data)

						let ui5Config = json['sap.ui5'],
							models = ui5Config.models || {};

						models[sModelName] = {
							"type": (sModelType === 'OData') ? "sap.ui.model.odata.v2.ODataModel" : "sap.ui.model.json.JSONModel",
							"settings": (sModelType === 'OData') ? {
								"defaultOperationMode": "Server",
								"defaultBindingMode": sBindingMode,
								"defaultCountMode": sCountMode,
								"preload": true
							} : {}
						}
						ui5Config.models = models;
						json['sap.ui5'] = ui5Config;

						if (sModelType === 'OData') {
							models[sModelName].dataSource = sDataSource

							let appConfig = json['sap.app'],
								dataSources = appConfig.dataSources || {};

							dataSources[sDataSource] = {
								"uri": sUrl,
								"type": sModelType,
								"settings": {
									"localUri": "localService/" + sUrl + "/metadata.xml"
								}
							}

							appConfig.dataSources = dataSources;
							json['sap.app'] = appConfig;
						}

						fs.writeFile(filePath, JSON.stringify(json, null, 4), function (err) {
							if (err) throw err;
							resolve();
						});
					})
				} catch (err) {
					reject(err);
				}

			});

			let result = await promise; // wait until the promise resolves (*)

		}

		f().catch((err) => {
			this.logg(err)
		}).finally(() => {
			this.log('Updated manifest file with the new model.');
		})

	}
};
