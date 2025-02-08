import {
  OptionCodename,
  OptionsValues,
} from '../../../common/options/optionsPrototype';
import { OptionsModifierPort } from '../../../services/options/OptionsModifier.port';

export class OptionsModifierAdapter implements OptionsModifierPort {
  set<O extends OptionCodename>(
    option: O,
    value: OptionsValues[O],
  ): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [option]: value }, () => resolve());
    });
  }
}
