import CssSelectorNodeWatcherScriptHandler from '../../../common/architecture/scripts/nodeWatcher/handlers/CssSelectorNodeWatcherScriptHandler';
import { NodeMutation } from '../../../presentation/nodeWatcher/NodeWatcherHandler';
import { CCDarkThemeNodeWatcherDependencies } from '../scripts/nodeWatcher.script';

/**
 * Sets the report dialog iframe's theme to the appropriate theme.
 */
export default class CCDarkThemeReportDialogHandler extends CssSelectorNodeWatcherScriptHandler<CCDarkThemeNodeWatcherDependencies> {
  cssSelector = 'iframe';

  onMutatedNode(mutation: NodeMutation) {
    this.options.reportDialogColorThemeFix.fixThemeIfReportDialogIframeAndApplicable(
      mutation.node,
      this.options.optionsProvider,
    );
  }
}
