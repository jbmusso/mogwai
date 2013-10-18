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
    Update current Vertex
  */
  Model.prototype.update = function(callback) {
    var update,
        properties = [];

    // Build sideEffect update property query
    update = "{";
    for (var propertyName in this.schema.properties) {
      properties.push('it.'+ propertyName +'="'+ this[propertyName] +'"');
    }
    update += properties.join("; ");
    update = update.replace(/\$/g, "\\$"); // Escape dollar sign
    update += "}";

    // SECURITY WARNING/TODO: The following query *IS* badly vulnerable to a Gremlin 'SQL' injection attack, allowing arbitrary fields to be set. Do not use in production!
    // TODO: fix encoding bug
    var query = this.g.v(this._id)._().sideEffect(update);

    return this.exec(query, callback);
  };


  /*
    Insert a new Model with given doc properties
  */
  Model.prototype.insert = function(callback) {
    var doc,
        transaction,
        property,
        properties = this.schema.properties;

    console.log("Inserting Model...");

    doc = this;
    doc.type = this.type;

    transaction = this.g.begin();
    v = transaction.addVertex(doc.toObject());

    for (var name in properties) {
      property = properties[name];

      if (property.isIndexed()) {
        // console.log("-", property.name, "(i) =", this.name);
        v.addProperty(name, this[property.name]);
      } else {
        // console.log("-", property.name, " =", this.name);
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
    Executes a Gremlin (grex) query, and return results as raw documents or models.

    TODO: improve performance when fetching only one document (check condition and remove loop).

    @param grexQuery {Function} grex query to execute
    @param asModel {Boolean} Whether retrieve each document as raw document or as a model instance (defaults to true)
  */
  Model.find = function(grexQuery, asModel, callback) {
    if (typeof grexQuery !== "object" || typeof grexQuery === null) {
      return callback("You must provide a valid Gremlin query");
    }

    console.log("Grex:", grexQuery.params);
    if (typeof asModel === "function") {
      callback = asModel;
      asModel = true;
    }

    var self = this;

    grexQuery
    .then(function(success) {
      if (success.results.length === 0 ) {
        return callback(null, null);
      }

      if (!asModel) {
        // Return raw results
        return callback(null, success.results);
      }

      // Return all vertices/documents as model instances
      var doc, key, result, results = [];
      for (var i = 0, _len = success.results.length; i < _len; i++) {
        result = success.results[i];
        doc = new self();
        for (key in result) {
          doc[key] = result[key];
        }
        results.push(doc);
      }

      return callback(null, results);
    })
    .fail(function(err) {
      return callback(err);
    });
  };


  /*
    Find a Vertex by name
  */
  Model.findOne = function(property, callback) {
    var key = Object.keys(property)[0];
    var query = this.g.V(key, property[key]).index(0);

    this.find(query, function(err, results) {
      return callback(err, results[0]);
    });
  };


  /*
    Find a Vertex by ID
  */
  Model.findById = function(id, callback) {
    var query = this.g.v(id);

    this.find(query, function(err, results) {
      return callback(err, results[0]);
    });
  };


  /*
    Delete a Vertex by ID.
  */
  Model.delete = function(id, callback) {
    this.g.removeVertex(g.v(id))
    .then(function(result) {
      return callback(null, result);
    })
    .fail(function(err) {
      return callback(err);
    });
  };


  return Model;

})();
