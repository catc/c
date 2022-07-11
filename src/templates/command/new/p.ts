import { prompt } from 'enquirer'

interface Response {
	name: string
}

export default async function p(): Promise<Response> {
	const resp = await prompt([
		{
			type: 'input',
			name: 'name',
			message: 'What is the command name?',
			required: true,
		},
	])

	return resp as Response
}
