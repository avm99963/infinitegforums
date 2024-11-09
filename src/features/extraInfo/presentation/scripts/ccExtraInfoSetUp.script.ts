import Script from '../../../../common/architecture/scripts/Script';
import ExtraInfo from '../../core';

export default class CCExtraInfoSetUpScript extends Script {
  public priority = 101;
  public page: never;
  public environment: never;
  public runPhase: never;

  constructor(private extraInfo: ExtraInfo) {
    super();
  }

  execute() {
    this.extraInfo.setUp();
  }
}
