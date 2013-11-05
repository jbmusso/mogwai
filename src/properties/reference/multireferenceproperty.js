var _ = require("underscore");

var ReferenceProperty = require("./referenceproperty");

/**
 * A Model MultiReferenceProperty can hold one or more reference to another
 * Model (internally stored as a Vertex in the database).
 */
module.exports = MultiReferenceProperty = (function () {
  /**
   * Constructor.
   *
   * MultiReferenceProperty holds an array of value as References to other
   * vertices.
   *
   * MultiReferenceProperty can not be indexed.
   */
  function MultiReferenceProperty() {
    ReferenceProperty.apply(this, arguments); // Call parent constructor

    this.indexable = false;

    this.value = [];
    this.type = null;
  }

  // Inherit from ReferenceProperty
  MultiReferenceProperty.prototype = Object.create(ReferenceProperty.prototype);
  MultiReferenceProperty.prototype.constructor = MultiReferenceProperty;

  MultiReferenceProperty.prototype.applyDefinition = function(propertyDefinition) {
    this.label = propertyDefinition.label;
    this.cardinality = propertyDefinition.cardinality;
    this.type = propertyDefinition.type[0];
  };

  /**
   * Attach this property as a *pushable array* to a given model prototype.
   *
   * @param {Model} model
   */
  MultiReferenceProperty.prototype.attachToModel = function(model) {
    var self = this;

    var propertyDefinition = {
      get: function() {
        return self.value;
      },
      set: function(data) {
        if (_.isArray(data) === false) {
          console.log("WARN: MultiReferenceProperty value set to a non-array data: "+ data);
        }
        self.value = data;
      }
    };

    Object.defineProperty(model, this.name, propertyDefinition);
    // Also make that property pushable directly from the model instance
    model[this.name].push = this.value.push;
  };

  return MultiReferenceProperty;

})();
