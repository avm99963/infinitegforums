import CssSelectorNodeWatcherScriptHandler from '../../../common/architecture/scripts/nodeWatcher/handlers/CssSelectorNodeWatcherScriptHandler';
import { NodeMutation } from '../../../common/nodeWatcher/NodeWatcherHandler';
import { WorkflowsNodeWatcherDependencies } from '../scripts/nodeWatcher.script';

/**
 * Injects the button to import a canned response next to each CR.
 */
export default class WorkflowsImportCRTagsHandler extends CssSelectorNodeWatcherScriptHandler<WorkflowsNodeWatcherDependencies> {
  cssSelector = 'ec-canned-response-row .tags';

  onMutatedNode(mutation: NodeMutation) {
    this.options.workflowsImport.addButtonIfEnabled(mutation.node);
  }
}
