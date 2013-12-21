var inherits = require("inherits");

var ElementProperty = require("./elementproperty");

module.exports = (function () {

  function StringProperty() {
    ElementProperty.apply(this, arguments); // Call parent constructor
  }

  inherits(StringProperty, ElementProperty);

  return StringProperty;

})();
