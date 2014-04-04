var grex = require("grex"),
    EventEmitter = require("events").EventEmitter;

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

  // Inherit from EventEmitter
  Connection.prototype = Object.create(EventEmitter.prototype);
  Connection.prototype.constructor = Connection;

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