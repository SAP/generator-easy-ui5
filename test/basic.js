import path from "path";
import { mkdirSync, cpSync, rmSync } from "fs";
import assert from "yeoman-assert";
import helpers from "yeoman-test";
import url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const pluginsHome = path.join(__dirname, "_/plugin-generators");

describe("Basic V4 project capabilities", function () {
	this.timeout(120000);

	before(function () {
		mkdirSync(path.join(pluginsHome, "generator-ui5-test-v4"), { recursive: true });
		cpSync(path.join(__dirname, "generator-ui5-test-v4"), path.join(pluginsHome, "generator-ui5-test-v4"), { recursive: true });
	});

	it("should be able to run the test generator", async function () {
		return new Promise((resolve, reject) => {
			helpers
				.run(path.join(__dirname, "../generators/app"))
				.inTmpDir()
				.withArguments(["test-v4"])
				.withOptions({
					pluginsHome,
					offline: true,
					verbose: true,
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
		rmSync(path.join(pluginsHome, "generator-ui5-test-v4"), { recursive: true });
	});
});

describe("Basic V5 project capabilities", function () {
	this.timeout(120000);

	before(function () {
		mkdirSync(path.join(pluginsHome, "generator-ui5-test-v5"), { recursive: true });
		cpSync(path.join(__dirname, "generator-ui5-test-v5"), path.join(pluginsHome, "generator-ui5-test-v5"), { recursive: true });
	});

	it("should be able to run the test generator", async function () {
		return new Promise((resolve, reject) => {
			helpers
				.run(path.join(__dirname, "../generators/app"))
				.inTmpDir()
				.withArguments(["test-v5"])
				.withOptions({
					pluginsHome,
					offline: true,
					verbose: true,
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
		return assert.file(["testFileC.md"]);
	});

	after(function () {
		rmSync(path.join(pluginsHome, "generator-ui5-test-v5"), { recursive: true });
	});
});
