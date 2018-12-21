# [Easy UI5](https://ui5.sap.com/) Generator
>Easy-ui5 is a [Yeoman](http://yeoman.io/) generator which enables you to create simple OpenUI5-based web-apps within seconds.

<!-- *********************************************************************** -->

![OpenUI5 Logo](./docs/openui5.png)

This generator has been created to simplify the creation of your OpenUI5 prototypes. Now you can scaffold simple UI5 projects from the shell/terminal of your choice. The current best practices (such as [async](https://blogs.sap.com/2018/12/18/ui5ers-buzz-41-best-practices-for-async-loading-in-ui5/)) are already baked into our templates so you don't have to worry about the definition of the metadata files.

**Disclaimer:** The purpose of this generator is to guide you on your first steps with SAPUI5 and SAP Cloud Platform deployments. Once you are familiar with those technologies, you might want to tweak the projects to adapt them for productive use-cases (such as continuous deployment pipelines and full i18n).
Currently, we do **NOT** recommend that you use this plugin for production applications.


<!-- *********************************************************************** -->
## Used Technologies
This project leverages (among others) the following Open Source projects:
* [UI5 Build and Development Tooling](https://github.com/SAP/ui5-tooling)
* [OpenUI5. Build Once. Run on any device.](https://github.com/SAP/openui5)
* [Yeoman - a set of tools for automating development workflow](https://github.com/yeoman/yeoman)
* [Cloud Foundry CLI](https://github.com/cloudfoundry/cli)

<!-- *********************************************************************** -->
## Installation
### Dependencies

1. Get [Node.js](https://nodejs.org/en/download/) (version 8.5 or higher ⚠️)
2. Install the generator
```sh
npm install -g yo generator-easy-ui5
```
3. Verify your installation
```sh
yo
```


### Optional Steps
Depending on your target platform you have to install the following tools:
#### Deploy to Cloud Foundry
1. [Create a free](https://developers.sap.com/mena/tutorials/hcp-create-trial-account.html) SAP Cloud Platform Cloud  account
2. [Set your environment up](https://developers.sap.com/tutorials/hcp-cf-getting-started.html) and connect to your Cloud Foundry endpoint
  ```sh
  cf login
  ```
3. [Install](https://github.com/cloudfoundry-incubator/multiapps-cli-plugin) the MultiApps CF CLI Plugin
4. [Download](https://tools.hana.ondemand.com/additional/mta_archive_builder-1.1.7.jar) the Multi-Target Application Archive Builder


## Usage
### Create your first OpenUI5 App within seconds!

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
4. Deploy it to SAP Cloud Platform (Make sure you [set up](#### Deploy to Cloud Foundry)  your environment correctly)
```
npm run deploy-to-cf
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


<!-- *********************************************************************** -->
## Support

Please use the GitHub bug tracking system to post questions, bug reports or to create pull requests.
This project is provided "as-is": there is no guarantee that raised issues will be answered or addressed in future releases.

<!-- *********************************************************************** -->
## Contributing

We welcome any type of contribution (code contributions, pull requests, issues) to this easy-ui5 generator equally.

<!-- *********************************************************************** -->
## ToDo's

The following aspects/features are not yet implemented:
* Tests / Continuous Integration Workflow
* Call `git init` after project creation
* Add more target platforms:
  * Neo env
  * SAP HANA
  * SAP NetWeaver

Contributions are very much appreciated. 🥳

## License

Copyright (c) 2018 SAP SE or an SAP affiliate company. All rights reserved.
This project is licensed under the Apache Software License, Version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
