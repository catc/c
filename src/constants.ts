import path from 'path'

export const RELATIVE_COMMANDS_DIR = '../commands'
export const COMMANDS_DIR = path.resolve(__dirname, RELATIVE_COMMANDS_DIR)

export const RESERVED_COMMANDS = ['new', 'dev', 'implode']
export const RESERVED_COMMANDS_REGEXP = RESERVED_COMMANDS.map(
	c => new RegExp(`${c}.(j|t)s`),
)
