import { OptionsProviderPort } from '@/services/options/OptionsProvider';
import ModifierMatcher from '../modifierMatcher/ModifierMatcher';
import { RequestModifier } from './types';
import {
  InterceptedRequest,
  RequestModifierPort,
  Result,
} from './RequestModifier.port';

export default class RequestModifierAdapter implements RequestModifierPort {
  private modifierMatcher: ModifierMatcher;

  constructor(
    private readonly requestModifiers: RequestModifier[],
    readonly optionsProvider: OptionsProviderPort,
  ) {
    this.modifierMatcher = new ModifierMatcher(optionsProvider);
  }

  async intercept(interception: InterceptedRequest): Promise<Result> {
    const matchingModifiers = await this.modifierMatcher.getMatchingModifiers(
      this.requestModifiers,
      interception.url,
    );

    if (matchingModifiers.length === 0) return { wasModified: false };

    let body = interception.originalBody;
    for (const modifier of matchingModifiers) {
      body = await modifier.interceptor(body, interception.url);
    }
    return {
      wasModified: true,
      modifiedBody: body,
    };
  }
}
