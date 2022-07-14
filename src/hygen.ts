import { runner, Logger } from 'hygen'
import path from 'path'
import { RESERVED_COMMANDS } from './constants'
import newCommandPrompt from './templates/command/new/p'
import kebabcase from 'lodash/kebabcase'

const templates = path.join(__dirname, 'templates')

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

	resp.name = kebabcase(resp.name)
	if (RESERVED_COMMANDS.includes(resp.name)) {
		return console.error(`Command name "${resp.name}" is reserved.`)
	}
	const args = generateTemplateArgs('command new', resp as TemplateBody)

	await runGenerator(args)
}
