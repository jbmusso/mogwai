var Property = require("../property");

/**
 * Abstract class for Reference properties (which can ben either Single or
 * Multi reference properties).
 */
module.exports = ReferenceProperty = (function () {
  /**
   * Constructor
   */
  function ReferenceProperty() {
    Property.apply(this, arguments); // Call parent constructor
    this.indexable = false;

    this.label = null;
    this.cardinality = null;
  }

  // Inherit from Property
  ReferenceProperty.prototype = Object.create(Property.prototype);
  ReferenceProperty.prototype.constructor = ReferenceProperty;

  /**
   * Apply a property definition, retrieves some information about that
   * property (ie. label, cardinality, etc).
   *
   * @param {Object} property definition
   * @private
   */
  ReferenceProperty.prototype.applyDefinition = function(propertyDefinition) {
    this.label = propertyDefinition.label;
    this.cardinality = propertyDefinition.cardinality;
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

  /**
   * Attach this property to the schema as a *reference* property.
   *
   * @param {Schema} schema
   */
  ReferenceProperty.prototype.attachToSchema = function(schema) {
    schema.refProperties[this.name] = this;
  };

  ReferenceProperty.prototype.attachToModel = function(model) {
    throw new Error("Not yet implemented");
  };

  return ReferenceProperty;

})();
