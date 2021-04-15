# Easy UI5 Generator

[![NPM version][npm-image]][npm-url]
[![Build Status][test-image]][test-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![License Status][license-image]][license-url]
[![REUSE status][reuse-image]][reuse-url]

## Description

Easy-ui5 is a [Yeoman](http://yeoman.io/) generator which enables you to create simple [SAPUI5](https://sapui5.hana.ondemand.com/)/[OpenUI5](https://openui5.hana.ondemand.com/)-based web-apps and other UI5-related projects within seconds.

This generator has been created to simplify the creation of your UI5 prototypes. Now you can scaffold simple UI5 projects from the shell/terminal of your choice. The current best practices (such as [async](https://blogs.sap.com/2018/12/18/ui5ers-buzz-41-best-practices-for-async-loading-in-ui5/)) are already baked into our templates so you don't have to worry about the definition of the metadata files.

The purpose of this generator is to guide you on your first steps with [SAPUI5](https://sapui5.hana.ondemand.com/) and [SAP BTP](https://www.sap.com/products/business-technology-platform.html) deployments. Once you are familiar with those technologies, you might want to tweak the projects to adapt them for productive use-cases (such as continuous deployment pipelines and full i18n).


## Installation

1. Get [Node.js](https://nodejs.org/en/download/) (version 8.5 or higher)
2. Install the generator
   ```sh
   npm install -g yo generator-easy-ui5
   ```
3. Verify your installation to see if Yeoman has been installed correctly
   ```sh
   yo
   ```
   Make sure you see the `easy-ui5` generator listed.

## Bootstrapping a new UI5 project

> Create your first UI5 App within a few seconds!

1. Scaffold your UI5 project
   ```
   yo easy-ui5 project
   ```
2. Answer the prompts to create your new project
3. Run it locally
   ```
   cd <your project directory>
   npm start # or "yarn start"
   ```

## Target platforms

During the prompting phase, the generator will ask on which target platform your app should run. Currently, the following options are available:

- Static webserver
- SAP BTP
- SAP HANA XS Advanced
- SAP NetWeaver

> Have a look at [this plugin project](https://github.com/ui5-community/generator-ui5-project/) for more usage instruction and information about the available subcommands.


## More generators

And this is just the start!
We made easy-ui5 extensible, so that the entire [UI5 Community](https://github.com/ui5-community/) can build additional plugins to scaffold any UI5-related development activity.

By default, this generator comes with the [project-creation-plugin](https://github.com/ui5-community/generator-ui5-project) but there are many others as well:
- Create new UI5 libraries [[ui5-community/generator-ui5-library]](https://github.com/ui5-community/generator-ui5-library)
- More are coming!
<!-- - Create new UI5 custom controls
- Create middlewares for the UI5 tooling
- Create tasks for the UI5 tooling
- Create a WDI5 test suite -->

To download and use any of the plugins above, run the following command
```sh
yo easy-ui5 [project|library] # this is the name of the repositorty without the "generator-ui5-" prefix
```

<!-- Are you missing a generator in this list and are you willing to provide one to the entire UI5 community? Great! [This blog posts](TODO INSERT LINK HERE) contains everything you need to know to get started!  -->

## Calling generators

Run the following command to see all subgenerators of a given plugin
```sh
yo easy-ui5 [project|library] --list
```
Once you decided on the subgenerator, run:

Run the following command to see all subgenerators of a given plugin
```sh
yo easy-ui5 [project|library] <sub-generator-id>
```

## Support

Please use the GitHub bug tracking system to post questions, bug reports or to create pull requests.

## Contributing

We welcome any type of contribution (code contributions, pull requests, issues) to this easy-ui5 generator equally.

Please follow our instructions if you would like to [contribute](https://github.com/SAP/generator-easy-ui5/blob/master/CONTRIBUTING.md).

[npm-image]: https://img.shields.io/npm/v/generator-easy-ui5.svg
[npm-url]: https://www.npmjs.com/package/generator-easy-ui5
[test-image]: https://github.com/SAP/generator-easy-ui5/actions/workflows/main.yml/badge.svg
[test-url]: https://github.com/SAP/generator-easy-ui5/actions/workflows/main.yml
[daviddm-image]: https://img.shields.io/david/SAP/generator-easy-ui5.svg
[daviddm-url]: https://david-dm.org/SAP/generator-easy-ui5
[license-image]: https://img.shields.io/npm/l/generator-easy-ui5.svg
[license-url]: https://github.com/SAP/generator-easy-ui5/blob/master/LICENSE
[reuse-image]: https://api.reuse.software/badge/github.com/SAP/generator-easy-ui5/
[reuse-url]: https://api.reuse.software/info/github.com/SAP/generator-easy-ui5/
