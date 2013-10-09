var Model = require("./model"),
    __extends = require("./extends");

module.exports = ModelCompiler = (function() {
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
    var self = this;

    model = (function (_super) {
      // Inherit from Model
      __extends(model, _super);

      function model() {
        return model.__super__.constructor.apply(this, arguments);
      }

      return model;

    })(Model);

    // Add grex getter to model
    model.prototype.base = model.base = self.base;
    model.prototype.connection = model.connection = self.base.connection; //todo: replace by a getter?
    // Define vertex _type as model's name. This could be improved.
    model.prototype.type = model.type = name.toLowerCase();
    model.prototype.schema = model.schema = schema;

    var g = {
      get: function() { return self.base.connection.grex; }
    };
    Object.defineProperty(model, "g", g);
    Object.defineProperty(model.prototype, "g", g);

    // Add instance methods
    for (var fnName in schema.methods) {
      model.prototype[fnName] = schema.methods[fnName];
    }

    // Add class methods
    for (var fnName in schema.statics) {
      model[fnName] = schema.statics[fnName];
    }

    model.init();

    return model;
  };

  return ModelCompiler;
})();
