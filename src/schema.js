var Model = require("./model"),
    Property = require("./property");

module.exports = Schema = (function() {

  function Schema(properties) {
    this.properties = {};
    this.statics = {};
    this.methods = {};
    this.indexes = [];

    this.add(properties);
  }


  Schema.prototype.plugin = function(fn, options) {
    fn(this, options);
    return this;
  };


  Schema.prototype.add = function(properties) {
    var propertyDefinition, property;

    for (var propertyName in properties) {
      propertyDefinition = properties[propertyName];
      property = new Property(propertyName, propertyDefinition);
      this.properties[propertyName] = property;
    }
  };


  /*
   * Add a model instance method definition to current schema
   */
  Schema.prototype.method = function(name, fn) {
    if (typeof name !== "string") {
      for (var i in name) {
        this.methods[i] = name[i];
      }
    } else {
      this.methods[name] = fn;
    }

    return this;
  };


  /*
   * Add a static model method definition to current schema
   */
  Schema.prototype.static = function(name, fn) {
    if (typeof name !== "string") {
      for (var i in name) {
        this.statics[i] = name[i];
      }
    } else {
      this.statics[name] = fn;
    }

    return this;
  };


  Schema.prototype.index = function(propertyName) {
    this.indexes.push(propertyName);
  };

  return Schema;

})();
