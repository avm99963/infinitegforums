export default class FetchInput {
  constructor(private input: RequestInfo | URL) {}

  /**
   * Returns the fetch input URL as a string.
   */
  getUrl() {
    if (typeof this.input === 'string') {
      return this.input;
    } else if (this.input instanceof URL) {
      return this.input.toString();
    } else {
      return this.input.url;
    }
  }
}
