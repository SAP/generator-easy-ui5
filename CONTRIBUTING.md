# Contributing to Easy-UI5

We welcome any type of contribution (code contributions, pull requests, issues) to this easy-ui5 generator equally.

## Analyze Issues

Analyzing issue reports can be a lot of effort. Any help is welcome! Go to the Github [issue tracker](https://github.com/SAP/generator-easy-ui5/issues?q=is%3Aopen) and find an open issue which needs additional work or a bugfix.

Additional work may be further information, or a minimized example or gist, or it might be a hint that helps understanding the issue. Maybe you can even find and contribute a bugfix?

## Report an Issue

If you find a bug - behavior of easy-ui5 code contradicting its specification - you are welcome to report it. We can only handle well-reported, actual bugs, so please follow the guidelines below before reporting the issue to the Github [issue tracker](https://github.com/SAP/generator-easy-ui5/issues)

### Quick Checklist for Bug Reports
Issue report checklist:

* Real, current bug
* No duplicate
* Reproducible
* Good summary
* Well-documented
* Minimal example
* Use the [template](https://github.com/SAP/generator-easy-ui5/issues/new)

### Issue Reporting Disclaimer
We want to improve the quality of easy-ui5 and good bug reports are welcome! But our capacity is limited, so we cannot handle questions or consultation requests and we cannot afford to ask for required details. So we reserve the right to close or to not process insufficient bug reports in favor of those which are very cleanly documented and easy to reproduce. Even though we would like to solve each well-documented issue, there is always the chance that it won't happen - remember: easy-ui5 is Open Source and comes without warranty.

Bug report analysis support is very welcome! (e.g. pre-analysis or proposing solutions)


## Contributing Code
### General Remarks
You are welcome to contribute code to the easy-ui5 generator in order to fix bugs or to implement new features.

There are two important things to know:

1. You must be aware of the Apache License (which describes contributions) and **agree to the Contributors License Agreement**. This is common practice in major Open Source projects. To make this process as simple as possible, we are using *[CLA assistant](https://cla-assistant.io/)* for individual contributions. CLA assistant is an open source tool that integrates with GitHub very well and enables a one-click experience for accepting the CLA. For company contributers, special rules apply. See the [respective section](#company-contributors) below for details.
3. **Not all proposed contributions can be accepted**. Some features may just fit a third-party add-on better. The code must match the overall direction of the easy-ui5 generator and improve it. So there should be some "bang for the byte". For most bug fixes this is a given, but a major feature implementation first needs to be discussed with one of the committers. Possibly, one who touched the related code or module recently. The more effort you invest, the better you should clarify in advance whether the contribution will match the project's direction. The best way would be to just open an enhancement ticket in the issue tracker to discuss the feature you plan to implement (make it clear that you intend to contribute). We will then forward the proposal to the respective code owner. This avoids disappointment.

### Contributor License Agreement
When you contribute code, documentation, or anything else, you have to be aware that your contribution is covered by the same [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0) that is applied to the easy-ui5 generator itself.

In particular, you need to agree to the Individual Contributor License Agreement, which can be [found here](https://gist.github.com/CLAassistant/bd1ea8ec8aa0357414e8). This applies to all contributors, including those contributing on behalf of a company.

If you agree to its content, you simply have to click on the link posted by the CLA assistant as a comment in the pull request. Click it to check the CLA, then accept it on the following screen if you agree to it. The CLA assistant saves this decision for upcoming contributions to that repository and notifies you, if there is any change to the CLA in the meantime.

### Company Contributors
If employees of a company contribute code, in **addition** to the individual agreement mentioned above, one company agreement must be submitted. This is mainly for the protection of the contributing employees.

A company representative authorized to do so needs to download, fill in, and print the [Corporate Contributor License Agreement](/docs/SAP%20Corporate%20Contributor%20License%20Agreement.pdf) form and then proceed with one of the following options:

- Scan and e-mail it to [opensource@sap.com](mailto:opensource@sap.com)
- Fax it to: +49 6227 78-45813
- Send it by traditional letter to:  
  *Industry Standards & Open Source Team*  
  *Dietmar-Hopp-Allee 16*  
  *69190 Walldorf*  
  *Germany*

The form contains a list of employees who are authorized to contribute on behalf of your company. When this list changes, please let us know.


## How to contribute - the Process
Make sure the change would be welcome (e.g. a bugfix or a useful feature); best do so by proposing it in a GitHub issue

1. Create a branch forking the generator-easy-ui5 repository and do your change.

2. Commit and push your changes on that branch

3. If your change fixes an issue reported at GitHub, add a [keyword](https://help.github.com/articles/closing-issues-using-keywords/) like `fix <issue ID>` to the commit message:

4. Create a Pull Request to this repository

5. Follow the link posted by the CLA assistant to your pull request and accept it, as described in detail above.

6. Wait for our code review and approval, possibly enhancing your change on request

  Note that the developers also have their regular duties, so depending on the required effort for reviewing, testing and clarification this may take a while

7. Once the change has been approved we will inform you in a comment
