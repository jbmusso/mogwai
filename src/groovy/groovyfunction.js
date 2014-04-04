var GroovyScript = require("./groovyscript");


var GroovyFunction = (function() {
  /**
   * A class representing a Groovy function defined in a .groovy file.
   */
  function GroovyFunction() {
    this.signature = null;
    this.name = null;
    this.definition = null;
    this.params = [];
  }

  // Inherit from GroovyScript
  GroovyFunction.prototype = Object.create(GroovyScript.prototype);
  GroovyFunction.prototype.constructor = GroovyFunction;

  /**
   * Return the name of the Groovy function, as defined in its signature
   * @return {String}
   */
  GroovyFunction.prototype.getName = function() {
    return this.name;
  };

  /**
   * Set the signature of a Groovy function from its first line. For example,
   * this line:
   *    def fooBar(baz) {
   *
   * yields the following function signature:
   *    fooBar(baz)
   *
   * Note that setting a signature simultaneously sets the name of the
   * function and its parameter definition.
   *
   * @param {String} line - A line starting with def from a .groovy file
   */
  GroovyFunction.prototype.setSignature = function(line) {
    var re = /^def(.*)( +){/;
    this.signature = line.match(re)[1].trim();

    this.setName();
    this.setParams();
  };

  /**
   * Set the name of a Groovy function from its signature. Ie.
   *    fooBar(baz)
   * will return a string:
   *    fooBar
   */
  GroovyFunction.prototype.setName = function() {
    var re = /^(.*)\(/;
    this.name = this.signature.match(re)[1].trim();
  };

  /**
   * Set an array of parameters (arguments) that this function accepts from its
   * signature. Ie.
   *    fooBar(baz, duh)
   * will return an array:
   *    [baz, duh]
   */
  GroovyFunction.prototype.setParams = function() {
    var re = /\(([^)]+)\)/;
    var params = this.signature.match(re);

    if (params !== null) {
      this.params = params[1].replace(/ /g, "").split(",");
    }
  };

  /**
   * Return parameters with their value for all parameters this Groovy function
   * actually accepts.
   *
   * @return {Object} - Object mapping param names to their value
   */
  GroovyFunction.prototype.getAppliedParameters = function(params) {
    var currentParam,
        appliedParameters = {};

    for (var i = 0; i < this.params.length; i++) {
      currentParam = this.params[i];
      appliedParameters[currentParam] = params[i];
    }

    return appliedParameters;
  };

  /**
   * Set a Groovy function body from a definition spanning over multiple lines
   *
   * @param {String} fileContent - content of groovy file
   * @param {String} line - first line of that function in the fileContent
   * @return {String} - full inner content of the function, without first line
   *    (signature) and last line (closing brace).
   */
  GroovyFunction.prototype.setDefinition = function(fileContent, line) {
    var startLine = fileContent.indexOf(line);
    var currentLine;
    var definitionContent = [];

    for (var i = startLine + 1; i < fileContent.length; i++) {
      currentLine = fileContent[i];
      if (this.isEndDefLine(currentLine)) {
        // Reached end of Groovy function definition, don't push last line
        // (ie. the closing brace '}'')
        break;
      }

      definitionContent.push(currentLine);
    }

    this.definition = definitionContent.join("\n");
  };

  /**
   * Check if line is the end of a function definition
   *
   * @param {String} line - A .groovy file line
   * @return {Boolean} - Whether the line ends the function or not
   */
  GroovyFunction.prototype.isEndDefLine = function(line) {
    var re = /^}/;
    return re.test(line);
  };


  return GroovyFunction;

})();

module.exports = GroovyFunction;