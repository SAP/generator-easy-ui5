const Generator = require("yeoman-generator");
const fileaccess = require("../../helpers/fileaccess");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  async prompting() {
    let prompts = [];
    prompts.push({
      type: "input",
      name: "wdi5ConfPath",
      message: "in what directory do you want the wdi5 config file to live?",
      default: "./"
    });
    prompts.push({
      type: "input",
      name: "wdi5TestDirName",
      message: "in what directory do the wdi5 tests live?",
      default: "uimodule/webapp/test/wdi5"
    });
    prompts.push({
      type: "input",
      name: "baseUrl",
      message: "URL to the app under test:",
      default: "http://localhost:8080"
    });
    prompts.push({
      type: "input",
      name: "indexFile",
      message: "name of the index file of the app under test:",
      default: "index.html"
    });

    this.answers = await this.prompt(prompts);
  }

  async writing() {
    // merging config for convenience
    Object.assign(this.answers, this.config.getAll());

    // wdi5 config file
    this.fs.copyTpl(
      this.templatePath("wdio-wdi5.conf.js"),
      this.destinationPath(this.answers.wdi5ConfPath, "wdio-wdi5.conf.js"),
      this.answers
    );

    // sample test file
    this.fs.copyTpl(
      this.templatePath("basic.test.js"),
      this.destinationPath(this.answers.wdi5TestDirName, "basic.test.js"),
      this.answers
    );

    // mingle path to where the wdi5 config file should live
    let _configPath;
    if (this.answers.wdi5ConfPath.endsWith("/")) {
      _configPath = this.answers.wdi5ConfPath.slice(0, -1);
    } else {
      _configPath = this.answers.wdi5ConfPath;
    }
    this.log("[wdi5] we'll modify /package.json for you for including wdi5");
    this.log("[wdi5] so it's safe to allow overwriting the file!");
    await fileaccess.manipulateJSON.call(this, "/package.json", function (pkg) {
      pkg.scripts.wdi5 = `wdio ${_configPath}/wdio-wdi5.conf.js`;
      pkg.devDependencies["wdio-ui5-service"] = "*";
      return pkg;
    }.bind(this));

  }

  install() {
    this.config.set("setupCompleted", true);
    this.log("[wdi5] using wdio cli for installing required node modules...");
    // do the wdio config boogie for defaults
    process.chdir(this.destinationPath());
    this.spawnCommandSync("npm", ["i", "@wdio/cli"]); // we need this as a prereq for next npx call
    this.spawnCommandSync("npx", ["wdio", "config", "-y"]); // generate a std wdio conf for receiving npm module deps
    // delete the shipped wdio.conf.js (from wdio defaults)
    // as it doesn't contain wdi5
    this.log("[wdi5] it's safe (!) to delete the default wdio.conf.js");
    this.log(`[wdi5] a specific wdio-wdi5.conf.js is provided at ${this.answers.wdi5ConfPath} !`);
    this.fs.delete(this.destinationPath("wdio.conf.js"));

    // quicker than this.installDependencies()
    this.spawnCommandSync("npm", ["i", "wdio-ui5-service"]);
  }

  end() {
    this.log("[wdi5] good to go!");
    this.log("[wdi5] 1. start the ui5 app via 'npm run start'");
    this.log("[wdi5] 2. run wdi5 tests via 'npm run wdi5'");
  }
};
