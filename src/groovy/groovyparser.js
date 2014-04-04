var Utils = require("../utils");
var GroovyFunction = require("./groovyfunction");

var GroovyParser = (function() {

  function GroovyParser() {
  }

  /**
   * Parse a .groovy file and return an object mapping each groovy function
   * name to its definition.
   *
   * @param {String} fileContent - raw content of a .groovy file
   * @return {Object} - map of GroovyFunction
   */
  GroovyParser.prototype.scan = function(fileContent) {
    var line,
        functionsContainer = {};

    fileContent = fileContent.split("\n");

    for (var i = 0; i < fileContent.length; i++) {
      line = fileContent[i];
      this.parseLine(fileContent, line, functionsContainer);
    }

    return functionsContainer;
  };

  /**
   * Parse a Groovy file line
   *
   * @param {Array} fileContent - array of Groovy lines
   * @param {String} line - Groovy file line
   * @param {Object} functionsContainer - Object to store all functions into
   */
  GroovyParser.prototype.parseLine = function(fileContent, line, functionsContainer) {
    var groovyFunction;

    if (this.isStartDefLine(line)) {
      groovyFunction = new GroovyFunction();
      groovyFunction.setSignature(line);
      groovyFunction.setDefinition(fileContent, line);

      functionsContainer[groovyFunction.getName()] = groovyFunction;
    }
  };

  /**
   * Check if line is the start of a function definition
   *
   * @param {String} line - Groovy file line
   * @return {Boolean} - Whether the line is a def starting line or not
   */
  GroovyParser.prototype.isStartDefLine = function(line) {
    var re = /^def( .*)/;
    return re.test(line);
  };


  return GroovyParser;

})();

module.exports = GroovyParser;