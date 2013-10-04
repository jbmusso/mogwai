var grex = require("grex");

module.exports = Connection = (function() {

  function Connection(base) {
    this.base = base;
    this.grex = null;
  }


  Connection.prototype.open = function(settings, callback) {
    var self = this;

    grex.connect(settings)
    .then(function (graphDB) {
      self.grex = graphDB;

      return callback(null, graphDB);
    })
    .fail(function(error) {
      return console.log(error);
    });
  };

  return Connection;

})();
