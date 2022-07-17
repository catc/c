import { readdirSync } from 'fs'
import path from 'path'
import { Command } from 'commander'
import { TreeValue } from 'omelette'
import { createNewCommand } from './hygen'
import { prompt } from 'enquirer'
import { commandSync } from 'execa'
import { RESERVED_COMMANDS_REGEXP } from './constants'

const RELATIVE_COMMANDS_DIR = '../commands'
const COMMANDS_DIR = path.resolve(__dirname, RELATIVE_COMMANDS_DIR)

// loads user commands
export function loadCommands(program: Command) {
	const cmds = readdirSync(COMMANDS_DIR).filter(f => f.match(/\.(t|j)s$/))

	cmds.forEach(file => {
		if (RESERVED_COMMANDS_REGEXP.find(reg => reg.test(file))) {
			return console.warn(`"${file}" command matches built in, skipping`)
		}
		require(`./${RELATIVE_COMMANDS_DIR}/${file}`)
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
		.description('Creates a new command file')
		.action(async () => {
			await createNewCommand()
			console.log(
				`\nDo \`${program.name()} dev\` to open commands/ dir (if you have vscode).`,
			)
		})

	program
		.command('dev')
		.description('Opens commands/ folder in vscode')
		.action(() => {
			const commandsDir = path.resolve(process.cwd(), './commands')
			try {
				commandSync(`code ${commandsDir}`, { shell: true })
			} catch (err: unknown) {
				console.error((err as Error).message)
			}
		})

	program
		.command('implode')
		.description('Removes from path and deletes repo')
		.action(async () => {
			const { confirm1 } = (await prompt({
				type: 'confirm',
				name: 'confirm1',
				required: true,
				message: `Are you sure you want to delete this repo? There's no going back.`,
			})) as { confirm1: boolean }

			if (!confirm1) return
			const { confirm2 } = (await prompt({
				type: 'confirm',
				name: 'confirm2',
				required: true,
				message: 'Are you completely sure?',
			})) as { confirm2: boolean }
			if (!confirm2) return

			const initScript = path.resolve(__dirname, '../scripts/init.sh')
			commandSync(`${initScript} implode ${program.name()}`, {
				shell: true,
				stdout: process.stdout,
			})
		})
}
