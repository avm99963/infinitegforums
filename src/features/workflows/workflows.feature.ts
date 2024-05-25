import Feature from '../../common/architecture/features/Feature';
import { ConcreteScript } from '../../common/architecture/scripts/Script';
import { OptionCodename } from '../../common/options/optionsPrototype';
import WorkflowsDependenciesSetUpAtMainScript from './scripts/dependenciesSetUpAtMain.script';
import WorkflowsDependenciesSetUpAtStartScript from './scripts/dependenciesSetUpAtStart.script';
import WorkflowsNodeWatcherScript from './scripts/nodeWatcher.script';

export default class WorkflowsFeature extends Feature {
  public readonly scripts: ConcreteScript[] = [
    WorkflowsDependenciesSetUpAtStartScript,
    WorkflowsDependenciesSetUpAtMainScript,
    WorkflowsNodeWatcherScript,
  ];

  readonly codename = 'workflows';
  readonly relatedOptions: OptionCodename[] = ['workflows'];
}
