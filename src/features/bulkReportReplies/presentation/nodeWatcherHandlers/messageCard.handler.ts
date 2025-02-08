import CssSelectorNodeWatcherHandler from '../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../../presentation/nodeWatcher/NodeWatcherHandler';
import { OptionsProviderPort } from '../../../../services/options/OptionsProvider';
import BulkReportControlsInjector from '../../ui/injectors/bulkReportControls.injector';

/**
 * Injects the bulk report reply controls.
 */
export default class BulkReportRepliesMessageCardHandler extends CssSelectorNodeWatcherHandler {
  cssSelector =
    ':is(.scTailwindThreadMessageMessagecardcontent:not(.scTailwindThreadMessageMessagecardpromoted), .scTailwindThreadMessageCommentcardcomment) sc-tailwind-thread-message-message-actions';

  bulkReportControlsInjector = new BulkReportControlsInjector();

  constructor(private optionsProvider: OptionsProviderPort) {
    super();
  }

  async onMutatedNode(mutation: NodeMutation) {
    if (!(mutation.node instanceof Element)) return;

    const isFeatureEnabled =
      await this.optionsProvider.isEnabled('bulkreportreplies');
    if (!isFeatureEnabled) return;

    this.bulkReportControlsInjector.inject(mutation.node);
  }
}
