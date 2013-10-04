var Model = require("./model")
  , Schema;

module.exports = Schema = (function() {

  function Schema(fields) {
    this.fields = {};
    this.statics = {};
    this.methods = {};

    this.add(fields);
  }


  Schema.prototype.plugin = function(fn, options) {
    fn(this, options);
    return this;
  };


  Schema.prototype.add = function(fields) {
    for (var fieldName in fields) {
      this.fields[fieldName] = fields[fieldName].type;
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

  return Schema;

})();
