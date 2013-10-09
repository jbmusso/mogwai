module.exports = Model = (function() {

  function Model() {
    this.schema = null;
  }


  Model.init = function(callback) {
    this.base.indexCreator.declareIndexes(this);
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
      var doc = this;
      doc.type = this.type;
      return this.insert(doc, callback);
    }
  };


  /*
    Update current Vertex
  */
  Model.prototype.update = function(callback) {
    // WARN (TODO/check): The following query may be vulnerable to a Gremlin 'SQL' injection attack
    var query;

    query = this.g.v(this._id)._().sideEffect('{it.name="' + this.name + '"; it.description="' + this.description + '"}');
    return this.exec(query, callback);
  };

  /*
    Insert a new Vertex with given doc properties
  */


  Model.prototype.insert = function(doc, callback) {
    var query, trxn;

    trxn = this.g.begin();
    trxn.addVertex(doc);
    query = trxn.commit();

    return this.exec(query, callback);
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
  Model.findOne = function(field, callback) {
    var key = Object.keys(field)[0];
    var query = this.g.V(key, field[key]).index(0);

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
