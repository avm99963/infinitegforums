import MWOptionsWatcherClient from '../common/mainWorldOptionsWatcher/Client.js';
import { OptionCodename } from '../common/options/optionsPrototype.js';
import {
  InterceptedResponse,
  ResponseModifierPort,
  Result,
} from './ResponseModifier.port.js';

import { Modifier } from './responseModifiers/types.js';

// Content script target
export const kCSTarget = 'TWPT-XHRInterceptorOptionsWatcher-CS';
// Main world (AKA regular web page) target
export const kMWTarget = 'TWPT-XHRInterceptorOptionsWatcher-MW';

export default class ResponseModifierAdapter implements ResponseModifierPort {
  private optionsWatcher: MWOptionsWatcherClient;

  constructor(private responseModifiers: Modifier[]) {
    this.optionsWatcher = new MWOptionsWatcherClient(
      Array.from(this.watchingFeatures(this.responseModifiers)),
      kCSTarget,
      kMWTarget,
    );
  }

  private watchingFeatures(modifiers: Modifier[]): Set<OptionCodename> {
    const union = new Set<OptionCodename>();
    for (const m of modifiers) {
      if (!m.featureGated) continue;
      for (const feature of m.features) union.add(feature);
    }
    return union;
  }

  private async getMatchingModifiers(requestUrl: string) {
    // First filter modifiers which match the request URL regex.
    const urlModifiers = this.responseModifiers.filter((modifier) =>
      requestUrl.match(modifier.urlRegex),
    );

    // Now filter modifiers which require a certain feature to be enabled
    // (feature-gated modifiers).
    const featuresAreEnabled = await this.optionsWatcher.areEnabled(
      Array.from(this.watchingFeatures(urlModifiers)),
    );

    // #!if !production
    if (Object.keys(featuresAreEnabled).length > 0) {
      console.debug(
        '[XHR Interceptor - Response Modifier] Requested features',
        featuresAreEnabled,
        'for request',
        requestUrl,
      );
    }
    // #!endif

    return urlModifiers.filter((modifier) => {
      return !modifier.featureGated || modifier.isEnabled(featuresAreEnabled);
    });
  }

  async intercept(interception: InterceptedResponse): Promise<Result> {
    const matchingModifiers = await this.getMatchingModifiers(interception.url);

    // If we didn't find any matching modifiers, return the response right away.
    if (matchingModifiers.length === 0) return { wasModified: false };

    // Otherwise, apply the modifiers sequentially and set the new response.
    let json = interception.originalResponse;
    for (const modifier of matchingModifiers) {
      json = await modifier.interceptor(json, interception.url);
    }
    return {
      wasModified: true,
      modifiedResponse: json,
    };
  }
}
