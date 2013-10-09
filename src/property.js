var _ = require("underscore");

module.exports = Property = (function() {

  function Property(name, propertyDefinition) {
    _.extend(this, propertyDefinition);
    this.name = name;
  }


  Property.prototype.isIndexed = function(first_argument) {
    return this.index;
  };


  return Property;

})();
