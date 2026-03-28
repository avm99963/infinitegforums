import CssSelectorNodeWatcherHandler from '@/infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '@/presentation/nodeWatcher/NodeWatcherHandler';
import { OptionsProviderPort } from '@/services/options/OptionsProvider';
import { SoftLockCheckboxInjectorPort } from '../../ui/injectors/softLockCheckbox.injector';
import { UnexpectedUIError } from '@/ui/errors/unexpectedUI.error';

/**
 * Injects the "Soft lock" checkbox into the old reply editor if the feature is
 * enabled.
 */
export default class ReplySoftLockAddToOldReplyEditorHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = 'ec-movable-dialog';

  constructor(
    private readonly optionsProvider: OptionsProviderPort,
    private readonly checkboxInjector: SoftLockCheckboxInjectorPort,
  ) {
    super();
  }

  async onMutatedNode(nodeMutation: NodeMutation<Node>) {
    const movableDialog = nodeMutation.node;
    if (!(movableDialog instanceof Element)) {
      throw new UnexpectedUIError(
        "The reply editor's display name editor is not an Element.",
      );
    }

    const displayNameEditor = movableDialog.querySelector(
      '.main .user > ec-display-name-editor',
    );
    if (displayNameEditor === null) {
      // NOOP, since this movable dialog doesn't have a reply editor.
      return;
    }

    const isEnabled = await this.optionsProvider.isEnabled('replysoftlock');
    if (isEnabled) {
      this.inject(displayNameEditor);
    }
  }

  private inject(displayNameEditor: Element) {
    const replyEditorUserRow = displayNameEditor.parentElement;
    if (replyEditorUserRow === null) {
      throw new UnexpectedUIError(
        "The reply editor's display name editor doesn't have a parent.",
      );
    }

    const subscribeCheckbox = replyEditorUserRow.querySelector(
      '& > material-checkbox',
    );

    if (subscribeCheckbox !== null) {
      // In this case we have 3 elements in the user row:
      //
      // - ec-avatar
      // - ec-display-name-editor
      // - material-checkbox (the subscribe checkbox)
      //
      // So we want to display it before the existing checkbox.
      this.checkboxInjector.execute({
        element: subscribeCheckbox,
        position: 'before',
      });
    } else {
      // In this case we only have the ec-avatar and ec-display-name-editor
      // elements. So we want to show it at the end.
      this.checkboxInjector.execute({
        element: replyEditorUserRow,
        position: 'end',
      });
    }
  }
}
