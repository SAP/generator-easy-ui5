// more on wdi5, syntax, and optional page object patterns at
// https://github.com/js-soft/wdi5
// https://blogs.sap.com/2020/11/19/state-of-testing-in-ui5-opa5-uiveri5-and-wdi5/

describe("basic wdi5 tests", () => {
    it("should validate the running app", () => {
        const _selector = {
            // forceSelect: true, // only use if reselect is necessary after re-rendering of UI
            selector: {
                viewName: "<%= projectname ? namespace + '.' + projectname : namespace %>.<%= viewname ? 'view.' + viewname : 'view.MainView.xml' %>",
                id: "idAppControl"
            }
        }
        const App = browser.asControl(_selector)
        expect(App.getVisible() /* UI5 Control API */).toBeTruthy()
    })
})
