var path = require("path");

var inherits = require("inherits");
var Titan = require("titan-node");

var GraphConnection = require("./graphconnection");

module.exports = (function() {
  'use strict';

  /**
   * TitanJavaGraphConnection class to the graph database
   */
  function TitanJavaGraphConnection() {
    GraphConnection.apply(this, arguments);
  }

  inherits(TitanJavaGraphConnection, GraphConnection);

  /**
   * Opens a connection to Grex.
   *
   * @param {Function} callback
   */
  TitanJavaGraphConnection.prototype.open = function(settings, callback) {
    try {
      var gremlin = new Titan.Gremlin({ loglevel: 'OFF' });
      var TitanFactory = gremlin.java.import('com.thinkaurelius.titan.core.TitanFactory');

      this.graph = TitanFactory.openSync(settings.graph);
      this.g = gremlin.wrap(this.graph);

      this.emit("open", this.g);

      callback(null, this.g);

    } catch(e) {
      console.log("TitanJava Error", e);
    }

  };

  return TitanJavaGraphConnection;

})();
