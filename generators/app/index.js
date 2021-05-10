"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const spawn = require("cross-spawn");
const { hasYarn } = require("yarn-or-npm");

const path = require("path");
const fs = require("fs");
const { rmdir } = require("fs").promises;

const { Octokit } = require("@octokit/rest");
const AdmZip = require("adm-zip");

const generatorOptions = {
  ghAuthToken: {
    type: String,
    description:
      `GitHub authToken to optionally access private generator repositories`,
  },
  ghOrg: {
    type: String,
    description: `GitHub organization to lookup for available generators`,
    default: "ui5-community",
    hidden: true // we don't want to recommend to use this option
  },
  list: {
    type: Boolean,
    description: `List the available subcommands of the generator`,
  },
  verbose: {
    type: Boolean,
    description: `Enable detailed logging`,
  },
  skipUpdate: {
    type: Boolean,
    description: `Skip the update of the plugin generators`,
  },
};

const generatorArgs = {
  generator: {
    type: String,
    required: false,
    description: `Name of the generator to invoke (without the "generator-ui5-" prefix)`,
  },
  subcommand: {
    type: String,
    required: false,
    description: `Name of the subcommand to invoke (without the "generator:" prefix)`,
  },
};

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    Object.keys(generatorArgs).forEach((argName) => {
      // register the argument for being displayed in the help
      this.argument(argName, generatorArgs[argName]);
    });

    Object.keys(generatorOptions).forEach((optionName) => {
      if (!generatorOptions[optionName].hidden) {
        // register the option for being displayed in the help
        this.option(optionName, generatorOptions[optionName]);
      } else {
        // apply the default value for hidden options if needed
        this.options[optionName] = this.options[optionName] || generatorOptions[optionName].default;
      }
    });
  }

  _showBusy(statusText) {
    this._clearBusy();
    const progressChars = ['\\', '|', '/', '-'];
    let i = 0;
    process.stdout.write(`\r${statusText}  `);
    this._busy = {
      text: statusText,
      timer: setInterval(() => {
        process.stdout.write(`\r${statusText} ${progressChars[i++]}`);
        i %= progressChars.length;
      }, 250),
    };
  }

  _clearBusy(newLine) {
    if (this._busy) {
      clearInterval(this._busy.timer);
      process.stdout.write(`\r`.padEnd(this._busy.text.length + 3) + (newLine ? "\n" : ""));
      delete this._busy;
    }
  }

  async prompting() {
    this.log(yosay(`Welcome to the ${chalk.red("easy-ui5")} generator!`));

    // create the octokit client to retrieve the generators from GH org
    const octokit = new Octokit({
      userAgent: `${this.rootGeneratorName()}:${this.rootGeneratorVersion()}`,
      auth: this.options.ghAuthToken,
    });

    // retrieve the available repositories
    let reqRepos;
    try {
      reqRepos = await octokit.repos.listForOrg({
        org: this.options.ghOrg,
      });
    } catch (e) {
      console.error(`Failed to connect to GitHub to retrieve available repository for "${this.options.ghOrg}" organization! Run with --verbose for details!`);
      if (this.options.verbose) {
        console.error(e);
      }
      return;
    }

    // download the generator from GH (or the test generator)
    let generatorPath;
    if (this.options.generator === "test") {
      generatorPath = path.join(
        __dirname,
        "../../plugin-generators/generator-ui5-test"
      );
    } else {

      // check for provided generator being available on GH
      let generator =
        this.options.generator &&
        reqRepos.data.find(
          (repo) => repo.name === `generator-ui5-${this.options.generator}`
        );

      // if no generator is provided and doesn't exist, ask for generator name
      if (!generator) {
        if (this.options.generator) {
          this.log(
            `The generator ${chalk.red(
              this.options.generator
            )} was not found. Please select an existing generator!`
          );
        }
        const generatorRepos = reqRepos.data.filter((repo) =>
          /^generator-ui5-.+/.test(repo.name)
        );
        const generatorIdx = (
          await this.prompt([
            {
              type: "list",
              name: "generator",
              message: "Select your generator?",
              choices: generatorRepos.map((repo, idx) => ({
                name: repo.name,
                value: idx,
              })),
            },
          ])
        ).generator;
        generator = generatorRepos[generatorIdx];
      }

      // fetch the available branches to retrieve the latest commit SHA
      let reqBranch;
      try {
        reqBranch = await octokit.repos.getBranch({
          owner: this.options.ghOrg,
          repo: generator.name,
          branch: generator.default_branch,
        });
      } catch (e) {
        console.error(`Failed to retrieve the default branch for repository "${generator.name}" for "${this.options.ghOrg}" organization! Run with --verbose for details!`);
        if (this.options.verbose) {
          console.error(e);
        }
        return;
      }

      const commitSHA = reqBranch.data.commit.sha;

      if (this.options.verbose) {
        this.log(
          `Using commit ${commitSHA} from @${this.options.ghOrg}/${generator.name}#${generator.default_branch}...`
        );
      }
      generatorPath = path.join(
        __dirname,
        "../../plugin-generators",
        generator.name
      );
      const shaMarker = path.join(generatorPath, `.${commitSHA}`);

      if (fs.existsSync(generatorPath) && this.options.skipUpdate) {
        // check if the SHA marker exists to know whether the generator is up-to-date or not
        if (!fs.existsSync(shaMarker)) {
          if (this.options.verbose) {
            this.log(`Generator "${generator.name}" in "${generatorPath}" is outdated...`);
          }
          // remove if the SHA marker doesn't exist => outdated!
          this._showBusy(`  Removing old "${generator.name}" templates`);
          await rmdir(generatorPath, { recursive: true });
        }
      }

      // re-fetch the generator and extract into local plugin folder
      if (!fs.existsSync(generatorPath)) {
        if (this.options.verbose) {
          this.log(`Extracting ZIP to "${generatorPath}"...`);
        }
        this._showBusy(`  Downloading and extracting "${generator.name}" templates`);
        const reqZIPArchive = await octokit.repos.downloadZipballArchive({
          owner: this.options.ghOrg,
          repo: generator.name,
          ref: commitSHA,
        });
        const buffer = Buffer.from(new Uint8Array(reqZIPArchive.data));
        const zip = new AdmZip(buffer);
        const zipEntries = zip.getEntries();
        zipEntries.forEach((entry) => {
          const match =
            !entry.isDirectory && entry.entryName.match(/[^\/]+\/(.+)/);
          if (match) {
            const entryPath = match[1].slice(0, entry.name.length * -1);
            zip.extractEntryTo(
              entry,
              path.join(generatorPath, entryPath),
              false,
              true
            );
          }
        });
        fs.writeFileSync(shaMarker, commitSHA);

        // run yarn/npm install
        if (this.options.verbose) {
          this.log("Installing the plugin dependencies...");
        }
        this._showBusy(`  Preparing "${generator.name}"`);
        await new Promise(function (resolve, reject) {
          spawn((hasYarn() ? "yarn" : "npm"), ["install", "--no-progress"], {
            stdio: this.config.verbose ? "inherit" : "ignore",
            cwd: generatorPath,
            env: {
              ...process.env,
              "NO_UPDATE_NOTIFIER": true
            }
          }).on('exit', function (code) {
            resolve(code);
          }).on('error', function (err) {
            reject(err);
          });
        }.bind(this));
      }
    }

    this._clearBusy(true);

    // filter the local options and the help command
    const opts = Object.keys(this._options).filter(
      (optionName) =>
        !(generatorOptions.hasOwnProperty(optionName) || optionName === "help")
    );

    // create the env for the plugin generator
    const yeoman = require("yeoman-environment");
    const env = yeoman.createEnv(this.args, opts);

    // helper to derive the subcommand
    function deriveSubcommand(namespace) {
      const match = namespace.match(/[^:]+:(.+)/);
      return match ? match[1] : namespace;
    }

    // filter the hidden subgenerators already
    //   -> subgenerators must be found in env as they are returned by lookup!
    let subGenerators = env
      .lookup({ localOnly: true, packagePaths: generatorPath })
      .filter((sub) => {
        const subGenerator = env.get(sub.namespace);
        return !subGenerator.hidden;
      });

    // list the available subgenerators in the console (as help)
    if (this.options.list) {
      let maxLength = 0;
      this.log(subGenerators
        .map(sub => {
          maxLength = Math.max(sub.namespace.length, maxLength);
          return sub;
        })
        .reduce((output, sub) => {
          const subGenerator = env.get(sub.namespace);
          const displayName = subGenerator.displayName || "";
          let line = `  ${deriveSubcommand(sub.namespace).padEnd(maxLength + 2)}`;
          if (displayName) {
            line += ` # ${subGenerator.displayName}`;
          }
          return `${output}\n${line}`;
        }, `Subcommands (${subGenerators.length}):`));
      return;
    }

    // if a subcommand is provided as argument, identify the matching subgenerator
    // and remove the rest of the subgenerators from the list for later steps
    if (this.options.subcommand) {
      const selectedSubGenerator = subGenerators
        .filter((sub) => {
          // identify the subgenerator by subcommand
          return new RegExp(`:${this.options.subcommand}$`).test(sub.namespace);
        });
      if (selectedSubGenerator.length == 1) {
        subGenerators = selectedSubGenerator;
      } else {
        this.log(
          `The generator ${chalk.red(
            this.options.generator
          )} has no subcommand ${chalk.red(
            this.options.subcommand
          )}. Please select an existing subcommand!`
        );
      }
    }

    // transform the list of the subgenerators and identify the 
    // default subgenerator for the default selection
    let defaultSubGenerator;
    let maxLength = 0;
    subGenerators = subGenerators
      .map(sub => {
        const generator = env.get(sub.namespace);
        let subcommand = deriveSubcommand(sub.namespace);
        let displayName = generator.displayName || subcommand;
        maxLength = Math.max(displayName.length, maxLength);
        return {
          subcommand,
          displayName,
          sub,
        };
      })
      .map(({ subcommand, displayName, sub }) => {
        const transformed = {
          name: `${displayName.padEnd(maxLength + 2)} [${subcommand}]`,
          value: sub.namespace,
        };
        if (/:app$/.test(sub.namespace)) {
          defaultSubGenerator = transformed;
        }
        return transformed;
      });

    // at least 1 subgenerator must be present
    if (subGenerators.length >= 1) {

      // by default the 1st subgenerator is used
      let subGenerator = subGenerators[0].value;

      // if more than 1 subgenerator is present
      // ask the developer to select one!
      if (subGenerators.length > 1) {
        subGenerator = (
          await this.prompt([
            {
              type: "list",
              name: "subGenerator",
              message: "What do you want to do?",
              default: defaultSubGenerator && defaultSubGenerator.value,
              choices: subGenerators,
            },
          ])
        ).subGenerator;
      }

      if (this.options.verbose) {
        this.log(`Calling ${chalk.red(subGenerator)}...`);
      }

      // finally, run the subgenerator
      env.run(subGenerator, {
        verbose: this.options.verbose,
        embedded: true,
      });

    } else {
      this.log(
        `The generator ${chalk.red(
          this.options.generator
        )} has no visible subgenerators!`
      );
    }

  }
};
