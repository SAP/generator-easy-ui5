# [Easy UI5](https://ui5.sap.com/) Generator
>Easy-ui5 is a [Yeoman](http://yeoman.io/) generator which enables you to create simple OpenUI5-based web-apps within seconds.

<!-- *********************************************************************** -->


**Disclaimer:** This is an alpha release!
The UI5 generator here is not intended for productive use yet. Breaking changes are to be expected.



<!-- *********************************************************************** -->
## Installing the generator
### Requirements

1. Get [Node.js](https://nodejs.org/en/download/) (version 8.5 or higher ⚠️)
2. Install the generator
```sh
npm install -g yo easy-ui5
```
3. Verify your installation
```sh
yo
```


### Optional Steps
Depending on your target platform you have to install the following tools
#### Deploy to Cloud Foundry
1. [Create a free](https://developers.sap.com/mena/tutorials/hcp-create-trial-account.html) SAP Cloud Platform Cloud  account
2. [Set your environment up](https://developers.sap.com/tutorials/hcp-cf-getting-started.html) and connect to your Cloud Foundry endpoint
  ```sh
  cf login
  ```


## Getting Started
Create your first OpenUI5 App within seconds!

1. Scaffold your OpenUI5 project
```
yo easy-ui5
```
3. Run it locally
```
cd <your project name>
npm start
```
4. Deploy it to SAP Cloud Platform
```
npm run deploy-to-cf
```

<!-- *********************************************************************** -->
## Support

Please use the GitHub bug tracking system to post questions, bug reports or to create pull requests.
This project is provided "as-is": there is no guarantee that raised issues will be answered or addressed in future releases.


<!-- *********************************************************************** -->
## Contributing

You are welcome to contribute code to the Easy-UI5 generator in order to fix bugs or to implement new features.

<!-- *********************************************************************** -->
## TODO

The following aspects/features are not yet implemented:
* Tests / Continuous Integration Workflow
* Init git after project creation
* Add more target platforms:
  * Neo env
  * SAP HANA
  * SAP NetWeaver

## License

Copyright (c) 2018 SAP SE or an SAP affiliate company. All rights reserved.
This project is licensed under the Apache Software License, Version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
