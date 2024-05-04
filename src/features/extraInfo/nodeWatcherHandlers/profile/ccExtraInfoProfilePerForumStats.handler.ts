import CssSelectorNodeWatcherScriptHandler from '../../../../common/architecture/scripts/nodeWatcher/handlers/CssSelectorNodeWatcherScriptHandler';
import { NodeMutation } from '../../../../common/nodeWatcher/NodeWatcherHandler';
import { CCExtraInfoMainOptions } from '../../scripts/ccExtraInfoMain.script';

export default class CCExtraInfoProfilePerForumStatsHandler extends CssSelectorNodeWatcherScriptHandler<CCExtraInfoMainOptions> {
  cssSelector =
    'ec-unified-user .scTailwindUser_profileUserprofilesection sc-tailwind-shared-activity-chart';

  onMutatedNode({ node }: NodeMutation) {
    this.options.extraInfo.injectPerForumStatsIfEnabled(node);
  }
}
