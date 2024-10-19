import CssSelectorNodeWatcherScriptHandler from '../../../common/architecture/scripts/nodeWatcher/handlers/CssSelectorNodeWatcherScriptHandler';
import { NodeMutation } from '../../../presentation/nodeWatcher/NodeWatcherHandler';
import { injectDarkThemeButton } from '../core/logic/darkTheme';
import { CCDarkThemeNodeWatcherDependencies } from '../scripts/nodeWatcher.script';

/**
 * Injects the dark theme button.
 */
export default class CCDarkThemeEcAppHandler extends CssSelectorNodeWatcherScriptHandler<CCDarkThemeNodeWatcherDependencies> {
  cssSelector = 'ec-app';

  async onMutatedNode(mutation: NodeMutation) {
    if (!(mutation.node instanceof Element)) return;

    const optionsProvider = this.options.optionsProvider;
    const isEnabled = await optionsProvider.isEnabled('ccdarktheme');
    const mode = await optionsProvider.getOptionValue('ccdarktheme_mode');

    // TODO(avm99963): make this feature dynamic.
    if (isEnabled && mode === 'switch') {
      const rightControl = mutation.node.querySelector('header .right-control');
      if (rightControl === null) return;
      injectDarkThemeButton(rightControl);
    }
  }
}
