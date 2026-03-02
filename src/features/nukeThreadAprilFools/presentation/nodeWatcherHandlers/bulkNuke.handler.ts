import CCThreadListBulkActionsNodeWatcherHandler from '@/infrastructure/presentation/nodeWatcher/handlers/CCThreadListBulkActions.adapter';
import { BulkNukeButtonInjectorPort } from '../../ui/injectors/bulkNukeButton.injector.port';
import { OptionCodename } from '@/common/options/optionsPrototype';
import { OptionsProviderPort } from '@/services/options/OptionsProvider';

const KILL_SWITCH_NAME = 'killswitch_aprilfools' satisfies OptionCodename;

/**
 * Injects the bulk nuke button in the thread list if the option is
 * currently enabled.
 */
export default class BulkNukeActionHandler extends CCThreadListBulkActionsNodeWatcherHandler {
  constructor(
    private readonly optionsProvider: OptionsProviderPort,
    private readonly buttonInjector: BulkNukeButtonInjectorPort,
  ) {
    super();
  }

  async onCreated() {
    if (
      (this.isForceEnabled() || this.is2026AprilFoolsDay()) &&
      !(await this.isKillSwitchEnabled())
    ) {
      this.buttonInjector.execute();
    }
  }

  private isForceEnabled() {
    return window.location.hash.includes('forceNuke');
  }

  private is2026AprilFoolsDay() {
    const today = new Date();

    // NOTE: In Date, the month is 0-indexed (so April is 3).
    return (
      today.getFullYear() === 2026 &&
      today.getMonth() === 3 &&
      today.getDate() === 1
    );
  }

  private async isKillSwitchEnabled() {
    const optionsConfiguration =
      await this.optionsProvider.getOptionsConfiguration();
    return optionsConfiguration.isKillSwitchEnabled(KILL_SWITCH_NAME);
  }
}
