# NOT ACTIVELY MAINTAINED

Mogwai
======

Object-to-graph mapper for Node.js which speaks Gremlin (and also reads .groovy files).

Mogwai tries to abstract interaction with any [Tinkerpop](http://www.tinkerpop.com/)'s [Blueprints](https://github.com/tinkerpop/blueprints/wiki) compliant Graph databases (ie. TitanDB, Neo4J, OrientDB, FoundationDB, Apache's Giraph, etc.).

Most of the documentation [is found in the wiki](https://github.com/gulthor/mogwai/wiki).

Comments, suggestions and pull requests are welcome.

Twitter: [@jbmusso](https://twitter.com/intent/follow?screen_name=jbmusso)


Installation
============

    $ npm install mogwai

Please refer to [grex's documentation](https://github.com/entrendipity/grex/blob/master/README.md) first on how to set up your Graph database/Rexster server (ie. you will have to install Gremlin and Batch kibbles).

Note that installing Batch kibble will no longer be necessary in a future version of Mogwai.

Quick start
===========

### Connecting ###

```javascript
var mogwai = require("mogwai");

var settings = {
  host: "localhost",
  port: 8182,
  graph: "graph",
  client: "titan" // or "rexster"
};

mogwai.connect(settings, function(err, connection) {
  // Start here...
});
```

### Simple Schema Definition ###

```javascript
var UserSchema = new mogwai.Schema(
  name: String
);

module.exports = mogwai.model("User", UserSchema)
```

Documentation
=============

The full documentation [is available in the Github wiki](https://github.com/gulthor/mogwai/wiki).



Overview
========

Mogwai's API is currently inspired by two libraries:

* Mongoose ([see documentation](https://github.com/LearnBoost/mongoose/)), a MongoDB modeling library for Node.js, especially for the general design of the library (Schema, Models, plugins, etc.). Hence, some method names in Mogwai are very inspired by MongoDB's method (ie. `findById`, `update`, etc.).
* Bulbflow ([see Github repo](https://github.com/espeed/bulbs/)), "a Python persistence framework for graph databases", especially for all stuff related to loading Gremlin scripts defined in .groovy files.



Mogwai sends Gremlin code/queries via HTTP directly to a Rexster server with the Gremlin extension enabled. Note that Mogwai currently also uses some features from [grex](https://github.com/entrendipity/grex), a "Gremlin inspired Rexster Graph Server client", which requires the Batch extension on your Rexster server as well.

Mogwai also aims to be ready for [changes coming next year with Tinkerpop 3.0](https://github.com/tinkerpop/tinkerpop3/wiki#extensions-and-kibbles). Mogwai may support Rexpro in the future.

**Note that Mogwai is currently developed with [TitanDB](http://thinkaurelius.github.io/titan/) v0.4.0 only, and hasn't been tested with other Tinkerpop/Rexster compliant databases**. Although most features should work, expect some of them to not work at all (ie. the still partially supported indexes). Feel free to fork and send a pull request (see `/src/clients` if you wish to tweak/implement client classes).

Please be aware that Mogwai is in active development, so changes breaking backward compatibility are very likely to occur as this project evolves to a more mature/stable API.

Mogwai is not considered stable and should not be used in production. Use at your own risk.






Tests
=====
Install development dependencies

    $ npm install

then run tests

    $ make test

TODO
====

Features

  * More work on indexes (support more databases)
  * Schema: defining property types, indexes, etc.
  * Validation
  * Hooks (pre and post middlewares)
  * Getters and setters for properties

Misc

  * Write many more tests
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
