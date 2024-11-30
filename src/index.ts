#!/usr/bin/env node
import addChangelog from "./scripts/add";

const parameters = process.argv.slice(2);

if (!parameters || parameters.length === 0 ) {
   throw new Error('Invalid parameter')
}

const checkValidParams = () => {
   const validParams = ['--add', '--updateFile', '--help']

   parameters.map(param => {
      if(!validParams.includes(param)) {
         throw new Error('Invalid paramenter name. Use --help for usage')
      }
   })
}

checkValidParams()

parameters.forEach(command => {
   if(command === '--add') {
      console.log("Let's create your changelog file... this will be quick")
      addChangelog()
   }
   if(command === '--updateFile') {
     console.log('To be implemented')
   }
   if(command === '--help') {
      console.log('Please use one of the following options:', '\n', '--add -> adds a new record to changelog folder', '\n', '--updateFile -> adds all records in changelog folder to UNRELEASED of CHANGELOG.md')
    }
})
