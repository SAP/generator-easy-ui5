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
    const platformIsAppRouter = this.options.oneTimeConfig.platform.includes("Application Router"); // aka no destination service etc needed

    // Copy approuter module
    if (oConfig.platform !== "SAP Launchpad service") {
      glob.sync("**", {
        cwd: this.sourceRoot() + "/approuter",
        nodir: true
      }).forEach(file => {
        this.fs.copyTpl(this.templatePath("approuter/" + file), this.destinationPath("approuter/" + file.replace(/^_/, "").replace(/\/_/, "/")), oConfig);
      });

      const welcomeRoute = platformIsAppRouter ? "uimodule/index.html" : (oConfig.namespace + oConfig.projectname + "/").replace(/\./g, "");

      await fileaccess.manipulateJSON.call(this, "/approuter/xs-app.json", {
        "welcomeFile": welcomeRoute,
        "authenticationMethod": "none",
        "logout": {
          "logoutEndpoint": "/do/logout"
        },
        "routes": []
      });
    }

    if (oConfig.platform !== "Application Router @ SAP HANA XS Advanced") {
      // Copy deployer module
      glob.sync("**", {
        cwd: this.sourceRoot() + "/deployer",
        nodir: true
      }).forEach(file => {
        this.fs.copyTpl(this.templatePath("deployer/" + file), this.destinationPath("deployer/" + file.replace(/^_/, "").replace(/\/_/, "/")), oConfig);
      });
    }
  }

  async addMTA() {
    const oConfig = this.config.getAll();

    let mta = {
      "ID": oConfig.projectname,
      "_schema-version": "3.2.0",
      "version": "0.0.1",
      "parameters": {
        "enable-parallel-deployments": true
      },
      "modules": [],
      "resources": []
    };

    let approuter;
    if (oConfig.platform !== "SAP Launchpad service") {
      approuter = {
        "name": oConfig.projectname,
        "type": "nodejs",
        "path": "approuter",
        "parameters": {
          "disk-quota": "512M",
          "memory": "512M"
        },
        "requires": []
      };
      mta.modules.push(approuter);

      if (oConfig.platform.includes("Application Router")) {
        approuter["build-parameters"] = {
          builder: "custom",
          commands: ["npm install", "npm run build:ui --prefix .."]
        };
      }
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
      if (approuter) {
        approuter.requires.push({ name: oConfig.projectname + "_destination" });
      }

      if (oConfig.platform === "SAP HTML5 Application Repository service for SAP BTP" || oConfig.platform === "SAP Launchpad service") {


        mta.modules.push({
          "name": "webapp_deployer",
          "type": "com.sap.application.content",
          "path": "deployer",
          "requires": [{
            "name": oConfig.projectname + "_html5_repo_host",
            "parameters": {
              "content-target": true
            }
          }],
          "build-parameters": {
            ["build-result"]: "resources",
            ["requires"]: []
          }
        });

        mta.resources.push({
          "name": oConfig.projectname + "_html5_repo_host",
          "type": "org.cloudfoundry.managed-service",
          "parameters": {
            "service-plan": "app-host",
            "service": "html5-apps-repo",
            "config": {
              "sizeLimit": oConfig.ui5libs.indexOf("Local resources") >= 0 ? 100 : 2
            }
          }
        });

        if (approuter) {
          mta.resources.push({
            "name": oConfig.projectname + "_html5_repo_runtime",
            "type": "org.cloudfoundry.managed-service",
            "parameters": {
              "service-plan": "app-runtime",
              "service": "html5-apps-repo"
            }
          });
          approuter.requires.push({ name: oConfig.projectname + "_html5_repo_runtime" });
        }

        mta.resources.push({
          "name": oConfig.projectname + "_uaa",
          "type": "org.cloudfoundry.managed-service",
          "parameters": {
            "path": "./xs-security.json",
            "service-plan": "application",
            "service": "xsuaa"
          }
        });
        this.fs.copyTpl(this.templatePath("xs-security.json"), this.destinationPath("xs-security.json"), oConfig);
        if (approuter) {
          approuter.requires.push({ name: oConfig.projectname + "_uaa" });
        }

        if (oConfig.platform === "SAP Launchpad service") {
          mta.modules.push({
            "name": oConfig.projectname + "destination-content",
            "type": "com.sap.application.content",
            "build-parameters": {
              "no-source": true
            },
            "requires": [
              {
                "name": oConfig.projectname + "_uaa",
                "parameters": {
                  "service-key": {
                    "name": oConfig.projectname + "_uaa-key"
                  }
                }
              },
              {
                "name": oConfig.projectname + "_html5_repo_host",
                "parameters": {
                  "service-key": {
                    "name": oConfig.projectname + "_html5_repo_host-key"
                  }
                }
              },
              {
                "name": oConfig.projectname + "_destination",
                "parameters": {
                  "content-target": true
                }
              }
            ],
            "parameters": {
              "content": {
                "subaccount": {
                  "existing_destinations_policy": "update",
                  "destinations": [
                    {
                      "Name": oConfig.projectname + "_html5_repo_host",
                      "ServiceInstanceName": oConfig.projectname + "_html5_repo_host",
                      "ServiceKeyName": oConfig.projectname + "_html5_repo_host-key",
                      "sap.cloud.service": oConfig.projectname + ".service"
                    },
                    {
                      "Name": oConfig.projectname + "_uaa",
                      "Authentication": "OAuth2UserTokenExchange",
                      "ServiceInstanceName": oConfig.projectname + "_uaa",
                      "ServiceKeyName": oConfig.projectname + "_uaa-key",
                      "sap.cloud.service": oConfig.projectname + ".service"
                    }
                  ]
                }
              }
            }
          });
        }
      }
    }

    await fileaccess.writeYAML.call(this, "/mta.yaml", mta);
  }
};
