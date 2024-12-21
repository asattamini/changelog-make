import fs, { readFile } from "fs";
import path from "path";
import { execSync } from "child_process";
import editJsonFile from "edit-json-file";

export = function release(parameter: string, git: boolean) {
  const fullPath = path.dirname(require.main?.filename || "");
  const regexResp = /^(.*?)node_modules/.exec(fullPath);
  const rootPath = regexResp ? regexResp[1] : fullPath;

  readFile(`${rootPath}/manifest.json`, "utf8", async (err, data) => {
    if (err) {
      throw new Error("Error while reading Manifest.json:");
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

  function merge(a: string[], b: string[], i = 0) {
    return a.slice(0, i).concat(b, a.slice(i));
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

  function updateRelease(version: string) {
    let arrayVersion = version.split(".");
    let newVersion = "";

    switch (parameter) {
      case "--major":
        newVersion = [parseInt(arrayVersion[0]) + 1, 0, 0].join(".");
        updateVersion(newVersion);
        break;
      case "--minor":
        newVersion = [
          parseInt(arrayVersion[0]),
          parseInt(arrayVersion[1]) + 1,
          0,
        ].join(".");
        updateVersion(newVersion);
        break;
      case "--patch":
        newVersion = [
          parseInt(arrayVersion[0]),
          parseInt(arrayVersion[1]),
          parseInt(arrayVersion[2]) + 1,
        ].join(".");
        updateVersion(newVersion);
        break;
    }

    console.log("\x1b[33m%s\x1b[0m", `Current version: ${version}`);
    console.log("\x1b[32m%s\x1b[0m", `New version: ${newVersion}`);
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
      updateChangelog(version);
    } catch (err) {
      throw err;
    }
  }

  function updateChangelog(version: string) {
    const date = new Date();
    const newLineChangeLog = `## [${version}] - ${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    try {
      const data = fs
        .readFileSync(`${rootPath}/CHANGELOG.md`, "utf8")
        .split(/\r?\n/);
      let ref;
      data.forEach((line, idx) => {
        line = line.trim();
        if (line.includes("## [Unreleased]")) {
          ref = idx + 1;
        }
      });

      const newVersionArr = [newLineChangeLog];

      const finalArray = merge(data, newVersionArr, ref);

      let newChangelog = finalArray.join("\n");

      fs.writeFileSync(`${rootPath}/CHANGELOG.md`, newChangelog, {
        encoding: "utf-8",
      });

      if (git) {
        commitAndPush(version);
      }
    } catch (err) {
      throw err;
    }
  }

  function commitAndPush(version: string) {
    try {
      executeGitCommand(`git checkout -b release/${version}`);
      executeGitCommand(`git add .`);
      executeGitCommand(`git commit -m "chore: release ${version}"`);
      executeGitCommand(`git tag ${version} -m "${version}"`);
      executeGitCommand(`git push origin ${version}`);
      executeGitCommand(`git push origin release/${version}`);
      console.log(
        "\x1b[32m%s\x1b[0m",
        `✅ Release ${version} created successfully!`
      );
    } catch (e) {
      throw e;
    }
  }
};
