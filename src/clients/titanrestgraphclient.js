var inherits = require("inherits");
var Q = require("q");
var _ = require("underscore");

var RestGraphClient = require("./RestGraphClient");

module.exports = (function(){
  /**
   * A Class describing the behavior of Mogwai when interacting with a Titan
   * server.
   *
   * @param {Mogwai} mogwai
   */
  function TitanRESTRexsterGraphClient(mogwai) {
    RestGraphClient.apply(this, arguments); // Call parent constructor
    this.indexedKeys = [];
  }

  inherits(TitanRESTRexsterGraphClient, RestGraphClient);

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
  TitanRESTRexsterGraphClient.prototype.createIndexes = function(callback) {
    this.getExistingTypes()
    .then(this.setIndexedKeys.bind(this))
    .then(this.makeKeys.bind(this))
    .then(function(success) {
      callback(null, success);
    })
    .fail(function(error) {
      console.error("[Mogwai][TitanRESTRexsterGraphClient] Error creating indexes:", error);
      callback(error);
    });
  };

  /**
   * Retrieves an array of names of already indexed keys.
   *
   * @return {Promise}
   */
  TitanRESTRexsterGraphClient.prototype.getExistingTypes = function() {
    var Vertex = this.g.ClassTypes.Vertex;

    return this.g.getIndexedKeys(Vertex.class);
  };

  TitanRESTRexsterGraphClient.prototype.setIndexedKeys = function(result) {
    this.indexedKeys = result.results;
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
  TitanRESTRexsterGraphClient.prototype.makeKeys = function() {
    var promises = [],
        g = this.g,
        Vertex = g.ClassTypes.Vertex,
        String = g.ClassTypes.String;

    // Make sure we index the Mogwai special $type key used for binding a vertex to a model type.
    if (this.isAlreadyIndexed("$type") === false) {
      promises.push(g.makeKey("$type").dataType(String.class).indexed(Vertex.class).make());
    }

    // Also index keys defined for each model
    _.each(this.getIndexableProperties(), function(property) {
      // Skip already indexed keys
      if (this.isAlreadyIndexed(property.name) === false) {
        var titanKey = g.makeKey(property.name).dataType(property.getDataType()).indexed(Vertex.class);

        if (property.isUnique()) {
          titanKey.unique();
        }

        promises.push(titanKey.make());
      }
    }, this);

    return Q.all(promises);
  };

  /**
   * For all registered Mogwai models with given properties, return an array of
   * of properties (keys) which can be indexed.
   *
   * @return {Array} of properties
   */
  TitanRESTRexsterGraphClient.prototype.getIndexableProperties = function() {
    var models = this.mogwai.models,
        indexableProperties = [];

    _.each(models, function(model, modelName) {
      var schemaProperties = models[modelName].schema.properties;

      _.each(schemaProperties, function(property) {
        if (property.isIndexable()) {
          indexableProperties.push(property);
        }
      });
    });

    return indexableProperties;
  };

  /**
   * Tell whether a key has already been indexed in the Database or not.
   *
   * @param {String} keyname
   * @return {Boolean}
   */
  TitanRESTRexsterGraphClient.prototype.isAlreadyIndexed = function(keyName) {
    if (this.indexedKeys.indexOf(keyName) === -1) {
      return false;
    }
    return true;
  };


  return TitanRESTRexsterGraphClient;

})();