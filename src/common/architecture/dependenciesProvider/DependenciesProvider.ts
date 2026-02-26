import type ExtraInfo from '../../../features/extraInfo/core';
import type AutoRefresh from '../../../features/autoRefresh/core/autoRefresh';
import type WorkflowsImport from '../../../features/workflows/core/communityConsole/import/import';
import type StartupDataStorageAdapter from '../../../infrastructure/services/communityConsole/startupDataStorage/StartupDataStorage.adapter';
import type ReportDialogColorThemeFix from '../../../features/ccDarkTheme/core/logic/reportDialog';
import type ThreadPageDesignWarning from '../../../features/threadPageDesignWarning/core/threadPageDesignWarning';

export const AutoRefreshDependency = 'autoRefresh';
export const ExtraInfoDependency = 'extraInfo';
export const ReportDialogColorThemeFixDependency =
  'report-dialog-color-theme-fix';
export const StartupDataStorageDependency = 'startupDataStorage';
export const ThreadPageDesignWarningDependency = 'threadPageDesignWarning';
export const WorkflowsImportDependency = 'workflowsImport';
type DependenciesToClass = {
  [AutoRefreshDependency]: typeof AutoRefresh;
  [ExtraInfoDependency]: typeof ExtraInfo;
  [ReportDialogColorThemeFixDependency]: typeof ReportDialogColorThemeFix;
  [StartupDataStorageDependency]: typeof StartupDataStorageAdapter;
  [ThreadPageDesignWarningDependency]: typeof ThreadPageDesignWarning;
  [WorkflowsImportDependency]: typeof WorkflowsImport;
};

interface OurWindow extends Window {
  TWPTDependencies?: Dependencies;
}

export type ClassFromDependency<T extends Dependency> = InstanceType<
  DependenciesToClass[T]
>;

type Dependencies = {
  [K in Dependency]?: ClassFromDependency<K>;
};

export type Dependency = keyof DependenciesToClass;

/**
 * Class that lets the composition root save and retrieve shared dependencies
 * between scripts that run in multiple run times, but at the same context
 * (sandbox or main world).
 */
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
   * Get an instance of a dependency, and create it beforehand with `factory` if
   * it doesn't exist yet.
   */
  getDependency<T extends Dependency>(
    dependency: T,
    factory: () => Dependencies[T],
  ): ClassFromDependency<T> {
    if (!this.hasDependency(dependency)) {
      this.dependencies[dependency] = factory();
    }

    const dep = this.dependencies[dependency];
    if (!dep) {
      throw new Error(`Dependency ${dependency} not found.`);
    }
    return dep;
  }

  hasDependency(dependency: Dependency): boolean {
    return this.dependencies[dependency] !== undefined;
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
