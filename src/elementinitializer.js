var _ = require("underscore");


module.exports = (function () {
  function ElementInitializer(base) {
    this.base = base;
  }

  ElementInitializer.prototype.initElements = function(responseBody) {
    var rawElement;
    var elements = [];

    for (var i = 0; i < responseBody.results.length; i++) {
      rawElement = responseBody.results[i];
      elements.push(this.initElement(rawElement));
    }

    return elements;
  };

  /*
   * Check from the list of registered models/schemas for the existence of
   * a defined model, and initialize the passed rawElement with that model
   * type if available. Simply return the raw element if no model is available.
   *
   * @param {Object} a raw Vertex or Edge element returned from the database
   * @return {Model|Object}
   */
  ElementInitializer.prototype.initElement = function(rawElement) {
    var element, elementClass;

    if (this.base.hasModel(rawElement.$type)) {
      elementClass = this.base.getModel(rawElement.$type);
      element = new elementClass();
      _.extend(element, rawElement);
      return element;
    } else {
      return rawElement;
    }
  };

  return ElementInitializer;

})();
