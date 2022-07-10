import { readdirSync } from 'fs'
import path from 'path'
import { Command } from 'commander'
import { TreeValue } from 'omelette'
import { createNewCommand } from './hygen'

// TODO - add option to open editor?
const RESERVED_COMMANDS_REGEXP = ['new', 'link', 'implode'].map(
	c => new RegExp(`${c}.(j|t)s`),
)

const COMMANDS_DIR = '../commands'
const DIR = path.resolve(__dirname, COMMANDS_DIR)

// loads user commands
export function loadCommands(program: Command) {
	const cmds = readdirSync(DIR).filter(f => f.match(/\.(t|j)s$/))

	cmds.forEach(file => {
		if (RESERVED_COMMANDS_REGEXP.find(reg => reg.test(file))) {
			return console.warn(`"${file}" command matches built in, skipping`)
		}
		require(`./${COMMANDS_DIR}/${file}`)
	})
}

type Branch = Record<string, any> | []

// generates a tree of all commands + sub/nested commands used for omelette autocomplete
export function generateCommandTree(program: Command) {
	const tree: TreeValue = {}

	program.commands.forEach(c => walk(c, tree))
	function walk(cmd: Command, tree: any) {
		const name = cmd.name()

		let branch: Branch = []
		if (cmd.commands.length) {
			branch = {}
			cmd.commands.forEach(c => walk(c, branch))
		}
		tree[name] = branch
	}

	return tree
}

export function addBuiltInCommands(program: Command) {
	program
		.command('new')
		.description('Creates a new command')
		.action(() => {
			createNewCommand()
		})

	program
		.command('implode')
		.description('Unlinks and removes')
		.action(() => {
			console.log('TODO')
		})
}
