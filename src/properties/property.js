var _ = require("underscore"),
    Model = require("./reference");

module.exports = Property = (function() {
  /**
   * An abstract Class defining a Model property.
   *
   * @param {String} name
   */
  function Property(name) {
    this.name = name;
    this.type = this.constructor.name.substring(0, this.constructor.name.length - 8);

    this.index = false;
    this.unique = false;
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
      string: require("./string"),
      reference: require("./reference"),
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
   * Get the Rexster data type as a string (ie. "Integer.class",
   * "Object.class").
   *
   * @return {String}
   * @public
   */
  Property.prototype.getDataType = function() {
    return this.type +".class";
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


  return Property;

})();
