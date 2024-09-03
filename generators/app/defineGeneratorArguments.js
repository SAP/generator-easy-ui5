export const generatorArguments = {
	generator: {
		type: String,
		required: false,
		description: "Name of the generator to invoke (without the \x1b[33mgenerator-ui5-\x1b[0m prefix)",
	},
	subcommand: {
		type: String,
		required: false,
		description: "Name of the subcommand to invoke (without the \x1b[33>mgenerator:\x1b[0m prefix)",
	},
};

export default function defineGeneratorArguments(generator) {
	Object.keys(generatorArguments).forEach((argName) => {
		// register the argument for being displayed in the help
		generator.argument(argName, generatorArguments[argName]);
	});
}
