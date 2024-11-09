import Script, {
  ConcreteScript,
} from '../../common/architecture/scripts/Script';
import ScriptFilterListProvider from '../../common/architecture/scripts/ScriptFilterListProvider';

export default class StandaloneScripts extends ScriptFilterListProvider {
  private scripts: ConcreteScript[] = [];
  private initializedScripts: Script[];

  protected getUnfilteredScriptsList() {
    if (this.initializedScripts === undefined) {
      this.initializedScripts = this.scripts.map((script) => new script());
    }
    return this.initializedScripts;
  }
}
