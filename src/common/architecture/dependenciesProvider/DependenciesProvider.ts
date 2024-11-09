import ExtraInfo from '../../../features/extraInfo/core';
import AutoRefresh from '../../../features/autoRefresh/core/autoRefresh';
import OptionsProviderAdapter from '../../../infrastructure/services/options/OptionsProvider.adapter';
import WorkflowsImport from '../../../features/workflows/core/communityConsole/import';
import Workflows from '../../../features/workflows/core/communityConsole/workflows';
import StartupDataStorageAdapter from '../../../infrastructure/services/communityConsole/StartupDataStorage.adapter';
import ReportDialogColorThemeFix from '../../../features/ccDarkTheme/core/logic/reportDialog';

export const AutoRefreshDependency = 'autoRefresh';
export const ExtraInfoDependency = 'extraInfo';
export const OptionsProviderDependency = 'optionsProvider';
export const ReportDialogColorThemeFixDependency =
  'report-dialog-color-theme-fix';
export const StartupDataStorageDependency = 'startupDataStorage';
export const WorkflowsDependency = 'workflows';
export const WorkflowsImportDependency = 'workflowsImport';
export const DependenciesToClass = {
  [AutoRefreshDependency]: AutoRefresh,
  [ExtraInfoDependency]: ExtraInfo,
  [OptionsProviderDependency]: OptionsProviderAdapter,
  [ReportDialogColorThemeFixDependency]: ReportDialogColorThemeFix,
  [StartupDataStorageDependency]: StartupDataStorageAdapter,
  [WorkflowsDependency]: Workflows,
  [WorkflowsImportDependency]: WorkflowsImport,
};

interface OurWindow extends Window {
  TWPTDependencies?: Dependencies;
}

export type ClassFromDependency<T extends Dependency> = InstanceType<
  (typeof DependenciesToClass)[T]
>;

type Dependencies = {
  [K in Dependency]?: ClassFromDependency<K>;
};

export type Dependency = keyof typeof DependenciesToClass;

class DependenciesProvider {
  private dependencies: Dependencies;

  constructor() {
    const ourWindow = window as OurWindow;
    if (!ourWindow.TWPTDependencies) {
      ourWindow.TWPTDependencies = {};
    }
    this.dependencies = ourWindow.TWPTDependencies;
  }

  /**
   * Gets an instance of a dependency, and creates it beforehand if it doesn't exist yet.
   */
  getDependency<T extends Dependency>(dependency: T): ClassFromDependency<T> {
    this.setUpDependency(dependency);
    const dep = this.dependencies[dependency];
    if (!dep) {
      throw new Error(`Dependency ${dependency} not found.`);
    }
    return dep;
  }

  setUpDependency<T extends Dependency>(dependency: T): void {
    if (!this.dependencies[dependency]) {
      const dependencyClass = DependenciesToClass[dependency];
      this.dependencies[dependency] = new dependencyClass() as Dependencies[T];
    }
  }
}

export default class DependenciesProviderSingleton {
  private static instance: DependenciesProvider;

  /**
   * @see {@link DependenciesProviderSingleton.getInstance}
   */
  private constructor() {}

  public static getInstance(): DependenciesProvider {
    if (!DependenciesProviderSingleton.instance) {
      DependenciesProviderSingleton.instance = new DependenciesProvider();
    }
    return DependenciesProviderSingleton.instance;
  }
}
