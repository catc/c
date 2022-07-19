import { program } from 'commander'

import { handleAutocomplete, setupAutoCompleteOptions } from './autocomplete'
import { addBuiltInCommands, loadCommands } from './commands'

export default function setup(programName: string) {
	program
		.name(programName)
		.action(() => {
			if (handleAutocomplete(program)) return

			// console.error('Unsupported command')
		})
		.showHelpAfterError()

	// adds options to support shell autocomplete
	setupAutoCompleteOptions(program)

	// adds default commands (new, implode)
	addBuiltInCommands(program)

	// loads all commands from `<root>/commands/`
	loadCommands(program)

	program.parse()
}
