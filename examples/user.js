var mogwai = require("../");


var UserSchema = new mogwai.Schema({
  name: {
    type: String,
    index: true,
    required: true,
    unique: true
  }
});

UserSchema.methods.speak = function(message) {
  console.log(this.name + 'says: ' + message);
};

// Compile Schema into Model
module.exports = mogwai.model("User", UserSchema);
