var grex = require("grex"),
    EventEmitter = require("events").EventEmitter;

module.exports = Connection = (function() {
  /**
   * Connection class to the graph database
   *
   * @param {Mogwai} mogwai
   */
  function Connection(mogwai) {
    this.mogwai = mogwai;
    this.g = null;
  }

  // Inherit from EventEmitter
  Connection.prototype = Object.create(EventEmitter.prototype);
  Connection.prototype.constructor = Connection;

  /**
   * Opens a connection to Grex.
   *
   * @param {Function} callback
   */
  Connection.prototype.open = function(settings, callback) {
    grex.connect(settings)
    .then(this.onConnect.bind(this, callback))
    .fail(this.onFail.bind(this, callback));
  };

  Connection.prototype.onConnect = function(graphDB, callback) {
    this.g = graphDB;
    this.emit("open");

    return callback(null, graphDB);
  };

  Connection.prototype.onFail = function(error, callback) {
    console.log(error);
    callback(error);
  };

  return Connection;

})();
