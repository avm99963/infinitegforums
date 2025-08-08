export enum KillSwitchType {
  Option = 'option',
  Experiment = 'experiment',
  Ignore = 'ignore',
  Deprecated = 'deprecated',
  InternalKillSwitch = 'internalKillSwitch',
}

export enum OptionContext {
  Options = 'options',
  Experiments = 'experiments',
  Internal = 'internal',
  Deprecated = 'deprecated',
}

export interface OptionConfig<T> {
  codename: string;
  context: OptionContext;
  defaultValue: T;
  killSwitchType: KillSwitchType;
}

export class Option<T> implements OptionConfig<T> {
  public codename: string;
  public context: OptionContext;
  public defaultValue: T;
  public killSwitchType: KillSwitchType;

  constructor(config: OptionConfig<T>) {
    this.codename = config.codename;
    this.context = config.context;
    this.defaultValue = config.defaultValue;
    this.killSwitchType = config.killSwitchType;
  }
}
