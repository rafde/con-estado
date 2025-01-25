import vitest from '@vitest/eslint-plugin';
import testingLibrary from 'eslint-plugin-testing-library';

import rootEslintConfig from '../eslint.config.mjs';

export default [
	...rootEslintConfig,
	testingLibrary.configs[ 'flat/react' ],
	{
		files: [
			'**/*.test.js',
		],
		languageOptions: {
			globals: {
				...vitest.environments.env.globals,
			},
		},
		plugins: {
			vitest,
			'testing-library': testingLibrary,
		},
		rules: {
			...vitest.configs.recommended.rules,
			'testing-library/no-dom-import': 'error',
			'testing-library/prefer-find-by': 'error',
			'vitest/consistent-test-it': ['error', {
				fn: 'test',
				withinDescribe: 'test',
			},],
			'vitest/no-alias-methods': 'error',
			'vitest/no-focused-tests': 'error',
			'vitest/no-interpolation-in-snapshots': 'error',
			'vitest/no-test-prefixes': 'error',
			'vitest/no-test-return-statement': 'error',
			'vitest/padding-around-after-all-blocks': 'error',
			'vitest/padding-around-after-each-blocks': 'error',
			'vitest/prefer-expect-resolves': 'error',
			'vitest/prefer-mock-promise-shorthand': 'error',
			'vitest/prefer-spy-on': 'error',
			'vitest/prefer-to-be': 'error',
			'vitest/prefer-to-be-falsy': 'error',
			'vitest/prefer-to-be-object': 'error',
			'vitest/prefer-to-be-truthy': 'error',
			'vitest/prefer-to-contain': 'error',
			'vitest/prefer-to-have-length': 'error',
			'vitest/prefer-vi-mocked': 'error',
			'vitest/valid-expect': 'error',
		},
		settings: {
			vitest: {
				typecheck: true,
			},
		},
	},
];
