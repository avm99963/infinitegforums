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
import ModifierMatcher from '../modifierMatcher/ModifierMatcher';

// Content script target
export const kCSTarget = 'TWPT-XHRInterceptorOptionsWatcher-CS';
// Main world (AKA regular web page) target
export const kMWTarget = 'TWPT-XHRInterceptorOptionsWatcher-MW';

export default class ResponseModifierAdapter implements ResponseModifierPort {
  private modifierMatcher: ModifierMatcher;

  constructor(
    private readonly responseModifiers: ResponseModifier[],
    private readonly optionsProvider: OptionsProviderPort,
  ) {
    this.modifierMatcher = new ModifierMatcher(optionsProvider);
  }

  private async getMatchingModifiers(requestUrl: string) {
    return this.modifierMatcher.getMatchingModifiers(
      this.responseModifiers,
      requestUrl,
    );
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
