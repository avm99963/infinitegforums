import {getOptions} from '../../../common/options/optionsUtils.js';

export async function setUpRedirectIfEnabled(options = null) {
  if (options === null) options = await getOptions(['redirect']);

  if (options.redirect) {
    setUpRedirect();
  }
}

function setUpRedirect() {
  window.TWPTRedirectHash = window.location.hash;
  // We're preloading the redirect option so we can redirect faster in
  // publicThread.js without having to retrieve the options again.
  window.TWPTShouldRedirect = true;
}
