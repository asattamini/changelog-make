#!/usr/bin/env node
import addChangelog from "./scripts/add";
import read from "./scripts/read";
import updateFile from "./scripts/updateFile";
import release from "./scripts/release";

const parameters = process.argv.slice(2);

if (!parameters || parameters.length === 0) {
  throw new Error("Invalid parameter");
}

const checkValidParams = () => {
  const validParams = [
    "--add",
    "--updateFile",
    "--help",
    "--read",
    "--release",
    "--major",
    "--minor",
    "--patch",
    "--no-push",
  ];

  const releaseParams = ["--major", "--minor", "--patch"];

  if (parameters.length > 1 && parameters[0] !== "--release") {
    throw new Error("Invalid parameters. Use --help for usage");
  }

  if (
    parameters.length === 3 &&
    parameters[0] !== "--release" &&
    parameters[2] !== "--no-push"
  ) {
    throw new Error("Invalid parameters. Use --help for usage");
  }

  parameters.map((param) => {
    if (!validParams.includes(param)) {
      throw new Error("Invalid parameter name. Use --help for usage");
    }
    if (param === "--release" && !releaseParams.includes(parameters[1])) {
      throw new Error(
        "Invalid semver type for --release. Please use --major, --minor or --patch"
      );
    }
  });
};

checkValidParams();
const command = parameters[0];
switch (command) {
  case "--add":
    console.log("Let's create your changelog file... this will be quick");
    addChangelog();
    break;
  case "--updateFile":
    console.log("Let's update your changelog file... this will be quick");
    updateFile();
    break;
  case "--read":
    console.log("Let's read your changelog file... this will be quick");
    read();
    break;
  case "--release":
    console.log("Let's start your release process... this will be quick");
    const git = parameters[2] && parameters[2] === "--no-push" ? false : true;
    release(parameters[1], git);
    break;
  case "--help":
    console.log(
      "Changelog Make. Add records and release your project with ease.",
      "\n",
      "USAGE",
      "\n",
      "changelog-make [COMMAND]",
      "\n",
      "COMMANDS",
      "\n",
      "--add    adds a new record to changelog folder",
      "\n",
      "--updateFile   adds all records in changelog folder to UNRELEASED of CHANGELOG.md",
      "\n",
      "--read   reads all records in changelog folder and prints to console",
      "\n",
      "--release [--major --minor --patch] [--no-push]  updates version in manifest.json and CHANGELOG.md, and creates a new tag in git. Use --no-push to avoid pushing to remote"
    );
    break;
}
