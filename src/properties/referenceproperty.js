var Property = require("./property");

module.exports = ReferenceProperty = (function () {

  function ReferenceProperty() {
    Property.apply(this, arguments); // Call parent constructor
    this.indexable = false;
  }

  // Inherit from Property
  ReferenceProperty.prototype = Object.create(Property.prototype);
  ReferenceProperty.prototype.constructor = ReferenceProperty;

  /**
   * Apply a property definition, retrieves some information about that
   * property (whether it should be indexed, unique, etc.).
   *
   * @param {Object} property definition
   * @private
   */
  ReferenceProperty.prototype.applyDefinition = function(propertyDefinition) {
    return;
  };

  /**
   * ReferenceProperties cannot be indexed.
   * Only vertex or edge properties can be indexed.
   *
   * @return {Boolean} false
   */
  ReferenceProperty.prototype.isIndexed = function() {
    return false;
  };


  return ReferenceProperty;

})();
