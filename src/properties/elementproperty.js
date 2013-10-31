var Property = require("./property");

module.exports = ElementProperty = (function () {

  function ElementProperty() {
    Property.apply(this, arguments); // Call parent constructor

    this.type = this.constructor.name.substring(0, this.constructor.name.length - 8);

    this.index = false;
    this.unique = false;
  }

  // Inherit from Property
  ElementProperty.prototype = Object.create(Property.prototype);
  ElementProperty.prototype.constructor = ElementProperty;

  /**
   * Apply a property definition, retrieves some information about that
   * property (whether it should be indexed, unique, etc.).
   *
   * @param {Object} property definition
   * @private
   */
  Property.prototype.applyDefinition = function(propertyDefinition) {
    if (propertyDefinition.hasOwnProperty("index")) {
      this.index = propertyDefinition.index;
    }

    if (propertyDefinition.hasOwnProperty("unique")) {
      this.unique = propertyDefinition.unique;
    }
  };

  /**
   * Check whether the property should be indexed or not.
   *
   * @return {String}
   * @public
   */
  Property.prototype.isIndexed = function() {
    return this.index;
  };

  /**
   * Check whether the property should hold unique value or not.
   *
   * @return {String}
   * @public
   */
  Property.prototype.isUnique = function() {
    return this.unique;
  };


  return ElementProperty;

})();
