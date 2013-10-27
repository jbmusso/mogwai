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
    var self = this;

    grex.connect(this.mogwai.settings)
    .then(function (graphDB) {
      self.grex = graphDB;
      self.emit("open");

      return callback(null, graphDB);
    })
    .fail(function(error) {
      return console.log(error);
    });
  };

  return Connection;

})();
