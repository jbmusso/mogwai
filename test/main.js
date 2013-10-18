var mogwai = require("../"),
    should = require("should");


describe("Connection", function() {
  it("should connect to a graph database", function(done) {
    var settings = {
      host: "localhost",
      port: 8182,
      graph: "test-graph",
      client: "titan"
    };

    mogwai.connect(settings, function(err, graphDB) {
      should.not.exist(err);
      should.exist(graphDB);
      done();
    });
  });
});

var model = null;

describe("Schemas", function() {
  var schemaName = "SomeSchema";

  before(function(done) {
    var Schema = new mogwai.Schema();
    model = mogwai.model(schemaName, Schema);
    done();
  });

  it("should compile a model", function(done) {
    should.exist(mogwai.models[schemaName]);
    done();
  });

});


describe("Model", function() {
  it("should have default methods findOne and findById", function(done) {
    should.exist(model.findOne);
    should.exist(model.findById);
    model.findOne.should.be.a("function");
    model.findById.should.be.a("function");
    done();
  });
});
