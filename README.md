# CHANGELOG MAKE

## Description

This is a simple node script for making easier to write individual changelog files to your project. Each developer should run this script everytime they start a new task, enabling quickly filling changelog data such as task id, description, section and type of implementation.

### Instalation

> npm install --save-dev changelog-make

### Usage

For major 0:

Simply create a script and import the package:

```
import ask from 'changelog-make';
ask();
```

Then, you can add this to your scripts section on package.json:

```
scripts: {
  "changelog:make": "node ./scripts/changelog-make.js 
}
```

For major 1:

Simply use npx:

```npx changelog-make --option```

Options:

--add Adds a record to changelog folder
--updateChangelog add all records in changelog folder do UNRELEASED section of CHANGELOG.md