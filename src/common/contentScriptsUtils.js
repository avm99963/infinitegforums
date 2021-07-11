export function injectStylesheet(stylesheetName, attributes = {}) {
  var link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', stylesheetName);
  if ('media' in attributes) link.setAttribute('media', attributes['media']);
  document.head.appendChild(link);
}

export function injectStyles(css) {
  injectStylesheet('data:text/css;charset=UTF-8,' + encodeURIComponent(css));
}

export function injectScript(scriptName) {
  var script = document.createElement('script');
  script.src = scriptName;
  document.head.appendChild(script);
}
