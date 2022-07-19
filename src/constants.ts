import path from 'path'

export const RELATIVE_COMMANDS_DIR = '../commands'
export const COMMANDS_DIR = path.resolve(__dirname, RELATIVE_COMMANDS_DIR)

export const COMMAND_SUFFIX = 'command'
export const generateCommandFilename = (name: string) => `${name}.${COMMAND_SUFFIX}.ts`

export const RESERVED_COMMANDS = ['new', 'dev', 'implode']
