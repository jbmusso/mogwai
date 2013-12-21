var Connection = require("./connection");
var grex = require("grex");


module.exports = HttpConnection = (function() {
  /**
   * HttpConnection class to the graph database
   */
  function HttpConnection() {
    Connection.apply(this, arguments);
  }

  // Inherit from Connection
  HttpConnection.prototype = Object.create(Connection.prototype);
  HttpConnection.prototype.constructor = HttpConnection;

  /**
   * Opens a Httpconnection to Grex.
   *
   * @param {Function} callback
   */
  HttpConnection.prototype.open = function(settings, callback) {
    grex.connect(settings)
    .then(this.onConnect.bind(this, callback))
    .fail(this.onFail.bind(this, callback));
  };

  HttpConnection.prototype.onConnect = function(callback, graphDB) {
    this.g = graphDB;

    this.g.ClassTypes = {
      T: grex.T,
      Contains: grex.Contains,
      Vertex: grex.Vertex,
      Edge: grex.Edge,
      String: grex["String"],
      Direction: grex.Direction,
      Geoshape: grex.Geoshape,
      TitanKey: grex.TitanKey,
      TitanLabel: grex.TitanLabel
    };

    this.emit("open", this.g);

    return callback(null, this.g);
  };

  return HttpConnection;

})();
