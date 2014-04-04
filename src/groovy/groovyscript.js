var GroovyScript = (function() {

  function GroovyScript(stringDefinition) {
    this.setDefinition(stringDefinition);
  }

  /**
   * Return the script's definition without spaces, and escaped $ sign.
   *
   * @return {String}
   */
  GroovyScript.prototype.getEscapedDefinition = function() {
    return this.definition.trim().replace(/\$/g, "\\$");
  };

  /**
   * Set the definition of the script
   *
   * @param {String} stringDefinition - A Groovy script string
   */
  GroovyScript.prototype.setDefinition = function(stringDefinition) {
    this.definition = stringDefinition;
  };

  /**
   * Groovy scripts do not (yet) accept parameters.
   */
  GroovyScript.prototype.getAppliedParameters = function() {
    return;
  };


  return GroovyScript;

})();

module.exports = GroovyScript;