var grex = require("grex"),
    EventEmitter = require("events").EventEmitter;

module.exports = Connection = (function() {

  function Connection(base) {
    this.base = base;
    this.grex = null;
  }

  // Inherit from EventEmitter
  Connection.prototype = Object.create(EventEmitter.prototype);


  Connection.prototype.open = function(settings, callback) {
    var self = this;

    grex.connect(settings)
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
