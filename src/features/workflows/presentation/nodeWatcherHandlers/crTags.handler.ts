import CssSelectorNodeWatcherHandler from '../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../../presentation/nodeWatcher/NodeWatcherHandler';
import WorkflowsImport from '../../core/communityConsole/import';

/**
 * Injects the button to import a canned response next to each CR.
 */
export default class WorkflowsImportCRTagsHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = 'ec-canned-response-row .tags';

  constructor(private workflowsImport: WorkflowsImport) {
    super();
  }

  onMutatedNode(mutation: NodeMutation) {
    this.workflowsImport.addButtonIfApplicable(mutation.node);
  }
}
