import Feature from '../common/architecture/features/Feature';
import AutoRefreshFeature from './autoRefresh/autoRefresh.feature';
import InfiniteScrollFeature from './infiniteScroll/infiniteScroll.feature';
import ScriptFilterListProvider from '../common/architecture/scripts/ScriptFilterListProvider';

export type ConcreteFeatureClass = { new (): Feature };

export default class Features extends ScriptFilterListProvider {
  private features: ConcreteFeatureClass[] = [
    AutoRefreshFeature,
    InfiniteScrollFeature,
  ];
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
