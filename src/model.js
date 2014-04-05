var _ = require('lodash');


var Model = (function() {

  /**
   * Mogwai Model class
   *
   * Models are ultimately stored as at least 1 Vertex in the database. That
   * vertex will be identified by a special "$type" property set to the
   * name of the Model defined in the Schema. See ModelCompiler.compile().
   */
  function Model() {}

  /**
   * Save a Model instance.
   * Will insert if new, or update if already present (currently checks for
   * the existence of a vertex _id).
   *
   * @param {Function} callback
   */
  Model.prototype.save = function(callback) {
    if (this.hasOwnProperty("_id")) {
      // Vertex already exist, just update it
      return this.update(callback);
    } else {
      // Missing, insert a new vertex
      return this.insert(callback);
    }
  };

  /**
   * Update a Model instance properties.
   *
   * @see update() function definition in model.groovy
   * @param {Function} callback
   */
  Model.prototype.update = function(callback) {
    var propertiesMap = {};
    var propertyValue;

    // Build property map only for properties defined in the Schema
    for (var propertyName in this.schema.properties) {
      propertyValue = this[propertyName];
      propertiesMap[propertyName] = propertyValue;
    }

    var script = this.scripts.update(this._id, propertiesMap);
    script.execute(function(err, results) {
      return callback(err, results);
    });
  };

  /**
   * Insert a new Model with given doc properties
   *
   * @param {Function} callback
   */
  Model.prototype.insert = function(callback) {
    var doc = this;
    var property;
    var properties = this.schema.properties;
    var gremlin = this.client.gremlin();

    // Assign Mogwai reserved "$type" property
    doc.$type = this.$type;

    var v = gremlin.g.addVertex(doc.toObject());

    for (var name in properties) {
      property = properties[name];

      if (property.isIndexed()) {
        v.addProperty(name, this[property.name]);
      } else {
        v.setProperty(name, this[property.name]);
      }
    }

    return gremlin.exec(this.sync.bind(this, callback));
  };

  Model.prototype.sync = function(callback, err, response) {
    var data = response.results[0];
    _.extend(this, data);
    callback(err, this, response);
  };

  /**
   * Transform a Model instance as a raw JavaScript object
   *
   * @return {Object}
   */
  Model.prototype.toObject = function() {
    var o = {};

    for (var propertyName in this) {
      if (this.hasOwnProperty(propertyName)) {
        o[propertyName] = this[propertyName];
      }
    }

    return o;
  };

  /**
   * Execute a Gremlin query, return results as raw model instances or raw
   * elements.
   *
   * @param {String} gremlinQuery - Gremlin query to execute
   * @param {Boolean} retrieveAsModels - Indicate whether the data should be retrieved
   *      as model instances (true) or as a raw graph elements (false).
   * @param {Function} callback
   */
  Model.find = function(gremlinQuery, retrieveAsModels, callback) {
    // Handle optional 'retrieveAsModels' parameter
    if (typeof retrieveAsModels === "function") {
      callback = retrieveAsModels;
      retrieveAsModels = true;
    }

    if (retrieveAsModels === true) {
      return this.gremlin(gremlinQuery, callback);
    } else {
      return this.gremlin(gremlinQuery).execute(callback);
    }
  };


  return Model;

})();

module.exports = Model;