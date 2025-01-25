import globals from 'globals';
import path from 'node:path';
import { fileURLToPath, } from 'node:url';
import js from '@eslint/js';
import { FlatCompat, } from '@eslint/eslintrc';
import tailwind from 'eslint-plugin-tailwindcss';
import jsxA11y from 'eslint-plugin-jsx-a11y';

import rootEslintConfig from '../eslint.config.mjs';

const __filename = fileURLToPath( import.meta.url, );
const __dirname = path.dirname( __filename, );
const compat = new FlatCompat( {
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
}, );

export default [
	...rootEslintConfig,
	...tailwind.configs[ 'flat/recommended' ],
	...compat.extends(
		'plugin:@next/next/recommended',
	),
	{
		files: [
			'src/**/*.{ts,tsx}',
		],
		...jsxA11y.flatConfigs.recommended,
	},
	{
		languageOptions: {
			globals: globals.browser,
		},

		settings: {
			tailwindcss: {
				config: './tailwind.config.js',
				callees: ['cn',],
				classRegex: '(^c|C)lass(Name)?$',
			},
		},
	},
	{
		files: [
			'**/{next,postcss,tailwind}.config.js',
		],

		languageOptions: {
			globals: globals.node,
		},

		rules: {
			'@typescript-eslint/no-require-imports': 'off',
		},
	},
];
