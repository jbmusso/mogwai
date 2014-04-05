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
  Gremlin.prototype.fetch =
  Gremlin.prototype.query = function(callback) {
    this.client.fetch(this.script, this.params, callback);
  };

  return Gremlin;

})();

module.exports = Gremlin;