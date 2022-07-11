import { Option, Command, OptionValues } from 'commander'
import omelette from 'omelette'
import { generateCommandTree } from './commands'

const COMPLETION_KEYWORDS = new Set([
	'completion',
	'completion-fish',
	'compzsh',
	'compbash',
	'compfish',
	'compgen',
])

export function hasCompletionOption(opts: OptionValues) {
	return Object.keys(opts).find(opt => COMPLETION_KEYWORDS.has(opt))
}

function generateAutocomplete(program: Command) {
	omelette(program.name()).tree(generateCommandTree(program)).init()
}

// returns shell autocomplete text
export function handleAutocomplete(program: Command) {
	const opts = program.opts()
	if (hasCompletionOption(opts)) {
		generateAutocomplete(program)
	}
}

// adds options to program to support autocomplete
export function setupAutoCompleteOptions(program: Command) {
	COMPLETION_KEYWORDS.forEach(opt => {
		program.addOption(new Option(`--${opt}`).hideHelp())
	})
}
