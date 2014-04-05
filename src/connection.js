var inherits = require('util').inherits;
var EventEmitter = require("events").EventEmitter;

var grex = require("grex");


var Connection = (function() {
  /**
   * Connection class to the graph database
   *
   * @param {Mogwai} mogwai
   */
  function Connection() {
    this.client = null;
  }

  inherits(Connection, EventEmitter);

  /**
   * Opens a connection to Grex.
   */
  Connection.prototype.open = function(settings) {
    grex.connect(settings, this.onConnected.bind(this));
  };

  Connection.prototype.onConnected = function(err, client) {
    if (err) {
      console.log(error);
    } else {
      this.client = client;
      this.emit('open');
    }
  };

  return Connection;

})();

module.exports = Connection;