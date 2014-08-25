var inherits = require('util').inherits;

var _ = require('lodash');
var grex = require('grex');
var gremlin = grex.gremlin;
var g = grex.g;

var RexsterClient = require("./rexster");


var TitanClient = (function() {
  /**
   * A Class describing the behavior of Mogwai when interacting with a Titan
   * server.
   *
   * @param {Mogwai} mogwai
   */
  function TitanClient(mogwai) {
    RexsterClient.apply(this, arguments);
  }

  inherits(TitanClient, RexsterClient);

  /**
   * Asynchronously build Titan types, used for indexing
   * Tested with Titan v0.4.0
   *
   * Loop through each schemas, find keys flagged for indexation, and build
   * types/indexes accordingly.
   *
   * This method does not recreate indexes on already created keys.
   *
   * Note: as per Titan's current limitations, "key index must be created prior
   * to key being used".
   *
   * @link https://github.com/thinkaurelius/titan/wiki/Type-Definition-Overview
   * @link https://github.com/thinkaurelius/titan/wiki/Titan-Limitations#temporary-limitations
   *
   * @param {Function} callback
   */
  TitanClient.prototype.initialize = function(callback) {
    this.getExistingTypes()
    .then(function(response) {
      alreadyIndexedKeys = response.results;
      return this.buildMakeKeyPromise(alreadyIndexedKeys);
    }.bind(this))
    .done(function(success) {
      callback(null, success);
    });
  };

  /**
   * Retrieves an array of names of already indexed keys.
   *
   * @return {Promise}
   */
  TitanClient.prototype.getExistingTypes = function() {
    var client = this.mogwai.connection.client;

    return client.exec(g.getIndexedKeys("Vertex.class"));
  };

  /**
   * Create data types which Titan uses for indexing.
   *
   * Note that the Mogwai special "$type" key is automatically indexed.
   *
   * This method does not return promise of creation for already created types.
   *
   * @return {Promise} to create all keys
   */
  TitanClient.prototype.buildMakeKeyPromise = function(alreadyIndexedKeys) {
    // var gremlin = this.mogwai.connection.client.gremlin();
    var client = this.mogwai.connection.client;
    var titanKey;
    var query = gremlin();


    // Make sure we index the Mogwai special $type key used for binding a model type to a vertex.
    if (alreadyIndexedKeys.indexOf("$type") === -1) {
      query(g.makeKey("$type").dataType("String.class").indexed("Vertex.class").make());
    }

    // Also index keys defined for each model, but skip already indexed keys
    _.each(this.mogwai.models, function(model) {
      _.each(model.schema.properties, function(property, propertyName) {
        // Only index keys that were not indexed before, skip otherwise
        if (alreadyIndexedKeys.indexOf(propertyName) === -1) {
          titanKey = g.makeKey(propertyName).dataType(property.getDataType()).indexed("Vertex.class");

          if (property.isUnique()) {
            titanKey.unique();
          }

          titanKey.make();

          query(titanKey);
        }
      });
    });

    return query.script && client.exec(query);
  };


  return TitanClient;

})();

module.exports = TitanClient;