import { OptionsModifierPort } from '@/services/options/OptionsModifier.port';
import CssSelectorNodeWatcherHandler from '../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../../presentation/nodeWatcher/NodeWatcherHandler';
import { OptionsProviderPort } from '../../../../services/options/OptionsProvider';
import { injectDarkThemeButton } from '../../core/logic/darkTheme';

/**
 * Injects the dark theme button.
 */
export default class CCDarkThemeEcAppHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = 'ec-app';

  constructor(
    private readonly optionsProvider: OptionsProviderPort,
    private readonly optionsModifier: OptionsModifierPort,
  ) {
    super();
  }

  async onMutatedNode(mutation: NodeMutation) {
    if (!(mutation.node instanceof Element)) return;

    const isEnabled = await this.optionsProvider.isEnabled('ccdarktheme');
    const mode = await this.optionsProvider.getOptionValue('ccdarktheme_mode');

    // TODO(avm99963): make this feature dynamic.
    if (isEnabled && mode === 'switch') {
      const rightControl = mutation.node.querySelector('header .right-control');
      if (rightControl === null) return;
      injectDarkThemeButton(
        rightControl,
        this.optionsProvider,
        this.optionsModifier,
      );
    }
  }
}
