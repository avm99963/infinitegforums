interface BaseOptionConfig {
  context: "options" | "experiments" | "internal" | "deprecated";
}
export type OptionConfig = BaseOptionConfig &
  (
    | {
        defaultValue: any;
        killSwitchType:
          | "option"
          | "experiment"
          | "ignore"
          | "deprecated";
      }
    | {
        killSwitchType: "internalKillSwitch";
      }
  );
export type OptionsPrototype = Record<string, OptionConfig>;

export const optionsPrototype: OptionsPrototype = {
  // Available options:
  list: {
    defaultValue: true,
    context: "options",
    killSwitchType: "option",
  },
  thread: {
    defaultValue: false,
    context: "options",
    killSwitchType: "option",
  },
  threadall: {
    defaultValue: true,
    context: "options",
    killSwitchType: "option",
  },
  fixedtoolbar: {
    defaultValue: false,
    context: "options",
    killSwitchType: "option",
  },
  redirect: {
    defaultValue: false,
    context: "options",
    killSwitchType: "option",
  },
  history: {
    defaultValue: false,
    context: "options",
    killSwitchType: "option",
  },
  increasecontrast: {
    defaultValue: false,
    context: "options",
    killSwitchType: "option",
  },
  stickysidebarheaders: {
    defaultValue: false,
    context: "options",
    killSwitchType: "option",
  },
  profileindicator: {
    defaultValue: false,
    context: "options",
    killSwitchType: "option",
  },
  profileindicatoralt: {
    defaultValue: false,
    context: "options",
    killSwitchType: "option",
  },
  profileindicatoralt_months: {
    defaultValue: 12,
    context: "options",
    killSwitchType: "ignore",
  },
  ccdarktheme: {
    defaultValue: false,
    context: "options",
    killSwitchType: "option",
  },
  ccdarktheme_mode: {
    defaultValue: "switch",
    context: "options",
    killSwitchType: "ignore",
  },
  ccforcehidedrawer: {
    defaultValue: false,
    context: "options",
    killSwitchType: "option",
  },
  // #!if ['chromium', 'chromium_mv3'].includes(browser_target)
  ccdragndropfix: {
    defaultValue: false,
    context: "options",
    killSwitchType: "option",
  },
  // #!endif
  batchlock: {
    defaultValue: false,
    context: "options",
    killSwitchType: "option",
  },
  enhancedannouncementsdot: {
    defaultValue: false,
    context: "options",
    killSwitchType: "option",
  },
  repositionexpandthread: {
    defaultValue: false,
    context: "options",
    killSwitchType: "option",
  },
  threadlistavatars: {
    defaultValue: false,
    context: "options",
    killSwitchType: "option",
  },
  autorefreshlist: {
    defaultValue: false,
    context: "options",
    killSwitchType: "option",
  },
  imagemaxheight: {
    defaultValue: false,
    context: "options",
    killSwitchType: "option",
  },
  perforumstats: {
    defaultValue: false,
    context: "options",
    killSwitchType: "option",
  },
  uispacing: {
    defaultValue: false,
    context: "options",
    killSwitchType: "option",
  },
  flattenthreads: {
    defaultValue: false,
    context: "options",
    killSwitchType: "option",
  },
  fixpekb269560789: {
    defaultValue: true,
    context: "options",
    killSwitchType: "option",
  },

  // Experiments:
  workflows: {
    defaultValue: false,
    context: "experiments",
    killSwitchType: "experiment",
  },
  extrainfo: {
    defaultValue: false,
    context: "experiments",
    killSwitchType: "experiment",
  },

  // Internal options:
  ccdarktheme_switch_enabled: {
    defaultValue: true,
    context: "internal",
    killSwitchType: "ignore",
  },
  flattenthreads_switch_enabled: {
    defaultValue: true,
    context: "internal",
    killSwitchType: "ignore",
  },

  // Internal kill switches:
  killswitch_xhrproxy: {
    context: "internal",
    killSwitchType: "internalKillSwitch",
  },

  // Deprecated options:
  escalatethreads: {
    defaultValue: false,
    context: "deprecated",
    killSwitchType: "deprecated",
  },
  movethreads: {
    defaultValue: false,
    context: "deprecated",
    killSwitchType: "deprecated",
  },
  batchduplicate: {
    defaultValue: false,
    context: "deprecated",
    killSwitchType: "deprecated",
  },
  smei_sortdirection: {
    defaultValue: false,
    context: "deprecated",
    killSwitchType: "deprecated",
  },
  forcemarkasread: {
    defaultValue: false,
    context: "deprecated",
    killSwitchType: "deprecated",
  },
  disableunifiedprofiles: {
    defaultValue: false,
    context: "deprecated",
    killSwitchType: "deprecated",
  },
  nestedreplies: {
    defaultValue: false,
    context: "deprecated",
    killSwitchType: "deprecated",
  },
  loaddrafts: {
    defaultValue: false,
    context: "deprecated",
    killSwitchType: "deprecated",
  },
  // #!if ['chromium', 'chromium_mv3'].includes(browser_target)
  blockdrafts: {
    defaultValue: false,
    context: "deprecated",
    killSwitchType: "deprecated",
  },
  // #!endif
  interopthreadpage: {
    defaultValue: false,
    context: "deprecated",
    killSwitchType: "deprecated",
  },
  interopthreadpage_mode: {
    defaultValue: "previous",
    context: "deprecated",
    killSwitchType: "ignore",
  },
};
