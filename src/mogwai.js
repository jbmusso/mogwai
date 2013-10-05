var Schema = require("./schema"),
    Model = require("./model"),
    Connection = require("./connection"),
    ModelCompiler = require("./modelcompiler");

module.exports = Mogwai = (function() {

  function Mogwai() {
    console.log("Loading Mogwai, object-to-graph mapper");
    this.schemas = {};
    this.models = {};
    this.modelCompiler = new ModelCompiler(this);

    this.connection = null;

    this.createConnection();
  }

  Mogwai.prototype.Schema = Schema;


  Mogwai.prototype.createConnection = function() {
    var connection = new Connection(this);
    this.connection = connection;
  };


  Mogwai.prototype.connect = function(settings, callback) {
    this.connection.open(settings, callback);
  };


  Mogwai.prototype.disconnect = function() {
    this.db.disconnect();
  };


  Mogwai.prototype.hasSchema = function(schemaName) {
    return this.schemas.hasOwnProperty(schemaName);
  };


  Mogwai.prototype.registerSchema = function(schemaName, schema) {
    this.schemas[schemaName] = schema;
  };


  Mogwai.prototype.getSchema = function(schemaName) {
    return this.schemas[schemaName];
  };


  Mogwai.prototype.addModel = function(modelName, model) {
    this.models[modelName] = model;
  };


  Mogwai.prototype.getModel = function(modelName) {
    return this.models[modelName];
  };


  /*
   * Define a model, or retrieve it
   */
  Mogwai.prototype.model = function(modelName, schema) {
    if (this.hasSchema(modelName)) {
      return this.getModel(modelName);
    }

    this.registerSchema(modelName, schema);

    // Compile and add model to Mogwai
    model = this.modelCompiler.compile(modelName, schema);
    this.addModel(modelName, model);

    return this.getModel(modelName);
  };

  return Mogwai;

})();
