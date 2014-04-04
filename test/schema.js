var should = require('should');
var mogwai = require("../");


var model;

describe("Schema", function() {
  var schemaName = "SomeSchema";

  before(function(done) {
    var Schema = new mogwai.Schema();
    model = mogwai.model(schemaName, Schema);
    done();
  });

  it("should compile a model", function(done) {
    should.exist(mogwai.models[schemaName.toLowerCase()]);
    done();
  });
});