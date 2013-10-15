var Q = require("q");


module.exports = IndexCreator = (function() {
  function IndexCreator(base) {
    this.base = base;
    this.indexedModels = [];
  }


  /*
   *
   */
  IndexCreator.prototype.declareIndexes = function(model) {
    console.log("Indexes for model", model._class, ":", model.schema.indexes);

    this.indexedModels.push(model);
  };


  /*
   * Sends index creation queries to the database as soon as the connection is opened.
   Index creation queries should be the first queries to hit the server.
   */
  IndexCreator.prototype.createIndexes = function(callback) {
    var promises = [],
        query,
        g = this.base.connection.grex,
        indexedModels = this.indexedModels,
        indexedModel,
        indexedProperty;

    // console.log("==================================", indexedModels);

    console.log("\nCreating index queries...");

    for (var i in indexedModels) {
      indexedModel = indexedModels[i];

      console.log(indexedModel.type);

      for (var j in indexedModel.schema.indexes) {
        indexedProperty = indexedModel.schema.indexes[j];
        // Titan: see https://github.com/thinkaurelius/titan/wiki/Type-Definition-Overview

        query = g.makeType().name(indexedProperty).dataType("String.class").unique("Direction.IN").indexed("Vertex.class").makePropertyKey();
        // query = g.makeType().name(indexedProperty).dataType("String.class").indexed("Vertex.class").unique("Direction.OUT").makePropertyKey();
        // query = g.createIndex(indexedModel.type, "Vertex.class");

        console.log("* "+ indexedProperty +" index: "+ query.params);

        promises.push(query);

      }
    }

    Q.all(promises)
    .then(function (success) {
      console.log("Created "+ promises.length +" property keys");
      callback(null, success);
    })
    .fail(function (error) {
      connection.log("---------error-------------");
      callback(error);
    });
  };


  return IndexCreator;

})();
