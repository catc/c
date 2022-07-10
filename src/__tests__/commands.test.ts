import { program, Command } from 'commander'
import { generateCommandTree, loadCommands } from '../commands'
import { readdirSync } from 'fs'

jest.mock('fs', () => ({
	...jest.requireActual('fs'),
	readdirSync: jest.fn(),
}))

const warn = jest.spyOn(console, 'warn')

describe('generateCommandTree', () => {
	it('generates a valid tree for omelette', () => {
		const program = new Command()
		program.command('foo').command('zz')

		const bar = program.command('bar')
		bar.command('yy')
		bar.command('xx')

		program.command('jam')

		const bb = program.command('blah').command('aa').command('bb')
		const cc = bb.command('cc')
		cc.command('dd')
		cc.command('ee')

		const tree = generateCommandTree(program)

		expect(tree).toEqual({
			foo: { zz: [] },
			bar: {
				yy: [],
				xx: [],
			},
			jam: [],
			blah: {
				aa: {
					bb: {
						cc: {
							dd: [],
							ee: [],
						},
					},
				},
			},
		})
	})
})

describe('loadCommands', () => {
	beforeEach(() => {
		warn.mockClear()
	})

	it('loads commands', () => {
		;(readdirSync as jest.Mock).mockReturnValue(['foo.js', 'bar.ts', 'new.ts'])

		const program = new Command()

		jest.mock('../../commands/foo.js', () => program.command('foo'), {
			virtual: true,
		})
		jest.mock('../../commands/bar.ts', () => program.command('bar'), {
			virtual: true,
		})
		// won't be loaded because `new` matched reserved, built in command
		jest.mock('../../commands/new.ts', () => program.command('new'), {
			virtual: true,
		})

		loadCommands(program)
		const addedCommands = program.commands.map(c => c.name())
		expect(addedCommands).toEqual(['foo', 'bar'])
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('new.ts'))
	})
})
