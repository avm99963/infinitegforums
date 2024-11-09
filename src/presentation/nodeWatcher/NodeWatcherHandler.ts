export enum NodeMutationType {
  /**
   * The node was found during initial discovery.
   */
  InitialDiscovery,
  /**
   * The node has been added.
   */
  NewNode,
  /**
   * The node was removed
   */
  RemovedNode,
}

export interface NodeMutation<T extends Node = Node> {
  /**
   * Node being mutated.
   */
  node: T;
  /**
   * Which mutation has occurred to the node.
   */
  type: NodeMutationType;
  /**
   * MutationRecord from which this node mutation has been extracted. It is null
   * if the type is {@link NodeMutationType.InitialDiscovery}.
   */
  mutationRecord: MutationRecord | null;
}

export interface NodeWatcherHandler {
  /**
   * Only node mutations which pass this filter (it returns true) will be passed
   * to {@link onMutatedNode}.
   */
  nodeFilter: (nodeMutation: NodeMutation) => boolean;

  /**
   * Optional CSS selector used to discover nodes existing prior to the handler
   * being established. These matching nodes will be evaluated by
   * {@link onMutatedNode} if they pass {@link nodeFilter}.
   *
   * This is useful when watching an node but it has already been created.
   */
  initialDiscoverySelector?: string;

  /**
   * Function which will be called with each of the filtered node mutations.
   */
  onMutatedNode: (nodeMutation: NodeMutation) => void;
}
