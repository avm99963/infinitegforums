import { injectPreviousPostsLinksUnifiedProfile } from '../../../../contentScripts/utilsCommon/unifiedProfiles';
import CssSelectorNodeWatcherHandler from '../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { OptionsProviderPort } from '../../../../services/options/OptionsProvider';

/** Show the "previous posts" links if the option is currently enabled. */
export default class PreviousPostsInjectHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = 'ec-unified-user .scTailwindUser_profileUsercarddetails';

  constructor(private optionsProvider: OptionsProviderPort) {
    super();
  }

  async onMutatedNode() {
    const isEnabled = await this.optionsProvider.isEnabled('history');
    if (isEnabled) {
      injectPreviousPostsLinksUnifiedProfile(/* isCommunityConsole = */ true);
    }
  }
}
