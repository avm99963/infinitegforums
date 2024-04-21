import {
  NodeWatcherHandler,
  NodeMutation,
  NodeMutationType,
} from './NodeWatcherHandler';

class NodeWatcher {
  private handlers: Map<string, NodeWatcherHandler> = new Map();
  private mutationObserver: MutationObserver;

  constructor() {
    this.mutationObserver = new MutationObserver(
      this.mutationCallback.bind(this),
    );
    this.start();
  }

  start(): void {
    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  pause(): void {
    this.mutationObserver.disconnect();
  }

  setHandler(key: string, handler: NodeWatcherHandler): void {
    this.handlers.set(key, handler);
    this.performInitialDiscovery(handler);
  }

  removeHandler(key: string): boolean {
    return this.handlers.delete(key);
  }

  private mutationCallback(mutationRecords: MutationRecord[]): void {
    for (const mutationRecord of mutationRecords) {
      if (mutationRecord.type !== 'childList') continue;
      this.handleAddedNodes(mutationRecord);
      this.handleRemovedNodes(mutationRecord);
    }
  }

  private handleAddedNodes(mutationRecord: MutationRecord): void {
    for (const node of mutationRecord.addedNodes) {
      this.handleMutatedNode({
        node,
        mutationRecord,
        type: NodeMutationType.NewNode,
      });
    }
  }

  private handleRemovedNodes(mutationRecord: MutationRecord): void {
    for (const node of mutationRecord.removedNodes) {
      this.handleMutatedNode({
        node,
        mutationRecord,
        type: NodeMutationType.RemovedNode,
      });
    }
  }

  private performInitialDiscovery(handler: NodeWatcherHandler): void {
    if (handler.initialDiscoverySelector === undefined) return;
    const candidateNodes = document.querySelectorAll(
      handler.initialDiscoverySelector,
    );
    for (const candidateNode of candidateNodes) {
      this.handleMutatedNodeWithHandler(
        {
          node: candidateNode,
          type: NodeMutationType.InitialDiscovery,
          mutationRecord: null,
        },
        handler,
      );
    }
  }

  private handleMutatedNode(nodeMutation: NodeMutation): void {
    for (const [, handler] of this.handlers) {
      this.handleMutatedNodeWithHandler(nodeMutation, handler);
    }
  }

  private handleMutatedNodeWithHandler(
    nodeMutation: NodeMutation,
    handler: NodeWatcherHandler,
  ): void {
    if (handler.nodeFilter(nodeMutation)) {
      handler.onMutatedNode(nodeMutation);
    }
  }
}

export default class NodeWatcherSingleton {
  private static instance: NodeWatcher;

  /**
   * @see {@link NodeWatcherSingleton.getInstance}
   */
  private constructor() {}

  public static getInstance(): NodeWatcher {
    if (!NodeWatcherSingleton.instance) {
      NodeWatcherSingleton.instance = new NodeWatcher();
    }
    return NodeWatcherSingleton.instance;
  }
}
