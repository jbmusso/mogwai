var Q = require("q");


module.exports = IndexCreator = (function() {
  function IndexCreator(base) {
    this.base = base;
    this.indexQueryQueue = [];
  }


  /*
   *
   */
  IndexCreator.prototype.declareIndexes = function(model) {
    console.log("Indexes for model", model.type, ":", model.schema.indexes);

    this.indexQueryQueue.push(model.schema._indexes);
  };


  /*
   * Sends index creation queries to the database as soon as the connection is opened.
   Index creation queries should be the first queries to hit the server.
   */
  IndexCreator.prototype.createIndexes = function(callback) {
    var promises = [],
        query,
        g = this.base.connection.grex,
        indexQueryQueue = this.indexQueryQueue,
        indexProperties,
        indexPropertiesSet,
        indexedProperty;

    console.log("\nCreating index queries...");

    for (var i in indexQueryQueue) {
      indexPropertiesSet = indexQueryQueue[i];

      for (var j in indexPropertiesSet) {
        indexedProperty = indexPropertiesSet[j];

        query = g.makeType().name(indexedProperty).dataType("String.class").indexed("Vertex.class").unique("Direction.BOTH").makePropertyKey();

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
      callback(error);
    });
  };


  return IndexCreator;

})();
