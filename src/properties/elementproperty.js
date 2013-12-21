var inherits = require("inherits");

var Property = require("./property");

module.exports = (function () {

  function ElementProperty() {
    Property.apply(this, arguments); // Call parent constructor

    this.type = this.constructor.name.substring(0, this.constructor.name.length - 8);

    this.indexable = true;

    this.index = false;
    this.unique = false;
  }

  inherits(ElementProperty, Property);

  /**
   * Apply a property definition, retrieves some information about that
   * property (whether it should be indexed, unique, etc.).
   *
   * @param {Object} property definition
   * @private
   */
  ElementProperty.prototype.applyDefinition = function(propertyDefinition) {
    if (propertyDefinition.hasOwnProperty("index")) {
      this.index = propertyDefinition.index;
    }

    // A unique property is automatically indexed
    if (propertyDefinition.hasOwnProperty("unique")) {
      this.unique = propertyDefinition.unique;
      this.index = true;
    }
  };

  /**
   * Check whether the property should hold unique value or not.
   *
   * @return {String}
   * @public
   */
  ElementProperty.prototype.isUnique = function() {
    return this.unique;
  };

  /**
   * Get the Rexster data type as a string (ie. "Integer.class",
   * "Object.class").
   *
   * @return {String}
   * @public
   */
  ElementProperty.prototype.getDataType = function() {
    return this.type +".class";
  };

  /**
   *
   */
   ElementProperty.prototype.getAsModelDefinition = function() {
    var modelDefinition = {
      get: function() {

      }
    };

    return modelDefinition;
  };


  return ElementProperty;

})();
