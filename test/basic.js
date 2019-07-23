const assert = require('yeoman-assert');
const path = require('path');
const helpers = require('yeoman-test');
const execa = require('execa');

describe('Basic project capabilities', function() {

	describe('Default Generator', function() {
		this.timeout(90000);

		it('should be able to create the project', function() {
			return helpers.run(path.join(__dirname, '../generators/app'))
		});

		it('should create the necessary ui5 files', function() {
			return assert.file(['ui5.yaml', 'webapp/view/MainView.view.xml', 'webapp/index.html', 'webapp/manifest.json']); //incomplete list, extend if necessary
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

	});


	describe('JSON Generator', function() {
		this.timeout(90000);

		it('should be able to create the project', function() {
			return helpers.run(path.join(__dirname, '../generators/app'))
				.withPrompts({ viewtype: 'JSON' })
		});

		it('should create the necessary ui5 files', function() {
			return assert.file(['ui5.yaml', 'webapp/view/MainView.view.json']);
		});

		it('should create an installable project', function() {
			return execa.commandSync('npm install')
		});

		it('should create valid code (run inner test suite)', function() {
			return execa.commandSync('npm test')
		});

	});


	describe('JS Generator', function() {
		this.timeout(90000);

		it('should be able to create the project', function() {
			return helpers.run(path.join(__dirname, '../generators/app'))
				.withPrompts({ viewtype: 'JS' })
		});

		it('should create the necessary ui5 files', function() {
			return assert.file(['ui5.yaml', 'webapp/view/MainView.view.js']);
		});

		it('should create an installable project', function() {
			return execa.commandSync('npm install')
		});

		it('should create valid code (run inner test suite)', function() {
			return execa.commandSync('npm test')
		});

	});


	describe('HTML Generator', function() {
		this.timeout(90000);

		it('should be able to create the project', function() {
			return helpers.run(path.join(__dirname, '../generators/app'))
				.withPrompts({ viewtype: 'HTML' })
		});

		it('should create the necessary ui5 files', function() {
			return assert.file(['ui5.yaml', 'webapp/view/MainView.view.html']);
		});

		it('should create an installable project', function() {
			return execa.commandSync('npm install')
		});

		it('should create valid code (run inner test suite)', function() {
			return execa.commandSync('npm test')
		});

	});

});
