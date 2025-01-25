import { fixupPluginRules, } from '@eslint/compat';
import react from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config} */
export default tseslint.config(
	js.configs.recommended,
	// replaces tseslint.configs.recommended, tseslint.configs.strict, and tseslint.configs.stylistic
	// tseslint.configs.strictTypeChecked,
	// tseslint.configs.stylisticTypeChecked,
	tseslint.configs.recommended,
	stylistic.configs[ 'recommended-flat' ],
	{
		ignores: [
			'**/.next/',
			'**/out/',
			'**/coverage/',
			'**/dist/',
		],
	},
	{
		ignores: [
			'**/jest.config.js',
			'node_modules/*',
		],
		linterOptions: {
			reportUnusedDisableDirectives: 'error',
		},
		// enable when tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked are enabled
		// languageOptions: {
		// 	parserOptions: {
		// 		projectService: true,
		// 		tsconfigRootDir: import.meta.dirname,
		// 	},
		// },
	},
	{
		files: [
			'**/*.js',
			'**/*.cjs',
			'**/*.mjs',
		],
		'extends': [
			tseslint.configs.disableTypeChecked,
		],
	},
	{
		...react.configs.flat.recommended, // This is not a plugin object, but a shareable config object
		languageOptions: {
			...react.configs.flat.recommended.languageOptions,
			globals: {
				...globals.browser,
			},
		},
		plugins: {
			...react.configs.flat.recommended.plugins,
			'react-hooks': fixupPluginRules( reactHooksPlugin, ),
		},
		rules: {
			...react.configs.flat.recommended.rules,
			...react.configs.flat[ 'jsx-runtime' ].rules, // Add this if you are using React 17+
			...reactHooksPlugin.configs.recommended.rules,
			'react-hooks/exhaustive-deps': 'error',
			'react-hooks/rules-of-hooks': 'error',
			'react/prop-types': ['off',],
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	{
		plugins: {
			'@stylistic': stylistic,
		},
		languageOptions: {
			globals: {
				...globals.browser,
				globalThis: false,
			},
			ecmaVersion: 'latest',
			sourceType: 'module',
		},
		rules: {
			'@stylistic/arrow-spacing': 'error',
			'@stylistic/comma-dangle': ['error', 'always',],
			'@stylistic/comma-style': ['error',],
			'@stylistic/computed-property-spacing': ['error', 'always',],
			'@stylistic/dot-location': ['error', 'property',],
			'@stylistic/func-call-spacing': 'error',
			'@stylistic/function-call-argument-newline': ['error', 'consistent',],
			'@stylistic/function-paren-newline': ['error', 'consistent',],
			'@stylistic/generator-star-spacing': 'error',
			'@stylistic/implicit-arrow-linebreak': 'error',
			'@stylistic/indent': ['error', 'tab',],
			'@stylistic/indent-binary-ops': ['error', 'tab',],
			'@stylistic/jsx-closing-tag-location': 'off',
			'@stylistic/jsx-closing-bracket-location': 'off',
			'@stylistic/jsx-indent': ['error', 'tab',],
			'@stylistic/jsx-indent-props': ['error', 'tab',],
			'@stylistic/jsx-wrap-multilines': 'off',
			'@stylistic/linebreak-style': 'error',
			'@stylistic/lines-around-comment': 'off',
			'@stylistic/newline-per-chained-call': 'error',
			'@stylistic/no-confusing-arrow': 'error',
			'@stylistic/no-extra-semi': 'error',
			'@stylistic/no-tabs': 'off',
			'@stylistic/object-curly-newline': 'error',
			'@stylistic/object-property-newline': 'error',
			'@stylistic/operator-linebreak': ['error', 'before',],
			'@stylistic/padded-blocks': ['error', 'never',],

			'@stylistic/quote-props': ['error', 'as-needed', {
				keywords: true,
			},],

			'@stylistic/quotes': ['error', 'single', {
				avoidEscape: true,
			},],
			'@stylistic/semi': ['error', 'always',],
			'@stylistic/semi-style': 'error',
			'@stylistic/space-before-function-paren': ['error', 'never',],
			'@stylistic/space-in-parens': ['error', 'always',],
			'@stylistic/switch-colon-spacing': 'error',
			'array-callback-return': 'error',
			'arrow-body-style': 'error',
			curly: [2, 'all',],
			'dot-notation': 'error',
			eqeqeq: ['error', 'smart',],
			'no-div-regex': 'error',
			'no-duplicate-imports': 'error',
			'no-else-return': 'error',
			'no-extra-bind': 'error',
			'no-extra-boolean-cast': 'error',
			'no-extra-label': 'error',
			'no-extra-parens': 'error',
			'no-func-assign': 'error',
			'no-implicit-coercion': 'error',
			'no-lonely-if': 'error',

			'no-multiple-empty-lines': ['error', {
				max: 1,
			},],

			'no-new-native-nonconstructor': 'error',
			'no-param-reassign': 'error',
			'no-promise-executor-return': 'error',
			'no-regex-spaces': 'error',
			'no-restricted-imports': 'error',
			'no-undef-init': 'error',
			'no-unmodified-loop-condition': 'error',
			'no-unneeded-ternary': 'error',
			'no-unreachable-loop': 'error',
			'no-unsafe-optional-chaining': 'error',
			'no-unused-labels': 'error',
			'no-unused-private-class-members': 'error',
			'no-unused-vars': 'off',
			'no-use-before-define': 'off',
			'no-useless-computed-key': 'error',
			'no-useless-rename': 'error',
			'no-useless-return': 'error',
			'no-var': 'error',
			'object-shorthand': 'error',
			'operator-assignment': 'error',
			'prefer-const': 'error',
			'prefer-destructuring': 'error',
			'prefer-exponentiation-operator': 'error',
			'prefer-object-spread': 'error',
			strict: 'error',
			'unicode-bom': 'error',
			yoda: 'error',
		},
	},
	{
		files: ['**/**.cjs',],
		languageOptions: {
			globals: globals.node,
			ecmaVersion: 5,
			sourceType: 'commonjs',
		},
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
			strict: 'off',
		},
	},
);
