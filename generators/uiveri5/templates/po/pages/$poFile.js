module.exports = createPageObjects({
	<%= poName %>: {
		actions: {
			// add action functions here
			<% if (action) { %><%= action %>: function () {
				element(by.control({
					controlType: "sap.m.Button"
				})).click();
			}<% } %>
		},
		assertions: {
			// add assertion functions here
			<% if (assertion) { %><%= assertion %>: function () {
				expect(element(by.control({
					controlType: "sap.m.Button"
				})).isDisplayed()).toBeTruthy();
			}<% } %>
		}
	}
});
