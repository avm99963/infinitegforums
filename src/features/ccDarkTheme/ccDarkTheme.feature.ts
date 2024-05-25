import Feature from '../../common/architecture/features/Feature';
import { ConcreteScript } from '../../common/architecture/scripts/Script';
import { OptionCodename } from '../../common/options/optionsPrototype';
import InjectAutoDarkTheme from './scripts/injectAutoDarkTheme.script';
import InjectForcedDarkTheme from './scripts/injectForcedDarkTheme.script';
import CCDarkThemeNodeWatcherScript from './scripts/nodeWatcher.script';

export default class CCDarkThemeFeature extends Feature {
  public readonly scripts: ConcreteScript[] = [
    InjectAutoDarkTheme,
    InjectForcedDarkTheme,
    CCDarkThemeNodeWatcherScript,
  ];

  readonly codename = 'darkTheme';
  readonly relatedOptions: OptionCodename[] = [
    'ccdarktheme',
    'ccdarktheme_mode',
    'ccdarktheme_switch_status',
  ];
}
