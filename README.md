# CHANGELOG MAKE

## Description

This is a simple CLI script for making easier to write individual changelog files to your project. Each developer should run this script everytime they start a new task, enabling quickly filling changelog data such as task id, description, section and type of implementation.

### Instalation

> npm i changelog-make

### Usage

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