var _ = require("underscore");

/**
 * An abstract Class defining a Model property.
 *
 */
module.exports = Property = (function() {
  /**
   * Constructor
   *
   * @param {String} name - name of the property (ie 'email' for user.email)
   */
  function Property(name) {
    this.name = name;
    this.value = null;
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

  Property.prototype.attachToSchema = function(schema) {
    throw new Error("Not yet implemented");
  };

  Property.prototype.attachToModel = function(model) {
    throw new Error("Not yet implemented");
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
      single: require("./reference/singlereferenceproperty"),
      multi: require("./reference/multireferenceproperty"),
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
    if (typeof propertyDefinition === "function") {
      return propertyDefinition.name.toLowerCase();
    }

    if (_.isArray(propertyDefinition.type)) {
      // Multi reference
      return "multi";
    } else {
      // Single reference
      if (propertyDefinition.type.name === "model") {
        return "single";
      } else {
        return propertyDefinition.type.name.toLowerCase();
      }
    }
  };

  return Property;

})();
