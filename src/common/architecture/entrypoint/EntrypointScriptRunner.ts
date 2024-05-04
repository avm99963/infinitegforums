import Features from '../../../features/Features';
import StandaloneScripts from '../../../scripts/Scripts';
import ScriptProvider from '../scripts/ScriptProvider';
import ScriptRunner from '../scripts/ScriptRunner';
import { Context } from './Context';

export default class EntrypointScriptRunner {
  private scriptRunner: ScriptRunner;

  constructor(public context: Context) {
    this.scriptRunner = new ScriptRunner();
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
