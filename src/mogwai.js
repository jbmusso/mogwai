var path = require("path"),
    fs = require("fs");

var Schema = require("./schema"),
    Model = require("./model"),
    Connection = require("./connection"),
    ModelCompiler = require("./modelcompiler"),
    EventEmitter = require("events").EventEmitter,
    TitanClient = require("./clients/titan"),
    RexsterClient = require("./clients/rexster"),
    Utils = require("./utils"),
    ElementInitializer = require("./elementinitializer");

module.exports = Mogwai = (function() {
  /**
   * The main Mogwai class, (currently) instantiated as a Singleton.
   */
  function Mogwai() {
    var self = this;

    console.log("Loading Mogwai, object-to-graph mapper");
    this.schemas = {};
    this.models = {};
    this.modelCompiler = new ModelCompiler(this);
    this.elementInitializer = new ElementInitializer(this);

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

  /**
   * Instantiate the appropriate graph database client, and ask the Connection
   * class to open a connection to that database.
   *
   * @param {Object} settings - host, port, db name, etc.
   * @param {Function} callback
   */
  Mogwai.prototype.connect = function(settings, callback) {
    this.settings = settings;

    this.buildClient();
    this.connection.open(callback);
  };

  /**
   * Define Mogwai's client with the client type defined in the settings.
   */
  Mogwai.prototype.buildClient = function() {
    var clients = {
      titan: TitanClient,
      rexster: RexsterClient
    };

    this.client = new clients[this.settings.client.toLowerCase()](this);
  };

  /**
   * Close the connection with the database
   */
  Mogwai.prototype.disconnect = function() {
    this.db.disconnect();
  };

  /**
   * Check whether a Schema by this name exists or not
   *
   * @return {Boolean}
   */
  Mogwai.prototype.hasSchema = function(schemaName) {
    return this.schemas.hasOwnProperty(schemaName);
  };

  /**
   * Register a Schema instance to this Mogwai instance
   *
   * @param {String} schemaName
   * @param {Schema} schema - Schema instance
   */
  Mogwai.prototype.registerSchema = function(schemaName, schema) {
    this.schemas[schemaName] = schema;
  };

  /**
   * Retrieve a registered Schema instance by name
   *
   * @param {String} schemaName
   * @param {Schema} - Schema instance
   */
  Mogwai.prototype.getSchema = function(schemaName) {
    return this.schemas[schemaName];
  };

  /**
   * Register a Model class (constructor) to this Mogwai instance
   *
   * @param {String} modelName
   * @param {Function} model - Model class constructor
   */
  Mogwai.prototype.addModel = function(modelName, model) {
    this.models[modelName] = model;
  };

  /**
   * Retrieve a registered Model constructor by name
   *
   * @param {String} modelName
   * @param {Function} - Model class constructor
   */
  Mogwai.prototype.getModel = function(modelName) {
    return this.models[modelName];
  };

  /**
   * Check whether a Model class constructor by this name exists or not
   *
   * @param {String} modelName
   * @return {Boolean}
   */
  Mogwai.prototype.hasModel = function(modelName) {
    return this.models.hasOwnProperty(modelName);
  };

  /**
   * Check for the existence of a .groovy file associated to a Schema, and
   * return its content if present.
   *
   * @param {String} pathToCaller - Path to the file of the calling function
   * @param {String} modelName
   * @param {String} groovyFile - Groovy file content
   */
  Mogwai.prototype.readGroovyFile = function(pathToCaller, modelName) {
    // Read groovy file content if present
    var fileName = path.basename(pathToCaller, path.extname(pathToCaller));
    var groovyFilePath = path.dirname(pathToCaller)+"/"+fileName+".groovy";
    var groovyFile;

    if (fs.existsSync(groovyFilePath)) {
      console.log("Found Gremlin .groovy file for "+ modelName +" Schema");
      groovyFile = fs.readFileSync(groovyFilePath, "utf8");

      return groovyFile;
    } else {
      return '';
    }
  };

  /**
   * Define a model, or retrieve it by name.
   * This method *must* be called for each defined Schema, and the resulting
   * model class should be set to module.exports in that Schema file.
   *
   * @param {String} modelName
   * @param {Schema} schema
   * @return {Function} - Model class constructor
   */
  Mogwai.prototype.model = function(modelName, schema) {
    modelName = modelName.toLowerCase();

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
