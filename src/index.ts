#!/usr/bin/env node
import addChangelog from "./scripts/add";
import read from "./scripts/read";
import updateFile from "./scripts/updateFile";

const parameters = process.argv.slice(2);

if (!parameters || parameters.length === 0) {
  throw new Error("Invalid parameter");
}

const checkValidParams = () => {
  const validParams = ["--add", "--updateFile", "--help", "--read"];

  if (parameters.length > 1) {
    throw new Error("Invalid number of parameters. Use --help for usage");
  }

  parameters.map((param) => {
    if (!validParams.includes(param)) {
      throw new Error("Invalid paramenter name. Use --help for usage");
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
  case "--help":
    console.log(
      "Please use one of the following options:",
      "\n",
      "--add -> adds a new record to changelog folder",
      "\n",
      "--updateFile -> adds all records in changelog folder to UNRELEASED of CHANGELOG.md",
      "\n",
      "--read -> reads all records in changelog folder and prints to console"
    );
    break;
}
