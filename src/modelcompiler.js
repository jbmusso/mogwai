var Model = require("./model"),
  // Inspired by CoffeeScript
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) {
    for (var key in parent) {
      if (__hasProp.call(parent, key)) child[key] = parent[key];
    }

    function ctor() {
      this.constructor = child;
    }

    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
  };


module.exports = Mogwai = (function() {
  function ModelCompiler(base) {
    this.base = base;
  }

  /*
   * Dynamically build an instantiable Model class from a Schema
   *
   * @inspiredBy: https://github.com/LearnBoost/mongoose/blob/a04860f30f03c44029ea64ec2b08e723e6baf899/lib/model.js#L2454
   *
   * @return {Class}
   */
  ModelCompiler.prototype.compile = function(name, schema) {
    console.log("-- Compiling Model: "+name);
    self = this;

    // Make current model class extends Model class
    model = (function (_super) {
      __extends(model, _super);
      function model() {
        return model.__super__.constructor.apply(this, arguments);
      }

      // Bind grex client to model as g property
      // We're doing so because models are very likely to be compiled *before* the connection is fully established (grex connects async).
      g = function(){
        return self.base.connection.grex;
      };
      model.__defineGetter__("g", g);
      model.prototype.__defineGetter__("g", g);

      // Define vertex _type as model's name. This could be improved.
      model.prototype.type = name.toLowerCase();
      model.foo = "bar";

      return model;

    })(Model);

    // Add instance methods
    for (var fnName in schema.methods) {
      model.prototype[fnName] = schema.methods[fnName];
    }

    // Add class methods
    for (var fnName in schema.statics) {
      model[fnName] = schema.statics[fnName];
    }

    model.schema = schema;

    // Model.createIndexes(schema);
    console.log("-- Done compiling --\n");

    return model;
  };

  return ModelCompiler;
})();
