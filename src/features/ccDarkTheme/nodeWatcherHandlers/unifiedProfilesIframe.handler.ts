import CssSelectorNodeWatcherHandler from '../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../presentation/nodeWatcher/NodeWatcherHandler';
import { OptionsProviderPort } from '../../../services/options/OptionsProvider';
import { isDarkThemeOn } from '../core/logic/darkTheme';
import { unifiedProfilesFix } from '../core/logic/unifiedProfiles';

/**
 * Redirect unified profile iframe to dark version if applicable
 */
export default class CCDarkThemeUnifiedProfilesIframeHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = 'iframe';

  constructor(private optionsProvider: OptionsProviderPort) {
    super();
  }

  async onMutatedNode(mutation: NodeMutation) {
    const optionsValues = await this.optionsProvider.getOptionsValues();

    if (
      isDarkThemeOn(optionsValues) &&
      unifiedProfilesFix.checkIframe(mutation.node)
    ) {
      unifiedProfilesFix.fixIframe(mutation.node);
    }
  }
}
