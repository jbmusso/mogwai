var ReferenceProperty = require("./referenceproperty");

module.exports = MultiReferenceProperty = (function () {

  function MultiReferenceProperty() {
    ReferenceProperty.apply(this, arguments); // Call parent constructor
    this.indexable = false;
  }

  // Inherit from MultiReferenceProperty
  MultiReferenceProperty.prototype = Object.create(ReferenceProperty.prototype);
  MultiReferenceProperty.prototype.constructor = MultiReferenceProperty;

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
