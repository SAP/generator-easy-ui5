const Generator = require("yeoman-generator");

module.exports = class extends Generator {
	static hidden = true;

	prompting() {
		throw "This subgenerator shouldn't be called.";
	}

	async writing() {}
};
