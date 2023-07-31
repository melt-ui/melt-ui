module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:storybook/recommended',
		'prettier',
	],
	plugins: ['svelte3', '@typescript-eslint'],
	ignorePatterns: ['*.cjs'],
	overrides: [
		{
			files: ['*.svelte'],
			processor: 'svelte3/svelte3',
		},
	],
	settings: {
		'svelte3/typescript': () => require('typescript'),
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	rules: {
		'no-console': 'warn',
		'no-restricted-imports': [
			'error',
			{
				patterns: [
					{
						group: ['**/lib/builders/*'],
						message: 'If you need to import a builder do it from the root `$lib`',
					},
					{
						group: ['$lib/builders/*'],
						message: 'If you need to import a builder do it from the root `$lib`',
					},
				],
			},
		],
	},
	globals: {
		NodeJS: true,
	},
};
