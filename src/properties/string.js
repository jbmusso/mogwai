var Property = require("./property");

module.exports = StringProperty = (function () {

  function StringProperty() {
    Property.apply(this, arguments); // Call parent constructor
  }

  // Inherit from Property
  StringProperty.prototype = Object.create(Property.prototype);
  StringProperty.prototype.constructor = StringProperty;


  return StringProperty;

})();
