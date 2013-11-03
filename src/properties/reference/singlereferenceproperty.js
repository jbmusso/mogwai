var ReferenceProperty = require("./referenceproperty");

/**
 * A reference to a Single model (ie cardinality constraint "OneToOne" or
 * "ManyToOne").
 * For example:
 * - a 'father' property will have a ManyToOne cardinality with "childrenOf"
 *    label
 * - a 'spouse' property will have a OneToOne cardinality with "spouseOf" label
 */
module.exports = SingleReferenceProperty = (function () {
  /**
   * Constructor
   */
  function SingleReferenceProperty() {
    ReferenceProperty.apply(this, arguments); // Call parent constructor
    this.indexable = false;
  }

  // Inherit from ReferenceProperty
  SingleReferenceProperty.prototype = Object.create(ReferenceProperty.prototype);
  SingleReferenceProperty.prototype.constructor = SingleReferenceProperty;

  SingleReferenceProperty.prototype.applyDefinition = function(propertyDefinition) {
    this.label = propertyDefinition.label;
    this.cardinality = propertyDefinition.cardinality;
    this.type = propertyDefinition.type;
  };

  return SingleReferenceProperty;

})();
