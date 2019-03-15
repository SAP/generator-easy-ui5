const assert = require('yeoman-assert');
const path = require('path');
const helpers = require('yeoman-test');
const execa = require("execa");

describe('Basic project capabilities', function() {

    describe('Generator', function() {
			this.timeout(50000);

			it("should be able to create the project", async function() {
					return helpers.run(path.join(__dirname, '../generators/app'))
			});

			it('should create the necessary ui5 files', function() {
					return assert.file(['webapp/index.html', 'webapp/manifest.json', 'ui5.yaml']); //incomplete list, extend if necessary
			});

			it('should create the  necessary cloud foundry files', function() {
					return assert.file(['cf_deployment_resources/xs-app.json', 'cf_deployment_resources/package.json', 'mta.yaml']);
			});

			it("should create a installable project", async function() {
					return execa.shellSync("npm install")
			});

			it("should install eslint", async function() {
				return assert.file(['node_modules/.bin/eslint']);
			});

    });

});
