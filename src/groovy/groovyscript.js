module.exports = (function () {

  function GroovyScript(stringDefinition) {
    this.setDefinition(stringDefinition);
  }

  /**
   * Return the script's definition without spaces, also escape $ sign.
   * @return {String}
   */
  GroovyScript.prototype.getEscapedDefinition = function() {
    return this.definition.trim().replace(/\$/g, "\\$");
  };

  GroovyScript.prototype.setDefinition = function(stringDefinition) {
    this.definition = stringDefinition;
  };

  GroovyScript.prototype.getAppliedParameters = function() {
    return;
  };


  return GroovyScript;

})();
