"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const spawn = require("cross-spawn");

const fs = require("fs");
const path = require("path");

const { Octokit } = require("@octokit/rest");
const AdmZip = require("adm-zip");

const generatorOptions = {
  generator: {
    type: String,
    description: "Name of the generator without the generator- prefix",
  },
  ghAuthToken: {
    type: String,
    description:
      "GitHub authToken to optionally access private generator repositories",
  },
  ghOrg: {
    type: String,
    description: "GitHub organization to lookup for generators",
    default: "ui5-community",
  },
  verbose: {
    type: Boolean,
    description: "Enable detailed logging",
  },
};

const generatorArgs = {
  generator: {
    type: String,
    required: false,
    description: "Name of the generator without the generator- prefix",
  },

  subGenerator: {
    type: String,
    required: false,
    description: "Name of the sub-generator you want to invoke",
  },
};

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    Object.keys(generatorArgs).forEach((argName) => {
      this.argument(argName, generatorArgs[argName]);
    });

    Object.keys(generatorOptions).forEach((optionName) => {
      this.option(optionName, generatorOptions[optionName]);
    });
  }

  shouldUseYarn() {
    try {
      spawn.sync("yarnpkg --version", { stdio: "ignore" });
      return true;
    } catch (e) {
      return false;
    }
  }

  async prompting() {
    this.log(yosay(`Welcome to the ${chalk.red("easy-ui5")} generator!`));

    const octokit = new Octokit({
      userAgent: `${this.rootGeneratorName()}:${this.rootGeneratorVersion()}`,
      auth: this.options.ghAuthToken,
    });

    const reqRepos = await octokit.repos.listForOrg({
      org: this.options.ghOrg,
    });

    let generatorPath;
    if (this.options.generator === "test") {
      generatorPath = path.join(
        __dirname,
        "../../plugin-generators/generator-ui5-test"
      );
    } else {
      let generator =
        this.options.generator &&
        reqRepos.data.find(
          (repo) => repo.name === `generator-ui5-${this.options.generator}`
        );

      if (!generator) {
        if (this.options.generator) {
          this.log(
            `The generator ${chalk.red(
              this.options.generator
            )} was not found. Please select an existing generator!`
          );
        }
        const generatorRepos = reqRepos.data.filter((repo) =>
          /^generator-.+/.test(repo.name)
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

      const reqBranch = await octokit.repos.getBranch({
        owner: this.options.ghOrg,
        repo: generator.name,
        branch: generator.default_branch,
      });

      const commitSHA = reqBranch.data.commit.sha;

      if (this.options.verbose) {
        this.log(
          `Fetching ZIP for commit ${commitSHA} from @${this.options.ghOrg}/${generator.name}#${generator.default_branch}...`
        );
      }
      generatorPath = path.join(
        __dirname,
        "../../plugin-generators",
        generator.name
      );
      const shaMarker = path.join(generatorPath, `.${commitSHA}`);

      if (fs.existsSync(generatorPath)) {
        // check if the SHA marker exists to know whether the generator is up-to-date or not
        if (!fs.existsSync(shaMarker)) {
          this.log(`generator in ${generatorPath} is outdated...`);
          // remove if the SHA marker doesn't exist => outdated!
          fs.rmdirSync(generatorPath, { recursive: true });
        }
      }

      if (!fs.existsSync(generatorPath)) {
        if (this.options.verbose) {
          this.log(`Extracting ZIP to ${generatorPath}...`);
        }
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
      }
    }

    this.log("Installing the plugin...");
    spawn.sync(this.shouldUseYarn() ? "yarn" : "npm", ["install"], {
      stdio: "ignore",
      cwd: generatorPath,
    });

    const yeoman = require("yeoman-environment");

    const opts = Object.keys(this._options).filter(
      (optionName) =>
        !(generatorOptions.hasOwnProperty(optionName) || optionName === "help")
    );

    const env = yeoman.createEnv(this.args, opts);

    function deriveSubcommand(namespace) {
      const match = namespace.match(/[^:]+:(.+)/);
      return match ? match[1] : namespace;
    }

    let defaultSubGenerator;

    let subGenerators = env
      .lookup({ localOnly: true, packagePaths: generatorPath })
      .filter((sub) => {
        if (this.options.subGenerator) {
          return (
            !env.get(sub.namespace)?.hidden &&
            sub.namespace.includes(`:${this.options.subGenerator}`)
          );
        }
        return !env.get(sub.namespace)?.hidden;
      })
      .map((sub) => {
        const transformed = {
          name:
            `${env.get(sub.namespace).displayName} [${deriveSubcommand(
              sub.namespace
            )}]` || deriveSubcommand(sub.namespace),
          value: sub.namespace,
        };
        if (/:app$/.test(sub.namespace)) {
          defaultSubGenerator = transformed;
        }
        return transformed;
      });

    let subGenerator = subGenerators[0]?.value;

    if (subGenerators.length > 1) {
      subGenerator = (
        await this.prompt([
          {
            type: "list",
            name: "subGenerator",
            message: "What do you want to do?",
            default: defaultSubGenerator?.value,
            choices: subGenerators,
          },
        ])
      ).subGenerator;
    }

    if (this.options.verbose) {
      this.log(`Calling generator ${chalk.red(subGenerator)}...`);
    }

    env.run(subGenerator, {
      verbose: this.options.verbose,
      embedded: true,
    });
  }
};
