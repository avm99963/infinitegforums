import Feature from '../common/architecture/features/Feature';
import InfiniteScrollFeature from './infiniteScroll/infiniteScroll.feature';
import ScriptFilterListProvider from '../common/architecture/scripts/ScriptFilterListProvider';
import ExtraInfoFeature from './extraInfo/extraInfo.feature';
import WorkflowsFeature from './workflows/workflows.feature';
import CCDarkThemeFeature from './ccDarkTheme/ccDarkTheme.feature';
import LoadDraftsFeature from './loadDrafts/loadDrafts.feature';
import InteropThreadPageFeature from './interopThreadPage/interopThreadPage.feature';

export type ConcreteFeatureClass = { new (): Feature };

export default class Features extends ScriptFilterListProvider {
  private features: ConcreteFeatureClass[] = [
    CCDarkThemeFeature,
    ExtraInfoFeature,
    InfiniteScrollFeature,
    InteropThreadPageFeature,
    LoadDraftsFeature,
    WorkflowsFeature,
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
