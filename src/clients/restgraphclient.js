var inherits = require("inherits");
var request = require("request");

var GraphClient = require("./graphclient"),
    Gremlin = require("../gremlin"),
    GroovyScript = require("../groovy/groovyscript");

module.exports = (function(){
  /**
   * A Class describing the behavior of Mogwai when interacting with a Rexster
   * server.
   *
   * @param {Mogwai} mogwai
   */
  function RestGraphClient(mogwai) {
    GraphClient.apply(this, arguments); // Call parent constructor
  }

  inherits(RestGraphClient, GraphClient);

  /**
   * Asynchronously send a Gremlin script to the server for execution via
   * HTTP, and return the response as a JavaScript object.
   *
   * Gremlin/Groovy scripts can be sent over with zero, one or more parameters
   * if required.
   *
   * @param {String} path - path to Rexster endpoint
   * @param {GroovyScript} groovyScript - GroovyScript to execute
   * @param {Object} params - parameters bound to the Groovy function
   * @param {Function} callback
   */
  RestGraphClient.prototype.executeScript = function(path, groovyScript, params, callback) {
    if (groovyScript instanceof GroovyScript === false) {
      return callback(new Error("Script must be an instance of GroovyScript"));
    }

    var self = this;
    var settings = this.mogwai.settings;
    var url = "http://"+ settings.host +":"+ settings.port +"/graphs/"+ settings.graph + path;

    var options = {
      uri: url,
      qs: {
        // Escape dollar sign
        script: groovyScript.getEscapedDefinition(),
        // Work around Rexster Gremlin extension not supporting bracket notation in QueryString for objects, but suppporting dot notation.
        params: JSON.stringify(groovyScript.getAppliedParameters(params))
      },
      // Set JSON header, and automatically parse body
      json: true
    };

    request.get(options, function(err, res, body) {
      self.handleResponse(err, body, callback);
    });
  };

  /**
   * Handle the HTTP response returned by Rexster upon request, checking
   * whether it was successful or not.
   *
   * @param {String} err
   * @param {String} body - HTTP response body
   * @param {Function} callback
   */
  RestGraphClient.prototype.handleResponse = function(err, body, callback) {
    if (err) {
      // HTTP/request error
      return callback(new Error(err));
    }

    if (body.success === false || body.error) {
      // Database error
      return callback(new Error(body.error));
    }

    if (body.message) {
      // Rexster error
      return callback(new Error(body.message));
    }

    // Success!
    return callback(null, body);
  };

  /**
   * Sends a Gremlin request to the server for execution, and returns the
   * response.
   * - Will return initialized graph element (ie as models) by default.
   * - If no callback is present, returns a Gremlin instance which allows the
   * used to either call execute() or query()
   *
   * Basically, supplying a callback as last parameter is equivalent to not
   * passing a callback, and calling .query() on the result.
   *
   * @param {String} script - gremlin script to execute
   * @param {Object} params - parameters to pass to the gremlin script
   * @param {Function} callback - an optional callback
   */
  RestGraphClient.prototype.gremlin = function(script, params, callback) {
    var gremlin;

    // Handle case were no params were supplied
    if (typeof params === "function") {
      callback = params;
      params = null;
    }

    gremlin = new Gremlin(this, script, params);

    // Execute now if a callback was supplied, or return Gremlin object for later execution.
    if (typeof callback === "function") {
      // Will return initialized elements by default
      return gremlin.query(callback);
    } else {
      // Allow the user to call execute() or query()
      return gremlin;
    }
  };

  /**
   * Shortcut for sending a Gremlin query to the server for execution.
   * Prepare the script before actually sending it.
   * If script is passed in as a string, create a new GroovyScript instance.
   * It may also return a GroovyFunction, which inherits GroovyScript.
   *
   * @param {String|GroovyScript} script - a Gremlin Groovy script
   * @param {Object} params - parameters to pass to the gremlin script
   * @param {Function} callback
   */
  RestGraphClient.prototype.executeGremlin = function(script, params, callback) {
    var groovyScript;

    if (script instanceof GroovyScript) {
      groovyScript = script;
    } else {
      groovyScript = new GroovyScript(script);
    }


    this.executeScript("/tp/gremlin", groovyScript, params, callback);
  };

  /**
   * TODO: handle indexes
   */
  RestGraphClient.prototype.createIndexes = function() {
    return;
  };

  return RestGraphClient;

})();
