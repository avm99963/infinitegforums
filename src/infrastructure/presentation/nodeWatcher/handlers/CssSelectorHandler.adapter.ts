import {
  NodeMutation,
  NodeMutationType,
  NodeWatcherHandler,
} from '../../../../presentation/nodeWatcher/NodeWatcherHandler';

export default abstract class CssSelectorNodeWatcherHandler
  implements NodeWatcherHandler
{
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

  abstract onMutatedNode(nodeMutation: NodeMutation<HTMLElement>): void;
}
