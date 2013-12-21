var TitanRestGraphClient = require("./clients/titanrestgraphclient");
var RestGraphClient = require("./clients/restgraphclient");


module.exports = (function() {
  function GraphClientFactory(mogwai) {
    this.mogwai = mogwai;
  }

  GraphClientFactory.prototype.createClient = function(clientName) {
    var clients = {
      rexster: RestGraphClient,
      titan: TitanRestGraphClient
    };

    var client = new clients[clientName](this.mogwai);

    return client;
  };


  return GraphClientFactory;

})();
