# Contributing to Easy-UI5

We welcome any type of contribution (code contributions, pull requests, issues) to this easy-ui5 generator equally.

## Analyze Issues

Analyzing issue reports can be a lot of effort. Any help is welcome! Go to the Github [issue tracker](https://github.com/SAP/generator-easy-ui5/issues?q=is%3Aopen) and find an open issue which needs additional work or a bugfix.

Additional work may be further information, or a minimized example or gist, or it might be a hint that helps understanding the issue. Maybe you can even find and contribute a bugfix?

## Report an Issue

If you find a bug - behavior of easy-ui5 code contradicting its specification - you are welcome to report it. We can only handle well-reported, actual bugs, so please follow the guidelines below before reporting the issue to the Github [issue tracker](https://github.com/SAP/generator-easy-ui5/issues)

### Quick Checklist for Bug Reports

Issue report checklist:

- Real, current bug
- No duplicate
- Reproducible
- Good summary
- Well-documented
- Minimal example
- Use the [template](https://github.com/SAP/generator-easy-ui5/issues/new)

### Issue Reporting Disclaimer

We want to improve the quality of easy-ui5 and good bug reports are welcome! But our capacity is limited, so we cannot handle questions or consultation requests and we cannot afford to ask for required details. So we reserve the right to close or to not process insufficient bug reports in favor of those which are very cleanly documented and easy to reproduce. Even though we would like to solve each well-documented issue, there is always the chance that it won't happen - remember: easy-ui5 is Open Source and comes without warranty.

Bug report analysis support is very welcome! (e.g. pre-analysis or proposing solutions)

## Contributing Code

### General Remarks

You are welcome to contribute code to the easy-ui5 generator in order to fix bugs or to implement new features.

My **overall vision for this project** is to support basic scaffolding for multiple runtimes/deployment scenarios. I don’t want to go down the road of providing different templates (List Report, Master-detail page etc.) because this will increase the complexity of maintaining the project and makes it more complicated to use. It makes sense to have these features but this should be done by a dedicated development team then. When you look for these features, please check out the [SAP Fiori Tools - Extension Pack](https://marketplace.visualstudio.com/items?itemName=SAPSE.sap-ux-fiori-tools-extension-pack) actually provides a generator that can be used to create Fiori Elements apps that can be published to ABAP systems and SAP BTP. The team is working hard to add more templates in the future.

**Not all proposed contributions can be accepted**. Some features may just fit a third-party add-on better. The code must match the overall direction of the easy-ui5 generator and improve it. So there should be some "bang for the byte". For most bug fixes this is a given, but a major feature implementation first needs to be discussed with one of the committers. Possibly, one who touched the related code or module recently. The more effort you invest, the better you should clarify in advance whether the contribution will match the project's direction. The best way would be to just open an enhancement ticket in the issue tracker to discuss the feature you plan to implement (make it clear that you intend to contribute). We will then forward the proposal to the respective code owner. This avoids disappointment.

## Developer Certificate of Origin (DCO)

Due to legal reasons, contributors will be asked to accept a DCO before they submit the first pull request to this projects, this happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## How to contribute - the Process

Make sure the change would be welcome (e.g. a bugfix or a useful feature); best do so by proposing it in a GitHub issue

1. Create a branch forking the generator-easy-ui5 repository and do your change.

2. Commit (with a commit message following the [conventional-commit](https://www.conventionalcommits.org/) syntax) and push your changes on that branch

3. If your change fixes an issue reported at GitHub, add a [keyword](https://help.github.com/articles/closing-issues-using-keywords/) like `fix <issue ID>` to the commit message:

4. Create a Pull Request to this repository

5. Wait for our code review and approval, possibly enhancing your change on request

Note that the developers also have their regular duties, so depending on the required effort for reviewing, testing and clarification this may take a while

6. Once the change has been approved we will inform you in a comment

## How to release - the Process

:warning: NPM > v8.x must be used for the release process!

First, make sure that you pull the latest state of the GitHub repository and then proceed with the following steps:

1. Update the version: `npm version patch|minor|major`

2. Push the new commit and tag: `git push && git push --tags`

A GitHub action will do the needful once the new tag has been pushed.
