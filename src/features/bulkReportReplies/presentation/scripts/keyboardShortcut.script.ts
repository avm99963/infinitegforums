import Script from '../../../../common/architecture/scripts/Script';
import { OptionsModifierPort } from '../../../../services/options/OptionsModifier.port';
import { OptionsProviderPort } from '../../../../services/options/OptionsProvider';

export default class BulkReportRepliesKeyboardShortcutScript extends Script {
  page: never;
  environment: never;
  runPhase: never;

  constructor(
    private optionsProvider: OptionsProviderPort,
    private optionsModifier: OptionsModifierPort,
  ) {
    super();
  }

  execute() {
    document.body.addEventListener('keydown', (e) => this.handleKeyPress(e));
  }

  private handleKeyPress(e: KeyboardEvent) {
    if (e.code === 'KeyR' && e.altKey && !e.repeat) {
      // Prevent other shortcuts (e.g. the one which opens the reply dialog)
      // from being triggered.
      e.stopPropagation();

      this.toggleFeature();
    }
  }

  private async toggleFeature() {
    const isCurrentlyEnabled = await this.optionsProvider.getOptionValue(
      'bulkreportreplies_switch_enabled',
    );
    await this.optionsModifier.set(
      'bulkreportreplies_switch_enabled',
      !isCurrentlyEnabled,
    );
  }
}
