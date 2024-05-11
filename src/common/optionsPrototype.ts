import {
  Option,
  OptionContext,
  KillSwitchType,
  OptionConfig,
} from './Option';

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
  // #!if ['chromium', 'chromium_mv3'].includes(browser_target)
  ccdragndropfix: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
  },
  // #!endif
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
  perforumstats: {
    defaultValue: false,
    context: OptionContext.Options,
    killSwitchType: KillSwitchType.Option,
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
  fixpekb269560789: {
    defaultValue: true,
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
  ccdarktheme_switch_enabled: {
    defaultValue: true,
    context: OptionContext.Internal,
    killSwitchType: KillSwitchType.Ignore,
  },
  flattenthreads_switch_enabled: {
    defaultValue: true,
    context: OptionContext.Internal,
    killSwitchType: KillSwitchType.Ignore,
  },

  // Internal kill switches
  killswitch_xhrproxy: {
    defaultValue: undefined as any,
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
  loaddrafts: {
    defaultValue: false,
    context: OptionContext.Deprecated,
    killSwitchType: KillSwitchType.Deprecated,
  },
  // #!if ['chromium', 'chromium_mv3'].includes(browser_target)
  blockdrafts: {
    defaultValue: false,
    context: OptionContext.Deprecated,
    killSwitchType: KillSwitchType.Deprecated,
  },
  // #!endif
  interopthreadpage: {
    defaultValue: false,
    context: OptionContext.Deprecated,
    killSwitchType: KillSwitchType.Deprecated,
  },
  interopthreadpage_mode: {
    defaultValue: 'previous',
    context: OptionContext.Deprecated,
    killSwitchType: KillSwitchType.Ignore,
  },
};

export type OptionPrototype<T> = Omit<
  OptionConfig<T>,
  'codename' | 'optionalPermissions'
>;
export const optionsPrototype: Record<
  string,
  OptionPrototype<any>
> = rawOptionConfigs;

export const options = Object.entries(optionsPrototype).map(
  ([codename, rawOption]) =>
    new Option({
      codename,
      ...rawOption,
    }),
);

export const optionsMap = new Map(
  options.map((option) => [option.codename, option]),
);

export type OptionCodename = keyof typeof rawOptionConfigs;
export type OptionValues = {
  [K in OptionCodename]: (typeof rawOptionConfigs)[K]['defaultValue'];
};
