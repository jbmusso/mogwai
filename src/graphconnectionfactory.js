var HttpGraphConnection = require("./connections/httpgraphconnection");
var TitanJavaGraphConnection = require("./connections/titanjavagraphconnection");

module.exports = (function() {
  'use strict';

  function GraphConnectionFactory(mogwai) {
    this.mogwai = mogwai;
  }

  GraphConnectionFactory.prototype.createConnection = function(settings) {
    var connections = {
      java: {
        titan: TitanJavaGraphConnection
      },
      http: {
        titan: HttpGraphConnection,
        // rexster: RESTRexsterConnection
      }
    };

    var connection = new connections[settings.bridge][settings.client]();

    return connection;
  };


  return GraphConnectionFactory;

})();
