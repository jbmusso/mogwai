var inherits = require('util').inherits;

var Client = require("./client");
var Gremlin = require("../gremlin");
var GroovyScript = require("../groovy/groovyscript");


var RexsterClient = (function() {
  /**
   * A Class describing the behavior of Mogwai when interacting with a Rexster
   * server.
   *
   * @param {Mogwai} mogwai
   */
  function RexsterClient(mogwai) {
    Client.apply(this, arguments);
  }

  inherits(RexsterClient, Client);

  /**
   * Asynchronously send a Gremlin script to the server for execution via
   * HTTP, and return the response as a JavaScript object.
   *
   * Gremlin/Groovy scripts can be sent over with zero, one or more parameters
   * if required.
   *
   * @param {GroovyScript} groovyScript - GroovyScript to execute
   * @param {Object} params - parameters bound to the Groovy function
   * @param {Function} callback
   */
  RexsterClient.prototype.executeScript = function(groovyScript, params, callback) {
    if (groovyScript instanceof GroovyScript === false) {
      return callback(new Error("Script must be an instance of GroovyScript"));
    }

    var gremlin = this.mogwai.connection.client.gremlin();
    gremlin.script = groovyScript.getEscapedDefinition();
    gremlin.params = JSON.stringify(groovyScript.getAppliedParameters(params));

    gremlin.exec(function(err, response) {
      this.handleResponse(err, response, callback);
    }.bind(this));
  };

  /**
   * Handle the HTTP response returned by Rexster upon request, checking
   * whether it was successful or not.
   *
   * @param {String} err
   * @param {String} body - HTTP response body
   * @param {Function} callback
   */
  RexsterClient.prototype.handleResponse = function(err, body, callback) {
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
  RexsterClient.prototype.gremlin = function(script, params, callback) {
    // Handle case were no params were supplied
    if (typeof params === "function") {
      callback = params;
      params = null;
    }

    var gremlin = new Gremlin(this, script, params);

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
  RexsterClient.prototype.exec = function(script, params, callback) {
    var groovyScript;

    if (script instanceof GroovyScript) {
      groovyScript = script;
    } else {
      groovyScript = new GroovyScript(script);
    }

    this.executeScript(groovyScript, params, callback);
  };

  /**
   * TODO: handle indexes
   */
  RexsterClient.prototype.initialize = function() {
    return;
  };

  return RexsterClient;

})();

module.exports = RexsterClient;