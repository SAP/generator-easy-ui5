const Generator = require("yeoman-generator"),
    yaml = require("yaml"),
    glob = require("glob");

module.exports = class extends Generator {

    prompting() {
        if (this.options.isSubgeneratorCall) {
            return this.prompt([{
                type: "input",
                name: "tilename",
                message: "What name should be displayed on the Fiori Launchpad tile?",
                default: "Fiori App"
            }]).then((answers) => {
                this.destinationRoot(this.options.cwd);
                this.options.oneTimeConfig = this.config.getAll();
                this.options.oneTimeConfig.tilename = answers.tilename;
            });
        }
        throw ("This subgenerator is only intended for internal use. Please don't call it directly.");
    }

    async writing() {
        glob.sync("**", {
            cwd: this.sourceRoot(),
            nodir: true
        }).forEach(file => {
            this.fs.copyTpl(this.templatePath(file), this.destinationPath(file.replace(/^_/, "").replace(/\/_/, "/")), this.options.oneTimeConfig);
        });
        const projectname = this.options.oneTimeConfig.projectname,
            title = this.options.oneTimeConfig.tilename;

        try {
            const filePath = process.cwd() + "/webapp/manifest.json";
            const json = await this.fs.readJSON(filePath);
            const appConfig = json["sap.app"];

            appConfig.crossNavigation = appConfig.crossNavigation || {};
            appConfig.crossNavigation.inbounds = appConfig.crossNavigation.inbounds || {};

            appConfig.crossNavigation.inbounds["intent1"] = {
                "signature": {
                    "parameters": {},
                    "additionalParameters": "allowed"
                },
                "semanticObject": "data",
                "action": "display",
                "title": title,
                "description": "App Description",
                "icon": "sap-icon://add"
            };

            this.fs.writeJSON(filePath, json);
            !this.options.isSubgeneratorCall && this.log("Updated manifest file with the new inbound navigation.");
        } catch (e) {
            this.log("Error during the manipulation of the manifest: " + e);
            throw e;
        }

        try {
            const filePath = process.cwd() + "/approuter/xs-app.json";
            const xsapp = await this.fs.readJSON(filePath);

            xsapp.routes = xsapp.routes || [];
            xsapp.welcomeFile = "/cp.portal";
            xsapp.routes = xsapp.routes.filter((route) => !route.localDir);

            this.fs.writeJSON(filePath, xsapp);
            !this.options.isSubgeneratorCall && this.log("Updated xs-app.json file.");
        } catch (e) {
            this.log("Error during the manipulation of the approuter/xs-app.json file: " + e);
            throw e;
        }

        try {
            const filePath = process.cwd() + "/webapp/xs-app.json";
            const xsapp = await this.fs.readJSON(filePath);

            xsapp.welcomeFile = "/flpSandbox.html";

            this.fs.writeJSON(filePath, xsapp);
            !this.options.isSubgeneratorCall && this.log("Updated xs-app.json file.");
        } catch (e) {
            this.log("Error during the manipulation of the webapp/xs-app.json file: " + e);
            throw e;
        }

        try {
            const filePath = process.cwd() + "/package.json";
            const descriptor = await this.fs.readJSON(filePath);

            descriptor.scripts.start = "ui5 serve -o flpSandbox.html";

            this.fs.writeJSON(filePath, descriptor);
            !this.options.isSubgeneratorCall && this.log("Updated xs-app.json file.");
        } catch (e) {
            this.log("Error during the manipulation of the package.json file: " + e);
            throw e;
        }

        try {
            const filePath = process.cwd() + "/mta.yaml";
            const mta = yaml.parse(this.fs.read(filePath));
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

            this.fs.write(filePath, yaml.stringify(mta));

            !this.options.isSubgeneratorCall && this.log("Updated the mta.yaml file with the new resources.");
        } catch (e) {
            this.log("Error during the manipulation of the mta.yaml file: " + e);
            throw e;
        }
    }
};
