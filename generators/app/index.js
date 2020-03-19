const Generator = require("yeoman-generator"),
    path = require("path"),
    glob = require("glob");

module.exports = class extends Generator {

    async prompting() {
        
        var basic =  await this.prompt([{
            type: "input",
            name: "projectname",
            message: "How do you want to name this project?",
            validate: (s) => {
                if (/^[a-zA-Z0-9_-]*$/g.test(s)) {
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
        },{
            type: "input",
            name: "clone",
            message: "Clone repository? (y,n) ",
            default: "n"
        }
        ]).then((answers) => {
            this.config.set(answers)
            return answers
        });

        if(this.config.get("clone") === "y"){
            var git =  await this.prompt([{
                    type: "input",
                    name: "repo",
                    message: "Insert repository:",
                },
                {
                    type: "input",
                    name: "branch",
                    message: "Insert branch:",
                    default: "master"
                }
            ]).then((git) => {
                    this.config.set("repo", git.repo);
                    this.config.set("branch", git.branch);
                    return git;
            })
            
        }
        
      return await this.prompt([{
            type: "list",
            name: "platform",
            message: "On which platform would you like to host the application?",
            choices: ["Static webserver",
                "Application Router @ Cloud Foundry",
                "Application Router @ SAP HANA XS Advanced",
                "Cloud Foundry HTML5 Application Repository",
                "Fiori Launchpad on Cloud Foundry"],
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
                if (/^[a-zA-Z0-9_\.]*$/g.test(s)) {
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
                    ["Content delivery network (OpenUI5)", "Content delivery network (SAPUI5)", "Local resources (OpenUI5)"] :
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
                this.destinationRoot(`${basic.namespace}.${basic.projectname}`);
            }
            this.config.set(Object.assign(basic, git, answers));
        });
       
    }

    clone(){
        
        if(this.config.get("clone") === "y"){
            const sPathTemplate = this.sourceRoot(path.join(__dirname, "templates"));
            const sRepo         = this.config.get("repo");
            const sBranch       = this.config.get("branch");
            console.log(sRepo)
            this.spawnCommandSync("rimraf", [sPathTemplate]);

            if(sBranch === "master"){
                this.spawnCommandSync("git",  ["clone", sRepo, sPathTemplate], {
                    cwd: this.destinationPath()
                });
            }else{
                this.spawnCommandSync("git", ["clone", sRepo, "--single-branch", "--branch", sBranch, sPathTemplate], {
                    cwd: this.destinationPath()
                });
            }
        }
    }

    writing() {
        const sViewName = this.config.get("viewname");
        const sViewType = this.config.get("viewtype");

        this.sourceRoot(path.join(__dirname, "templates"));
        glob.sync("**", {
            cwd: this.sourceRoot(),
            nodir: true
        }).forEach((file) => {
            const sOrigin = this.templatePath(file);
            const sTarget = this.destinationPath(file.replace(/^_/, "").replace(/\/_/, "/").replace(/\$ViewType/, sViewType).replace(/\$ViewEnding/, sViewType.toLowerCase()).replace(/\$ViewName/, sViewName));

            this.fs.copyTpl(sOrigin, sTarget, this.config.getAll());
        });

        const oSubGen = Object.assign({}, this.config.getAll());
        oSubGen.isSubgeneratorCall = true;
        oSubGen.cwd = this.destinationRoot();

        this.composeWith(require.resolve("../newview"), oSubGen);
        const selectedPlatform = this.config.get("platform");
        if (selectedPlatform !== "Static webserver") {
            this.composeWith(require.resolve("../approuter"), oSubGen);
            if (selectedPlatform === "Cloud Foundry HTML5 Application Repository") {
                this.composeWith(require.resolve("../deployer"), oSubGen);
            }
            if (selectedPlatform === "Fiori Launchpad on Cloud Foundry") {
                this.composeWith(require.resolve("../deployer"), oSubGen);
                this.composeWith(require.resolve("../launchpad"), oSubGen);
            }
        }
    }

    install() {
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

