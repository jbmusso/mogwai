/*jshint expr: true*/ // won't complain for type.should.be.a.String;

var Property = require("../src/properties/property"),
    StringProperty = require("../src/properties/property"),
    should = require("should");


var stringProperty;

describe("Properties", function() {
  describe("Property", function() {

    var stringPropertyDefinition = String;
    var numberPropertyDefinition = {type: Number};

    describe("#retrieveType", function() {

      it("should return a type when the definition is a type Constructor", function() {
        type = Property.retrieveType(stringPropertyDefinition);
        type.should.be.a.String;
        type.should.equal("string");
      });


      it("should return a type when the definition is an Object with a type property", function() {
        type = Property.retrieveType({type: String});
        type.should.be.a.String;
        type.should.equal("string");
      });

    });

    describe("#build", function() {
      it("should build a String property", function() {
        stringProperty = Property.build("firstname", stringPropertyDefinition);
        stringProperty.should.be.an.instanceof(StringProperty);
      });

    });

  });


  describe("String property", function() {

    describe("When supplied no specific definition", function() {
      var stringProperty;

      before(function() {
        stringProperty = Property.build("lastname", String);
      });

      it("should not be flagged to be indexed", function() {
        stringProperty.isIndexed().should.be.false;
      });

      it("should not be flagged to be unique", function() {
        stringProperty.isUnique().should.be.false;
      });

    });


    describe("#isIndexed()", function() {

    });
  });
});
