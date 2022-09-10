"use strict";
const spawn = require("cross-spawn");
const fs = require("fs");
const { rm } = require("fs").promises;
const path = require("path");
const { hasYarn } = require("yarn-or-npm");
const { Octokit } = require("@octokit/rest");
const { throttling } = require("@octokit/plugin-throttling");
const MyOctokit = Octokit.plugin(throttling);
const AdmZip = require("adm-zip");

// helper to retrieve config entries from npm
//   --> npm config set easy-ui5_addGhOrg XYZ
const NPM_CONFIG_PREFIX = "easy-ui5_";
let npmConfig;
const getNPMConfig = (configName) => {
	if (!npmConfig) {
		npmConfig = require("libnpmconfig").read();
	}
	return npmConfig && npmConfig[`${NPM_CONFIG_PREFIX}${configName}`];
};

const ghOrg = "ui5-community",
	repoName = "generator-ui5-project",
	branch = "main",
	ghAuthToken = getNPMConfig("ghAuthToken");

(async () => {
	let _busy;

	function showBusy(statusText) {
		clearBusy();
		const progressChars = ["\\", "|", "/", "-"];
		let i = 0;
		process.stdout.write(`\r${statusText}  `);
		_busy = {
			text: statusText,
			timer: setInterval(() => {
				process.stdout.write(`\r${statusText} ${progressChars[i++]}`);
				i %= progressChars.length;
			}, 250),
		};
	}

	function clearBusy(newLine) {
		if (_busy) {
			clearInterval(_busy.timer);
			process.stdout.write("\r".padEnd(_busy.text.length + 3) + (newLine ? "\n" : ""));
			_busy = null;
		}
	}

	const pkg = require(path.join(__dirname, "../../package.json"));
	console.log(`${pkg.name}:${pkg.version} - ${ghAuthToken}`);
	const octokit = new MyOctokit({
		userAgent: `${pkg.name}:${pkg.version}`,
		auth: ghAuthToken,
		throttle: {
			onRateLimit: (retryAfter, options) => {
				console.log("Hit the GitHub API limit! Request quota exhausted for this request.");
				if (options.request.retryCount === 0) {
					// only retries once
					this.log(`Retrying after ${retryAfter} seconds. Alternatively, you can cancel this operation and supply an auth token with "npm config set easy-ui5_ghAuthToken ghp_xxxx".`);
					return true;
				}
			},
			onAbuseLimit: () => {
				// does not retry, only logs a warning
				console.error('Hit the GitHub API limit again! Please supply an auth token with with "npm config set easy-ui5_ghAuthToken ghp_xxxx".');
			},
		},
	});

	const reqBranch = await octokit.repos.getBranch({
		owner: ghOrg,
		repo: repoName,
		branch,
	});

	const commitSHA = reqBranch.data.commit.sha;

	// eslint-disable-next-line
	console.log(`Using commit ${commitSHA} from @${ghOrg}/${repoName}#${branch}...`);
	const generatorPath = path.join(__dirname, "../../plugin-generators", repoName);
	const shaMarker = path.join(generatorPath, `.${commitSHA}`);

	if (fs.existsSync(generatorPath)) {
		// check if the SHA marker exists to know whether the generator is up-to-date or not
		if (!fs.existsSync(shaMarker)) {
			// eslint-disable-next-line
			console.log(`Fetching new ZIP as the default generator is outdated...`);
			// remove if the SHA marker doesn't exist => outdated!
			showBusy("  Removing old default templates");
			await rm(generatorPath, { recursive: true });
		}
	}

	// re-fetch the generator and extract into local plugin folder
	if (!fs.existsSync(generatorPath)) {
		console.log("Extracting default templates...");
		showBusy("  Downloading and extracting default templates");
		const reqZIPArchive = await octokit.repos.downloadZipballArchive({
			owner: ghOrg,
			repo: repoName,
			ref: commitSHA,
		});
		const buffer = Buffer.from(new Uint8Array(reqZIPArchive.data));
		const zip = new AdmZip(buffer);
		const zipEntries = zip.getEntries();
		zipEntries.forEach((entry) => {
			const match = !entry.isDirectory && entry.entryName.match(/[^\/]+\/(.+)/);
			if (match) {
				const entryPath = match[1].slice(0, entry.name.length * -1);
				zip.extractEntryTo(entry, path.join(generatorPath, entryPath), false, true);
			}
		});
		fs.writeFileSync(shaMarker, commitSHA);

		// run yarn/npm install
		console.log("Installing the plugin dependencies...");
		showBusy("  Preparing the default templates");
		await new Promise(
			function (resolve, reject) {
				spawn(hasYarn() ? "yarn" : "npm", ["install", "--no-progress", "--ignore-engines"], {
					stdio: "inherit",
					cwd: generatorPath,
					env: {
						...process.env,
						NO_UPDATE_NOTIFIER: true,
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

	clearBusy(true);
})();
