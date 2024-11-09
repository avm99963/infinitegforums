import CssSelectorNodeWatcherHandler from '../../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../../../presentation/nodeWatcher/NodeWatcherHandler';
import ExtraInfo from '../../../core';

/** Inject a per-forum stats section in profiles. */
export default class CCExtraInfoProfilePerForumStatsHandler extends CssSelectorNodeWatcherHandler {
  cssSelector =
    'ec-unified-user .scTailwindUser_profileUserprofilesection sc-tailwind-shared-activity-chart';

  constructor(private extraInfo: ExtraInfo) {
    super();
  }

  onMutatedNode({ node }: NodeMutation) {
    this.extraInfo.injectPerForumStatsIfEnabled(node);
  }
}
