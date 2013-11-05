var _ = require("underscore");

/**
 * Mogwai main Model class.
 *
 * Models are compiled at application startup from a Schema definition.
 *
 * Models are ultimately stored as at least 1 Vertex in the database. That
 * vertex will be identified by a special "$type" property set to the
 * name of the Model defined in the Schema. See ModelCompiler.compile().
 *
 * Models have to two kind or properties:
 * - selfProperties: properties bound to the vertex properties
 * - refProperties: links to other models, ie. edges pointing to other vertices
 */
module.exports = Model = (function() {
  /**
   * Model constructor.
   * Takes an optional map of key/value as first parameter used to assign
   * properties directly at instantiation.
   *
   * @param {Object} rawElement - Optional: map properties
   */
  function Model(rawElement) {
    var properties = this.schema.properties,
        property;

    // Attach properties to model instance
    // TODO: move the following logic to model prototype, and avoid the dirty
    // _.clone trick.
    for (var propertyName in properties) {
      property = _.clone(properties[propertyName]);
      property.attachToModel(this);
    }

    // If any, set values to properties
    if (rawElement) {
      _.extend(this, rawElement);
    }
  }

  /**
   * Execute a Grex query.
   *
   * @param {Grex} grexQuery
   * @param {Function} callback
   */
  Model.prototype.exec = function(grexQuery, callback) {
    console.log("Grex:", grexQuery.params);

    grexQuery.then(function(success) {
      return callback(null, success);
    }).fail(function(err) {
      console.error(err);
      return callback(err);
    });
  };

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
   * Update a Model instance properties, updating both the underlying vertex
   * own properties as well as adding edges to other vertices if required by
   * this model's refProperties.
   *
   * @see update() function definition in model.groovy
   * @param {Function} callback
   */
  Model.prototype.update = function(callback) {
    var propertiesMap = {},
        propertyValue;

    // Set vertex properties as model's selfProperties: build property map
    // only for non-reference properties defined in the Schema
    for (var propertyName in this.schema.selfProperties) {
      propertyValue = this[propertyName];
      propertiesMap[propertyName] = propertyValue;
    }

    // Update database. TODO: also handle refproperties.
    this.scripts.update(this._id, propertiesMap).execute(function(err, results) {
      return callback(err, results);
    });
  };

  /**
   * Insert a new Model with given doc properties
   *
   * @param {Function} callback
   */
  Model.prototype.insert = function(callback) {
    var doc,
        transaction,
        property,
        properties = this.schema.selfProperties;

    doc = this;
    // Assign Mogwai reserved "$type" property
    doc.$type = this.$type;

    transaction = this.g.begin();
    v = transaction.addVertex(doc.toObject());

    for (var propertyName in properties) {
      property = properties[propertyName];

      // Only add/set non-null properties (avoid Rexster bug?)
      if (_.isNull(this[property.name]) === false) {
        if (property.isIndexed()) {
          v.addProperty(propertyName, this[property.name]);
        } else {
          v.setProperty(propertyName, this[property.name]);
        }
      }
    }

    return this.exec(transaction.commit(), callback);
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
