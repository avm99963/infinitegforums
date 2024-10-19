import NodeWatcherSingleton from '../../../nodeWatcher/NodeWatcher';
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

  /**
   * Resolves to the options when the script is executed.
   *
   * This is so we can defer retrieving dependencies until the script is
   * executed, to prevent loading unnecessary things if they aren't needed
   * after all.
   */
  protected abstract optionsFactory(): Options;

  execute() {
    const nodeWatcher = NodeWatcherSingleton.getInstance();
    const options = this.optionsFactory();

    for (const [key, handlerClass] of this.handlers) {
      const handler = new handlerClass(options);
      nodeWatcher.setHandler(key, handler);
    }
  }
}
