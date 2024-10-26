import CssSelectorNodeWatcherHandler from '../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../presentation/nodeWatcher/NodeWatcherHandler';
import { OptionsProviderPort } from '../../../services/options/OptionsProvider';
import ReportDialogColorThemeFix from '../core/logic/reportDialog';

/**
 * Sets the report dialog iframe's theme to the appropriate theme.
 */
export default class CCDarkThemeReportDialogHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = 'iframe';

  constructor(
    private optionsProvider: OptionsProviderPort,
    private reportDialogColorThemeFix: ReportDialogColorThemeFix,
  ) {
    super();
  }

  onMutatedNode(mutation: NodeMutation) {
    this.reportDialogColorThemeFix.fixThemeIfReportDialogIframeAndApplicable(
      mutation.node,
      this.optionsProvider,
    );
  }
}
