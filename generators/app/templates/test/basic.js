const path = require('path');
const execa = require('execa');
const assert = require('yeoman-assert');

describe('Basic project capabilities', function() {

    describe('Generated code', function() {

				it('should contain eslint', function() {
						return assert.file(['node_modules/.bin/eslint']);
				});

        it('should be lintable', function() {
            return execa.shellSync('npm run lint')
        });

    });

});
