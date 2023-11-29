import Generator from "yeoman-generator";

import path from "path";
import fs from "fs";
import os from "os";
import url from "url";

import { glob } from "glob";
import chalk from "chalk";
import yosay from "yosay";
import libnpmconfig from "libnpmconfig";
import AdmZip from "adm-zip";
import { request } from "@octokit/request";
import { Octokit } from "@octokit/rest";
import { throttling } from "@octokit/plugin-throttling";
const MyOctokit = Octokit.plugin(throttling);
import spawn from "cross-spawn";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// apply proxy settings to GLOBAL_AGENT to support the proxy configuration
// provided via the standard Node.js environment varibales (used for fetch API)
let HTTP_PROXY, HTTPS_PROXY, NO_PROXY;
if (global?.GLOBAL_AGENT) {
	HTTP_PROXY = global.GLOBAL_AGENT.HTTP_PROXY = process.env.HTTP_PROXY || process.env.http_proxy;
	HTTPS_PROXY = global.GLOBAL_AGENT.HTTPS_PROXY = process.env.HTTPS_PROXY || process.env.https_proxy;
	NO_PROXY = global.GLOBAL_AGENT.NO_PROXY = process.env.NO_PROXY || process.env.no_proxy;
}

// helper to retrieve config entries from npm
//   --> npm config set easy-ui5_addGhOrg XYZ
const NPM_CONFIG_PREFIX = "easy-ui5_";
let npmConfig;
const getNPMConfig = (configName) => {
	if (!npmConfig) {
		npmConfig = libnpmconfig.read();
	}
	return npmConfig && npmConfig[`${NPM_CONFIG_PREFIX}${configName}`];
};

// the command line options of the generator
const generatorOptions = {
	pluginsHome: {
		type: String,
		description: "Home directory of the plugin generators",
		default: path.join(os.homedir(), ".npm", "_generator-easy-ui5", "plugin-generators"),
		hide: true, // shouldn't be needed
		npmConfig: true,
	},
	plugins: {
		type: Boolean,
		alias: "p",
		description: "List detailed information about installed plugin generators",
	},
	pluginsWithDevDeps: {
		type: Boolean,
		alias: "dev",
		description: "Installs the plugin generators with dev dependencies (compat mode)",
	},
	ghBaseUrl: {
		type: String,
		description: "Base URL for the Octokit API (defaults to https://api.github.com if undefined)",
		hide: true, // shouldn't be needed
		npmConfig: true,
	},
	ghAuthToken: {
		type: String,
		description: "GitHub authToken to optionally access private generator repositories",
		npmConfig: true,
	},
	ghOrg: {
		type: String,
		description: "GitHub organization to lookup for available generators",
		default: "ui5-community",
		hide: true, // we don't want to recommend to use this option
	},
	ghThreshold: {
		type: Number,
		default: 100,
		hide: true, // shouldn't be needed
	},
	subGeneratorPrefix: {
		type: String,
		description: "Prefix used for the lookup of the available generators",
		default: "generator-ui5-",
		hide: true, // we don't want to recommend to use this option
	},
	addGhBaseUrl: {
		type: String,
		description: "Base URL for the Octokit API for the additional generators (defaults to https://api.github.com if undefined)",
		hide: true, // shouldn't be needed
		npmConfig: true,
	},
	addGhOrg: {
		type: String,
		description: "GitHub organization to lookup for additional available generators",
		hide: true, // we don't want to recommend to use this option
		npmConfig: true,
	},
	addSubGeneratorPrefix: {
		type: String,
		description: "Prefix used for the lookup of the additional available generators",
		default: "generator-",
		hide: true, // we don't want to recommend to use this option
		npmConfig: true,
	},
	embed: {
		type: Boolean,
		description: "Embeds the selected plugin generator",
		hide: true, // shouldn't be needed
	},
	list: {
		type: Boolean,
		description: "List the available subcommands of the generator",
	},
	skipUpdate: {
		type: Boolean,
		description: "Skip the update of the plugin generator",
	},
	forceUpdate: {
		type: Boolean,
		description: "Force the update of the plugin generator",
	},
	offline: {
		type: Boolean,
		alias: "o",
		description: "Running easy-ui5 in offline mode",
	},
	verbose: {
		type: Boolean,
		description: "Enable detailed logging",
	},
	next: {
		type: Boolean,
		description: "Preview the next mode to consume subgenerators from bestofui5.org",
	},
};

