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

  Connection.prototype.close = function() {
    this.g = null;
  };

  Connection.prototype.onConnect = function(callback, graphDB) {
    this.g = graphDB;

    this.g.T =  grex.T;
    this.g.Contains = grex.Contains;
    this.g.Vertex = grex.Vertex;
    this.g.Edge = grex.Edge;
    this.g.String = grex["String"];
    this.g.Direction = grex.Direction;
    this.g.Geoshape = grex.Geoshape;
    this.g.TitanKey = grex.TitanKey;
    this.g.TitanLabel = grex.TitanLabel;

    this.emit("open", this.g);

    return callback(null, this.g);
  };

  Connection.prototype.onFail = function(callback, error) {
    console.error(error);

    return callback(error);
  };

  return Connection;

})();
