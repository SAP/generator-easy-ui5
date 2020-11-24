<% function upperFirst (str) { return str.charAt(0).toUpperCase() + str.substr(1);} %><% Object.keys(uiveri5pos).forEach(function (poFile) { %>require("./pages/<%= poFile %>");
<% }) %>
describe("<%= suiteName %>", function () {

  it("<%= specName %>", function () {
    // add actions and assertions here

    expect(true).toBeTruthy();
  });

  <% Object.keys(uiveri5pos).forEach(function (poFile) { %>it("should see the <%= upperFirst(poFile) %> page", function () {
    // call the page object's actions and assertions:
    // When.onThe<%= upperFirst(poFile) %>Page.iDoSomething();
    // Then.onThe<%= upperFirst(poFile) %>Page.iAssertSomething();<% if (uiveri5pos[poFile].action) { %>

    When.onThe<%= upperFirst(poFile) %>Page.<%= uiveri5pos[poFile].action %>();<% } %><% if (uiveri5pos[poFile].assertion) { %>
    Then.onThe<%= upperFirst(poFile) %>Page.<%= uiveri5pos[poFile].assertion %>();<% } %>
  });

<% }) %>

});
