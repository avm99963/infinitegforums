import { NodeWatcherScriptHandler } from './NodeWatcherScriptHandler';
import { NodeMutation, NodeMutationType } from '../../../../../presentation/nodeWatcher/NodeWatcherHandler';

/**
 * @deprecated
 */
export default abstract class CssSelectorNodeWatcherScriptHandler<
  Options,
> extends NodeWatcherScriptHandler<Options> {
  readonly mutationTypesProcessed: NodeMutationType[] = [
    NodeMutationType.InitialDiscovery,
    NodeMutationType.NewNode,
  ];

  abstract readonly cssSelector: string;

  nodeFilter(nodeMutation: NodeMutation): boolean {
    if (
      !this.mutationTypesProcessed.includes(nodeMutation.type) ||
      !(nodeMutation.node instanceof Element)
    ) {
      return false;
    }
    return nodeMutation.node.matches(this.cssSelector);
  }

  get initialDiscoverySelector() {
    return this.cssSelector;
  }
}
