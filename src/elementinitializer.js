var _ = require("lodash");


var ElementInitializer = (function() {
  /**
   * Initializes raw elements fetched from the database as Mogwai models.
   *
   * @param {Mogwai} mogwai
   */
  function ElementInitializer(mogwai) {
    this.mogwai = mogwai;
  }

  /**
   * Loop through all raw element in a response body and return an array of
   * elements instantiated as Mogwai models.
   *
   * @param {Object} responseBody - The response body returned by Rexster.
   * @return {Array} - An array of Mogwai {Model} instances and/or
   *      raw {Object} elements
   */
  ElementInitializer.prototype.initElements = function(response, results) {
    var rawElement;
    var i;
    var elements = [];

    for (i = 0; i < results.length; i++) {
      rawElement = results[i];
      elements.push(this.initElement(rawElement));
    }

    return elements;
  };

  /**
   * Check from the list of registered models/schemas for the existence of
   * a defined model, and initialize the passed rawElement with that model
   * type if available. Simply return the raw element if no model is available.
   *
   * @param {Object} rawElement - a raw Vertex or Edge element returned from
   *      the database.
   * @return {Model|Object}
   */
  ElementInitializer.prototype.initElement = function(rawElement) {
    if (this.mogwai.hasModel(rawElement.$type)) {
      var elementClass = this.mogwai.getModel(rawElement.$type);
      var element = new elementClass();
      _.extend(element, rawElement);
      return element;
    } else {
      return rawElement;
    }
  };

  return ElementInitializer;

})();

module.exports = ElementInitializer;