import Script from "../../../common/architecture/scripts/Script";
import { NodeWatcherHandler } from "../../../presentation/nodeWatcher/NodeWatcherHandler";
import { NodeWatcherPort } from "../../../presentation/nodeWatcher/NodeWatcher.port";

export default class NodeWatcherScriptAdapter extends Script {
  // TODO: Delete this once these properties are removed from Script.
  page: never;
  environment: never;
  runPhase: never;

  constructor(
    private nodeWatcher: NodeWatcherPort,
    private handlers: Map<string, NodeWatcherHandler>,
  ) {
    super();
  }

  execute() {
    this.nodeWatcher.start();
    for (const [key, handler] of this.handlers) {
      this.nodeWatcher.setHandler(key, handler);
    }
  }
}
