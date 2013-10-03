var Mogwai;

var grex = require("grex")
  , Schema = require("./schema")
  , Model = require("./model");

module.exports = Mogwai = (function() {

  Mogwai.prototype.Schema = Schema;

  function Mogwai() {
    console.log("Loading Mogwai, object-to-graph mapper");
    this.schemas = {};
    this.models = {};
  }


  Mogwai.prototype.connect = function(settings, callback) {
    var self = this;
    
    grex.connect(settings)
    .then(function (graphDB) {
      var model, modelName, _ref;
      self.g = graphDB;
      _ref = self.models;
      for (modelName in _ref) {
        model = _ref[modelName];
        model.g = graphDB;
        model.prototype.g = graphDB;
      }
      return callback(null, graphDB);
    })
    .fail(function(error) {
      return console.log(error);
    });
  };


  Mogwai.prototype.disconnect = function() {
    this.db.disconnect();
  };


  Mogwai.prototype.hasSchema = function(schemaName) {
    return this.schemas[schemaName] != null;
  };


  Mogwai.prototype.registerSchema = function(schemaName, schema) {
    this.schemas[schemaName] = schema;
    this.models[schemaName] = Model.compile(schemaName, schema, this);
  };


  Mogwai.prototype.getSchema = function(schemaName) {
    return this.schemas[schemaName];
  };


  Mogwai.prototype.getModel = function(modelName) {
    return this.models[modelName];
  };


  Mogwai.prototype.model = function(modelName, schema) {
    if (this.hasSchema(modelName)) {
      return this.getModel(modelName);
    }
    this.registerSchema(modelName, schema);
    return this.getModel(modelName);
  };

  return Mogwai;

})();
