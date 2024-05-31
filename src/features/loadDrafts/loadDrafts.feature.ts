import Feature from '../../common/architecture/features/Feature';
import { ConcreteScript } from '../../common/architecture/scripts/Script';
import { OptionCodename } from '../../common/options/optionsPrototype';
import EnableLoadDraftsFlagInDataStartupScript from './scripts/setThreadPageInDataStartupScript.script';

export default class LoadDraftsFeature extends Feature {
  public readonly scripts: ConcreteScript[] = [
    EnableLoadDraftsFlagInDataStartupScript,
  ];

  readonly codename = 'loadDrafts';
  readonly relatedOptions: OptionCodename[] = ['loaddrafts'];
}
