import getNPMConfig from "./getNPMConfig.js";

// apply proxy settings to GLOBAL_AGENT to support the proxy configuration for node-fetch using the GLOBAL_AGENT
// ==> the configuration is derived from the environment variables ([GLOBAL_AGENT_](HTTP|HTTPS|NO)_PROXY) and the npm config ((http|https|no)-proxy)
// ==> empty values will allow to override the more general proxy settings and make the proxy value undefined
let HTTP_PROXY, HTTPS_PROXY, NO_PROXY;
if (global?.GLOBAL_AGENT) {
	HTTP_PROXY = process.env.GLOBAL_AGENT_HTTP_PROXY ?? process.env.HTTP_PROXY ?? process.env.http_proxy ?? getNPMConfig("http-proxy", "") ?? getNPMConfig("proxy", "");
	global.GLOBAL_AGENT.HTTP_PROXY = HTTP_PROXY = HTTP_PROXY || global.GLOBAL_AGENT.HTTP_PROXY;
	HTTPS_PROXY = process.env.GLOBAL_AGENT_HTTPS_PROXY ?? process.env.HTTPS_PROXY ?? process.env.https_proxy ?? getNPMConfig("https-proxy", "") ?? getNPMConfig("proxy", "");
	global.GLOBAL_AGENT.HTTPS_PROXY = HTTPS_PROXY = HTTPS_PROXY || global.GLOBAL_AGENT.HTTPS_PROXY;
	NO_PROXY = process.env.GLOBAL_AGENT_NO_PROXY ?? process.env.NO_PROXY ?? process.env.no_proxy ?? getNPMConfig("no-proxy", "");
	global.GLOBAL_AGENT.NO_PROXY = NO_PROXY = NO_PROXY || global.GLOBAL_AGENT.NO_PROXY;
}

export { HTTP_PROXY, HTTPS_PROXY, NO_PROXY };
