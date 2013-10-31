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
   * Builds a property with a given definition, returning an appropriate
   * property class.
   *
   * @param {String} propertyName
   * @param {Object} propertyDefinition
   * @public
   */
  Property.build = function (propertyName, propertyDefinition) {
    console.log("==build==", propertyName);
    var property;
    var propertyTypes = {
      string: require("./stringproperty"),
      reference: require("./referenceproperty"),
    };

    var typeName = Property.retrieveType(propertyDefinition);
    console.log(typeName);

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
    // console.log("==retrieveType==");
    // console.log(propertyDefinition);

    if (typeof propertyDefinition === "function") {
      return propertyDefinition.name.toLowerCase();
    }

    if (propertyDefinition.type.name === "model") {
      // console.log("--reference--");
      return "reference";
    } else {
      console.log(propertyDefinition.type.name);
      return propertyDefinition.type.name.toLowerCase();
    }
  };

  /**
   * Get the Rexster data type as a string (ie. "Integer.class",
   * "Object.class").
   *
   * @return {String}
   * @public
   */
  Property.prototype.getDataType = function() {
    return this.type +".class";
  };

  return Property;

})();
