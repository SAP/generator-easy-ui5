# Easy UI5 Generator
[![NPM version][npm-image]][npm-url]
[![Build Status][circleci-image]][circleci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![License Status][license-image]][license-url]
[![REUSE status](https://api.reuse.software/badge/github.com/SAP/generator-easy-ui5/)](https://api.reuse.software/info/github.com/SAP/generator-easy-ui5/)

## Description

Easy-ui5 is a [Yeoman](http://yeoman.io/) generator which enables you to create simple [OpenUI5](https://openui5.hana.ondemand.com/)-based web-apps within seconds.

This generator has been created to simplify the creation of your OpenUI5 prototypes. Now you can scaffold simple UI5 projects from the shell/terminal of your choice. The current best practices (such as [async](https://blogs.sap.com/2018/12/18/ui5ers-buzz-41-best-practices-for-async-loading-in-ui5/)) are already baked into our templates so you don't have to worry about the definition of the metadata files.

The purpose of this generator is to guide you on your first steps with SAPUI5 and SAP Cloud Platform deployments. Once you are familiar with those technologies, you might want to tweak the projects to adapt them for productive use-cases (such as continuous deployment pipelines and full i18n).


## Target platforms
During the prompting phase, the generator will ask on which target platform your app should run. Currently, the following options are available:

### Static webserver
This is the most basic option. Choose this option if you want to deploy the web app in your custom environment or host it on an arbitrary server.
### Application Router @ Cloud Foundry
This is the most basic way to deploy the web app in Cloud Foundry-based environments. Besides the basic UI5 project, the generator will add an [Approuter](https://github.com/gregorwolf/SAP-NPM-API-collection/tree/master/apis/approuter) node.js-module that serves the web app.
### Application Router @ SAP HANA XS Advanced
This is the standard way to deploy the web app in SAP HANA XSA-based environments. Besides the basic UI5 project, the generator will add an [Approuter](https://github.com/gregorwolf/SAP-NPM-API-collection/tree/master/apis/approuter) node.js-module that serves the web app.
### Cloud Foundry HTML5 Application Repository
This option is a more sophisticate way to serve the web app from Cloud Foundry-based environments. The generator will include all modules that are included in the **Application Router @ Cloud Foundry** and, additionally, install a module to upload the web app to the HTML5 application repository during deploy-time. You can watch [this presentation](https://www.youtube.com/watch?v=emnl-y9btdU&list=PLVf0R17F93RXT2tzhHzAr-iiYTmc9KngS&index=11&t=0s) to learn more about the benefits of using the HTML5 application repository.
### Fiori Launchpad on Cloud Foundry
Use this option if you would like to develop a Fiori Launchpad application that should run on Cloud Foundry. The generator will include all modules that are included in the **Cloud Foundry HTML5 Application Repository** and, additionally, install a module that adds Fiori Launchpad resources to the HTML5 application repository.
### SAP NetWeaver
Use this option if you want to deploy your application(s) to the SAP NetWeaver ABAP Repository.

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
> Create your first OpenUI5 App within a few seconds!

1. Scaffold your OpenUI5 project
    ```
    yo easy-ui5
    ```
2. Answer the prompts to create your OpenUI5 project
3. Run it locally
    ```
    cd <your project name>
    npm start
    ```



## Sub-generators to avoid recurring tasks

### Add a new view
This sub-generator will create a new view (of the same type you specified during the creating of your project) and a new controller and route. If you have OPA5 tests, you can add a corresponding page object now or later with another sub-generator.
```
yo easy-ui5:newview
```

### Create a custom control
Run the following command from your project's root to scaffold a custom control.
```
yo easy-ui5:newcontrol
```

### Add a new model
This sub-generator will create a new model in your manifest.  Currently, [JSON](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.json.JSONModel) and [OData v2](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.odata.v2.ODataModel) models are supported with various configuration options.
```
yo easy-ui5:newmodel
```

### Add a new component usage
This sub-generator will add a new component usage for component reuse to your manifest.
```
yo easy-ui5:newcomponentusage
```

### UIVeri5 tests
This sub-generator will add a basic [UIVeri5](https://github.com/SAP/ui5-uiveri5) test. It will ask you for test configuration and names of the suite and spec. You can add page objects now or later with another sub-generator.
```
yo easy-ui5:uiveri5
```
This sub-generator will create a UIVeri5 page object and a new test that shows how to use the page object:
```
yo easy-ui5:newuiveri5po
```
This sub-generator will create a UIVeri5 spec file:
```
yo easy-ui5:newuiveri5spec
```

### OPA5 tests
This sub-generator will add a basic [OPA5](https://openui5.hana.ondemand.com/topic/2696ab50faad458f9b4027ec2f9b884d) test setup. You can add page objects now or later with another sub-generator.
```
yo easy-ui5:opa5
```
This sub-generator will create an OPA5 page object and add it to your journeys:
```
yo easy-ui5:newopa5po
```
This sub-generator will create an OPA5 journey and add it to your test page:
```
yo easy-ui5:newopa5journey
```

### `wdi5` test framework

There's a sub-generator available to add

- `wdi5` as the test framework
- a basic `wdi5` config and
- a sample test file

to the UI5 application by `easy-ui5`.

```bash
$> cd yourEasyUI5-project
$> yo easy-ui5:wdi5
```

## Deployment
Depending on your target platform you'll need to install additional tools:

### Cloud Foundry
#### Required tools
1. [Create a free](https://developers.sap.com/mena/tutorials/hcp-create-trial-account.html) SAP Cloud Platform Cloud account
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

## Embedded Technologies
This project leverages (among others) the following Open Source projects:
* [UI5 Build and Development Tooling](https://github.com/SAP/ui5-tooling)
* [OpenUI5. Build Once. Run on any device.](https://github.com/SAP/openui5)

## Support

Please use the GitHub bug tracking system to post questions, bug reports or to create pull requests.

## Contributing

We welcome any type of contribution (code contributions, pull requests, issues) to this easy-ui5 generator equally.

Please follow our instructions if you would like to [contribute](https://github.com/SAP/generator-easy-ui5/blob/master/CONTRIBUTING.md).

## To-Do

The following aspects/features are not yet implemented:
* Decouple the sub-generators from the main flow. E.g. so that app router modules can be added after the generation of the UI5 web app.

Contributions are very much appreciated.



[npm-image]: https://img.shields.io/npm/v/generator-easy-ui5.svg
[npm-url]: https://www.npmjs.com/package/generator-easy-ui5
[circleci-image]: https://img.shields.io/circleci/project/github/SAP/generator-easy-ui5.svg
[circleci-url]: https://circleci.com/gh/SAP/generator-easy-ui5
[daviddm-image]: https://img.shields.io/david/SAP/generator-easy-ui5.svg
[daviddm-url]: https://david-dm.org/SAP/generator-easy-ui5
[license-image]: https://img.shields.io/npm/l/generator-easy-ui5.svg
[license-url]: https://github.com/SAP/generator-easy-ui5/blob/master/LICENSE
