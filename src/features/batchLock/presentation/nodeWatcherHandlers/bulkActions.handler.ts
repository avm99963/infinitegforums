import CCThreadListBulkActionsNodeWatcherHandler from '../../../../infrastructure/presentation/nodeWatcher/handlers/CCThreadListBulkActions.adapter';
import { OptionsProviderPort } from '../../../../services/options/OptionsProvider';
import { BatchLockButtonInjectorPort } from '../../ui/injectors/batchLockButton.injector.port';

/**
 * Injects the batch lock button in the thread list if the option is
 * currently enabled.
 */
export default class BatchLockBulkActionsHandler extends CCThreadListBulkActionsNodeWatcherHandler {
  constructor(
    private optionsProvider: OptionsProviderPort,
    private batchLockButtonInjector: BatchLockButtonInjectorPort,
  ) {
    super();
  }

  async onCreated() {
    const isEnabled = await this.optionsProvider.isEnabled('batchlock');
    if (isEnabled) {
      this.batchLockButtonInjector.execute();
    }
  }
}
