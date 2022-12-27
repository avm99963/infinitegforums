import MWOptionsWatcherClient from '../../common/mainWorldOptionsWatcher/Client.js';
import {convertJSONToResponse, getResponseJSON} from '../utils.js';

import demo from './demo.js';

export const responseModifiers = [
  demo,
];

// Content script target
export const kCSTarget = 'TWPT-XHRInterceptorOptionsWatcher-CS';
// Main world (AKA regular web page) target
export const kMWTarget = 'TWPT-XHRInterceptorOptionsWatcher-MW';

export default class ResponseModifier {
  constructor() {
    this.optionsWatcher = new MWOptionsWatcherClient(
        Array.from(this.watchingFeatures()), kCSTarget, kMWTarget);
  }

  watchingFeatures(modifiers) {
    if (!modifiers) modifiers = responseModifiers;

    const union = new Set();
    for (const m of modifiers) {
      if (!m.featureGated) continue;
      for (const feature of m.features) union.add(feature);
    }
    return union;
  }

  async #getMatchingModifiers(request) {
    // First filter modifiers which match the request URL regex.
    const urlModifiers = responseModifiers.filter(
        modifier => request.$TWPTRequestURL.match(modifier.urlRegex));

    // Now filter modifiers which require a certain feature to be enabled
    // (feature-gated modifiers).
    const featuresAreEnabled = await this.optionsWatcher.areEnabled(
        Array.from(this.watchingFeatures(urlModifiers)));

    // #!if !production
    if (Object.keys(featuresAreEnabled).length > 0) {
      console.info(
          '[XHR Interceptor - Response Modifier] Requested features',
          featuresAreEnabled, 'for request', request.$TWPTRequestURL);
    }
    // #!endif

    return urlModifiers.filter(modifier => {
      return !modifier.featureGated || modifier.isEnabled(featuresAreEnabled);
    });
  }

  async intercept(request, response) {
    const matchingModifiers = await this.#getMatchingModifiers(request);

    // If we didn't find any matching modifiers, return the response right away.
    if (matchingModifiers.length === 0) return response;

    // Otherwise, apply the modifiers sequentially and set the new response.
    let json = getResponseJSON({
      responseType: request.xhr.responseType,
      response: request.xhr.response,
      $TWPTRequestURL: request.$TWPTRequestURL,
      $isArrayProto: request.$isArrayProto,
    });
    for (const modifier of matchingModifiers) {
      json = await modifier.interceptor(request, json);
    }
    response = convertJSONToResponse(request, json);
    request.$newResponse = response;
    request.$responseModified = true;
  }
}
