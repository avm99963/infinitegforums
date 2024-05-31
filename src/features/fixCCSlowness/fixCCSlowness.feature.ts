import Feature from '../../common/architecture/features/Feature';
import { ConcreteScript } from '../../common/architecture/scripts/Script';
import { OptionCodename } from '../../common/options/optionsPrototype';
import RemoveUserAbuseEventsFromDataStartupScript from './scripts/removeUserAbuseEventsFromDataStartup.script';

// This feature also has an associated response modifier.

/**
 * @deprecated This feature has been deprecated. Its code will soon be removed
 * once we're sure the feature won't come back.
 */
export default class FixCCSlownessFeature extends Feature {
  public readonly scripts: ConcreteScript[] = [
    RemoveUserAbuseEventsFromDataStartupScript,
  ];

  readonly codename = 'fixCCSlowness';
  readonly relatedOptions: OptionCodename[] = ['fixpekb269560789'];
}
