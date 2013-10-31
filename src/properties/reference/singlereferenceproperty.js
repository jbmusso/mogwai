var ReferenceProperty = require("./referenceproperty");

module.exports = SingleReferenceProperty = (function () {

  function SingleReferenceProperty() {
    ReferenceProperty.apply(this, arguments); // Call parent constructor
    this.indexable = false;
  }

  // Inherit from SingleReferenceProperty
  SingleReferenceProperty.prototype = Object.create(ReferenceProperty.prototype);
  SingleReferenceProperty.prototype.constructor = SingleReferenceProperty;

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
