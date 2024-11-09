import CssSelectorNodeWatcherHandler from '../../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../../../presentation/nodeWatcher/NodeWatcherHandler';
import ExtraInfo from '../../../core';

/** Inject abuse info chip in profiles. */
export default class CCExtraInfoProfileAbuseChipsHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = 'ec-unified-user .scTailwindUser_profileUsercardmain';

  constructor(private extraInfo: ExtraInfo) {
    super();
  }

  onMutatedNode({ node }: NodeMutation) {
    this.extraInfo.injectAbuseChipsAtProfileIfEnabled(node);
  }
}
