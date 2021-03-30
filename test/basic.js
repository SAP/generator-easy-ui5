const assert = require("yeoman-assert"),
  path = require("path"),
  helpers = require("yeoman-test"),
  fs = require("fs"),
  rimraf = require("rimraf"),
  glob = require("glob");

describe("Basic project capabilities", function () {
  this.timeout(10000);

  before(function () {
    glob.sync("test/generator-ui5-test/**").forEach((source) => {
      const target = source.replace(
        "test/generator-ui5-test",
        "plugin-generators/generator-ui5-test"
      );
      if (!source.includes(".")) {
        !fs.existsSync(target) && fs.mkdirSync(target);
      } else {
        fs.copyFileSync(source, target);
      }
    });
  });

  it("should be able to run the test generator", function () {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .withArguments(["test"]);
  });

  it("should create the test file", function () {
    return assert.file(["testFileA.md"]);
  });

  after(function () {
    rimraf.sync("plugin-generators/generator-ui5-test");
  });
});
