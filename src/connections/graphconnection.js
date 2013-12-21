var EventEmitter = require("events").EventEmitter;

module.exports = (function() {
  /**
   * GraphConnection class to the graph database
   *
   */
  function GraphConnection() {
    this.g = null;
  }

  // Inherit from EventEmitter
  GraphConnection.prototype = Object.create(EventEmitter.prototype);
  GraphConnection.prototype.constructor = GraphConnection;

  GraphConnection.prototype.close = function() {
    this.g = null;
  };

  GraphConnection.prototype.onFail = function(callback, error) {
    console.error(error);

    return callback(error);
  };

  return GraphConnection;

})();
