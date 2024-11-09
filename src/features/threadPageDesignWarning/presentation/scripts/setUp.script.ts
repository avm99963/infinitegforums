import Script from '../../../../common/architecture/scripts/Script';
import ThreadPageDesignWarning from '../../core/threadPageDesignWarning';

export default class ThreadPageDesignWarningSetUpScript extends Script {
  priority = 102;
  page: never;
  environment: never;
  runPhase: never;

  constructor(private threadPageDesignWarning: ThreadPageDesignWarning) {
    super();
  }

  execute() {
    this.threadPageDesignWarning.setUp();
  }
}
