var ElementProperty = require("./elementproperty");

module.exports = StringProperty = (function () {

  function StringProperty() {
    ElementProperty.apply(this, arguments); // Call parent constructor
  }

  // Inherit from ElementProperty
  StringProperty.prototype = Object.create(ElementProperty.prototype);
  StringProperty.prototype.constructor = StringProperty;


  return StringProperty;

})();
