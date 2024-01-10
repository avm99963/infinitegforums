import rescape from '@stdlib/utils-escape-regexp-string';

import {correctArrayKeys} from './protojs';

export function parseView(viewVar) {
  const escapedViewVar = rescape(viewVar);
  const viewRegex = new RegExp(`var ${escapedViewVar} ?= ?'([^']+)';`);

  const scripts = document.querySelectorAll('script');
  let viewData = null;
  for (let i = 0; i < scripts.length; ++i) {
    const matches = scripts[i].textContent.match(viewRegex);
    if (matches?.[1]) {
      let rawJsonStringContents =
          matches[1]
              .replace(
                  /\\x([0-9a-f]{2})/ig,
                  (_, pair) => {
                    return String.fromCharCode(parseInt(pair, 16));
                  })
              .replace(/\\'/g, `'`)
              .replace(/"/g, `\\"`);
      let rawJsonString = `"${rawJsonStringContents}"`;
      let rawJson = JSON.parse(rawJsonString);
      viewData = JSON.parse(rawJson);
      break;
    }
  }
  if (!viewData) throw new Error(`Could not find ${viewVar} view data.`);
  return correctArrayKeys(viewData);
}
