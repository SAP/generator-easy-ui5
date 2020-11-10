<% function upperFirst (str) { return str.charAt(0).toUpperCase() + str.substr(1);} %>require("./pages/<%= poFile %>");

describe("<%= poFile %>Example", function () {

  it("should see the <%= upperFirst(poName) %> page", function () {
    // call the page object's actions and assertions:
    // When.onThe<%= upperFirst(poName) %>Page.iDoSomething();
    // Then.onThe<%= upperFirst(poName) %>Page.iAssertSomething();<% if (action) { %>

    When.onThe<%= upperFirst(poName) %>Page.<%= action %>();<% } %><% if (assertion) { %>
    Then.onThe<%= upperFirst(poName) %>Page.<%= assertion %>();<% } %>
  });

});
