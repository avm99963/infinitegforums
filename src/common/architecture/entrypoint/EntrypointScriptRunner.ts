import Features from '../../../features/Features';
import StandaloneScripts from '../../../scripts/Scripts';
import ScriptProvider from '../scripts/ScriptProvider';
import LegacyScriptRunner from '../scripts/LegacyScriptRunner';
import { Context } from './Context';

/**
 * @deprecated
 */
export default class EntrypointScriptRunner {
  private scriptRunner: LegacyScriptRunner;

  constructor(public context: Context) {
    this.scriptRunner = new LegacyScriptRunner();
    this.addScriptProvider(new Features());
    this.addScriptProvider(new StandaloneScripts());
  }

  addScriptProvider(scriptProvider: ScriptProvider): EntrypointScriptRunner {
    const scripts = scriptProvider.getScripts(this.context);
    this.scriptRunner.add(...scripts);
    return this;
  }

  run() {
    this.scriptRunner.run();
  }
}
