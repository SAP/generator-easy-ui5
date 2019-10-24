# Easy UI5 Generator
[![NPM version][npm-image]][npm-url]
[![Build Status][circleci-image]][circleci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![License Status][license-image]][license-url]

## Description

Easy-ui5 is a [Yeoman](http://yeoman.io/) generator which enables you to create simple [OpenUI5](https://openui5.hana.ondemand.com/)-based web-apps within seconds.

This generator has been created to simplify the creation of your OpenUI5 prototypes. Now you can scaffold simple UI5 projects from the shell/terminal of your choice. The current best practices (such as [async](https://blogs.sap.com/2018/12/18/ui5ers-buzz-41-best-practices-for-async-loading-in-ui5/)) are already baked into our templates so you don't have to worry about the definition of the metadata files.

The purpose of this generator is to guide you on your first steps with SAPUI5 and SAP Cloud Platform deployments. Once you are familiar with those technologies, you might want to tweak the projects to adapt them for productive use-cases (such as continuous deployment pipelines and full i18n).


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


## Usage
### Create your first OpenUI5 App within a few seconds!

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

### Add a new view
This sub-generator will create a new view (of the same type you specified during the creating of your project)  and a new controller.
```
yo easy-ui5:newview
```

### Create a custom control
Run the following command from your project's root to scaffold a custom control.
```
yo easy-ui5:newcontrol
```

## Deployment
Depending on your target platform you'll need to install additional tools:

### Cloud Foundry
#### Required tools
1. [Create a free](https://developers.sap.com/mena/tutorials/hcp-create-trial-account.html) SAP Cloud Platform Cloud  account
2. [Install](https://developers.sap.com/tutorials/cp-cf-download-cli.html) the Cloud Foundry Command Line Interface
    ```sh
    cf login
    ```
3. [Install](https://github.com/cloudfoundry-incubator/multiapps-cli-plugin) the MultiApps CF CLI Plugin
4. [Install](https://sap.github.io/cloud-mta-build-tool/download/) MTA Build Tool for Cloud Foundry
```sh
npm install -g mbt
```

#### Deploy
Call this command from the root directory to deploy the application to Cloud Foundry
```
npm run deploy:cf
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
* Tests / Continuous Integration Workflow
* Call `git init` after project creation
* Add more target platforms:
  * Neo env
  * SAP HANA
  * SAP NetWeaver

Contributions are very much appreciated. 🥳

## License

Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
This project is licensed under the Apache Software License, Version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.


[npm-image]: https://img.shields.io/npm/v/generator-easy-ui5.svg
[npm-url]: https://www.npmjs.com/package/generator-easy-ui5
[circleci-image]: https://img.shields.io/circleci/project/github/SAP/generator-easy-ui5.svg
[circleci-url]: https://circleci.com/gh/SAP/generator-easy-ui5
[daviddm-image]: https://img.shields.io/david/SAP/generator-easy-ui5.svg
[daviddm-url]: https://david-dm.org/yeoman/yeoman-test
[license-image]: https://img.shields.io/npm/l/generator-easy-ui5.svg
[license-url]: https://github.com/SAP/generator-easy-ui5/blob/master/LICENSE
