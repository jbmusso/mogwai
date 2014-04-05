var fs = require("fs");
var inherits = require('util').inherits;

var _ = require("lodash");

var Model = require("./model");
var GroovyParser = require("./groovy/groovyparser");


var ModelCompiler = (function() {
  /**
   * Class responsible for compiling a Schema into a Model class.
   * Model Compilation is only done once at startup
   *
   * @param {Mogwai} mogwai - Main Mogwai instance
   */
  function ModelCompiler(mogwai) {
    this.mogwai = mogwai;
    this.groovyParser = new GroovyParser();
  }

  /**
   * Build an instantiable Model class from a Schema, binding to this model
   * all class methods and static methods defined in the Schema. It will also
   * bind all functions defined in optional .groovy file associated to the
   * Schema.
   *
   * This Schema/Model implementation is very inspired by Mongoose.
   * @see: https://github.com/LearnBoost/mongoose/blob/a04860f30f03c44029ea64ec2b08e723e6baf899/lib/model.js#L2454
   *
   * @param {String} name - name of the model
   * @param {Schema} schema - Schema defining the model
   * @param {String} customGroovyFileContent - Content of a Groovy file
   * @return {Function} - Model constructor
   */
  ModelCompiler.prototype.compile = function(name, schema, customGroovyFileContent) {
    // Create a model class, inheriting from base Model

    function model() {
      return Model.apply(this, arguments);
    }

    inherits(model, Model);

    // Make that Model class aware of the full Mogwai environment
    model.prototype.mogwai = model.mogwai = this.mogwai;
    model.prototype.connection = model.connection = this.mogwai.connection; //todo: replace by a getter? or simply remove?

    // Define a special "$type" key used to identify vertices of that model
    // type in the graph.
    // Note that this special "Mogwai" key/property is currently automatically indexed in the graph.
    model.prototype.$type = model.$type = name.toLowerCase();
    model.prototype.schema = model.schema = schema;

    // Define grex getter
    var client = {
      get: function() {
        return this.mogwai.connection.client;
      }.bind(this)
    };
    Object.defineProperty(model, "client", client);
    Object.defineProperty(model.prototype, "client", client);

    // Define Gremlin getter
    var gremlin = {
      get: function() {
        // TODO: find a way to avoid bind() trick? remove getter?
        return this.mogwai.client.gremlin.bind(this.mogwai.client);
      }
    };
    Object.defineProperty(model, "gremlin", gremlin);
    Object.defineProperty(model.prototype, "gremlin", gremlin);

    // Attach custom methods (schema methods first, then custom Groovy:
    // avoid accidental replacements)
    model.scripts = {};

    this.attachGroovyFunctions(model, customGroovyFileContent);

    // Load global model groovy functions
    var globalModelGroovyFileContent = fs.readFileSync(__dirname + "/model.groovy", "utf8");
    this.attachGroovyFunctions(model, globalModelGroovyFileContent);

    // Attach default JavaScript methods defined in the Schema
    this.attachSchemaFunctions(model, schema);

    // Allow scripts to be used in model instances as well
    model.prototype.scripts = model.scripts;

    return model;
  };

  /**
   * Attach custom, Schema-defined static methods and instance methods to the
   * model.
   *
   * @param {Model} model
   * @param {Schema} schema
   */
  ModelCompiler.prototype.attachSchemaFunctions = function(model, schema) {
    var fnName;

    // Add instance methods
    for (fnName in schema.methods) {
      model.prototype[fnName] = schema.methods[fnName];
    }

    // Add class methods
    for (fnName in schema.statics) {
      model[fnName] = schema.statics[fnName];
    }
  };

  /**
   * Attach Gremlin methods defined in a seperate .groovy files to the model
   * as getters.
   *
   * @param {Model} model
   * @param {String} customGroovyFileContent
   */
  ModelCompiler.prototype.attachGroovyFunctions = function(model, customGroovyFileContent) {
    var groovyFunctions = this.groovyParser.scan(customGroovyFileContent);
    var fnName;
    var fnBody;
    var groovyFunctionGetter;

    for (fnName in groovyFunctions) {
      fnBody = groovyFunctions[fnName];
      groovyFunctionGetter = this.attachGroovyFunction(fnBody);

      model[fnName] = groovyFunctionGetter;
      // Avoid .bind() trick?
      model.scripts[fnName] = groovyFunctionGetter.bind(model);
    }
  };

  /**
   * Build a getter for a given GroovyScript
   *
   * @param {GroovyScript} groovyScript
   * @param {Object} - Object property definition
   */
  ModelCompiler.prototype.attachGroovyFunction = function(groovyScript) {
    return function() {
      // Get optional callback as last parameter)
      var callback = _.last(arguments);

      if (typeof _.last(arguments) === "function") {
        params = _.initial(arguments);
      } else {
        params = arguments;
      }

      return this.gremlin(groovyScript, params, callback);
    };
  };

  return ModelCompiler;

})();

module.exports = ModelCompiler;