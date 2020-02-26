// eslint-disable-next-line
window.suite = function() {
  "use strict";

  // eslint-disable-next-line
  var oSuite = new parent.jsUnitTestSuite(),
    sContextPath = location.pathname.substring(0, location.pathname.lastIndexOf("/") + 1);

  oSuite.addTestPage(sContextPath + "integration/opaTests.qunit.html");

  return oSuite;
};
