import Script from '../../../../common/architecture/scripts/Script';
import InjectLitComponentsScript from '../../../../presentation/standaloneScripts/litComponents/injectLitComponents.script';
import FlattenThreadsReplyActionHandler from '../../core/replyActionHandler';

export default class FlattenThreadsSetUpReplyActionHandlerScript extends Script {
  page: never;
  environment: never;
  runPhase: never;
  runAfter = [InjectLitComponentsScript];

  constructor(
    private flattenThreadsReplyActionHandler: FlattenThreadsReplyActionHandler,
  ) {
    super();
  }

  execute() {
    this.flattenThreadsReplyActionHandler.handleIfApplicable();
  }
}