const generatorArgs = {
	generator: {
		type: String,
		required: false,
		description: `Name of the generator to invoke (without the ${chalk.yellow("generator-ui5-")} prefix)`,
	},
	subcommand: {
		type: String,
		required: false,
		description: `Name of the subcommand to invoke (without the ${chalk.yellow("generator:")} prefix)`,
	},
};

export default class extends Generator {
	constructor(args, opts) {
		super(args, opts, {
			// disable the Yeoman 5 package-manager logic (auto install)!
			customInstallTask: "disabled",
		});

		Object.keys(generatorArgs).forEach((argName) => {
			// register the argument for being displayed in the help
			this.argument(argName, generatorArgs[argName]);
		});

		Object.keys(generatorOptions).forEach((optionName) => {
			const initialValue = this.options[optionName];
			// register the option for being displayed in the help
			this.option(optionName, generatorOptions[optionName]);
			const defaultedValue = this.options[optionName];
			if (generatorOptions[optionName].npmConfig) {
				// if a value is set, use the set value (parameter has higher precedence than npm config)
				// => this.option(...) applies the default value to this.options[...] used as last resort
				this.options[optionName] = initialValue || getNPMConfig(optionName) || defaultedValue;
			}
		});
	}

	_showBusy(statusText) {
		this._clearBusy();
		const progressChars = ["\\", "|", "/", "-"];
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
			process.stdout.write("\r".padEnd(this._busy.text.length + 3) + (newLine ? "\n" : ""));
			delete this._busy;
		}
	}

	async _npmInstall(dir, withDevDeps) {
		return new Promise(
			function (resolve, reject) {
				spawn("npm", ["install", "--no-progress", "--ignore-engines", "--ignore-scripts"], {
					stdio: this.config.verbose ? "inherit" : "ignore",
					cwd: dir,
					env: {
						...process.env,
						NO_UPDATE_NOTIFIER: true,
						NODE_ENV: withDevDeps ? undefined : "production", // do not install devDependencies!
					},
				})
					.on("exit", function (code) {
						resolve(code);
					})
					.on("error", function (err) {
						reject(err);
					});
			}.bind(this)
		);
	}

	_unzip(pathOrBuffer, targetPath, zipInternalPath /* used for plugin generators from GitHub (e.g. TS tutorial) */) {
		const zip = new AdmZip(pathOrBuffer);
		const zipEntries = zip.getEntries();
		zipEntries.forEach((entry) => {
			const match = !entry.isDirectory && entry.entryName.match(/[^\/]+(\/.+)/);
			let entryPath;
			if (zipInternalPath && match && match[1].startsWith(zipInternalPath)) {
				entryPath = path.dirname(match[1].substring(zipInternalPath.length));
			} else if (!zipInternalPath && match) {
				entryPath = path.dirname(match[1]);
			}
			if (entryPath) {
				zip.extractEntryTo(entry, path.join(targetPath, entryPath), false, true);
			}
		});
	}

	determineAppname() {
		return "Easy UI5";
	}

	async prompting() {
		const home = path.join(__dirname, "..", "..");
		const pkgJson = JSON.parse(fs.readFileSync(path.join(home, "package.json"), "utf8"));

		// Have Yeoman greet the user.
		if (!this.options.embedded) {
			this.log(yosay(`Welcome to the ${chalk.red("easy-ui5")} ${chalk.yellow(pkgJson.version)} generator!`));
		}

		// by default we install the easy-ui5 plugin generators into the following folder:
		// %user_dir%/.npm/_generator-easy-ui5/plugin-generators
		let pluginsHome = this.options.pluginsHome;
		if (this.options.verbose) {
			console.info("  Context:");
			console.info(`    - sourceRoot = ${chalk.green(this.sourceRoot())}`);
			console.info(`    - destinationRoot = ${chalk.green(this.destinationRoot())}`);
			console.info("  Options:");
			Object.keys(generatorOptions).forEach((option) => {
				console.info(`    - ${option} = ${chalk.green(this.options[option])}`);
			});
			console.info("  Proxy:");
			console.info(`    - HTTP_PROXY = ${chalk.green(HTTP_PROXY)}`);
			console.info(`    - HTTPS_PROXY = ${chalk.green(HTTPS_PROXY)}`);
			console.info(`    - NO_PROXY = ${chalk.green(NO_PROXY)}`);
		}
		fs.mkdirSync(pluginsHome, { recursive: true });

		// log the plugins and configuration
		if (this.options.plugins) {
			const { createRequire } = await import("node:module");
			const require = createRequire(import.meta.url);

			const yeoman = require("yeoman-environment/package.json");

			const components = {
				"Node.js": process.version,
				"yeoman-environment": yeoman.version,
				"generator-easy-ui5": pkgJson.version,
				home: home,
				pluginsHome: pluginsHome,
			};

			Object.keys(components).forEach((component) => {
				this.log(`${chalk.green(component)}: ${components[component]}`);
			});

			this.log(chalk.green("\nAvailable generators:"));
			glob.sync(`${pluginsHome}/*/package.json`).forEach((plugin) => {
				const name = plugin.match(/.*\/generator-(.+)\/package\.json/)[1];
				const lib = require(plugin);
				this.log(`  - ${chalk.green(name)}: ${lib.version}`);
			});

			return;
		}

		// create the octokit client to retrieve the generators from GH org
		// when not running in offline mode!
		let octokit;
		if (this.options.offline) {
			this.log(`Running in ${chalk.yellow("offline")} mode!`);
		} else {
			// define the options for the Octokit API
			const octokitOptions = {
				userAgent: `${this.rootGeneratorName()}:${this.rootGeneratorVersion()}`,
				auth: this.options.ghAuthToken,
				baseUrl: this.options.ghBaseUrl,
				throttle: {
					onRateLimit: (retryAfter, options) => {
						this.log(`${chalk.yellow("Hit the GitHub API limit!")} Request quota exhausted for this request.`);
						if (options.request.retryCount === 0) {
							// only retries once
							this.log(
								`Retrying after ${retryAfter} seconds. Alternatively, you can cancel this operation and supply an auth token with the \`--ghAuthToken\` option. For more details, run \`yo easy-ui5 --help\`. `
							);
							return true;
						}
					},
					onSecondaryRateLimit: () => {
						// does not retry, only logs a warning
						this.log(`${chalk.red("Hit the GitHub API limit again!")} Please supply an auth token with the \`--ghAuthToken\` option. For more details, run \`yo easy-ui5 --help\` `);
					},
				},
			};
			// create the octokit instance
			octokit = new MyOctokit(octokitOptions);
		}

		// helper for filtering repos with corresponding subGenerator prefix
		const filterReposWithSubGeneratorPrefix = (repos, subGeneratorPrefix) => {
			if (!Array.isArray(repos)) {
				return [];
			}
			return repos
				.filter((repo) => repo.name.startsWith(`${subGeneratorPrefix}`))
				.map((repo) => {
					return {
						org: repo.owner?.login,
						name: repo.name,
						branch: repo.default_branch,
						subGeneratorName: repo.name.substring(subGeneratorPrefix.length),
					};
				});
		};

		// helper to retrieve the available repositories for a GH org
		const listGeneratorsForOrg = async (ghOrg, subGeneratorPrefix, threshold) => {
			const response = await octokit.repos.listForOrg({
				org: ghOrg,
				sort: "name",
				// eslint-disable-next-line camelcase
				per_page: threshold,
			});
			return filterReposWithSubGeneratorPrefix(response?.data, subGeneratorPrefix);
		};

		// helper to retrieve the available repositories for a GH user
		const listGeneratorsForUser = async (ghUser, subGeneratorPrefix) => {
			const response = await octokit.repos.listForUser({
				username: ghUser,
				sort: "name",
				// eslint-disable-next-line camelcase
				per_page: threshold,
			});
			return filterReposWithSubGeneratorPrefix(response?.data, subGeneratorPrefix);
		};

		// determine the generator to be used
		let generator;

		// try to identify whether concrete generator is defined
		if (!generator) {
			// determine generator by ${owner}/${repo}(!${dir})? syntax, e.g.:
			//   > yo easy-ui5 SAP-samples/ui5-typescript-tutorial
			//   > yo easy-ui5 SAP-samples/ui5-typescript-tutorial#1.0
			//   > yo easy-ui5 SAP-samples/ui5-typescript-tutorial\!/generator
			//   > yo easy-ui5 SAP-samples/ui5-typescript-tutorial\!/generator#1.0
			const reGenerator = /([^\/]+)\/([^\!\#]+)(?:\!([^\#]+))?(?:\#(.+))?/;
			const matchGenerator = reGenerator.exec(this.options.generator);
			if (matchGenerator) {
				// derive and path the generator information from command line
				const [owner, repo, dir = "/generator", branch] = matchGenerator.slice(1);
				// the plugin path is derived from the owner, repo, dir and branch
				const pluginPath = `_/${owner}/${repo}${dir.replace(/[\/\\]/g, "_")}${branch ? `#${branch.replace(/[\/\\]/g, "_")}` : ""}`;
				generator = {
					org: owner,
					name: repo,
					branch,
					dir,
					pluginPath,
				};
				// log which generator is being used!
				if (this.options.verbose) {
					this.log(`Using generator ${chalk.green(`${owner}/${repo}!${dir}${branch ? "#" + branch : ""}`)}`);
				}
			}
		}

		// retrieve the available repositories (if no generator is specified specified directly)
		let availGenerators;
		if (!generator) {
			// lookup the non-installed embedded generator(s)
			const generatorsToBeInstalled = glob
				.sync(`${path.join(__dirname, "../../plugins")}/generator-*.zip`)
				.map((file) => {
					const generatorName = path.basename(file, ".zip");
					const generatorPath = path.join(pluginsHome, generatorName);
					return {
						file,
						generatorName,
						generatorPath,
					};
				})
				.filter(({ generatorPath }) => !fs.existsSync(generatorPath));
			// install (unzip) the missing embedded generator(s)
			if (generatorsToBeInstalled.length > 0) {
				this._showBusy("  Installing embedded subgenerators...");
				generatorsToBeInstalled.map(({ file, generatorName, generatorPath }) => {
					this._showBusy(`  Installing embedded subgenerator ${chalk.yellow(generatorName)}...`);
					this._unzip(file, generatorPath);
				});
				this._clearBusy(true);
			}
			// offline mode means local generators only versus only mode
			if (this.options.offline) {
				availGenerators = glob.sync(`${pluginsHome}/generator-*/package.json`).map((plugin) => {
					const match = plugin.match(/.*\/(generator-(.+))\/package\.json/);
					return {
						org: "local",
						name: match[1],
						subGeneratorName: match[2].match(/(?:ui5-)?(.*)/)?.[1] || match[2],
						local: true,
					};
				});
			} else {
				// either lookup the generators from bestofui5.org (next option)
				// or fetch it from the ui5-community gh organization
				if (this.options.next) {
					// check bestofui5.org for generators
					try {
						const response = await request({
							method: "GET",
							url: "https://raw.githubusercontent.com/ui5-community/bestofui5-data/live-data/data/data.json",
						});
						const data = JSON.parse(response.data);

						availGenerators = data?.packages
							?.filter((entry) => {
								return entry.type === "generator";
							})
							.map((entry) => {
								return {
									org: entry.gitHubOwner,
									name: entry.gitHubRepo,
									subGeneratorName: entry.gitHubRepo.match(/(?:generator-(?:ui5-)?)(.*)/)?.[1] || entry.gitHubRepo,
								};
							});
					} catch (e) {
						console.error("Failed to connect to bestofui5.org to retrieve all available generators! Run with --verbose for details!");
						if (this.options.verbose) {
							console.error(e);
						}
						return;
					}
				} else {
					// check the main GH org for generators
					try {
						availGenerators = await listGeneratorsForOrg(this.options.ghOrg, this.options.subGeneratorPrefix, this.options.ghThreshold);
					} catch (e) {
						console.error(`Failed to connect to GitHub to retrieve all available generators for "${this.options.ghOrg}" organization! Run with --verbose for details!`);
						if (this.options.verbose) {
							console.error(e);
						}
						return;
					}

					// check the additional GH org for generators with a different prefix
					try {
						if (this.options.addGhOrg && this.options.addSubGeneratorPrefix) {
							availGenerators = availGenerators.concat(await listGeneratorsForOrg(this.options.addGhOrg, this.options.addSubGeneratorPrefix, this.options.ghThreshold));
						}
					} catch (e) {
						if (this.options.verbose) {
							this.log(`Failed to connect to GitHub retrieve additional generators for "${this.options.addGhOrg}" organization! Try to retrieve for user...`);
						}
						try {
							availGenerators = availGenerators.concat(await listGeneratorsForUser(this.options.addGhOrg, this.options.addSubGeneratorPrefix, this.options.ghThreshold));
						} catch (e1) {
							console.error(`Failed to connect to GitHub to retrieve additional generators for organization or user "${this.options.addGhOrg}"! Run with --verbose for details!`);
							if (this.options.verbose) {
								console.error(e1);
							}
							return;
						}
					}
				}
			}
		}

		// if no generator is provided and doesn't exist, ask for generator name
		if (!generator) {
			// check for provided generator being available on GH
			generator = this.options.generator && availGenerators.find((repo) => repo.subGeneratorName === this.options.generator);

			// if no generator is provided and doesn't exist, ask for generator name
			if (this.options.generator && !generator) {
				this.log(`The generator ${chalk.red(this.options.generator)} was not found. Please select an existing generator!`);
			}

			// still not found, select a generator
			if (!generator) {
				const generatorIdx = (
					await this.prompt([
						{
							type: "list",
							name: "generator",
							message: "Select your generator?",
							choices: availGenerators.map((availGenerator, idx) => ({
								name: `${availGenerator.subGeneratorName}${this.options.addGhOrg ? ` [${availGenerator.org}]` : ""}`,
								value: idx,
							})),
						},
					])
				).generator;
				generator = availGenerators[generatorIdx];
			}
		}

		let generatorPath = path.join(pluginsHome, generator.pluginPath || generator.name);
		if (!this.options.offline) {
			// lookup the default path of the generator if not set
			if (!generator.branch) {
				try {
					const repoInfo = await octokit.repos.get({
						owner: generator.org,
						repo: generator.name,
					});
					generator.branch = repoInfo.data.default_branch;
				} catch (e) {
					console.error(`Generator "${owner}/${repo}!${dir}${branch ? "#" + branch : ""}" not found! Run with --verbose for details!`);
					if (this.options.verbose) {
						console.error(e);
					}
					return;
				}
			}
			// fetch the branch to retrieve the latest commit SHA
			let commitSHA;
			try {
				// determine the commitSHA
				const reqBranch = await octokit.repos.getBranch({
					owner: generator.org,
					repo: generator.name,
					branch: generator.branch,
				});
				commitSHA = reqBranch.data.commit.sha;
			} catch (ex) {
				console.error(chalk.red(`Failed to retrieve the branch "${generator.branch}" for repository "${generator.name}" for "${generator.org}" organization! Run with --verbose for details!`));
				if (this.options.verbose) {
					console.error(chalk.red(ex.message));
				}
				return;
			}

			if (this.options.verbose) {
				this.log(`Using commit ${commitSHA} from @${generator.org}/${generator.name}#${generator.branch}!`);
			}
			const shaMarker = path.join(generatorPath, `.${commitSHA}`);

			if (fs.existsSync(generatorPath) && !this.options.skipUpdate) {
				// check if the SHA marker exists to know whether the generator is up-to-date or not
				if (this.options.forceUpdate || !fs.existsSync(shaMarker)) {
					if (this.options.verbose) {
						this.log(`Generator ${chalk.yellow(generator.name)} in "${generatorPath}" is outdated!`);
					}
					// remove if the SHA marker doesn't exist => outdated!
					this._showBusy(`  Deleting subgenerator ${chalk.yellow(generator.name)}...`);
					fs.rmSync(generatorPath, { recursive: true });
				}
			}

			// re-fetch the generator and extract into local plugin folder
			if (!fs.existsSync(generatorPath)) {
				// unzip the archive
				if (this.options.verbose) {
					this.log(`Extracting ZIP to "${generatorPath}"...`);
				}
				this._showBusy(`  Downloading subgenerator ${chalk.yellow(generator.name)}...`);
				const reqZIPArchive = await octokit.repos.downloadZipballArchive({
					owner: generator.org,
					repo: generator.name,
					ref: commitSHA,
				});

				this._showBusy(`  Extracting subgenerator ${chalk.yellow(generator.name)}...`);
				const buffer = Buffer.from(new Uint8Array(reqZIPArchive.data));
				this._unzip(buffer, generatorPath, generator.dir);

				// write the sha marker
				fs.writeFileSync(shaMarker, commitSHA);
			}

			// only when embedding we clear the busy state as otherwise
			// the npm install will immediately again show the busy state
			if (this.options.embed) {
				this._clearBusy(true);
			}
		}

		// do not execute the plugin generator during the setup/embed mode
		if (!this.options.embed) {
			// filter the local options and the help command
			const opts = Object.keys(this._options).filter((optionName) => !(generatorOptions.hasOwnProperty(optionName) || optionName === "help"));

			// run npm install (always for self-healing!)
			if (this.options.verbose) {
				this.log("Installing the subgenerator dependencies...");
			}
			this._showBusy(`  Preparing ${chalk.yellow(generator.name)}...`);
			await this._npmInstall(generatorPath, this.options.pluginsWithDevDeps);
			this._clearBusy(true);

			// create the env for the plugin generator
			let env = this.env; // in case of Yeoman UI the env is injected!
			if (!env) {
				const yeoman = require("yeoman-environment");
				env = yeoman.createEnv(this.args, opts);
			}

			// helper to derive the subcommand
			function deriveSubcommand(namespace) {
				const match = namespace.match(/[^:]+:(.+)/);
				return match ? match[1] : namespace;
			}

			// filter the hidden subgenerators already
			//   -> subgenerators must be found in env as they are returned by lookup!
			const lookupGeneratorMeta = await env.lookup({ localOnly: true, packagePaths: generatorPath });
			let subGenerators = lookupGeneratorMeta.filter((sub) => {
				const subGenerator = env.get(sub.namespace);
				return !subGenerator.hidden;
			});

			// list the available subgenerators in the console (as help)
			if (this.options.list) {
				let maxLength = 0;
				this.log(
					subGenerators
						.map((sub) => {
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
						}, `Subcommands (${subGenerators.length}):`)
				);
				return;
			}

			// if a subcommand is provided as argument, identify the matching subgenerator
			// and remove the rest of the subgenerators from the list for later steps
			if (this.options.subcommand) {
				const selectedSubGenerator = subGenerators.filter((sub) => {
					// identify the subgenerator by subcommand
					return new RegExp(`:${this.options.subcommand}$`).test(sub.namespace);
				});
				if (selectedSubGenerator.length == 1) {
					subGenerators = selectedSubGenerator;
				} else {
					this.log(`The generator ${chalk.red(this.options.generator)} has no subcommand ${chalk.red(this.options.subcommand)}. Please select an existing subcommand!`);
				}
			}

			// transform the list of the subgenerators and identify the
			// default subgenerator for the default selection
			let defaultSubGenerator;
			let maxLength = 0;
			subGenerators = subGenerators
				.map((sub) => {
					const subGenerator = env.get(sub.namespace);
					let subcommand = deriveSubcommand(sub.namespace);
					let displayName = subGenerator.displayName || subcommand;
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
					this.log(`Calling ${chalk.red(subGenerator)}...\n  \\_ in "${generatorPath}"`);
				}

				// finally, run the subgenerator
				env.run(subGenerator, {
					verbose: this.options.verbose,
					embedded: true,
					destinationRoot: this.destinationRoot(),
				});
			} else {
				this.log(`The generator ${chalk.red(this.options.generator)} has no visible subgenerators!`);
			}
		} else {
			// zip the content of the plugin generator or
			// install the dependencies of the generator
			if (this.options.verbose) {
				this.log(`Embedding plugin generator ${chalk.yellow(generator.name)}...`);
			}
			const generatorZIP = new AdmZip();
			const addLocalFile = (file) => {
				const filePath = path.join(generator.name, path.relative(generatorPath, file));
				generatorZIP.addLocalFile(file, path.dirname(filePath), path.basename(filePath));
				if (this.options.verbose) {
					this.log(`  + file: ${file}`);
				}
			};
			glob.sync(`${generatorPath}/*`, { nodir: true, dot: true }).forEach(addLocalFile);
			glob.sync(`${generatorPath}/!(node_modules)/**/*`, { nodir: true, dot: true }).forEach(addLocalFile);
			const generatorZIPPath = path.join(__dirname, "../../plugins", `${generator.name}.zip`);
			generatorZIP.writeZip(generatorZIPPath);
			if (this.options.verbose) {
				this.log(`Stored plugin generator ${chalk.yellow(generator.name)} zip to "${generatorZIPPath}"!`);
			}
		}
	}
}
