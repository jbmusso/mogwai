var Q = require("q");

var RexsterClient = require("./rexster");

module.exports = TitanClient = (function(){
  function TitanClient(base) {
    RexsterClient.apply(this, arguments); // Call parent constructor
  }

  // Inherit from RexsterClient
  TitanClient.prototype = Object.create(RexsterClient.prototype);
  TitanClient.prototype.constructor = TitanClient;

  /*
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
   * TODO: This method does not check (yet) for already existing types.
   *
   * @link https://github.com/thinkaurelius/titan/wiki/Type-Definition-Overview
   * @link https://github.com/thinkaurelius/titan/wiki/Titan-Limitations#temporary-limitations
   *
   * @param {Function} callback
   */
  TitanClient.prototype.createIndexes = function(callback) {
    var self = this;

    this.getExistingTypes()
    .then(function(result) {
      alreadyIndexedKeys = result.results;
      return self.buildMakeKeyPromise(alreadyIndexedKeys);
    })
    .then(function(success) {
      callback(null, success);
    })
    .fail(function(error) {
      console.error("[Mogwai][TitanClient] Error creating indexes");
      console.error(error);
      callback(error);
    });
  };

  /*
   * Retrieves an array of names of already indexed keys.
   *
   * @return {Promise}
   */
  TitanClient.prototype.getExistingTypes = function() {
    var g = this.base.connection.grex;

    return g.getIndexedKeys("Vertex.class");
  };


  /*
   * Create data types in Titan, used for indexing.
   *
   * Note that the Mogwai special $type key is automatically indexed.
   *
   * This method does not return promise of creation for already created types.
   *
   * @return {Promise} to create all keys
   */
  TitanClient.prototype.buildMakeKeyPromise = function(alreadyIndexedKeys) {
    var promises = [],
        g = this.base.connection.grex,
        models = this.base.models,
        schemaProperties,
        property, titanKey;

    // Make sure we index the Mogwai special $type key used for binding a model type to a vertex.
    if (alreadyIndexedKeys.indexOf("$type") === -1) {
      promises.push(g.makeKey("$type").dataType("String.class").indexed("Vertex.class").make());
    }

    // Also index keys defined for each model, but skip already indexed keys
    for (var i in models) {
      schemaProperties = models[i].schema.properties;

      for (var propertyName in schemaProperties) {
        // Only index keys that were not indexed before, skip otherwise
        if (alreadyIndexedKeys.indexOf(propertyName) === -1) {
          property = schemaProperties[propertyName];

          titanKey = g.makeKey(propertyName).dataType(property.getDataType()).indexed("Vertex.class");

          if (property.isUnique()) {
            titanKey.unique();
          }

          promises.push(titanKey.make());
        }
      }
    }

    return Q.all(promises);
  };


  return TitanClient;

})();
