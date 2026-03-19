import BaseThreadMessageExtraInfoInjection from './baseThreadMessage.js';

export default class ThreadReplyExtraInfoInjection extends BaseThreadMessageExtraInfoInjection {
  getInteractionsRootClass() {
    return 'scTailwindThreadMessageMessageinteractionsroot';
  }

  getInteractionsRootNonEmptyClass() {
    return 'scTailwindThreadMessageMessageinteractionsinteractions';
  }
}
