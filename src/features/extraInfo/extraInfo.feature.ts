import Feature from '../../common/architecture/features/Feature';
import { ConcreteScript } from '../../common/architecture/scripts/Script';
import { OptionCodename } from '../../common/optionsPrototype';
import CCExtraInfoDependencySetUpScript from './scripts/ccExtraInfoDependencySetUp.script';
import CCExtraInfoInjectScript from './scripts/ccExtraInfoInject.script';
import CCExtraInfoMainScript from './scripts/ccExtraInfoMain.script';
import CCExtraInfoStylesScript from './scripts/ccExtraInfoStyles.script';

export default class ExtraInfoFeature extends Feature {
  public readonly scripts: ConcreteScript[] = [
    CCExtraInfoDependencySetUpScript,
    CCExtraInfoInjectScript,
    CCExtraInfoMainScript,
    CCExtraInfoStylesScript,
  ];

  readonly codename = 'extraInfo';
  readonly relatedOptions: OptionCodename[] = ['extrainfo', 'perforumstats'];
}
