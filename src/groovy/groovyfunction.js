var GroovyScript = require("./groovyscript");

module.exports = (function () {

  function GroovyFunction() {
    this.signature = null;
    this.name = null;
    this.definition = null;
    this.params = [];
  }

  // Inherit from GroovyScript
  GroovyFunction.prototype = Object.create(GroovyScript.prototype);
  GroovyFunction.prototype.constructor = GroovyFunction;


  GroovyFunction.prototype.getName = function() {
    return this.name;
  };

  /* *
   * Set the signature of a Groovy function from its first line. For example,
   * this line:
   *    def fooBar(baz) {
   *
   * yields the following signature:
   *    fooBar(baz)
   *
   * Note that setting a signature also set the name of the function as well as
   * as its parameter definition.
   *
   * @param {String} line - Groovy line starting with def
   */
  GroovyFunction.prototype.setSignature = function(line) {
    var re = /^def(.*)( +){/;
    this.signature = line.match(re)[1].trim();

    this.setName();
    this.setParams();
  };

  /**
   * Get the name of a Groovy function from its signature. Ie.
   *    fooBar(baz)
   * will return:
   *    fooBar
   */
  GroovyFunction.prototype.setName = function() {
    var re = /^(.*)\(/;
    this.name = this.signature.match(re)[1].trim();
  };

  /**
   * Set the parameters (arguments) that this function accepts.
   */
  GroovyFunction.prototype.setParams = function() {
    var re = /\(([^)]+)\)/;
    var params = this.signature.match(re);

    if (params !== null) {
      this.params = params[1].replace(/ /g, "").split(",");
    }
  };

  /**
   * Return parameters with their value for all parameters this function
   * actually accepts.
   *
   * @return {Object}
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
        // Reached end of Groovy function definition, don't push last line (closing brace)
        break;
      }

      definitionContent.push(currentLine);
    }

    this.definition = definitionContent.join("\n");
  };

  /**
   * Check if line is the end of a function definition
   *
   * @param {String} groovy file line
   * @return {Boolean} - Whether the line ends the function or not
   */
  GroovyFunction.prototype.isEndDefLine = function(line) {
    var re = /^}/;
    return re.test(line);
  };


  return GroovyFunction;

})();
