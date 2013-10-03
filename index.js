var Mogwai = require("./lib/mogwai");

var Singleton = (function() {
  var instance = null;

  function Singleton() {}

  Singleton.get = function() {
    return instance != null ? instance : instance = new Mogwai();
  };

  return Singleton;

})();

module.exports = Singleton.get();
