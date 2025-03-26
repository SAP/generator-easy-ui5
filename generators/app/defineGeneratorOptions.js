import path from "path";
import os from "os";
import getNPMConfig from "./getNPMConfig.js";

// the command line options of the generator
export const generatorOptions = {
	pluginsHome: {
		type: String,
		description: "Home directory of the plugin generators",
		default: path.join(os.homedir(), ".npm", "_generator-easy-ui5", "plugin-generators"),
		hide: true, // shouldn't be needed
		npmConfig: true,
	},
	plugins: {
		type: Boolean,
		alias: "p",
		description: "List detailed information about installed plugin generators",
	},
	pluginsWithDevDeps: {
		type: Boolean,
		alias: "dev",
		description: "Installs the plugin generators with dev dependencies (compat mode)",
	},
	ghBaseUrl: {
		type: String,
		description: "Base URL for the Octokit API (defaults to https://api.github.com if undefined)",
		hide: true, // shouldn't be needed
		npmConfig: true,
	},
	ghAuthToken: {
		type: String,
		description: "GitHub authToken to optionally access private generator repositories",
		npmConfig: true,
	},
	ghOrg: {
		type: String,
		description: "GitHub organization to lookup for available generators",
		default: "ui5-community",
		hide: true, // we don't want to recommend to use this option
	},
	ghThreshold: {
		type: Number,
		default: 100,
		hide: true, // shouldn't be needed
	},
	subGeneratorPrefix: {
		type: String,
		description: "Prefix used for the lookup of the available generators",
		default: "generator-ui5-",
		hide: true, // we don't want to recommend to use this option
	},
	addGhBaseUrl: {
		type: String,
		description: "Base URL for the Octokit API for the additional generators (defaults to https://api.github.com if undefined)",
		hide: true, // shouldn't be needed
		npmConfig: true,
	},
	addGhOrg: {
		type: String,
		description: "GitHub organization to lookup for additional available generators",
		hide: true, // we don't want to recommend to use this option
		npmConfig: true,
	},
	addSubGeneratorPrefix: {
		type: String,
		description: "Prefix used for the lookup of the additional available generators",
		default: "generator-",
		hide: true, // we don't want to recommend to use this option
		npmConfig: true,
	},
	embed: {
		type: Boolean,
		description: "Embeds the selected plugin generator",
		hide: true, // shouldn't be needed
	},
	list: {
		type: Boolean,
		description: "List the available subcommands of the generator",
	},
	skipUpdate: {
		type: Boolean,
		description: "Skip the update of the plugin generator",
	},
	forceUpdate: {
		type: Boolean,
		description: "Force the update of the plugin generator",
	},
	offline: {
		type: Boolean,
		alias: "o",
		description: "Running easy-ui5 in offline mode",
	},
	verbose: {
		type: Boolean,
		description: "Enable detailed logging",
	},
	next: {
		type: Boolean,
		description: "Preview the next mode to consume subgenerators from bestofui5.org",
	},
	skipNested: {
		type: Boolean,
		description: "Skips the nested generators and runs only the first subgenerator",
	},
};

export default function defineGeneratorOptions(generator) {
	Object.keys(generatorOptions).forEach((optionName) => {
		const initialValue = generator.options[optionName];
		// register the option for being displayed in the help
		generator.option(optionName, generatorOptions[optionName]);
		const defaultedValue = generator.options[optionName];
		if (generatorOptions[optionName].npmConfig) {
			// if a value is set, use the set value (parameter has higher precedence than npm config)
			// => generator.option(...) applies the default value to generator.options[...] used as last resort
			generator.options[optionName] = initialValue || getNPMConfig(optionName) || defaultedValue;
		}
	});
}
