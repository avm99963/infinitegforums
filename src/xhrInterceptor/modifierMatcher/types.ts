import { OptionsConfiguration } from '@/common/options/OptionsConfiguration';

export interface MatchableModifier {
  urlRegex: RegExp;
  isEnabled(options: OptionsConfiguration): boolean;
}
