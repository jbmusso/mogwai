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
      console.log("[Mogwai][TitanGraphClient] Will skip "+ alreadyIndexedKeys.length +" already created keys: "+alreadyIndexedKeys);

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
   * Returns the name of already indexed keys.
   *
   * @return {Promise}
   */
  TitanGraphClient.prototype.getExistingTypes = function() {
    var g = this.base.connection.grex;

    return g.getIndexedKeys("Vertex.class");
  };


  /*
   * This method won't build make key promises for already indexed keys.
   *
   * @return {Promise}
   */
  TitanGraphClient.prototype.buildMakeKeyPromise = function(alreadyIndexedKeys) {
    var promises = [],
        promiseForAll,
        g = this.base.connection.grex,
        schemas = this.base.schemas,
        propertyName,
        propery, titanKey, query;

    for (var i in schemas) {
      schema = schemas[i];

      for (var propertyName in schema.properties) {
        // Only index keys that were not indexed before, skip otherwise
        if (alreadyIndexedKeys.indexOf(propertyName) === -1) {
          property = schema.properties[propertyName];

          titanKey = g.makeKey(propertyName).dataType("String.class")
          titanKey.indexed("Vertex.class");

          if (property.unique) {
            titanKey.unique()
          }

          query = titanKey.make();

          promises.push(query);
        }
      }
    }

    promiseForAll = Q.all(promises)

    return promiseForAll;
  };


  return TitanGraphClient;

})();
