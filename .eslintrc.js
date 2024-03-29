module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2019,
		sourceType: 'module',
		ecmaFeatures: {},
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	plugins: [
		// ...
		'@typescript-eslint',
		'prettier',
	],
	settings: {
		'import/extensions': ['.js', '.ts'],
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts'],
		},
	},
	env: {
		es6: true,
		node: true,
		jest: true,
	},
	globals: {
		document: true,
		Promise: true,
		window: true,
	},
	rules: {
		// basic
		curly: [2, 'multi-line'],
		eqeqeq: [1, 'smart'],
		'no-eval': 2,
		'no-use-before-define': 'off',
		quotes: [1, 'single', { allowTemplateLiterals: true }],
		// indent: [2, 'tab', { SwitchCase: 1 }], // disabled - interferes with prettier
		'no-trailing-spaces': 1,
		// space between `ifHERE()HERE{}`
		'keyword-spacing': [1, { before: true, after: true }],
		'no-var': 1,

		'space-before-function-paren': [
			// MIGHT interferes with prettier
			1,
			{ anonymous: 'never', named: 'never', asyncArrow: 'ignore' },
		],
		'space-in-parens': [1, 'never'], // MIGHT interferes with prettier
		'linebreak-style': 0,
		'object-shorthand': ['error', 'properties'],

		// typescript
		'@typescript-eslint/no-unused-vars': 0,
		'@typescript-eslint/explicit-member-accessibility': 0,
		'@typescript-eslint/explicit-function-return-type': [0],
		'@typescript-eslint/explicit-module-boundary-types': 0,
		'@typescript-eslint/no-explicit-any': 0,
		'@typescript-eslint/no-var-requires': 0,
		'@typescript-eslint/no-use-before-define': [2, { functions: false }],
		'@typescript-eslint/no-non-null-assertion': 0,
		'@typescript-eslint/camelcase': 0,
		'@typescript-eslint/no-empty-function': 0,
		'@typescript-eslint/ban-ts-ignore': 0,
		'@typescript-eslint/ban-ts-comment': 0,

		'prettier/prettier': [
			'error',
			{
				arrowParens: 'avoid',
				bracketSpacing: true,
				printWidth: 90,
				proseWrap: 'preserve',
				requirePragma: false,
				semi: false,
				singleQuote: true,
				tabWidth: 4,
				trailingComma: 'all',
				useTabs: true,
			},
			{
				usePrettierrc: false,
			},
		],
	},
	ignorePatterns: ['z_*', 'z_*/', '_templates/'],
}
