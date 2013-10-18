var Model = require("./model"),
    Property = require("./properties/property");

module.exports = Schema = (function() {

  function Schema(properties) {
    this.properties = {};
    this.statics = {};
    this.methods = {};
    this.indexes = [];

    this.add(properties);
  }


  Schema.prototype.plugin = function(pluginDefinition, options) {
    pluginDefinition(this, options);
    return this;
  };


  Schema.prototype.add = function(properties) {
    var propertyDefinition, property;

    for (var propertyName in properties) {
      propertyDefinition = properties[propertyName];
      property = Property.build(propertyName, propertyDefinition);
      this.properties[propertyName] = property;
    }
  };


  /*
   * Add a model instance method definition to current schema
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


  /*
   * Add a static model method definition to current schema
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


  Schema.prototype.index = function(propertyName) {
    this.indexes.push(propertyName);
  };

  return Schema;

})();
