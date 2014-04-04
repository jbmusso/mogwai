var should = require('should');
var mogwai = require("../");


var model;

describe("Model", function() {
  before(function(done) {
    var Schema = new mogwai.Schema();
    model = mogwai.model('SomeSchema', Schema);
    done();
  });

  it("should have default methods findByKeyValue and findById", function(done) {
    should.exist(model.findByKeyValue);
    should.exist(model.findById);
    model.findByKeyValue.should.be.a("function");
    model.findById.should.be.a("function");
    done();
  });
});