var Q = require("q");

module.exports = TitanGraphClient = (function(){
  function TitanGraphClient (base) {
    console.log("[Mogwai] Building Titan client");

    this.base = base;
  }

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
  TitanGraphClient.prototype.createIndexes = function(callback) {
    var self = this;

    this.getExistingTypes()
    .then(function(result) {
      alreadyIndexedKeys = result.results
      console.log("[Mogwai][TitanGraphClient] Skipping "+ alreadyIndexedKeys.length +" already created keys: "+alreadyIndexedKeys);

      return self.buildMakeKeyPromise(alreadyIndexedKeys);
    })
    .then(function(success) {
      console.log("[Mogwai][TitanGraphClient] Created "+ success.length +" property keys");

      callback(null, success);
    })
    .fail(function(error) {
      console.error("[Mogwai][TitanGraphClient] Error creating indexes");
      console.error(error);
      callback(error);
    });
  };

  /*
   * Retrieves an array of names of already indexed keys.
   *
   * @return {Promise}
   */
  TitanGraphClient.prototype.getExistingTypes = function() {
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
  TitanGraphClient.prototype.buildMakeKeyPromise = function(alreadyIndexedKeys) {
    var promises = [],
        g = this.base.connection.grex,
        models = this.base.models,
        schemaProperties,
        propertyName,
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


  return TitanGraphClient;

})();
