const assert = require('yeoman-assert');
const path = require('path');
const helpers = require('yeoman-test');
const execa = require('execa');

function createTest(sTestName, sFileType){
	describe(sTestName, function() {
		this.timeout(200000);

		it('should be able to create the project', function() {
			return helpers.run(path.join(__dirname, '../generators/app')).withPrompts({ viewtype: sFileType });
		});

		it('should create the necessary ui5 files', function() {
			return assert.file(['ui5.yaml', `webapp/view/MainView.view.${sFileType.toLowerCase()}`, 'webapp/index.html', 'webapp/manifest.json']); //incomplete list, extend if necessary
		});

		it('should create the necessary cloud foundry files', function() {
			return assert.file(['cf_deployment_resources/xs-app.json', 'cf_deployment_resources/package.json', 'mta.yaml']);
		});

		it('should create an installable project', function() {
			return execa.commandSync('npm install')
		});

		it('should create valid code (run inner test suite)', function() {
			return execa.commandSync('npm run test')
		});

		it('should create an buildable project', function() {
			return execa.commandSync('npm run build:cf')
		});

	});
}

describe('Basic project capabilities', function() {

	createTest('XML Generator', 'XML');
	createTest('JSON Generator','JSON');
	createTest('XML Generator', 'JS' );
	createTest('XML Generator', 'HTML');

});
