mogwai
======

Object-to-graph mapper for Node.js using Gremlin, (currently) in Mongoose style.

Mogwai tries to abstract interaction with any [Tinkerpop](http://www.tinkerpop.com/)'s [Blueprints](https://github.com/tinkerpop/blueprints/wiki) compliant Graph databases (ie. TitanDB, Neo4J, OrientDB, FoundationDB, etc.).

Mogwai internally uses [grex](https://github.com/entrendipity/grex), a "Gremlin inspired Rexster Graph Server client", and therefore communicates with the database via HTTP.

Comments, suggestions and pull requests are welcome.

Twitter: [@jbmusso](https://twitter.com/intent/follow?screen_name=jbmusso)

Installation
============

    $ npm install mogwai

or, should you wish to add mogwai as a dependency in your package.json file as well:

    $ npm install mogwai --save

Please refer to [grex's documentation](https://github.com/entrendipity/grex/blob/master/README.md) first on how to set up your Graph database/Rexster server (ie. you will have to install Gremlin and Batch kibbles).


Usage
=====

Mogwai's API is currently very close to Mongoose ([see Mongoose documentation](https://github.com/LearnBoost/mongoose/)), a MongoDB modeling library for Node.js. Hence, some method names in Mogwai are very inspired by MongoDB's method (ie. `findOne`, `findById`, etc.).

Please be aware that Mogwai is in active development, so changes breaking backward compatibility are very likely to occur as this project evolves to a more mature/stable API (possibly diverging from Mongoose).

Mogwai is not considered stable and should not be used in production.

## Connecting to the database ##

```javascript
var mogwai = require("mogwai");

var settings = {
  host: "localhost",
  port: 8182,
  graph: "graph"
};

// mogwai.connect() is just a wrapper around grex.connect()
mogwai.connect(settings, function(err, connection) {
  // Start here...
});
```

## Schema definition ##

Schemas compile into Models which are used to retrieve and perform CRUD operations on your data.

```javascript
var mogwai = require("mogwai");

UserSchema = new mogwai.Schema();

UserSchema.statics.findByName = function(name, callback) {
  this.findOne({
    name: name
  }, callback);
};

UserSchema.methods.edit = function(data, callback) {
  this.name = data.name;

  return this.save(callback);
};

// Compiles schema into a model of type 'user'
module.exports = mogwai.model("User", UserSchema);
```

## Schema plugins ##

Plugins add a set of methods to existing schemas.

### Plugin definition ###

`plugin.js` file:

```javascript
module.exports = function(schema, options) {
  schema.method("doSomething", function(callback) {
    // ...
  });

  schema.static("doMoreStuff", function(callback) {
    // ...
  });
```

### Adding a plugin to an existing Schema ###

```javascript
// ...
var mogwai = require("mogwai");
var myplugin = require("./path/to/my/plugin");


UserSchema = new mogwai.Schema()
// ...

UserSchema.plugin(myplugin);

```

Tests
=====
Install development dependencies

    $ npm install

then run tests

    $ make test

TODO
====

Features

  * Indexes
  * Validation
  * Hooks (pre and post middlewares)
  * Getters and setters

Misc

  * Write more tests
  * Performance and optimization


Licence
=======

The MIT License (MIT)

Copyright (c) 2013 Jean-Baptiste Musso

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
