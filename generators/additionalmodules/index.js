const Generator = require("yeoman-generator"),
  fileaccess = require("../../helpers/fileaccess"),
  path = require("path"),
  glob = require("glob");

module.exports = class extends Generator {

  prompting() {
    if (this.options.isSubgeneratorCall) {
      this.destinationRoot(this.options.cwd);
      this.options.oneTimeConfig = this.config.getAll();
      this.options.oneTimeConfig.modulename = this.options.modulename;
      return;
    }
    throw ("This subgenerator is only intended for internal use. Please don\"t call it directly.");
  }

  async writing() {
    this.sourceRoot(path.join(__dirname, "templates"));

    const oConfig = this.options.oneTimeConfig;
    const platformIsAppRouter = this.options.oneTimeConfig.platform.includes("Application Router");

    // Copy approuter module
    glob.sync("**", {
      cwd: this.sourceRoot() + "/approuter",
      nodir: true
    }).forEach(file => {
      this.fs.copyTpl(this.templatePath("approuter/" + file), this.destinationPath("approuter/" + file.replace(/^_/, "").replace(/\/_/, "/")), oConfig);
    });
    this.fs.copyTpl(this.templatePath("xs-security.json"), this.destinationPath("xs-security.json"), oConfig);

    const welcomeRoute = platformIsAppRouter ? "uimodule/index.html" :
      oConfig.platform === "Cloud Foundry HTML5 Application Repository" ? (oConfig.namespace + oConfig.projectname + "/").replace(/\./g, "") : "/cp.portal";

    await fileaccess.manipulateJSON.call(this, "/approuter/xs-app.json", {
      "welcomeFile": welcomeRoute,
      "authenticationMethod": "none",
      "logout": {
        "logoutEndpoint": "/do/logout"
      },
      "routes": []
    });

    if (!platformIsAppRouter) {
      // Copy deployer module
      glob.sync("**", {
        cwd: this.sourceRoot() + "/deployer",
        nodir: true
      }).forEach(file => {
        this.fs.copyTpl(this.templatePath("deployer/" + file), this.destinationPath("deployer/" + file.replace(/^_/, "").replace(/\/_/, "/")), oConfig);
      });




    }
    if (oConfig.platform === "Fiori Launchpad on Cloud Foundry") {

      // Copy launchpad module
      glob.sync("**", {
        cwd: this.sourceRoot() + "/launchpad",
        nodir: true
      }).forEach(file => {
        this.fs.copyTpl(this.templatePath("launchpad/" + file), this.destinationPath("launchpad/" + file.replace(/^_/, "").replace(/\/_/, "/")), oConfig);
      });
    }

  }

  async addMTA() {
    const oConfig = this.config.getAll();

    const buildParam = {
      builder: "custom",
      commands: ["npm install", "npm run build:ui --prefix .."]
    };

    let mta = {
      "ID": oConfig.projectname,
      "_schema-version": "3.2.0",
      "version": "0.0.1",
      "parameters": {
        "enable-parallel-deployments": true
      },
      "modules": [{
        "name": oConfig.projectname,
        "type": "nodejs",
        "path": "approuter",
        "parameters": {
          "disk-quota": "512M",
          "memory": "512M"
        },
        "requires": []
      }],
      "resources": []
    };


    const approuter = mta.modules[0];

    if (oConfig.platform.includes("Application Router")) {
      approuter["build-parameters"] = buildParam;
    }

    if (oConfig.platform !== "Application Router @ SAP HANA XS Advanced") {

      mta.resources.push({
        "name": oConfig.projectname + "_destination",
        "type": "org.cloudfoundry.managed-service",
        "parameters": {
          "service-plan": "lite",
          "service": "destination"
        }
      });
      approuter.requires.push({ name: oConfig.projectname + "_destination" });

      if (oConfig.platform === "Cloud Foundry HTML5 Application Repository" || oConfig.platform === "Fiori Launchpad on Cloud Foundry") {

        mta.modules.push({
          "name": oConfig.projectname + "_deployer",
          "type": "com.sap.html5.application-content",
          "path": "deployer",
          "requires": [{
            "name": oConfig.projectname + "_html5_repo_host"
          }],
          "build-parameters": buildParam
        });

        mta.resources.push({
          "name": oConfig.projectname + "_html5_repo_host",
          "type": "org.cloudfoundry.managed-service",
          "parameters": {
            "service-plan": "app-host",
            "service": "html5-apps-repo",
            "config": {
              "sizeLimit": 2
            }
          }
        });

        mta.resources.push({
          "name": oConfig.projectname + "_html5_repo_runtime",
          "type": "org.cloudfoundry.managed-service",
          "parameters": {
            "service-plan": "app-runtime",
            "service": "html5-apps-repo"
          }
        });
        approuter.requires.push({ name: oConfig.projectname + "_html5_repo_runtime" });

        mta.resources.push({
          "name": oConfig.projectname + "_uaa",
          "type": "org.cloudfoundry.managed-service",
          "parameters": {
            "path": "./xs-security.json",
            "service-plan": "application",
            "service": "xsuaa"
          }
        });
        approuter.requires.push({ name: oConfig.projectname + "_uaa" });


        if (oConfig.platform === "Fiori Launchpad on Cloud Foundry") {
          approuter.requires.push({ name: oConfig.projectname + "_portal" });
          mta.modules.push({
            name: oConfig.projectname + "_launchpad_deployer",
            type: "com.sap.portal.content",
            path: "launchpad",
            ["deployed-after"]: [oConfig.projectname + "_deployer"],
            requires: [{
              name: oConfig.projectname + "_portal"
            }, {
              name: oConfig.projectname + "_html5_repo_host"
            }, {
              name: oConfig.projectname + "_uaa"
            }]
          });
          mta.resources.push({
            name: oConfig.projectname + "_portal",
            type: "org.cloudfoundry.managed-service",
            parameters: {
              "service-plan": "standard",
              "service": "portal"
            }
          });
        }
      }
    }

    await fileaccess.writeYAML.call(this, "/mta.yaml", mta);
  }
};
