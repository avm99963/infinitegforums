import AutoRefresh from '../../../features/autoRefresh/core/autoRefresh';

export const AutoRefreshDependency = 'autoRefresh';
export const DependenciesToClass = {
  [AutoRefreshDependency]: AutoRefresh,
};

interface OurWindow extends Window {
  TWPTDependencies?: Dependencies;
}

type Dependencies = {
  [K in Dependency]?: InstanceType<(typeof DependenciesToClass)[K]>;
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

  getDependency(dependency: Dependency) {
    this.setUpDependency(dependency);
    return this.dependencies[dependency];
  }

  setUpDependency(dependency: Dependency): void {
    if (!this.dependencies[dependency]) {
      this.dependencies[dependency] = new DependenciesToClass[dependency]();
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
