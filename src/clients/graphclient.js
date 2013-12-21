module.exports = (function () {
  /**
   * The main abstract GraphClient class.
   *
   * @param {Mogwai} mogwai - An instance of Mogwai
   */
  function GraphClient(mogwai) {
    this.mogwai = mogwai;

    this.g = this.mogwai.connection.g;
    this.graph = this.mogwai.connection.graph;
  }

  return GraphClient;

})();
