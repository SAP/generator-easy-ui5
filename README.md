# Easy UI5 Generator

[![NPM version][npm-image]][npm-url]
[![Build Status][test-image]][test-url]
[![Dependency Status][librariesio-image]][repo-url]
[![License Status][license-image]][license-url]
[![REUSE status][reuse-image]][reuse-url]

## Description

Easy UI5 (`easy-ui5`) 💙 is a [Yeoman](http://yeoman.io/) generator which enables you to create simple [SAPUI5](https://ui5.sap.com)/[OpenUI5](https://sdk.openui5.org)-based web-apps and other UI5-related projects within seconds.

This generator has been created to simplify the creation of your UI5 prototypes. Now you can scaffold simple UI5 projects from the shell/terminal of your choice. The current best practices (such as [async](https://blogs.sap.com/2018/12/18/ui5ers-buzz-41-best-practices-for-async-loading-in-ui5/)) are already baked into our templates so you don't have to worry about the definition of the metadata files.

The purpose of the (preinstalled) `project generator` is to guide you on your first steps with [SAPUI5](https://sapui5.hana.ondemand.com/) and [SAP BTP](https://www.sap.com/products/business-technology-platform.html) deployments. Once you are familiar with those technologies, you might want to tweak the projects to adapt them for productive use-cases (such as continuous deployment pipelines and full i18n).

> :warning: Starting with easy-ui5 v3, all templates will be outsource to repositories in the [UI5 Community](https://github.com/ui5-community/). This project is from now on a shell that will offer all generators hosted on that GitHub org. easy-ui5 will download and install these repositories when needed.
>
> By default, it will download the repository [generator-ui5-project](https://github.com/ui5-community/generator-ui5-project/) which contains the templates that were previously integrated in easy-ui5 < 3.

## Requirements

- Get [Node.js](https://nodejs.org/en/download/) (:warning: **version 20 or higher**).

## Download and Installation

1. Install the generator:

   ```sh
   npm install -g yo generator-easy-ui5
   ```

2. Verify your installation to see if Yeoman has been installed correctly:
   ```sh
   yo
   ```
   Make sure you see the `easy-ui5` generator listed.

## Bootstrapping a new UI5 project

> Create your first UI5 App within a few seconds!

1. Scaffold your UI5 project:

   ```
   yo easy-ui5 project
   ```

2. Answer the prompts to create your new project.

3. Run it locally:
   ```
   cd <your project directory>
   npm start # or "yarn start"
   ```

## Target platforms

During the prompting phase, the project generator will ask on which target platform your app should run. Currently, the following options are available:

- Static webserver
- Application Router
- Application Frontend Service
- SAP HTML5 Application Repository
- SAP Build Work Zone, standard edition
- SAP NetWeaver

> Have a look at the [project generator](https://github.com/ui5-community/generator-ui5-project/) for more usage instruction and information about its available subgenerators.

## More generators

And this is just the start!

We made easy-ui5 extensible, so that the entire [UI5 Community](https://github.com/ui5-community/) can build additional plugins to scaffold any UI5-related development activity.

By default, this generator comes with the [project generator](https://github.com/ui5-community/generator-ui5-project) but there are many others as well:

- [[ui5-community/generator-ui5-ts-app]](https://github.com/ui5-community/generator-ui5-ts-app)
- [[ui5-community/generator-ui5-ts-app-fcl]](https://github.com/ui5-community/generator-ui5-ts-app-fcl)
- [[ui5-community/generator-ui5-app]](https://github.com/ui5-community/generator-ui5-app)
- [[ui5-community/generator-ui5-flp-plugin]](https://github.com/ui5-community/generator-ui5-flp-plugin)
- [[ui5-community/generator-ui5-library]](https://github.com/ui5-community/generator-ui5-library)
- [[ui5-community/generator-ui5-ts-library]](https://github.com/ui5-community/generator-ui5-ts-library)
- [[ui5-community/generator-ui5-wdi5]](https://github.com/ui5-community/generator-ui5-wdi5)
- [[ui5-community/generator-ui5-add-extension]](https://github.com/ui5-community/generator-ui5-add-extension)
- [[ui5-community/generator-ui5-library-webc]](https://github.com/ui5-community/generator-ui5-library-webc)

To download and use any of the plugins above, run the following command:

```sh
yo easy-ui5 [project|ts-app|...] # this is the name of the repository without the "generator-ui5-" prefix
```

## Calling generators

Run the following command to see all subgenerators of a given generator:

```sh
yo easy-ui5 [project|ts-app|...] --list
```

Once you decided on the generator, run:

```sh
yo easy-ui5 [project|ts-app|...]
```

## Proxy settings

If you are running easy-ui5 behind a coporate proxy, just use the default proxy environment variables for Node.js to configure your corporate proxy:

- `HTTP_PROXY`: Specify the value to use as the HTTP proxy for all connections, e.g., `HTTP_PROXY="http://proxy.mycompany.com:8080/"`.
- `HTTPS_PROXY`: Specify the value to use as the HTTPS proxy for all connections, e.g., `HTTPS_PROXY="http://proxy.mycompany.com:8080/"`.
- `NO_PROXY`: Define the hosts that should bypass the proxy, e.g., `NO_PROXY="localhost,.mycompany.com,192.168.6.254:80"`.

In addition, easy-ui5 also supports proxy configuration from the `.npmrc` configuration:

```text
http-proxy=http://proxy.mycompany.com:8080/
https-proxy=http://proxy.mycompany.com:8080/
proxy=http://proxy.mycompany.com:8080/
no-proxy=localhost,.mycompany.com,192.168.6.254:80
```

This configuration is shared with npm itself since this proxy configuration is used to download the packages from npm.

Proxies can be passed as env variables or as npm config options. The highest precedence have the `GLOBAL_AGENT_*` env variables before the regular env variables followed by the npm configuration options, e.g.:

1. env: `GLOBAL_AGENT_HTTP_PROXY`
2. env: `HTTP_PROXY`
3. npm: `http-proxy`
4. npm: `proxy`

## How to obtain support

Please use the GitHub bug tracking system to post questions, bug reports or to create pull requests.

## Contributing

We welcome any type of contribution (code contributions, pull requests, issues) to this project equally.

Please follow our instructions if you would like to [contribute](https://github.com/SAP/generator-easy-ui5/blob/master/CONTRIBUTING.md).

[npm-image]: https://img.shields.io/npm/v/generator-easy-ui5.svg
[npm-url]: https://www.npmjs.com/package/generator-easy-ui5
[test-image]: https://github.com/SAP/generator-easy-ui5/actions/workflows/main.yml/badge.svg
[test-url]: https://github.com/SAP/generator-easy-ui5/actions/workflows/main.yml
[librariesio-image]: https://img.shields.io/librariesio/github/SAP/generator-easy-ui5
[repo-url]: https://github.com/SAP/generator-easy-ui5
[license-image]: https://img.shields.io/npm/l/generator-easy-ui5.svg
[license-url]: https://github.com/SAP/generator-easy-ui5/blob/master/LICENSE
[reuse-image]: https://api.reuse.software/badge/github.com/SAP/generator-easy-ui5/
[reuse-url]: https://api.reuse.software/info/github.com/SAP/generator-easy-ui5/
