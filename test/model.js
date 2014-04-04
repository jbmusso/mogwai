var should = require('should');
var mogwai = require("../");


var model;

describe("Model", function() {
  before(function(done) {
    var Schema = new mogwai.Schema();
    model = mogwai.model('SomeSchema', Schema);
    done();
  });

  describe('Methods', function() {
    it("should have findById method", function() {
      should.exist(model.findById);
      model.findById.should.be.a("function");
    });

    it("should have findByKeyValue method", function() {
      should.exist(model.findByKeyValue);
      model.findByKeyValue.should.be.a("function");
    });
  });
});