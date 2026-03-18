import fs, { readFile } from "fs";
import path from "path";
import { execSync } from "child_process";
import editJsonFile from "edit-json-file";

export = function releaseBeta(parameter: string, git: boolean) {
  const fullPath = path.dirname(require.main?.filename || "");
  const regexResp = /^(.*?)node_modules/.exec(fullPath);
  const rootPath = regexResp ? regexResp[1] : fullPath;

  readFile(`${rootPath}/manifest.json`, "utf8", async (err, data) => {
    if (err) {
      throw new Error("Error while reading Manifest.json:"), err;
    }

    try {
      const jsonData = JSON.parse(data);

      if (!jsonData.version) {
        throw new Error("Error while reading Manifest.json. No version found.");
      }

      updateRelease(jsonData.version);
    } catch (parseError) {
      throw parseError;
    }
  });

  function executeGitCommand(command: string) {
    return execSync(command)
      .toString("utf8")
      .replace(/[\n\r\s]+$/, "");
  }

  function checkBranch(branch: string) {
    if (branch !== "develop" && branch !== "master") {
      throw new Error(
        'Please, run this script on "develop" or "master" branch.'
      );
    }
  }

  const branch = executeGitCommand("git branch --show-current");

  checkBranch(branch);

  function iterateBeta(beta:string) {

    const hyphenIndex = beta.lastIndexOf("-")
    const betaVersion = beta.substring(hyphenIndex + 1)
    const finalBeta = parseInt(betaVersion) + 1
    return beta.substring(0, hyphenIndex) + "-" + finalBeta.toString()
    
}

  function updateRelease(version: string) {
    let arrayVersion = version.split(".");
    let newVersion = "";

    const isAlreadyBeta = arrayVersion[2].includes('beta')

    switch (parameter) {
      case "--major":
        newVersion = isAlreadyBeta ? iterateBeta(version) : [parseInt(arrayVersion[0]) + 1, 0, 0].join(".") + "-ppr-beta-0";
        updateVersion(newVersion);
        break;
      case "--minor":
        newVersion = isAlreadyBeta ? iterateBeta(version) : 
        [
          parseInt(arrayVersion[0]),
          parseInt(arrayVersion[1]) + 1,
          0,
        ].join(".") + "-ppr-beta-0";
        updateVersion(newVersion);
        break;
      case "--patch":
        newVersion = isAlreadyBeta ? iterateBeta(version) : 
        [
          parseInt(arrayVersion[0]),
          parseInt(arrayVersion[1]),
          parseInt(arrayVersion[2]) + 1,
        ].join(".") + "-ppr-beta-0";
        updateVersion(newVersion);
        break;
    }

    console.log("\x1b[33m%s\x1b[0m", `Current version: ${version}`);
    console.log("\x1b[32m%s\x1b[0m", `Beta version: ${newVersion}`);
  }

  function updateVersion(version: string) {
    console.log("version", version);
    const files = ["manifest"];

    try {
      files.map((file) => {
        let data = editJsonFile(`${rootPath}/${file}.json`, {
          autosave: true,
        });
        data.set("version", `${version}`);
        data.save();
      });
      pushGitVersion(version)
    } catch (err) {
      throw err;
    }
  }

  function pushGitVersion(version: string) {
    try {
      executeGitCommand(`git checkout -b release/${version}`);
      executeGitCommand(`git add .`);
      executeGitCommand(`git commit -m "chore: beta release ${version}"`);
      executeGitCommand(`git tag ${version} -m "${version}"`);
      executeGitCommand(`git push origin ${version}`);
      executeGitCommand(`git push origin release/${version}`);
      console.log(
        "\x1b[32m%s\x1b[0m",
        `✅ Beta Release ${version} created successfully!`
      );
    } catch (e) {
      throw e;
    }
  }
};
