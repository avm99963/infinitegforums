import Script from '../../../../common/architecture/scripts/Script';
import AutoRefresh from '../../core/autoRefresh';

export default class AutoRefreshSetUpScript extends Script {
  priority = 100;
  page: never;
  environment: never;
  runPhase: never;

  constructor(private autoRefresh: AutoRefresh) {
    super();
  }

  execute() {
    this.autoRefresh.setUpHandlers();
  }
}
