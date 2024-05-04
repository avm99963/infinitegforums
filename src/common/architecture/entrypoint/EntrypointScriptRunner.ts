import Features from '../../../features/Features';
import ScriptRunner from '../scripts/ScriptRunner';
import { Context } from './Context';

export default class EntrypointScriptRunner {
  private features: Features;
  private scriptRunner: ScriptRunner;

  constructor(public context: Context) {
    this.features = new Features();
    this.scriptRunner = new ScriptRunner();
  }

  run() {
    const scripts = this.features.getScripts(this.context);
    this.scriptRunner.add(...scripts);
    this.scriptRunner.run();
  }
}
