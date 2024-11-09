import CssSelectorNodeWatcherHandler from '../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../../presentation/nodeWatcher/NodeWatcherHandler';
import ThreadPageDesignWarning from '../../core/threadPageDesignWarning';

/** Inject old thread page design warning if applicable */
export default class ThreadPageDesignWarningInjectHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = 'ec-thread > .page > .material-content > div[role="list"]';

  constructor(private threadPageDesignWarning: ThreadPageDesignWarning) {
    super();
  }

  onMutatedNode({ node }: NodeMutation) {
    this.threadPageDesignWarning.injectWarningIfApplicable(node);
  }
}
