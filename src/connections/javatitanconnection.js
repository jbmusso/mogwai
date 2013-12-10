var path = require("path");

var Titan = require("titan-node");
var Connection = require("./connection");

module.exports = (function() {
  /**
   * JavaTitanConnection class to the graph database
   */
  function JavaTitanConnection() {
    Connection.apply(this, arguments);
  }

  // Inherit from Connection
  JavaTitanConnection.prototype = Object.create(Connection.prototype);
  JavaTitanConnection.prototype.constructor = JavaTitanConnection;

  /**
   * Opens a connection to Grex.
   *
   * @param {Function} callback
   */
  JavaTitanConnection.prototype.open = function(settings, callback) {
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

  return JavaTitanConnection;

})();
