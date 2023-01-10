export const kAdditionalInfoPrefix = '__TWPT_FLATTENTHREADS_ADDITIONALINFO__';
export const kAdditionalInfoRegex =
    /^__TWPT_FLATTENTHREADS_ADDITIONALINFO__(.*)/;

export const kReplyPayloadSelector =
    '.scTailwindThreadMessageMessagecardcontent:not(.scTailwindThreadMessageMessagecardpromoted) .scTailwindThreadPostcontentroot html-blob';
export const kReplyActionButtonsSelector =
    '.scTailwindThreadMessageMessagecardcontent:not(.scTailwindThreadMessageMessagecardpromoted) sc-tailwind-thread-message-message-actions';
export const kMatchingSelectors = [
  kReplyPayloadSelector,
  kReplyActionButtonsSelector,
];

export function getExtraInfoNodes(node) {
  const confirmedNodes = [];
  const possibleExtraInfoNodes =
      node.querySelectorAll('span[style*=\'display\'][style*=\'none\']');
  for (const candidate of possibleExtraInfoNodes) {
    const content = candidate.textContent;
    const matches = content.match(kAdditionalInfoRegex);
    if (matches) confirmedNodes.push(candidate);
  }
  return confirmedNodes;
}

export default class FlattenThreads {
  construct() {}

  getExtraInfo(node) {
    let rawExtraInfo = null;
    const possibleExtraInfoNodes =
        node.querySelectorAll('span[style*=\'display\'][style*=\'none\']');
    for (const candidate of possibleExtraInfoNodes) {
      const content = candidate.textContent;
      const matches = content.match(kAdditionalInfoRegex);
      if (matches) {
        rawExtraInfo = matches?.[1] ?? null;
        break;
      }
    }
    if (!rawExtraInfo) return null;
    return JSON.parse(rawExtraInfo);
  }

  injectId(node, extraInfo) {
    const root = node.closest('.scTailwindThreadMessageMessagecardcontent');
    if (!root) return false;
    root.setAttribute('data-twpt-message-id', extraInfo.id);
    return true;
  }

  injectQuote(node, extraInfo) {
    const content = node.closest('.scTailwindThreadPostcontentroot');
    const quote = document.createElement('twpt-flatten-thread-quote');
    quote.setAttribute('prevMessage', JSON.stringify(extraInfo.prevMessage));
    content.prepend(quote);
  }

  injectReplyBtn(node, extraInfo) {
    const btn = document.createElement('twpt-flatten-thread-reply-button');
    btn.setAttribute('extraInfo', JSON.stringify(extraInfo));
    node.prepend(btn);
  }

  injectQuoteIfApplicable(node) {
    // If we injected the additional information, it means the flatten threads
    // feature is enabled and in actual use, so we should inject the quote.
    const extraInfo = this.getExtraInfo(node);
    if (!extraInfo) return;

    this.injectId(node, extraInfo);
    if (extraInfo.isComment) this.injectQuote(node, extraInfo);
  }

  shouldInjectQuote(node) {
    return node.matches(kReplyPayloadSelector);
  }

  injectReplyBtnIfApplicable(node) {
    // If we injected the additional information, it means the flatten threads
    // feature is enabled and in actual use, so we should inject the reply
    // button.
    const root =
        node.closest('.scTailwindThreadMessageMessagecardcontent')
            .querySelector('.scTailwindThreadMessageMessagecardbody html-blob');
    const extraInfo = this.getExtraInfo(root);
    if (!extraInfo) return;

    this.injectReplyBtn(node, extraInfo);
  }

  shouldInjectReplyBtn(node) {
    return node.matches(kReplyActionButtonsSelector);
  }
}
