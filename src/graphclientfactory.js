var RestGraphClient = require("./clients/restgraphclient");
var TitanRestGraphClient = require("./clients/titanrestgraphclient");
var TitanJavaGraphClient = require("./clients/titanjavagraphclient");


module.exports = (function() {
  function GraphClientFactory(mogwai) {
    this.mogwai = mogwai;
  }

  GraphClientFactory.prototype.createClient = function(api, clientName) {
    var clients = {
      java: {
        titan: TitanJavaGraphClient
      },
      http: {
        rexster: RestGraphClient,
        titan: TitanRestGraphClient
      }
    };

    var client = new clients[api][clientName](this.mogwai);

    return client;
  };


  return GraphClientFactory;

})();
