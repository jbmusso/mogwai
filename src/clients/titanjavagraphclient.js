var inherits = require("inherits");
var Q = require("q");
var _ = require("underscore");

var GraphClient = require("./graphclient");

module.exports = (function(){
  /**
   * A Class describing the behavior of Mogwai when interacting with a Titan
   * server over the Java API.
   *
   * @param {Mogwai} mogwai
   */
  function TitanJavaGraphClient(mogwai) {
    GraphClient.apply(this, arguments); // Call parent constructor
    this.indexedKeys = [];
  }

  inherits(TitanJavaGraphClient, GraphClient);

  /**
   * @param {Function} callback
   */
  TitanJavaGraphClient.prototype.createIndexes = function(callback) {

  };

  /**
   * Retrieves an array of names of already indexed keys.
   *
   * @return {Promise}
   */
  TitanJavaGraphClient.prototype.getExistingTypes = function() {
    var Vertex = this.g.ClassTypes.Vertex;

    return this.g.getIndexedKeys(Vertex.class);
  };

  TitanJavaGraphClient.prototype.setIndexedKeys = function(result) {
    this.indexedKeys = result.results;
  };

  /**
   * Create data types which Titan uses for indexing.
   *
   * Note that the Mogwai special "$type" key is automatically indexed.
   */
  TitanJavaGraphClient.prototype.makeKeys = function() {

  };

  /**
   * Tell whether a key has already been indexed in the Database or not.
   *
   * @param {String} keyname
   * @return {Boolean}
   */
  TitanJavaGraphClient.prototype.isAlreadyIndexed = function(keyName) {
    if (this.indexedKeys.indexOf(keyName) === -1) {
      return false;
    }
    return true;
  };


  return TitanJavaGraphClient;

})();
