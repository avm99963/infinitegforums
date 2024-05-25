export interface StylesheetAttributes {
  media?: string;
}

export function injectStylesheet(
  stylesheetName: string,
  attributes: StylesheetAttributes = {},
) {
  var link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', stylesheetName);
  if ('media' in attributes) {
    link.setAttribute('media', attributes['media']);
  }
  document.head.appendChild(link);
  return link;
}

export function injectStyles(css: string) {
  injectStylesheet('data:text/css;charset=UTF-8,' + encodeURIComponent(css));
}

export function injectScript(scriptName: string, prepend = false) {
  var script = document.createElement('script');
  script.src = scriptName;
  const root = document.head || document.documentElement;
  if (prepend) {
    root.prepend(script);
  } else {
    root.append(script);
  }
}
