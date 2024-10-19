import CssSelectorNodeWatcherScriptHandler from '../../../common/architecture/scripts/nodeWatcher/handlers/CssSelectorNodeWatcherScriptHandler';
import { NodeMutation } from '../../../presentation/nodeWatcher/NodeWatcherHandler';
import { isDarkThemeOn } from '../core/logic/darkTheme';
import { unifiedProfilesFix } from '../core/logic/unifiedProfiles';
import { CCDarkThemeNodeWatcherDependencies } from '../scripts/nodeWatcher.script';

/**
 * Redirect unified profile iframe to dark version if applicable
 */
export default class CCDarkThemeUnifiedProfilesIframeHandler extends CssSelectorNodeWatcherScriptHandler<CCDarkThemeNodeWatcherDependencies> {
  cssSelector = 'iframe';

  async onMutatedNode(mutation: NodeMutation) {
    const optionsValues = await this.options.optionsProvider.getOptionsValues();

    if (
      isDarkThemeOn(optionsValues) &&
      unifiedProfilesFix.checkIframe(mutation.node)
    ) {
      unifiedProfilesFix.fixIframe(mutation.node);
    }
  }
}
