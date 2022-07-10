import { hasCompletionOption } from '../autocomplete'

describe('hasCompletionOption', () => {
	it('handles supported autocomplete options', () => {
		const opts = { completion: true, other: false }
		expect(hasCompletionOption(opts)).toBeTruthy()
	})

	it('handles non-autocomplete options', () => {
		const opts = { other: false }
		expect(hasCompletionOption(opts)).toBeFalsy()
	})
})
