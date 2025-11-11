import {
  OptionCodename,
  OptionsValues,
} from '../../../common/options/optionsPrototype';

export type OptionChangedEvent<C extends OptionCodename = OptionCodename> =
  CustomEvent<{
    option: C;
    value: OptionsValues[C];
  }>;
