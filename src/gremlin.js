var Gremlin = (function() {
  /**
   * Execute Gremlin scripts on the client (Rexster, Titan...)
   * @see https://github.com/espeed/bulbs/blob/master/bulbs/gremlin.py
   *
   * @param {Client} client - Client with the Gremlin extension
   * @param {String} script - A raw Groovy script
   */
  function Gremlin(client, script, params) {
    this.client = client;
    this.script = script;
    this.params = params;
  }

  /**
   * Asynchronously ask the client to send the script to the database for
   * execution, and return the full raw response.
   *
   * @param {Function} callback
   */
  Gremlin.prototype.execute =
  Gremlin.prototype.exec = function(callback) {
    this.client.exec(this.script, this.params, callback);
  };

  /**
   * Asynchronously ask the client to send the script to the database for
   * execution, and return elements as appropriate model instances if
   * available. Won't initialize elements in case of an error.
   *
   * @param {Function} callback
   */
  Gremlin.prototype.query = function(callback) {
    var initializer = this.client.mogwai.elementInitializer;

    this.client.exec(this.script, this.params, function(err, response) {
      var elements = [];

      if (!err) {
        elements = initializer.initElements(response, response.results);
      }

      return callback(err, elements);
    });
  };

  return Gremlin;

})();

module.exports = Gremlin;