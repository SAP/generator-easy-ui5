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

    // try {
    //   const filePath = process.cwd() + "/package.json";
    //   const descriptor = await this.fs.readJSON(filePath);

    //   descriptor.devDependencies["ui5-task-zipper"] = "0.3.0";
    //   descriptor.ui5.dependencies.push("ui5-task-zipper");

    //   this.fs.writeJSON(filePath, descriptor);
    //   !this.options.isSubgeneratorCall && this.log("Updated xs-app.json file.");
    // } catch (e) {
    //   this.log("Error during the manipulation of the package.json file: " + e);
    //   throw e;
    // }
    await fileaccess.manipulateJSON.call(this, "/package.json", {
      devDependencies: {
        "ui5-task-zipper": "0.3.0"
      },
      ui5: {
        dependencies: ["ui5-task-zipper"]
      }
    });

    // try {
    //   const filePath = process.cwd() + "/mta.yaml";
    //   const mta = yaml.parse(this.fs.read(filePath));
    //   const approuter = mta.modules.find((module) => module.name === projectname);

    //   approuter.requires.push({ name: projectname + "_portal" });
    //   mta.modules.push({
    //     name: projectname + "_launchpad_deployer",
    //     type: "com.sap.portal.content",
    //     path: "launchpad",
    //     requires: [{
    //       name: projectname + "_portal"
    //     }, {
    //       name: projectname + "_html5_repo_host"
    //     }, {
    //       name: projectname + "_uaa"
    //     }]
    //   });
    //   mta.resources.push({
    //     name: projectname + "_portal",
    //     type: "org.cloudfoundry.managed-service",
    //     parameters: {
    //       "service-plan": "standard",
    //       "service": "portal"
    //     }
    //   });

    //   this.fs.write(filePath, yaml.stringify(mta));

    //   !this.options.isSubgeneratorCall && this.log("Updated the mta.yaml file with the new resources.");
    // } catch (e) {
    //   this.log("Error during the manipulation of the mta.yaml file: " + e);
    //   throw e;
    // }

    await fileaccess.manipulateYAML.call(this, "/mta.yaml", function (mta) {
      debugger
      const approuter = mta.modules.find((module) => module.name === projectname);
      approuter.requires.push({ name: projectname + "_portal" });
      debugger
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
    debugger

    try {
      const filePath = process.cwd() + "/ui5.yaml";
      const mta = yaml.parse(this.fs.read(filePath));

      const builder = mta.builder || {};
      const customTasks = builder.customTasks || [];

      customTasks.push({
        name: "ui5-task-zipper",
        afterTask: "uglify",
        configuration: {
          archiveName: "webapp",
          additionalFiles: ["approuter/xs-app.json"]
        }
      })

      this.fs.write(filePath, yaml.stringify(mta));

      !this.options.isSubgeneratorCall && this.log("Updated the mta.yaml file with the new resources.");
    } catch (e) {
      this.log("Error during the manipulation of the mta.yaml file: " + e);
      throw e;
    }
  }
};
