var should = require('should');
var mogwai = require("../");


describe("Connection", function() {
  it("should connect to a graph database", function(done) {
    var settings = {
      host: "localhost",
      port: 8182,
      graph: "tinkergraph",
      client: "titan"
    };

    mogwai.connect(settings, function(err, graphDB) {
      should.not.exist(err);
      should.exist(graphDB);
      done();
    });
  });
});