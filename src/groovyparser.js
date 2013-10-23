Utils = require("./utils");

module.exports = GroovyParser = (function () {

  function GroovyParser() {
  }

  /*
   * Parse a .groovy file and return an object mapping each groovy function
   * name to its definition.
   *
   * @param {String} raw content of a .groovy file
   * @return {Object} map of Groovy function names with their respective
   * definition.
   */
  GroovyParser.prototype.scan = function(fileContent) {
    var line;

    methodsContainer = {};

    fileContent = fileContent.split("\n");
    for (var i = 0; i < fileContent.length; i++) {
      line = fileContent[i];
      this.parseLine(fileContent, line, methodsContainer);
    }

    return methodsContainer;
  };

  GroovyParser.prototype.parseLine = function(fileContent, line, methodsContainer) {
    if (this.isStartDefLine(line)) {
      // Multiline definition
      methodSignature = this.getMethodSignature(line);
      methodName = this.getMethodName(methodSignature);

      methodDefinition = this.getMultineLineDefinition(fileContent, line);
      methodDefinition = methodDefinition.join("");

      methodsContainer[methodName] = methodDefinition;
    }

  };

  /*
   * Check if line is the start of a function definition
   *
   * @param {String} groovy file line
   * @return {Boolean}
   */
  GroovyParser.prototype.isStartDefLine = function(line) {
    var re = /^def( .*)/;
    return re.test(line);
  };

  /*
   * Check if line is the end of a function definition
   *
   * @param {String} groovy file line
   * @return {Boolean}
   */
  GroovyParser.prototype.isEndDefLine = function(line) {
    var re = /^}/;
    return re.test(line);
  };

  /*
   * Get a Groovy function definition spanning over multiple lines
   *
   * @param {String} content of groovy file
   * @param {String} first line of function in file
   * @return {String} inner content of the function, without first line
   * (signature) and last line (closing brace).
   */
  GroovyParser.prototype.getMultineLineDefinition = function(fileContent, line) {
    var startLine = fileContent.indexOf(line);
    var currentLine;
    var content = [];

    for (var i = startLine + 1; i < fileContent.length; i++) {
      currentLine = fileContent[i];
      if (this.isEndDefLine(currentLine)) {
        // Reached end of Groovy function definition, don't push last line (closing brace)
        break;
      }

      content.push(currentLine);
    }

    return content;

  };

  /*
   * Get the signature of a Groovy function from its first line. Ie.
   *    def fooBar(baz) {
   * will return:
   *    fooBar(baz)
   */
  GroovyParser.prototype.getMethodSignature = function(methodDefinition) {
    var re = /^def(.*)( +){/;
    var methodSignature = methodDefinition.match(re)[1].trim();

    return methodSignature;
  };

  /*
   * Get the name of a Groovy function from its signature. Ie.
   *    fooBar(baz)
   * will return:
   *    fooBar
   */
  GroovyParser.prototype.getMethodName = function(methodSignature) {
    var re = /^(.*)\(/;
    var methodName = methodSignature.match(re)[1].trim();

    return methodName;
  };


  return GroovyParser;

})();
