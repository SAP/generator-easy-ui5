const Generator = require("yeoman-generator"),
  fileaccess = require("../../helpers/fileaccess"),
  path = require("path"),
  glob = require("glob");

module.exports = class extends Generator {

  prompting() {
    return this.prompt([{
      type: "input",
      name: "projectname",
      message: "How do you want to name this project?",
      validate: (s) => {
        if (/^\d*[a-zA-Z][a-zA-Z0-9]*$/g.test(s)) {
          return true;
        }
        return "Please use alpha numeric characters only for the project name.";
      },
      default: "myUI5App"
    }, {
      type: "input",
      name: "namespace",
      message: "Which namespace do you want to use?",
      validate: (s) => {
        if (/^[a-zA-Z0-9_\.]*$/g.test(s)) {
          return true;
        }
        return "Please use alpha numeric characters and dots only for the namespace.";
      },
      default: "com.myorg"
    }, {
      type: "list",
      name: "platform",
      message: "On which platform would you like to host the application?",
      choices: ["Static webserver",
        "Application Router @ Cloud Foundry",
        "Cloud Foundry HTML5 Application Repository",
        "Fiori Launchpad on Cloud Foundry",
        "Application Router @ SAP HANA XS Advanced",
        "SAP NetWeaver"],
      default: "Static webserver"
    }, {
      type: "list",
      name: "viewtype",
      message: "Which view type do you want to use?",
      choices: ["XML", "JSON", "JS", "HTML"],
      default: "XML"
    }, {
      type: "input",
      name: "viewname",
      message: "How do you want to name your main view?",
      validate: (s) => {
        if (/^\d*[a-zA-Z][a-zA-Z0-9]*$/g.test(s)) {
          return true;
        }
        return "Please use alpha numeric characters only for the view name.";
      },
      default: "MainView"
    }, {
      type: "list",
      name: "ui5libs",
      message: "Where should your UI5 libs be served from?",
      choices: (props) => {
        return (props.platform !== "Fiori Launchpad on Cloud Foundry") ?
          ["Content delivery network (OpenUI5)", "Content delivery network (SAPUI5)", "Local resources (OpenUI5)", "Local resources (SAPUI5)"] :
          ["Content delivery network (SAPUI5)"];
      },
      default: (props) => {
        return (props.platform !== "Fiori Launchpad on Cloud Foundry") ?
          "Content delivery network (OpenUI5)" :
          "Content delivery network (SAPUI5)";
      },
    }, {
      type: "confirm",
      name: "newdir",
      message: "Would you like to create a new directory for the project?",
      default: true
    }]).then((answers) => {
      if (answers.newdir) {
        this.destinationRoot(`${answers.namespace}.${answers.projectname}`);
      }
      this.config.set(answers);
      this.config.set("namespaceURI", answers.namespace.split(".").join("/"));
    });
  }

  async writing() {
    const oConfig = this.config.getAll();

    this.sourceRoot(path.join(__dirname, "templates"));
    glob.sync("**", {
      cwd: this.sourceRoot(),
      nodir: true
    }).forEach((file) => {
      const sOrigin = this.templatePath(file);
      const sTarget = this.destinationPath(file.replace(/^_/, "").replace(/\/_/, "/"));

      this.fs.copyTpl(sOrigin, sTarget, oConfig);
    });

    const oSubGen = Object.assign({}, oConfig);
    oSubGen.isSubgeneratorCall = true;
    oSubGen.cwd = this.destinationRoot();
    oSubGen.modulename = "uimodule";

    if (oConfig.platform !== "Static webserver" && oConfig.platform !== "SAP NetWeaver") {
      this.composeWith(require.resolve("../additionalmodules"), oSubGen);
    }

    this.composeWith(require.resolve("../newwebapp"), oSubGen);
  }

  async addPackage() {
    const oConfig = this.config.getAll();
    let packge = {
      "name": oConfig.projectname,
      "version": "0.0.1",
      "scripts": {
        "start": "ui5 serve --config=uimodule/ui5.yaml  --open index.html",
        "build:ui": "run-s ",
        "test": "run-s lint karma",
        "karma-ci": "karma start karma-ci.conf.js",
        "clearCoverage": "shx rm -rf coverage",
        "karma": "run-s clearCoverage karma-ci",
        "lint": "eslint ."
      },
      "devDependencies": {
        "shx": "^0.3.2",
        "@ui5/cli": "^2.2.5",
        "ui5-middleware-livereload": "^0.3.0",
        "karma": "^5.0.9",
        "karma-chrome-launcher": "^3.1.0",
        "karma-coverage": "^2.0.2",
        "karma-ui5": "^2.1.2",
        "npm-run-all": "^4.1.5",
        "eslint": "^7.1.0"
      },
      "ui5": {
        "dependencies": [
          "ui5-middleware-livereload",
        ]
      }
    };

    if (oConfig.platform !== "Static webserver" && oConfig.platform !== "SAP NetWeaver") {
      packge.devDependencies["ui5-middleware-cfdestination"] = "^0.2.0";
      packge.devDependencies["ui5-task-zipper"] = "^0.3.0",
      packge.devDependencies["cross-var"] = "^1.1.0";
      packge.devDependencies["mbt"] = "^1.0.14";
      packge.ui5.dependencies.push("ui5-middleware-cfdestination");
      packge.ui5.dependencies.push("ui5-task-zipper");

      if (oConfig.platform.includes("Cloud Foundry")) {
        packge.scripts["build:mta"] = "mbt build";
        packge.scripts["deploy:cf"] = `cross-var cf deploy mta_archives/${oConfig.projectname}_$npm_package_version.mtar`;
        packge.scripts["deploy"] = "run-s build:mta deploy:cf";
      } else if (oConfig.platform === "Application Router @ SAP HANA XS Advanced") {
        packge.scripts["build:mta"] = "mbt build -p=xsa";
        packge.scripts["deploy:cf"] = `cross-var xs deploy mta_archives/${oConfig.projectname}_$npm_package_version.mtar`;
        packge.scripts["deploy"] = "run-s build:mta deploy:xs";
      }

      if (oConfig.platform === "Fiori Launchpad on Cloud Foundry") {
        packge.scripts.start = "ui5 serve --config=uimodule/ui5.yaml  --open flpSandbox.html";
      }
    }

    if (oConfig.platform === "SAP NetWeaver"){
      packge.devDependencies["ui5-task-nwabap-deployer"] = "*";
      packge.devDependencies["ui5-middleware-route-proxy"] = "*";
      packge.ui5.dependencies.push("ui5-task-nwabap-deployer");
      packge.ui5.dependencies.push("ui5-middleware-route-proxy");
      packge.scripts["deploy"] = "run-s build:ui";
    }

    await fileaccess.writeJSON.call(this, "/package.json", packge);
  }

  install() {
    this.config.set("setupCompleted", true);
    this.installDependencies({
      bower: false,
      npm: true
    });
  }

  end() {
    this.spawnCommandSync("git", ["init", "--quiet"], {
      cwd: this.destinationPath()
    });
    this.spawnCommandSync("git", ["add", "."], {
      cwd: this.destinationPath()
    });
    this.spawnCommandSync("git", ["commit", "--quiet", "--allow-empty", "-m", "Initialize repository with easy-ui5"], {
      cwd: this.destinationPath()
    });
  }
};
