import Script, { ConcreteScript } from '../common/architecture/scripts/Script';
import ScriptFilterListProvider from '../common/architecture/scripts/ScriptFilterListProvider';
import InjectLitComponentsScript from './litComponents/injectLitComponents.script';
import MWI18nServerScript from './mainWorldServers/MWI18nServerScript.script';
import MWOptionsWatcherServerScript from './mainWorldServers/MWOptionsWatcherServerScript.script';
import OptionsProviderSetUpScript from './optionsProvider/optionsProvider.script';
import ApplyStartupDataModificationsOnMainScript from './startupDataStorage/applyStartupDataModificationsOnMain.script';
import ApplyStartupDataModificationsOnStartScript from './startupDataStorage/applyStartupDataModificationsOnStart.script';
import XHRInterceptorScript from './xhrInterceptor/xhrInterceptor.script';

export default class StandaloneScripts extends ScriptFilterListProvider {
  private scripts: ConcreteScript[] = [
    ApplyStartupDataModificationsOnMainScript,
    ApplyStartupDataModificationsOnStartScript,
    InjectLitComponentsScript,
    MWI18nServerScript,
    MWOptionsWatcherServerScript,
    OptionsProviderSetUpScript,
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
