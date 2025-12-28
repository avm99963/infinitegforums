import { OptionsProviderPort } from '@/services/options/OptionsProvider';
import { MatchableModifier } from './types';

export default class ModifierMatcher {
  constructor(private readonly optionsProvider: OptionsProviderPort) {}

  /**
   * Returns enabled modifiers matching the URL.
   */
  async getMatchingModifiers<T extends MatchableModifier>(
    modifiers: T[],
    requestUrl: string,
  ): Promise<T[]> {
    modifiers = modifiers.filter((modifier) =>
      requestUrl.match(modifier.urlRegex),
    );

    if (modifiers.length == 0) {
      return [];
    }

    const optionsConfiguration =
      await this.optionsProvider.getOptionsConfiguration();
    return modifiers.filter((modifier) => {
      return modifier.isEnabled(optionsConfiguration);
    });
  }
}
