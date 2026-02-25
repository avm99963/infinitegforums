/**
 * @file Exports a fetch method that can be used by the extension in a content
 * script to execute a request as if it was the page.
 *
 * In gecko, we need to use window.content.fetch since window.fetch sends the
 * request from the context of the extension and not the page, and thus CORS
 * fails.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#xhr_and_fetch}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/content}
 */

let context: { fetch: typeof window.fetch };
// #!if defined(GECKO)
context = window.content || window;
// #!else
context = window;
// #!endif

export const fetch = context.fetch;

// #!if defined(GECKO)
declare global {
  interface Window {
    content: {
      fetch: typeof window.fetch;
    };
  }
}
// #!endif
