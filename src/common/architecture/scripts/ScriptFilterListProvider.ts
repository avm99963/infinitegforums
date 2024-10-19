import { Context } from '../entrypoint/Context';
import Script from './Script';
import ScriptProvider from './ScriptProvider';

/**
 * @deprecated
 */
export default abstract class ScriptFilterListProvider
  implements ScriptProvider
{
  protected abstract getUnfilteredScriptsList(): Script[];

  getScripts(context: Context) {
    const scripts = this.getUnfilteredScriptsList();
    return scripts.filter(
      (script) =>
        script.page === context.page &&
        script.environment === context.environment &&
        script.runPhase === context.runPhase,
    );
  }
}
