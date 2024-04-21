import DependenciesProviderSingleton, { Dependency } from "../../dependenciesProvider/DependenciesProvider";
import Script from "../Script";

export default abstract class SetUpDependenciesScript extends Script {
  abstract dependencies: Dependency[];

  execute() {
    const dependenciesProvider = DependenciesProviderSingleton.getInstance();
    this.dependencies.forEach(dependency => {
      dependenciesProvider.setUpDependency(dependency);
    });
  }
}
