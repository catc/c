import { runner, Logger } from 'hygen'
import path from 'path'

const defaultTemplates = path.join(__dirname, '_templates')


function run(template: string){
  const args = template.split(' ')
  runner(args, {
    templates: defaultTemplates,
    cwd: process.cwd(),
    logger: new Logger(console.log.bind(console)),
    createPrompter: () => require('enquirer'),
    exec: (action, body) => {
      const opts = body && body.length > 0 ? { input: body } : {}
      console.log(action, body)
      return require('execa').shell(action, opts)
    },
  })  
}

export const createNewCommand = () => run('command new')
export const initCLI = () => run('init new --name foooo')
