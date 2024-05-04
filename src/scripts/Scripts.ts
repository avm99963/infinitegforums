import Script, { ConcreteScript } from '../common/architecture/scripts/Script';
import ScriptFilterListProvider from '../common/architecture/scripts/ScriptFilterListProvider';
import MWI18nServerScript from './mainWorldServers/MWI18nServerScript.script';
import MWOptionsWatcherServerScript from './mainWorldServers/MWOptionsWatcherServerScript.script';
import XHRInterceptorScript from './xhrInterceptor/xhrInterceptor.script';

export default class StandaloneScripts extends ScriptFilterListProvider {
  private scripts: ConcreteScript[] = [
    MWI18nServerScript,
    MWOptionsWatcherServerScript,
    XHRInterceptorScript,
  ];
  private initializedScripts: Script[];

  protected getUnfilteredScriptsList() {
    if (this.initializedScripts === undefined) {
      this.initializedScripts = this.scripts.map((script) => new script());
    }
    return this.initializedScripts;
  }
}
