const path = require("path");
const fs = require("fs-extra");

const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("Basic project capabilities", function () {
	this.timeout(10000);

	before(function () {
		fs.copySync(path.join(__dirname, "generator-ui5-test"), path.join(__dirname, "../plugin-generators/generator-ui5-test"), { recursive: true, overwrite: true });
	});

	it("should be able to run the test generator", async function () {
		return new Promise((resolve, reject) => {
			helpers
				.run(path.join(__dirname, "../generators/app"))
				.inTmpDir()
				.withArguments(["test"])
				.withOptions({
					offline: true,
				})
				.on("end", (ctx) => {
					// ensure the async write took place
					setTimeout(() => {
						resolve(ctx);
					}, 1000);
				})
				.on("error", (err) => {
					reject(err);
				});
		});
	});

	it("should create the test file", function () {
		return assert.file(["testFileA.md"]);
	});

	after(function () {
		fs.removeSync(path.join(__dirname, "../plugin-generators/generator-ui5-test"));
	});
});
