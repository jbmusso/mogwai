var _ = require("underscore");

module.exports = Property = (function() {
  /**
   * An abstract Class defining a Model property.
   *
   * @param {String} name
   */
  function Property(name) {
    this.name = name;
  }

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
   * Check whether
   * @public
   */
  Property.prototype.isIndexable = function() {
    return this.indexable;
  };

  /**
   * Builds a property with a given definition, returning an appropriate
   * property class.
   *
   * @param {String} propertyName
   * @param {Object} propertyDefinition
   * @public
   */
  Property.build = function (propertyName, propertyDefinition) {
    var property;
    var propertyTypes = {
      string: require("./stringproperty"),
      reference: require("./referenceproperty"),
    };

    var typeName = Property.retrieveType(propertyDefinition);

    try {
      property = new propertyTypes[typeName](propertyName, propertyDefinition);
      property.applyDefinition(propertyDefinition);
    } catch(e) {
      console.error("Property Error: Unsupported property type: "+ e);
    }

    return property;
  };

  /**
   * Retrieve the type of a property, as a string, from a property definition.
   *
   * @param {Object} propertyDefinition
   * @return {String} name of the type
   */
  Property.retrieveType = function(propertyDefinition) {
    var type;

    if (typeof propertyDefinition === "function") {
      return propertyDefinition.name.toLowerCase();
    }

    if (propertyDefinition.type.name === "model") {
      return "reference";
    } else {
      return propertyDefinition.type.name.toLowerCase();
    }
  };

  return Property;

})();
