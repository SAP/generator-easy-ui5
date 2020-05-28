const Generator = require("yeoman-generator"),
  fileaccess = require("../../helpers/fileaccess"),
  glob = require("glob");

module.exports = class extends Generator {

  prompting() {
    if (this.options.isSubgeneratorCall) {
      this.destinationRoot(this.options.cwd);
      this.options.oneTimeConfig = this.config.getAll();
      return;
    }
    throw ("This subgenerator is only intended for internal use. Please don\"t call it directly.");
  }

  async writing() {
    glob.sync("**", {
      cwd: this.sourceRoot(),
      nodir: true
    }).forEach(file => {
      this.fs.copy(this.templatePath(file), this.destinationPath(file.replace(/^_/, "").replace(/\/_/, "/")));
    });

    const projectname = this.options.oneTimeConfig.projectname;

    await fileaccess.manipulateJSON.call(this, "/package.json", {
      devDependencies: {
        "ui5-task-zipper": "0.3.0"
      },
      ui5: {
        dependencies: ["ui5-task-zipper"]
      }
    });

    await fileaccess.manipulateYAML.call(this, "/mta.yaml", function (mta) {
      const approuter = mta.modules.find((module) => module.name === projectname);
      approuter.requires.push({ name: projectname + "_portal" });
      mta.modules.push({
        name: projectname + "_launchpad_deployer",
        type: "com.sap.portal.content",
        path: "launchpad",
        requires: [{
          name: projectname + "_portal"
        }, {
          name: projectname + "_html5_repo_host"
        }, {
          name: projectname + "_uaa"
        }]
      });
      mta.resources.push({
        name: projectname + "_portal",
        type: "org.cloudfoundry.managed-service",
        parameters: {
          "service-plan": "standard",
          "service": "portal"
        }
      });
      return mta;
    });

    await fileaccess.manipulateYAML.call(this, "/uimodule/ui5.yaml", { //TODO hard coded ui module path -> bad
      builder: {
        customTasks: [{
          name: "ui5-task-zipper",
          afterTask: "uglify",
          configuration: {
            archiveName: "webapp",
            additionalFiles: ["approuter/xs-app.json"]
          }
        }]
      }
    });

  }
};
