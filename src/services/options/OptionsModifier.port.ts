import { OptionCodename, OptionsValues } from "../../common/options/optionsPrototype";

/**
 * Modifier in the sense that it allows users to modify/save options.
 */
export interface OptionsModifierPort {
  set<O extends OptionCodename>(
    option: O,
    value: OptionsValues[O],
  ): Promise<void>;
}
