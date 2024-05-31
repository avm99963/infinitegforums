import Feature from '../../common/architecture/features/Feature';
import { ConcreteScript } from '../../common/architecture/scripts/Script';
import { OptionCodename } from '../../common/options/optionsPrototype';
import SetThreadPageInDataStartupScript from './scripts/setThreadPageInDataStartupScript.script';

export default class InteropThreadPageFeature extends Feature {
  public readonly scripts: ConcreteScript[] = [
    SetThreadPageInDataStartupScript,
  ];

  readonly codename = 'interopThreadPage';
  readonly relatedOptions: OptionCodename[] = [
    'interopthreadpage',
    'interopthreadpage_mode',
  ];
}
