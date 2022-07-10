import { runner, Logger } from 'hygen'
import path from 'path'
import newCommandPrompt from './templates/command/new/p'

const templates = path.join(__dirname, 'templates')

function run(args: string[]) {
	runner(args, {
		templates,
		cwd: process.cwd(),
		logger: new Logger(console.log.bind(console)),
		createPrompter: () => require('enquirer'),
		exec: (action, body) => {
			const opts = body && body.length > 0 ? { input: body } : {}
			return require('execa').shell(action, opts)
		},
		debug: true,
	})
}

export function generateTemplateArgs(template: string, body: Record<string, string>) {
	const args = Object.entries(body).reduce((args, [key, val]) => {
		return args.concat(`--${key}`, val)
	}, template.split(' '))
	return args
}

export const createNewCommand = async () => {
	const resp = (await newCommandPrompt()) as Record<string, string>
	const args = generateTemplateArgs('command new', resp)
	run(args)
}

export const initCLI = () => {
	// TODO - get app name
	// TODO - ask if should autocomplete
	// TODO - update zshrc
	// TODO - generate src/index.ts
	// TODO - display message on how to get strted
	// run('init new --name foooo')
}
