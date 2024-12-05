import {parseView} from '../common/TWBasicUtils.js';
import ThreadModel from '../models/Thread';

var CCThreadWithoutMessage = /forum\/[0-9]*\/thread\/[0-9]*$/;

/**
 * @returns {boolean} Whether the redirection was successful.
 */
export function redirectIfApplicable() {
  if (window.TWPTShouldRedirect) {
    let ok = redirectToCommunityConsoleV2();
    if (ok) return true;

    return redirectToCommunityConsoleV1();
  }
}

function redirectToCommunityConsoleV2() {
  try {
    const threadView = parseView('thread_view');
    if (!threadView) throw new Error('Could not find thread data.');

    const thread = new ThreadModel(threadView);
    const forumId = thread.getForumId();
    const threadId = thread.getId();

    if (!forumId || !threadId)
      throw new Error('Forum id and thread id not present in thread data.');

    const searchParams = new URLSearchParams(location.search);
    const msgId = searchParams.get('msgid');

    const msgSuffix = msgId ? `/message/${msgId}` : '';
    const hash = window.TWPTRedirectHash ?? '';
    const url =
        `/s/community/forum/${forumId}/thread/${threadId}${msgSuffix}${hash}`;
    window.location = url;
    return true;
  } catch (err) {
    console.error('Error redirecting to the Community Console (v2): ', err);
    return false;
  }
}

function redirectToCommunityConsoleV1() {
  try {
    const redirectLink = document.querySelector('.community-console');
    if (redirectLink === null) throw new Error('Could not find redirect link.');

    let redirectUrl = redirectLink.href;

    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has('msgid') && searchParams.get('msgid') !== '' &&
        CCThreadWithoutMessage.test(redirectUrl)) {
      redirectUrl +=
          '/message/' + encodeURIComponent(searchParams.get('msgid'));
    }
    redirectUrl += window.TWPTRedirectHash ?? '';

    window.location = redirectUrl;
    return true;
  } catch (err) {
    console.error('Error redirecting to the Community Console (v1): ', err);
    return false;
  }
}
