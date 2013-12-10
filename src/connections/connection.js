var EventEmitter = require("events").EventEmitter;

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

  Connection.prototype.close = function() {
    this.g = null;
  };

  Connection.prototype.onFail = function(callback, error) {
    console.error(error);

    return callback(error);
  };

  return Connection;

})();
