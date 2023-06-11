import Generator from "yeoman-generator";

export default class extends Generator {
	static hidden = true;

	prompting() {
		throw "This subgenerator shouldn't be called.";
	}

	async writing() {}
}
