module.exports = Property = (function() {

  function Property(name) {
    this.name = name;
    this.type = this.constructor.name.substring(0, this.constructor.name.length - 8);

    this.index = false;
    this.unique = false;
  }


  /*
   * Builds a property with a given definition, returning an appropriate
   * property class.
   *
   * @param {String} name
   * @param {Object} propertyDefinition
   */
  Property.build = function (name, propertyDefinition) {
    var propertyTypes = {
      string: require("./string")
    };

    var type = Property.retrieveType(propertyDefinition);

    try {
      var property = new propertyTypes[type](name, propertyDefinition);
      property.applyDefinition(propertyDefinition);
    } catch(e) {
      console.error("Unsupported property type: "+ e);
    }

    return property;
  }

  /*
   * Retrieve the type of a property, as a string, from a property definition.
   *
   * @param {Object} propertyDefinition
   * @return {String} name of the type
   */
  Property.retrieveType = function(propertyDefinition) {
    var type;

    if (typeof propertyDefinition === "function") {
      type = propertyDefinition.name;
    } else {
      type = propertyDefinition.type.name;
    }

    return type.toLowerCase();
  }

  /*
   * Apply a property definition, retrieves some information about that
   * property (ie should it be indexed, unique, etc.).
   *
   * @param {Object} property definition
   * @api private
   */
  Property.prototype.applyDefinition = function(propertyDefinition) {
    if (propertyDefinition.hasOwnProperty("index")) {
      this.index = propertyDefinition.index;
    }

    if (propertyDefinition.hasOwnProperty("unique")) {
      this.unique = propertyDefinition.unique;
    }
  };

  /*
   * Get the Rexster data type as a string (ie. "Integer.class",
   * "Object.class").
   *
   * @return {String}
   * @api public
   */
  Property.prototype.getDataType = function() {
    return this.type +".class";
  };

  /*
   * Check whether the property should be indexed or not.
   *
   * @return {String}
   * @api public
   */
  Property.prototype.isIndexed = function() {
    return this.index;
  };

  /*
   * Check whether the property should hold unique value or not.
   *
   * @return {String}
   * @api public
   */
  Property.prototype.isUnique = function() {
    return this.unique;
  };


  return Property;

})();
