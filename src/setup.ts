import { program } from 'commander'

import { handleAutocomplete, setupAutoCompleteOptions } from './autocomplete'
import { loadCommands } from './commands'

export default function setup(programName: string){
  program
    .name(programName)
    .action(() => {
      handleAutocomplete(program)

      // TODO - add support for other default commands
    })

  // adds options to support shell autocomplete
  setupAutoCompleteOptions(program)

  // loads all commands from `root/cmds`
  loadCommands(program)
  
  program.parse();
}

