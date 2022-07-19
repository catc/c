import { createNewCommand, generateTemplateArgs } from '../hygen'
import { runner } from 'hygen'
import newCommandPrompt from '../templates/command/new/p'

jest.mock('hygen')
jest.mock('../templates/command/new/p')

const error = jest.spyOn(console, 'error')

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

describe('createNewCommand', () => {
	beforeEach(() => {
		;(runner as jest.Mock).mockClear()
		;(error as jest.Mock).mockClear()
	})

	it('generates new commands', async () => {
		;(newCommandPrompt as jest.Mock).mockResolvedValue({
			name: 'zzz',
		})

		await createNewCommand()

		expect(runner).toHaveBeenCalledWith(
			[
				'command',
				'new',
				'--name',
				'zzz',
				'--path',
				expect.stringContaining('zzz.command.ts'),
			],
			expect.anything(),
		)
	})

	it('handles reserved command names', async () => {
		;(newCommandPrompt as jest.Mock).mockResolvedValue({
			name: 'new',
		})

		await createNewCommand()

		expect(runner).not.toHaveBeenCalled()
		expect(error).toHaveBeenCalledWith(expect.stringContaining('new'))
	})
})
