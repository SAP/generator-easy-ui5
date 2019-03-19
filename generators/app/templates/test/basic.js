const path = require('path');
const execa = require('execa');
const assert = require('yeoman-assert');

describe('Basic project capabilities', function() {

    describe('Generated code', function() {
				this.timeout(35000)

				it('should contain eslint', function() {
						return assert.file(['node_modules/.bin/eslint']);
				});

        it('should be lintable', function() {
            return execa.shellSync('npm run lint')
        });

        it('should pass karma test suite', function() {
            return execa.shellSync('npm run karma')
        });

    });

});
