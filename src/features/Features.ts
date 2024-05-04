import Feature from '../common/architecture/features/Feature';
import {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../common/architecture/scripts/Script';
import ScriptRunner from '../common/architecture/scripts/ScriptRunner';
import AutoRefreshFeature from './autoRefresh/autoRefresh.feature';
import InfiniteScrollFeature from './infiniteScroll/infiniteScroll.feature';

export type ConcreteFeatureClass = { new (): Feature };

export interface Context {
  page: ScriptPage;
  environment: ScriptEnvironment;
  runPhase: ScriptRunPhase;
}

export default class Features {
  private features: ConcreteFeatureClass[] = [
    AutoRefreshFeature,
    InfiniteScrollFeature,
  ];
  private initializedFeatures: Feature[];

  getScriptRunner(context: Context) {
    const scripts = this.getScripts(context);
    const scriptRunner = new ScriptRunner();
    scriptRunner.add(...scripts);
    return scriptRunner;
  }

  getScripts(context: Context) {
    const features = this.getFeatures();
    const allScripts = features.map((feature) => feature.getScripts()).flat(1);
    return allScripts.filter(
      (script) =>
        script.page === context.page &&
        script.environment === context.environment &&
        script.runPhase === context.runPhase,
    );
  }

  private getFeatures() {
    if (this.initializedFeatures === undefined) {
      this.initializedFeatures = this.features.map((feature) => new feature());
    }
    return this.initializedFeatures;
  }
}
