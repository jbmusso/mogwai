var inherits = require("inherits");

var ReferenceProperty = require("./referenceproperty");

module.exports = (function () {
  'use strict';

  function MultiReferenceProperty() {
    ReferenceProperty.apply(this, arguments); // Call parent constructor
    this.indexable = false;
  }

  inherits(MultiReferenceProperty, ReferenceProperty);

  MultiReferenceProperty.prototype.getAsModelDefinition = function() {
    return {
      get: function() {
        console.log(this);
        return "foo";
      }
    };
  };


  return MultiReferenceProperty;

})();
