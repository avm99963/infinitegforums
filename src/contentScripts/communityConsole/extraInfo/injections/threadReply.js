import BaseThreadMessageExtraInfoInjection from './baseThreadMessage.js';

export default class ThreadCommentExtraInfoInjection extends BaseThreadMessageExtraInfoInjection {
  getInteractionsRootClass() {
    return 'scTailwindThreadMessageMessageinteractionsroot';
  }

  getInteractionsRootNonEmptyClass() {
    return 'scTailwindThreadMessageMessageinteractionsinteractions';
  }
}
