import { NodeMutation, NodeWatcherHandler } from "../../../../nodeWatcher/NodeWatcherHandler";

export abstract class NodeWatcherScriptHandler<Options>
  implements NodeWatcherHandler
{
  abstract initialDiscoverySelector?: string;
  constructor(protected options: Options) {}
  abstract nodeFilter(nodeMutation: NodeMutation): boolean;
  abstract onMutatedNode(nodeMutation: NodeMutation): void;
}

export type ConcreteNodeWatcherScriptHandler<Options> = {
  new (options: Options): NodeWatcherScriptHandler<Options>;
};
