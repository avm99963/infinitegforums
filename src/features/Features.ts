import Feature from '../common/architecture/features/Feature';
import ScriptFilterListProvider from '../common/architecture/scripts/ScriptFilterListProvider';

export type ConcreteFeatureClass = { new (): Feature };

export default class Features extends ScriptFilterListProvider {
  private features: ConcreteFeatureClass[] = [];
  private initializedFeatures: Feature[];

  protected getUnfilteredScriptsList() {
    const features = this.getFeatures();
    return features.map((feature) => feature.getScripts()).flat(1);
  }

  private getFeatures() {
    if (this.initializedFeatures === undefined) {
      this.initializedFeatures = this.features.map((feature) => new feature());
    }
    return this.initializedFeatures;
  }
}
