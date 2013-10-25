module.exports = Model = (function() {

  function Model() {
  }


  Model.init = function(callback) {
  };


  Model.prototype.exec = function(grexQuery, callback) {
    console.log("Grex:", grexQuery.params);

    grexQuery.then(function(success) {
      return callback(null, success);
    }).fail(function(err) {
      console.log(err);
      return callback(err);
    });
  };

  /*
   * Insert a document, or update if already present (checks the vertex _id)
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

  /*
   * Update current Vertex properties
   */
  Model.prototype.update = function(callback) {
    var properties = [],
        property,
        propertyValue;

    // Build property map, escape special chars
    var m = "m = [", gremlin;
    for (var propertyName in this.schema.properties) {
      propertyValue = this[propertyName];
      propertyValue = propertyValue.replace(/\'/g, "\\'");
      propertyValue = propertyValue.replace(/\"/g, "\\\"");

      property = propertyName +":'"+ propertyValue +"'";
      properties.push(property);
    }
    m += properties.join(", ");
    m += "]\n";

    // Update vertex properties from map
    gremlin = m + "m.each{g.v("+this._id+").setProperty(it.key, it.value)}";

    return this.gremlin(gremlin).execute(callback);
  };

  /*
   * Insert a new Model with given doc properties
   */
  Model.prototype.insert = function(callback) {
    var doc,
        transaction,
        property,
        properties = this.schema.properties;

    doc = this;
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


  Model.prototype.toObject = function() {
    var o = {};

    for (var propertyName in this) {
      if (this.hasOwnProperty(propertyName)) {
        o[propertyName] = this[propertyName];
      }
    }

    return o;
  };


  /*
   * Execute a Gremin query, return results as raw model instances or raw
   * elements
   *
   * @param gremlinQuery {String} Gremlin query to execute
   * @param asModel {Boolean} Indicate if the data should be retrieved as a
   * model instances (true) or as a raw graph elements (false).
  */
  Model.find = function(gremlinQuery, asModel, callback) {
    if (typeof asModel === "function") {
      callback = asModel;
      asModel = true;
    }

    if (asModel === true) {
      return this.gremlin(gremlinQuery, callback);
    } else {
      return this.gremlin(gremlinQuery).execute(callback);
    }
  };

  /*
   * Find a Vertex by name
   */
  Model.findOne = function(property, callback) {
    var key = Object.keys(property)[0];
    var gremlinQuery = "g.V('"+ key +"', '"+ property[key] +"')[0]";

    this.find(gremlinQuery, function(err, results) {
      return callback(err, results[0]);
    });
  };

  /*
   * Find a Vertex by ID
   *
   * @param id {Number}
   */
  Model.findById = function(id, callback) {
    var gremlinQuery = "g.v("+ id +")";

    this.find(gremlinQuery, function(err, results) {
      return callback(err, results[0]);
    });
  };

  /*
   * Delete a Vertex by ID.
   *
   * @param id {Number}
   */
  Model.delete = function(id, callback) {
    var gremlinQuery = "g.removeVertex(g.v("+ id +"))";

    this.gremlin(gremlinQuery).execute(callback);
  };


  return Model;

})();
