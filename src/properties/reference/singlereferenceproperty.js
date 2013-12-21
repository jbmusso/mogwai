var inherits = require("inherits");

var ReferenceProperty = require("./referenceproperty");

module.exports = (function () {

  function SingleReferenceProperty() {
    ReferenceProperty.apply(this, arguments); // Call parent constructor
    this.indexable = false;
  }

  inherits(SingleReferenceProperty, ReferenceProperty);

  SingleReferenceProperty.prototype.getAsModelDefinition = function() {
    return {
      get: function() {
        console.log(this);
        return "foo";
      }
    };
  };

  return SingleReferenceProperty;

})();
