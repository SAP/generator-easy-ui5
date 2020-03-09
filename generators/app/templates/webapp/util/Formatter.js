sap.ui.define([],
  function () {
    "use strict";

    let Formatter = {};

    Formatter.test = function (sIn) {
      const sOut = `${sIn} - transformed`;
      return sOut;
    };

    return Formatter;
  }, true);
