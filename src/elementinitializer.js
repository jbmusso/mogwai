var _ = require("underscore");


module.exports = (function () {
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
  ElementInitializer.prototype.initElements = function(responseBody) {
    var rawElement,
        i,
        elements = [];

    for (i = 0; i < responseBody.results.length; i++) {
      rawElement = responseBody.results[i];
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
    var element, ModelClass;

    if (this.mogwai.hasModel(rawElement.$type)) {
      ModelClass = this.mogwai.getModel(rawElement.$type);
      element = new ModelClass(rawElement);
      return element;
    } else {
      return rawElement;
    }
  };

  return ElementInitializer;

})();
