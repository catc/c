import { runner, Logger } from 'hygen'
import { join, resolve } from 'path'
import { COMMANDS_DIR, generateCommandFilename, RESERVED_COMMANDS } from './constants'
import newCommandPrompt from './templates/command/new/p'
import kebabcase from 'lodash/kebabcase'

const templates = join(__dirname, 'templates')

function runGenerator(args: string[]) {
	return runner(args, {
		templates,
		cwd: process.cwd(),
		logger: new Logger(console.log.bind(console)),
		createPrompter: () => require('enquirer'),
		exec: (action, body) => {
			const opts = body && body.length > 0 ? { input: body } : {}
			return require('execa').shell(action, opts)
		},
		// debug: true,
	})
}

type TemplateBody = Record<string, any>

export function generateTemplateArgs(template: string, body: TemplateBody) {
	const args = Object.entries(body).reduce((args, [key, val]) => {
		return args.concat(`--${key}`, val)
	}, template.split(' '))
	return args
}

export const createNewCommand = async () => {
	const resp = await newCommandPrompt().catch(() => process.exit(0))

	const name = kebabcase(resp.name)
	if (RESERVED_COMMANDS.includes(name)) {
		return console.error(`Command name "${name}" is reserved.`)
	}
	const path = join(COMMANDS_DIR, generateCommandFilename(name))
	const args = generateTemplateArgs('command new', {
		name,
		path,
	} as TemplateBody)

	await runGenerator(args)
}
