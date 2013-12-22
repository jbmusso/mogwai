var inherits = require("inherits");

var Property = require("../property");

module.exports = (function () {
  'use strict';

  function ReferenceProperty() {
    Property.apply(this, arguments); // Call parent constructor
    this.indexable = false;
  }

  inherits(ReferenceProperty, Property);

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


  ReferenceProperty.prototype.getAsModelDefinition = function() {
    throw "Not yet implemented";

  };

  return ReferenceProperty;

})();
