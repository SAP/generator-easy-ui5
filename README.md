# Easy UI5 Generator

[![NPM version][npm-image]][npm-url]
[![Build Status][circleci-image]][circleci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![License Status][license-image]][license-url]
[![REUSE status](https://api.reuse.software/badge/github.com/SAP/generator-easy-ui5/)](https://api.reuse.software/info/github.com/SAP/generator-easy-ui5/)

## Description

Easy-ui5 is a [Yeoman](http://yeoman.io/) generator which enables you to create simple [SAPUI5](https://sapui5.hana.ondemand.com/)/[OpenUI5](https://openui5.hana.ondemand.com/)-based web-apps and other UI5-related projects within seconds.

This generator has been created to simplify the creation of your UI5 prototypes. Now you can scaffold simple UI5 projects from the shell/terminal of your choice. The current best practices (such as [async](https://blogs.sap.com/2018/12/18/ui5ers-buzz-41-best-practices-for-async-loading-in-ui5/)) are already baked into our templates so you don't have to worry about the definition of the metadata files.

The purpose of this generator is to guide you on your first steps with SAPUI5 and SAP BTP deployments. Once you are familiar with those technologies, you might want to tweak the projects to adapt them for productive use-cases (such as continuous deployment pipelines and full i18n).

## Target platforms

During the prompting phase, the generator will ask on which target platform your app should run. Currently, the following options are available:

- Static webserver
- SAP BTP
- SAP HANA XS Advanced
- SAP NetWeaver

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
   cd <your project name>
   npm start # yarn start
   ```

## Sub-generators to avoid recurring tasks

### Add a new view

This sub-generator will create a new view (of the same type you specified during the creating of your project) and a new controller and route. If you have OPA5 tests, you can add a corresponding page object now or later with another sub-generator.

```
yo easy-ui5 project newview
```

### Create a custom control

Run the following command from your project's root to scaffold a custom control.

```
yo easy-ui5 project newcontrol
```

### Add a new model

This sub-generator will create a new model in your manifest. Currently, [JSON](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.json.JSONModel) and [OData v2](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.odata.v2.ODataModel) models are supported with various configuration options.

```
yo easy-ui5 project newmodel
```

### Add a new component usage

This sub-generator will add a new component usage for component reuse to your manifest.

```
yo easy-ui5 project newcomponentusage
```

### OPA5 tests

This sub-generator will add a basic [OPA5](https://openui5.hana.ondemand.com/topic/2696ab50faad458f9b4027ec2f9b884d) test setup. You can add page objects now or later with another sub-generator.

```
yo easy-ui5 project opa5
```

This sub-generator will create an OPA5 page object and add it to your journeys:

```
yo easy-ui5 project newopa5po
```

This sub-generator will create an OPA5 journey and add it to your test page:

```
yo easy-ui5 project newopa5journey
```

## Deployment

Depending on your target platform you'll need to install additional tools:

### Cloud Foundry

#### Required tools

1. [Create a free account](https://developers.sap.com/mena/tutorials/hcp-create-trial-account.html) on SAP BTP Trial
2. [Install](https://developers.sap.com/tutorials/cp-cf-download-cli.html) the Cloud Foundry Command Line Interface
   ```sh
   cf login
   ```
3. [Install](https://github.com/cloudfoundry-incubator/multiapps-cli-plugin) the MultiApps CF CLI Plugin

#### Deploy

Call this command from the root directory to deploy the application to Cloud Foundry

```
npm run deploy
```

> #### Optional: When using the HTML5 Applications Repository
>
> [Install](https://sap.github.io/cf-html5-apps-repo-cli-plugin/) the HTML5 Applications Repository CF CLI Plugin:
>
> `cf install-plugin -r CF-Community "html5-plugin"`
>
> With this tool you can update your web app without the need to deploy a new cloud application:
>
> `cf html5-push -n html5_repo_host .`

### SAP HANA XSA

#### Required tools

1. SAP HANA or [create a free](https://developers.sap.com/group.hxe-install-binary.html) SAP HANA Express system
2. [Install](https://developers.sap.com/tutorials/hxe-ua-install-xs-xli-client.html) the XS CLI Client
   ```sh
   xs login
   ```

#### Deploy

Call this command from the root directory to deploy the application to HANA XSA

```
npm run deploy
```

### SAP NetWeaver

#### Deploy

Update the ui5.yaml file with your system settings (user, password & server) and ABAP repository settings (package, BSP Container & Transport).
Run following command to deploy the application to SAP NetWeaver

```
npm run deploy
```

## More generators

TODO, insert text

## Support

Please use the GitHub bug tracking system to post questions, bug reports or to create pull requests.

## Contributing

We welcome any type of contribution (code contributions, pull requests, issues) to this easy-ui5 generator equally.

Please follow our instructions if you would like to [contribute](https://github.com/SAP/generator-easy-ui5/blob/master/CONTRIBUTING.md).


[npm-image]: https://img.shields.io/npm/v/generator-easy-ui5.svg
[npm-url]: https://www.npmjs.com/package/generator-easy-ui5
[circleci-image]: https://img.shields.io/circleci/project/github/SAP/generator-easy-ui5.svg
[circleci-url]: https://circleci.com/gh/SAP/generator-easy-ui5
[daviddm-image]: https://img.shields.io/david/SAP/generator-easy-ui5.svg
[daviddm-url]: https://david-dm.org/SAP/generator-easy-ui5
[license-image]: https://img.shields.io/npm/l/generator-easy-ui5.svg
[license-url]: https://github.com/SAP/generator-easy-ui5/blob/master/LICENSE
