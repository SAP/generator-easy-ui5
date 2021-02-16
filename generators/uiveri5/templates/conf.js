exports.config = {
  profile: "integration",
  baseUrl: "<%= baseUrl %>"<% if (chosenReporters.length) { %>,
  reporters: [<% chosenReporters.forEach(function (reporter) { %>
    {
      name: "./reporter/<%= reportersMap[reporter] %>"<% if (reporter === "SauceLabs") { %><% if (saucelabsResultsUrl) { %>,
      resultsUrl: "<%= saucelabsResultsUrl %>"<% } %><% if (saucelabsLoginUrl) { %>,
      loginUrl: "<%= saucelabsLoginUrl %>"<% } %><% } %>
    },<% }) %>
  ]<% } %><% if (viewtype) { %>,
  specs: ["./<%= dirname %>/*.spec.js"]<% } %><% if (auth && authMap[auth]) { %>,
  auth: {
    // provide credentials as params when running the test:
    // uiveri5 --params.user=<user> --params.pass=<pass>
    "<%= authMap[auth] %>": {
      user: "${params.user}",
      pass: "${params.pass}"
    }
  }<% } %><% if (chosenReporters.indexOf("SauceLabs") > -1) { %>,

  // open the browser on SauceLabs cloud
  seleniumAddress: "https://<user>:<key>@ondemand.eu-central-1.saucelabs.com:443/wd/hub",

  browsers: [{
    // define the runtime according UIVeri5 naming scheme
    browserName: "edge",
    platformName: "windows",
    capabilities: {
      // override runtime with SauceLabs specific names
      platform: "Windows 10",
      browserName: "MicrosoftEdge",
      // add details for your SauceLabs test execution
      name: "my-test",
      tags: ["UIVeri5"],
      build: process.env.BUILD_NUMBER
    }
  }]<% } %>
};
