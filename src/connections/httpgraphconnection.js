var inherits = require("inherits");
var grex = require("grex");

var GraphConnection = require("./graphconnection");


module.exports = (function() {
  'use strict';

  /**
   * HttpGraphConnection class to the graph database
   */
  function HttpGraphConnection() {
    GraphConnection.apply(this, arguments);
  }

  inherits(HttpGraphConnection, GraphConnection);

  /**
   * Opens a Httpconnection to Grex.
   *
   * @param {Function} callback
   */
  HttpGraphConnection.prototype.open = function(settings, callback) {
    grex.connect(settings)
    .then(this.onConnect.bind(this, callback))
    .fail(this.onFail.bind(this, callback));
  };

  HttpGraphConnection.prototype.onConnect = function(callback, graphDB) {
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

  return HttpGraphConnection;

})();
