var EventEmitter = require("events").EventEmitter;

var inherits = require("inherits");

module.exports = (function() {
  'use strict';

  /**
   * GraphConnection class to the graph database
   *
   */
  function GraphConnection() {
    this.g = null;
  }

  inherits(GraphConnection, EventEmitter);

  GraphConnection.prototype.open = function(settings, callback) {
    throw new Error("Not yet implemented");
  };

  GraphConnection.prototype.close = function() {
    this.g = null;
  };

  GraphConnection.prototype.onFail = function(callback, error) {
    console.error(error);

    return callback(error);
  };

  return GraphConnection;

})();
