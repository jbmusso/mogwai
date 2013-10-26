module.exports = (function () {
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
  Gremlin.prototype.execute = function(callback) {
    this.client.executeGremlin(this.script, this.params, callback);
  };

  /**
   * Asynchronously ask the client to send the script to the database for
   * execution, and return elements as appropriate model instances if
   * available.
   *
   * @param {Function} callback
   */
  Gremlin.prototype.query = function(callback) {
    var initializer = this.client.mogwai.elementInitializer;

    this.client.executeGremlin(this.script, this.params, function(err, body) {
      var elements = initializer.initElements(body);

      return callback(null, elements);
    });
  };

  return Gremlin;

})();
