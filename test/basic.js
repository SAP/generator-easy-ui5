const assert = require('yeoman-assert');
const path = require('path');
const helpers = require('yeoman-test');
const execa = require('execa');

describe('Basic project capabilities', function() {

    describe('Generator', function() {
        this.timeout(90000);

        it('should be able to create the project', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
        });

        it('should create the necessary ui5 files', function() {
            return assert.file(['webapp/index.html', 'webapp/manifest.json', 'ui5.yaml']); //incomplete list, extend if necessary
        });

        it('should create the necessary cloud foundry files', function() {
            return assert.file(['cf_deployment_resources/xs-app.json', 'cf_deployment_resources/package.json', 'mta.yaml']);
        });

        it('should create an installable project', function() {
            return execa.shellSync('npm install')
        });

        it('should create valid code (run inner test suite)', function() {
            return execa.shellSync('npm test')
        });

    });

});
