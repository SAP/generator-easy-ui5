import libnpmconfig from "libnpmconfig";

// helper to retrieve config entries from npm
//   --> npm config set easy-ui5_addGhOrg XYZ
let npmConfig;

export default function getNPMConfig(configName, prefix = "easy-ui5_") {
	if (!npmConfig) {
		npmConfig = libnpmconfig.read();
	}
	return npmConfig && npmConfig[`${prefix}${configName}`];
}
