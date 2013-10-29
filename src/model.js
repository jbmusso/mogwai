module.exports = Model = (function() {

  /**
   * Mogwai Model class
   *
   * Models are ultimately stored as at least 1 Vertex in the database. That
   * vertex will be identified by a special "$type" property set to the
   * name of the Model defined in the Schema. See ModelCompiler.compile().
   */
  function Model() {}

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
   * Update a Model instance properties.
   *
   * @see update() function definition in model.groovy
   * @param {Function} callback
   */
  Model.prototype.update = function(callback) {
    var propertiesMap = {},
        propertyValue;

    // Build property map only for properties defined in the Schema,
    // and escape special chars
    // TODO: move escaping logic to a more central place.
    for (var propertyName in this.schema.properties) {
      propertyValue = this[propertyName];
      propertyValue = propertyValue.replace(/\'/g, "\\'");
      propertyValue = propertyValue.replace(/\"/g, "\\\"");

      propertiesMap[propertyName] = propertyValue;
    }

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
        properties = this.schema.properties;

    doc = this;
    // Assign Mogwai reserved "$type" property
    doc.$type = this.$type;

    transaction = this.g.begin();
    v = transaction.addVertex(doc.toObject());

    for (var name in properties) {
      property = properties[name];

      if (property.isIndexed()) {
        v.addProperty(name, this[property.name]);
      } else {
        v.setProperty(name, this[property.name]);
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
