const Generator = require("yeoman-generator"),
  fileaccess = require("../../helpers/fileaccess"),
  glob = require("glob");

module.exports = class extends Generator {

  prompting() {
    if (this.options.isSubgeneratorCall) {
      this.destinationRoot(this.options.cwd);
      this.options.oneTimeConfig = this.config.getAll();
      debugger
      this.options.oneTimeConfig.modulename = this.options.modulename;

      return this.prompt([{
        type: "input",
        name: "tilename",
        message: "What name should be displayed on the Fiori Launchpad tile?",
        default: "Fiori App"
      }]).then((answers) => {
        this.destinationRoot(this.options.cwd);
        this.options.oneTimeConfig = this.config.getAll();
        this.options.oneTimeConfig.tilename = answers.tilename;
        // this.options.oneTimeConfig.modulename = answers.modulename;
      });
      // const modules = this.config.get("uimodules");
      //   type: "list",
      //   name: "modulename",
      //   message: "To which module do you want to add a view?",
      //   choices: modules || [],
      //   when: modules && modules.length > 1
      // }, {
    }
    throw ("This subgenerator is only intended for internal use. Please don't call it directly.");
  }

  async writing() {

    const sModuleName = this.options.oneTimeConfig.modulename;

    debugger

    glob.sync("**", {
      cwd: this.sourceRoot(),
      nodir: true
    }).forEach(file => {
      debugger
      this.fs.copyTpl(this.templatePath(file), this.destinationPath(file.replace(/^_/, "").replace(/\/_/, "/")), this.options.oneTimeConfig);
    });
    const projectname = this.options.oneTimeConfig.projectname,
      title = this.options.oneTimeConfig.tilename;


    await fileaccess.manipulateJSON.call(this, "/" + sModuleName + "/webapp/manifest.json", {
      sap: {
        app: {
          crossNavigation: {
            inbounds: {
              intent1: {
                "signature": {
                  "parameters": {},
                  "additionalParameters": "allowed"
                },
                "semanticObject": "data",
                "action": "display",
                "title": title,
                "description": "App Description",
                "icon": "sap-icon://add"
              }
            }
          }
        }
      }
    });

    await fileaccess.manipulateJSON.call(this, "/approuter/xs-app.json", function (xsapp) {
      xsapp.routes = xsapp.routes || [];
      xsapp.welcomeFile = "/cp.portal";
      xsapp.routes = xsapp.routes.filter((route) => !route.localDir);

      return xsapp;
    });

    await fileaccess.manipulateJSON.call(this, "/" + sModuleName + "/webapp/xs-app.json", {
      welcomeFile: "/flpSandbox.html"
    });

    await fileaccess.manipulateJSON.call(this, "/package.json", {
      scripts: {
        start: "ui5 serve --config=uimodule/ui5.yaml  --open flpSandbox.html"
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

  }
};
