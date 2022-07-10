import { prompt } from 'enquirer'

export default async function p() {
	const resp = await prompt([
		{
			type: 'input',
			name: 'name',
			message: 'What is the command name?',
			required: true,
		},
	])

	return resp
}
