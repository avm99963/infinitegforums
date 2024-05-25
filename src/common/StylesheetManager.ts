import { StylesheetAttributes, injectStylesheet } from './contentScriptsUtils';

export default class StylesheetManager {
  private injectedElement: HTMLElement;

  constructor(
    /**
     * Relative path to the stylesheet from the extension root.
     */
    public stylesheet: string,

    /**
     * Attributes to include in the injected <link> element.
     */
    public attributes: StylesheetAttributes = {},
  ) {}

  isInjected() {
    return this.injectedElement !== undefined;
  }

  inject() {
    this.injectedElement = injectStylesheet(
      chrome.runtime.getURL(this.stylesheet),
      this.attributes,
    );
  }

  remove() {
    this.injectedElement.remove();
    this.injectedElement = undefined;
  }
}
