import CssSelectorNodeWatcherHandler from '../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../../presentation/nodeWatcher/NodeWatcherHandler';
import { OptionsProviderPort } from '../../../../services/options/OptionsProvider';
import { BatchLockButtonInjectorPort } from '../../ui/injectors/batchLockButton.injector.port';

/**
 * Injects the batch lock button in the thread list if the option is
 * currently enabled.
 */
export default class BatchLockBulkActionsHandler extends CssSelectorNodeWatcherHandler {
  cssSelector =
    'ec-bulk-actions material-button:is([debugid="mark-read-button"], [debugid="mark-unread-button"])';

  constructor(
    private optionsProvider: OptionsProviderPort,
    private batchLockButtonInjector: BatchLockButtonInjectorPort,
  ) {
    super();
  }

  async onMutatedNode({ node }: NodeMutation) {
    if (!(node instanceof Element)) return;

    const isEnabled = await this.optionsProvider.isEnabled('batchlock');
    if (isEnabled) {
      this.batchLockButtonInjector.execute();
    }
  }
}
