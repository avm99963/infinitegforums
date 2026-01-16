import CssSelectorNodeWatcherHandler from '../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../../presentation/nodeWatcher/NodeWatcherHandler';
import { OptionsProviderPort } from '../../../../services/options/OptionsProvider';
import { BulkReportControlsInjectorPort } from '../../ui/injectors/bulkReportControls.injector.port';

/**
 * Injects the bulk report reply controls in question cards.
 */
export default class BulkReportRepliesQuestionCardHandler extends CssSelectorNodeWatcherHandler {
  cssSelector =
    '.scTailwindThreadQuestionQuestioncardcontent sc-tailwind-thread-question-question-actions';

  constructor(
    private optionsProvider: OptionsProviderPort,
    private bulkReportControlsInjector: BulkReportControlsInjectorPort,
  ) {
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
