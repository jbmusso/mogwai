var mogwai = require("../");

var Users = require("./user");


var settings = {
  host: "localhost",
  port: 8182,
  graph: "graph",
  client: "titan",
  bridge: "java"
};

// Connect to the graph
mogwai.connect(settings, function(err, connection) {
  var user = new Users();
  user.name = "Bob";

  user.save(function(err, result) {
    if (err) {
      console.error("An error occurred", err);
    } else {
      // User saved
      console.log("Success!", result);
    }
  });
});
