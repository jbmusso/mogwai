var inherits = require('util').inherits;

var Property = require("./property");


var StringProperty = (function() {

  function StringProperty() {
    Property.apply(this, arguments);
  }

  inherits(StringProperty, Property);


  return StringProperty;

})();

module.exports = StringProperty;