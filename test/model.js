var should = require('should');
var mogwai = require('../');


var UserSchema = new mogwai.Schema({
  name: String
});

User = mogwai.model('User', UserSchema);

var user;

describe('Model', function() {
  it('should instantiate a new model', function() {
    user = new User();
    user.should.be.an.instanceOf(model);
  });

  it('should have properties', function() {
    user.foo = 'bar';
    user.should.have.property('foo', 'bar');
  });

  describe('save()', function() {
    it('should insert a new model to the graph database', function(done) {
      user.save(function(err, user, response) {
        should.not.exist(err);
        should.exist(response);
        done();
      });
    });
  });
});