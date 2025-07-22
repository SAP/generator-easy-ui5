import Generator from "yeoman-generator";
import path from "path";
import yosay from "yosay";
import { glob } from "glob";
import url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export default class extends Generator {
	static displayName = "This name should be displayed";

	async writing() {
		if (!this.options.embedded) {
			this.log(yosay(`Welcome to the ${chalk.red("test-v5")} generator!`));
		}

		const oConfig = this.config.getAll();

		this.sourceRoot(path.join(__dirname, "templates"));
		glob
			.sync("**", {
				cwd: this.sourceRoot(),
				nodir: true,
			})
			.forEach((file) => {
				const sOrigin = this.templatePath(file);
				const sTarget = this.destinationPath(file.replace(/^_/, "").replace(/\/_/, "/"));

				this.fs.copyTpl(sOrigin, sTarget, oConfig);
			});
	}
}
