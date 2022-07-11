export const RESERVED_COMMANDS = ['new', 'dev', 'implode']
export const RESERVED_COMMANDS_REGEXP = RESERVED_COMMANDS.map(
	c => new RegExp(`${c}.(j|t)s`),
)
