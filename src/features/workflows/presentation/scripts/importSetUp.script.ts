import Script from '../../../../common/architecture/scripts/Script';
import WorkflowsImport from '../../core/communityConsole/import';

export default class WorkflowsImportSetUpScript extends Script {
  priority = 103;
  page: never;
  environment: never;
  runPhase: never;

  constructor(private workflowsImport: WorkflowsImport) {
    super();
  }

  execute() {
    this.workflowsImport.setUp();
  }
}
