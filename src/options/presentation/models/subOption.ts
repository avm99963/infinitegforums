import { OptionCodename } from '../../../common/options/optionsPrototype';

export interface DropdownOption {
  value: string;
  label: string;
}

export type NestedOptionType =
  | {
      type: 'integer';
      min?: number;
      max?: number;
    }
  | {
      type: 'dropdown';
      options: DropdownOption[];
    };

export interface SubOptionConfig<
  T extends NestedOptionType = NestedOptionType,
> {
  optionCodename: OptionCodename;
  label: string;
  type: T;
}

export class SubOption<T extends NestedOptionType = NestedOptionType> {
  public optionCodename: OptionCodename;
  public label: string;
  public type: T;

  constructor(config?: SubOptionConfig<T>) {
    this.optionCodename = config.optionCodename;
    this.label = config.label;
    this.type = config.type;
  }
}
