import fs from 'fs';
import pkg from 'enquirer';
// @ts-ignore
const { Input, Select } = pkg;

console.log("Let's create your changelog file... this will be quick")

const taskAsk =  {
  type: 'input',
  name: 'task',
  message: 'Please enter the Task Number. Such as DEV-1000',
  validate: (item:string) => {
    const pattern = /^[A-Z]+(-)[0-9]+/;
    return pattern.test(item)
  }
};

const descriptionAsk = {
  type: 'input',
  name: 'Description',
  message: 'Please enter a simple description of the task.'
}

const sectionAsk = {
  type: 'input',
  name: 'section',
  message: 'Please enter the section of the task. Such as HEADER, PDP, FOOTER',
  validate: (item:string) => {
    const pattern = /^[A-Z]+/;
    return pattern.test(item)
  }
}

const ask = async () => {

  const task = await new Input(taskAsk).run();
  const message = await new Input(descriptionAsk).run();
  const section = await new Input(sectionAsk).run();

  const promptSelect = new Select({
    name: 'Type of changelog',
    message: 'Pick an option',
    choices: ['Fixed', 'Added', 'Changed', 'Hotfix'],
  })

  const type = await promptSelect.run()

  const header = `### ${type}\r\n`
  const content = `${task} - [${section}] - ${message}`

  const file = `./changelog/${task}.md`

  try {
    fs.writeFileSync(file, header, { encoding: 'utf-8' })
    fs.promises.appendFile(file, content)
  } catch (error) {
    console.log('Some error occurred while trying to save de file. Make sure you have a folder named changelog on the project root');
    process.exit(0)
  }


  console.log(`GREAT, YOUR TASK IS ${task}`)
  console.log(`GREAT, YOUR MESSAGE IS ${message}`)
  console.log(`GREAT, YOUR SECTION IS ${section}`)
  console.log(`GREAT, YOUR TYPE IS ${type}`)
  console.log(`Now your changelog file has been created under CHANGELOG folder`)
  console.log(`Happy Coding :)`)
}

export default ask
