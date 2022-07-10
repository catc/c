import { generateTemplateArgs } from '../hygen'

describe('promptToArgs', () => {
	it('generates template', () => {
		const template = generateTemplateArgs('command new', {
			name: 'foo',
			message: 'this is a message',
		})
		expect(template).toEqual([
			'command',
			'new',
			'--name',
			'foo',
			'--message',
			'this is a message',
		])
	})
})
