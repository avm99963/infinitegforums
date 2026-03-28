import CssSelectorNodeWatcherHandler from '@/infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '@/presentation/nodeWatcher/NodeWatcherHandler';
import { OptionsProviderPort } from '@/services/options/OptionsProvider';
import { SoftLockCheckboxInjectorPort } from '../../ui/injectors/softLockCheckbox.injector';
import { UnexpectedUIError } from '@/ui/errors/unexpectedUI.error';

/**
 * Injects the "Soft lock" checkbox into the reply editor's top row if the
 * feature is enabled.
 */
export default class ReplySoftLockAddToReplyEditorTopHandler extends CssSelectorNodeWatcherHandler {
  cssSelector =
    ':is(sc-tailwind-thread-question-question-card, .scTailwindThreadMessageMessagecardaction) sc-tailwind-thread-reply-editor .scTailwindThreadReplyeditortop-row';

  constructor(
    private readonly optionsProvider: OptionsProviderPort,
    private readonly checkboxInjector: SoftLockCheckboxInjectorPort,
  ) {
    super();
  }

  async onMutatedNode(nodeMutation: NodeMutation<Node>) {
    const replyEditorTopRow = nodeMutation.node;
    if (!(replyEditorTopRow instanceof Element)) {
      throw new UnexpectedUIError(
        "The reply editor's top row is not an Element.",
      );
    }

    const isEnabled = await this.optionsProvider.isEnabled('replysoftlock');
    if (isEnabled) {
      this.inject(replyEditorTopRow);
    }
  }

  private inject(replyEditorTopRow: Element) {
    const subscribeCheckboxContainer = replyEditorTopRow.querySelector(
      '.scTailwindThreadReplyeditorsubscribe',
    );

    if (subscribeCheckboxContainer !== null) {
      // In this case we have 2 elements in the top row, so we want to inject it
      // in the second one, so the checkbox is shown aligned to the right, just
      // before the "subscribe" checkbox.
      this.checkboxInjector.execute({
        element: subscribeCheckboxContainer,
        position: 'start',
      });
    } else {
      // In this case, since the subscribe checkbox does not exist, we have to
      // create our own checkbox, which will be automatically shown aligned to
      // the right.
      this.checkboxInjector.execute({
        element: replyEditorTopRow,
        position: 'end',
      });
    }
  }
}
