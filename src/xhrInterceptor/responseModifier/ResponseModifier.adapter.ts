import {
  OptionCodename,
  OptionsValues,
} from '../../common/options/optionsPrototype.js';
import {
  InterceptedResponse,
  ResponseModifierPort,
  Result,
} from './ResponseModifier.port.js';

import { ResponseModifier } from './types.js';
import { OptionsProviderPort } from '@/services/options/OptionsProvider';

// Content script target
export const kCSTarget = 'TWPT-XHRInterceptorOptionsWatcher-CS';
// Main world (AKA regular web page) target
export const kMWTarget = 'TWPT-XHRInterceptorOptionsWatcher-MW';

export default class ResponseModifierAdapter implements ResponseModifierPort {
  constructor(
    private readonly responseModifiers: ResponseModifier[],
    private readonly optionsProvider: OptionsProviderPort,
  ) {}

  private async getMatchingModifiers(requestUrl: string) {
    // First filter modifiers which match the request URL regex.
    const urlModifiers = this.responseModifiers.filter((modifier) =>
      requestUrl.match(modifier.urlRegex),
    );

    // Now filter modifiers which require a certain feature to be enabled
    // (feature-gated modifiers).
    const optionsConfiguration = await this.optionsProvider.getOptionsConfiguration();

    return urlModifiers.filter((modifier) => {
      // TODO(https://iavm.xyz/b/twpowertools/230): Fix the type assertion below.
      return (
        modifier.isEnabled(optionsConfiguration)
      );
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
