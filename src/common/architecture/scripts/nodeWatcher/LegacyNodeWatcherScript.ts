import NodeWatcherSingleton, { NodeWatcherAdapter } from '../../../../infrastructure/presentation/nodeWatcher/NodeWatcher.adapter';
import { ConcreteNodeWatcherScriptHandler } from './handlers/NodeWatcherScriptHandler';
import Script from '../Script';

/**
 * @deprecated
 */
export default abstract class LegacyNodeWatcherScript<Options> extends Script {
  public abstract handlers: Map<
    string,
    ConcreteNodeWatcherScriptHandler<Options>
  >;

  private nodeWatcher: NodeWatcherAdapter;

  constructor() {
    super();

    // TODO(https://iavm.xyz/b/226): Retrieve this via constructor injection.
    this.nodeWatcher = NodeWatcherSingleton.getInstance();
  }

  /**
   * Resolves to the options when the script is executed.
   *
   */
  protected abstract optionsFactory(): Options;

  execute() {
    const options = this.optionsFactory();

    this.nodeWatcher.start();
    for (const [key, handlerClass] of this.handlers) {
      const handler = new handlerClass(options);
      this.nodeWatcher.setHandler(key, handler);
    }
  }
}
