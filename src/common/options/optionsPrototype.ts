import { Option, OptionContext, KillSwitchType, OptionConfig } from './Option';

const rawOptionConfigs = {
  // Available options
  list: {
    defaultValue: true,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  thread: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  threadall: {
    defaultValue: true,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  fixedtoolbar: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  redirect: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  history: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  loaddrafts: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  increasecontrast: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  stickysidebarheaders: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  profileindicator: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  profileindicatoralt: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  profileindicatoralt_months: {
    defaultValue: 12,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Ignore,
  },
  ccdarktheme: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  ccdarktheme_mode: {
    defaultValue: 'switch',
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Ignore,
  },
  ccforcehidedrawer: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  ccdragndropfix: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  batchlock: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  enhancedannouncementsdot: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  repositionexpandthread: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  threadlistavatars: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  autorefreshlist: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  imagemaxheight: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  blockdrafts: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  perforumstats: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  interopthreadpage: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  interopthreadpage_mode: {
    defaultValue: 'previous',
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Ignore,
  },
  uispacing: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  flattenthreads: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  bulkreportreplies: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  bulkmove: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  logstartupdata: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  fixlinkdialog: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  fixpekb381989895: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },

  // Experiments
  workflows: {
    defaultValue: false,
    context: OptionContext.Experiments,
    killSwitchType: KillSwitchType.Experiment,
  },
  extrainfo: {
    defaultValue: false,
    context: OptionContext.Experiments,
    killSwitchType: KillSwitchType.Experiment,
  },

  // Internal options
  ccdarktheme_switch_status: {
    defaultValue: true,
    context: OptionContext.Internal,
    killSwitchType: KillSwitchType.Ignore,
  },
  flattenthreads_switch_enabled: {
    defaultValue: true,
    context: OptionContext.Internal,
    killSwitchType: KillSwitchType.Ignore,
  },
  bulkreportreplies_switch_enabled: {
    defaultValue: true,
    context: OptionContext.Internal,
    killSwitchType: KillSwitchType.Ignore,
  },

  // Internal kill switches
  killswitch_xhrproxy: {
    defaultValue: undefined as unknown,
    context: OptionContext.Internal,
    killSwitchType: KillSwitchType.InternalKillSwitch,
  },

  // Deprecated options
  escalatethreads: {
    defaultValue: false,
    context: OptionContext.Deprecated,
    killSwitchType: KillSwitchType.Deprecated,
  },
  movethreads: {
    defaultValue: false,
    context: OptionContext.Deprecated,
    killSwitchType: KillSwitchType.Deprecated,
  },
  batchduplicate: {
    defaultValue: false,
    context: OptionContext.Deprecated,
    killSwitchType: KillSwitchType.Deprecated,
  },
  smei_sortdirection: {
    defaultValue: false,
    context: OptionContext.Deprecated,
    killSwitchType: KillSwitchType.Deprecated,
  },
  forcemarkasread: {
    defaultValue: false,
    context: OptionContext.Deprecated,
    killSwitchType: KillSwitchType.Deprecated,
  },
  disableunifiedprofiles: {
    defaultValue: false,
    context: OptionContext.Deprecated,
    killSwitchType: KillSwitchType.Deprecated,
  },
  nestedreplies: {
    defaultValue: false,
    context: OptionContext.Deprecated,
    killSwitchType: KillSwitchType.Deprecated,
  },
  fixpekb269560789: {
    defaultValue: false,
    context: OptionContext.Deprecated,
    killSwitchType: KillSwitchType.Deprecated,
  },
};

export type OptionPrototype<T> = Omit<OptionConfig<T>, 'codename'>;
export const optionsPrototype: Record<
  string,
  OptionPrototype<unknown>
> = rawOptionConfigs;

export const options = Object.entries(rawOptionConfigs).map(
  ([codename, rawOption]) =>
    new Option({
      codename,
      ...rawOption,
    }),
);

export const optionsMap = new Map(
  options.map((option) => [option.codename, option]),
);

export const optionCodenames = Object.keys(
  rawOptionConfigs,
) as OptionCodename[];

export type OptionCodename = keyof typeof rawOptionConfigs;
export type OptionsValues = {
  [K in OptionCodename]: (typeof rawOptionConfigs)[K]['defaultValue'];
};
