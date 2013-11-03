var Model = require("./model"),
    Property = require("./properties/property");

module.exports = Schema = (function() {
  /**
   * The definition of a Model class
   *
   * @param {Object} properties - The description of all the model properties
   *      with their name, type, index rules, etc.
   */
  function Schema(properties) {
    this.properties = {};
    this.selfProperties = {}; // Properties set to the underlying Vertex.
    this.refProperties = {}; // Properties referencing to other vertices

    this.statics = {};
    this.methods = {};
    this.indexes = [];

    this.add(properties);
  }

  /**
   * Register a plugin to this Schema. Can be chained.
   *
   * @param {Function} pluginDefinition
   * @param {Object} options - options to pass to the plugin
   * @return {Schema} this schema
   */
  Schema.prototype.plugin = function(pluginDefinition, options) {
    pluginDefinition(this, options);
    return this;
  };

  /**
   * Add new properties to this Schema according to their definition.
   *
   * Typically used by plugins, though you may also use it directly in the
   * Schema if you do not wish to define properties in the Schema constructor.
   *
   * @param {Object} properties
   */
  Schema.prototype.add = function(properties) {
    var propertyDefinition, property;

    for (var propertyName in properties) {
      propertyDefinition = properties[propertyName];
      property = Property.build(propertyName, propertyDefinition);
      this.properties[propertyName] = property;

      // Tell that property to attach itself in the schema, either into
      // refProperties or into selfProperties, depending on its type.
      property.attachToSchema(this);
    }
  };

  /**
   * Add a model instance method definition to the Schema.
   * Also accepts a named Function as first (and only) parameter.
   *
   * @param {String} name - name of the instance method
   * @param {Function} functionDefinition
   */
  Schema.prototype.method = function(name, functionDefinition) {
    if (typeof name !== "string") {
      for (var i in name) {
        this.methods[i] = name[i];
      }
    } else {
      this.methods[name] = functionDefinition;
    }

    return this;
  };

  /**
   * Add a static model method definition to the Schema.
   * Also accepts a named Function as first (and only) parameter.
   *
   * @param {String} name - name of the static method
   * @param {Function} functionDefinition
   */
  Schema.prototype.static = function(name, functionDefinition) {
    if (typeof name !== "string") {
      for (var i in name) {
        this.statics[i] = name[i];
      }
    } else {
      this.statics[name] = functionDefinition;
    }

    return this;
  };

  /**
   * Tells the Schema that this property should be indexed.
   * This method is typically used in plugins, though you may use it in your
   * Schema definition as well.
   *
   * @param {String} propertyName
   */
  Schema.prototype.index = function(propertyName) {
    this.indexes.push(propertyName);
  };

  return Schema;

})();
