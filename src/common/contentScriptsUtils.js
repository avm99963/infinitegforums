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

export function injectScript(scriptName, prepend = false) {
  var script = document.createElement('script');
  script.src = scriptName;
  const root = (document.head || document.documentElement);
  if (prepend)
    root.prepend(script);
  else
    root.append(script);
}
