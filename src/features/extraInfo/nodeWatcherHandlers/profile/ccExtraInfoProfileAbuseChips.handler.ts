import CssSelectorNodeWatcherScriptHandler from '../../../../common/architecture/scripts/nodeWatcher/handlers/CssSelectorNodeWatcherScriptHandler';
import { NodeMutation } from '../../../../common/nodeWatcher/NodeWatcherHandler';
import { CCExtraInfoMainOptions } from '../../scripts/ccExtraInfoMain.script';

export default class CCExtraInfoProfileAbuseChipsHandler extends CssSelectorNodeWatcherScriptHandler<CCExtraInfoMainOptions> {
  cssSelector = 'ec-unified-user .scTailwindUser_profileUsercardmain';

  onMutatedNode({ node }: NodeMutation) {
    this.options.extraInfo.injectAbuseChipsAtProfileIfEnabled(node);
  }
}
