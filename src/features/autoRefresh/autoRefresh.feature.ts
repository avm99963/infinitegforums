import Feature from '../../common/architecture/features/Feature';
import { ConcreteScript } from '../../common/architecture/scripts/Script';
import { OptionCodename } from '../../common/options/optionsPrototype';
import AutoRefreshNodeWatcherScript from './scripts/nodeWatcher.script';
import AutoRefreshSetUpScript from './scripts/setUp.script';
import AutoRefreshStylesScript from './scripts/styles.script';

export default class AutoRefreshFeature extends Feature {
  public readonly scripts: ConcreteScript[] = [
    AutoRefreshNodeWatcherScript,
    AutoRefreshSetUpScript,
    AutoRefreshStylesScript,
  ];

  readonly codename = 'autoRefresh';
  readonly relatedOptions: OptionCodename[] = ['autorefreshlist'];
}
