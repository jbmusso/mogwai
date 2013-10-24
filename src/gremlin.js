module.exports = (function () {

  /*
   * Execute Gremlin scripts on the client (Rexster, Titan...)
   *
   * @see https://github.com/espeed/bulbs/blob/master/bulbs/gremlin.py
   */
  function Gremlin(client, script, params) {
    this.client = client;
    this.script = script;
    this.params = params;
  }

  /*
   * Return the full raw response from Rexster
   */
  Gremlin.prototype.execute = function(callback) {
    this.client.gremlin(this.script, this.params, callback);
  };

  /*
   * Return the full response from Rexster, and initialize all graph elements
   * with the appropriate model if available.
   */
  Gremlin.prototype.query = function(callback) {
    var initializer = this.client.base.elementInitializer;

    this.client.gremlin(this.script, this.params, function(err, body) {
      var elements = initializer.initElements(body);

      return callback(null, elements);
    });
  };

  return Gremlin;

})();
