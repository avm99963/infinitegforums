import CCThreadListBulkActionsNodeWatcherHandler from '../../../../infrastructure/presentation/nodeWatcher/handlers/CCThreadListBulkActions.adapter';
import { OptionsProviderPort } from '../../../../services/options/OptionsProvider';
import { BulkMoveButtonInjectorPort } from '../../ui/injectors/bulkMoveButton.injector.port';

/**
 * Injects the bulk move button in the thread list if the option is
 * currently enabled.
 */
export default class BulkMoveBulkActionsHandler extends CCThreadListBulkActionsNodeWatcherHandler {
  constructor(
    private optionsProvider: OptionsProviderPort,
    private buttonInjector: BulkMoveButtonInjectorPort,
  ) {
    super();
  }

  async onCreated() {
    const isEnabled = await this.optionsProvider.isEnabled('bulkmove');
    if (isEnabled) {
      this.buttonInjector.execute();
    }
  }
}
