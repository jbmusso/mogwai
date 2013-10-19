var request = require("request");

var Client = require("../client");

module.exports = RexsterClient = (function(){
  function RexsterClient(base) {
    Client.apply(this, arguments); // Call parent constructor
  }

  // Inherit from Client
  RexsterClient.prototype = Object.create(Client.prototype);
  RexsterClient.prototype.constructor = RexsterClient;



  /*
   * Sends a request to the server for execution, and returns the response.
   */
  RexsterClient.prototype.request = function(path, script, params, callback) {
    var settings = this.base.settings;
    var url = "http://"+ settings.host +":"+ settings.port +"/graphs/"+ settings.graph + path;

    var options = {
      uri: url,
      qs: {
        script: script.replace(/\$/g, "\\$"), // Escape $ sign
        params: params
      },
      json: true
    };

    request.get(options, function(err, res, body) {
      if (err) {
        // HTTP/request error
        return callback(err);
      }

      if (!body.success) {
        // Internal Rexster error
        return callback(body.error);
      }

      // Success!
      callback(null, body);
    });
    // request.
  };

  /*
   * Sends a Gremlin request to the server for execution, and returns the
   * response.
   */
  RexsterClient.prototype.gremlin = function(script, params, callback) {
    this.request("/tp/gremlin", script, params, callback);
  };

  return RexsterClient;

})();
