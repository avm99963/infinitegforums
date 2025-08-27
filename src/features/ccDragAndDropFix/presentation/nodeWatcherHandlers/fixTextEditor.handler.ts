import { OptionCodename } from '../../../../common/options/optionsPrototype';
import CssSelectorNodeWatcherHandler from '../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../../presentation/nodeWatcher/NodeWatcherHandler';
import { OptionsProviderPort } from '../../../../services/options/OptionsProvider';

/**
 * Fixes the drag&drop issue with the rich text editor if the option is
 * currently enabled.
 *
 *   We target both tags because in different contexts different
 *   elements containing the text editor get added to the DOM structure.
 *   Sometimes it's a EC-MOVABLE-DIALOG which already contains the
 *   EC-RICH-TEXT-EDITOR, and sometimes it's the EC-RICH-TEXT-EDITOR
 *   directly.
 */
export default class CCDragAndDropFixTextEditorHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = 'ec-movable-dialog, ec-rich-text-editor';

  constructor(private optionsProvider: OptionsProviderPort) {
    super();
  }

  async onMutatedNode(mutation: NodeMutation) {
    if (!(mutation.node instanceof HTMLElement)) return;

    const isFeatureEnabled =
      await this.optionsProvider.isEnabled('ccdragndropfix');
    if (!isFeatureEnabled) return;

    this.fixTextEditor(mutation.node);
  }

  private fixTextEditor(node: HTMLElement) {
    console.debug('[ccDragAndDropFix] Adding link drag&drop fix to ', node);
    node.addEventListener(
      'drop',
      (e) => {
        if (e.dataTransfer.types.includes('text/uri-list')) {
          e.stopImmediatePropagation();
          console.debug(
            '[ccDragAndDropFix] Stopping link drop event propagation.',
          );
        }
      },
      true,
    );
  }
}
