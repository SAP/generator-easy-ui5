import globals from "globals";
import js from "@eslint/js";

export default [
	js.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
			},
			ecmaVersion: 2023,
			sourceType: "module",
		},
		rules: {
			"block-scoped-var": 1,
			"keyword-spacing": 2,
			"space-unary-ops": 2,
			camelcase: 1,
			"no-warning-comments": 1,
			"no-debugger": 2,
			"default-case": 1,
			"no-unused-vars": 2,
			"no-trailing-spaces": 2,
			semi: [1, "always"],
			quotes: [1, "double"],
			"key-spacing": [
				1,
				{
					beforeColon: false,
				},
			],
			"comma-spacing": [
				1,
				{
					before: false,
					after: true,
				},
			],
			"no-shadow": 2,
			"no-irregular-whitespace": 2,
		},
	},
	{
		ignores: [
			"eslint.config.js",

			// Ignore node_files
			"node_modules/",

			// Ignore plugin generators (which are copies of the generators)
			"plugin-generators/",

			// Ignore test files
			"test/",
		],
	},
];
