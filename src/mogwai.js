var path = require("path"),
    fs = require("fs");

var Schema = require("./schema"),
    Model = require("./model"),
    Connection = require("./connection"),
    ModelCompiler = require("./modelcompiler"),
    EventEmitter = require("events").EventEmitter,
    TitanClient = require("./clients/titan"),
    Utils = require("./utils");


module.exports = Mogwai = (function() {

  function Mogwai() {
    var self = this;

    console.log("Loading Mogwai, object-to-graph mapper");
    this.schemas = {};
    this.models = {};
    this.modelCompiler = new ModelCompiler(this);

    this.client = null;
    this.settings = null;
    this.connection = new Connection(this);

    // Register events
    this.connection.on("open", function() {
      self.client.createIndexes(function() {
        self.emit("ready");
      });
    });
  }

  // Inherit from EventEmitter
  Mogwai.prototype = Object.create(EventEmitter.prototype);
  Mogwai.prototype.constructor = Mogwai;


  Mogwai.prototype.Schema = Schema;


  Mogwai.prototype.connect = function(settings, callback) {
    this.settings = settings;

    this.buildClient();
    this.connection.open(callback);
  };


  Mogwai.prototype.buildClient = function() {
    var clients = {
      titan: TitanClient
    };

    this.client = new clients[this.settings.client.toLowerCase()](this);
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
   * Check for the existence of a .groovy file associated to a model, and
   * return its content if present.
   */
  Mogwai.prototype.readGroovyFile = function(caller, modelName) {
    // Read groovy file content if present
    var fileName = path.basename(caller, path.extname(caller));
    var groovyFilePath = path.dirname(caller)+"/"+fileName+".groovy";
    var groovyFile;

    if (fs.existsSync(groovyFilePath)) {
      console.log("Found Gremlin .groovy file for "+ modelName +" Schema");
      groovyFile = fs.readFileSync(groovyFilePath, "utf8");

      return groovyFile;
    }
  };

  /*
   * Define a model, or retrieve it
   */
  Mogwai.prototype.model = function(modelName, schema) {
    if (this.hasSchema(modelName)) {
      return this.getModel(modelName);
    }

    // Add schema to Mogwai and compile Model
    this.registerSchema(modelName, schema);

    var groovyFile = this.readGroovyFile(Utils.getCaller().id, modelName);
    model = this.modelCompiler.compile(modelName, schema, groovyFile);
    this.addModel(modelName, model);

    return this.getModel(modelName);
  };

  return Mogwai;

})();
