"use strict";
const spawn = require("cross-spawn");
const fs = require("fs");
const path = require("path");
const { Octokit } = require("@octokit/rest");
const AdmZip = require("adm-zip");

const ghOrg = "ui5-community",
  repoName = "generator-ui5-project",
  branch = "main";

(async () => {
  const octokit = new Octokit({
    userAgent: "generator-easy-ui5",
  });

  const reqBranch = await octokit.repos.getBranch({
    owner: ghOrg,
    repo: repoName,
    branch,
  });

  const commitSHA = reqBranch.data.commit.sha;

  // eslint-disable-next-line
  console.log(
    `Fetching ZIP for commit ${commitSHA} from @${ghOrg}/${repoName}#${branch}...`
  );
  const generatorPath = path.join(
    __dirname,
    "../../plugin-generators",
    repoName
  );
  const shaMarker = path.join(generatorPath, `.${commitSHA}`);

  if (fs.existsSync(generatorPath)) {
    // check if the SHA marker exists to know whether the generator is up-to-date or not
    if (!fs.existsSync(shaMarker)) {
      // eslint-disable-next-line
      console.log(`generator in ${generatorPath} is outdated...`);
      // remove if the SHA marker doesn't exist => outdated!
      fs.rmdirSync(generatorPath, { recursive: true });
    }
  }

  if (!fs.existsSync(generatorPath)) {
    // eslint-disable-next-line
    console.log(`Extracting ZIP to ${generatorPath}...`);
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
        zip.extractEntryTo(
          entry,
          path.join(generatorPath, entryPath),
          false,
          true
        );
      }
    });
    fs.writeFileSync(shaMarker, commitSHA);

    // eslint-disable-next-line
    console.log("Installing the plugin...");
    spawn.sync(shouldUseYarn() ? "yarn" : "npm", ["install"], {
      stdio: "ignore",
      cwd: generatorPath,
    });
  }
})();

function shouldUseYarn() {
  try {
    spawn.sync("yarnpkg --version", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}
