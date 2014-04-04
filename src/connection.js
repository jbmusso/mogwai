var inherits = require('util').inherits;
var EventEmitter = require("events").EventEmitter;

var grex = require("grex");


var Connection = (function() {
  /**
   * Connection class to the graph database
   *
   * @param {Mogwai} mogwai
   */
  function Connection(mogwai) {
    this.mogwai = mogwai;
    this.grex = null;
  }

  inherits(Connection, EventEmitter);

  /**
   * Opens a connection to Grex.
   *
   * @param {Function} callback
   */
  Connection.prototype.open = function(callback) {
    grex.connect(this.mogwai.settings, this.onConnected.bind(this));
  };

  Connection.prototype.onConnected = function(err, client) {
    if (err) {
      console.log(error);
    } else {
      this.grex = client;
      this.emit('open');
    }
  };

  return Connection;

})();

module.exports = Connection;