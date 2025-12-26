/**
 * Code used in the main world of the Community Console and TW basic threads to
 * inject and load the data for the profile indicator.
 */

import { CCApi } from '@/common/api.js';
import { createImmuneLink } from '@/common/commonUtils.js';
import { escapeUsername } from '@/common/communityConsoleUtils.js';
import { ProtobufNumber } from '@/common/protojs/protojs.types';
import { createPlainTooltip } from '@/common/tooltip.js';
import { ChromeI18nPort } from '@/services/i18n/chrome/ChromeI18n.port';
import { OptionsProviderPort } from '@/services/options/OptionsProvider';

const OP_FIRST_POST = 0 as const;
const OP_OTHER_POSTS_READ = 1 as const;
const OP_OTHER_POSTS_UNREAD = 2 as const;

type OPStatus =
  | typeof OP_FIRST_POST
  | typeof OP_OTHER_POSTS_READ
  | typeof OP_OTHER_POSTS_UNREAD;

const OPClasses = {
  0: 'first-post',
  1: 'other-posts-read',
  2: 'other-posts-unread',
};

const OPi18n = {
  0: 'first_post',
  1: 'other_posts_read',
  2: 'other_posts_unread',
};

export const UI_COMMUNITY_CONSOLE = 0 as const;
export const UI_TW_LEGACY = 1 as const;
export const UI_TW_INTEROP = 2 as const;
export const UI_COMMUNITY_CONSOLE_INTEROP = 3 as const;
export const UI_TW_INTEROP_V2 = 4 as const;
export const UI_COMMUNITY_CONSOLE_INTEROP_V2 = 5 as const;

export type UI =
  | typeof UI_COMMUNITY_CONSOLE
  | typeof UI_TW_LEGACY
  | typeof UI_TW_INTEROP
  | typeof UI_COMMUNITY_CONSOLE_INTEROP
  | typeof UI_TW_INTEROP_V2
  | typeof UI_COMMUNITY_CONSOLE_INTEROP_V2;

type Options = {
  indicatorDot: boolean;
  numPosts: boolean;
  numPostMonths: number;
};

type Context = {
  authuser: ProtobufNumber;
  i18n: ChromeI18nPort;
  optionsProvider: OptionsProviderPort;
  ui: UI;
};

type OurContext = Context & {
  options: Options;
};

// Filter used as a workaround to speed up the ViewForum request.
const FILTER_ALL_LANGUAGES =
  'lang:(ar | bg | ca | "zh-hk" | "zh-cn" | "zh-tw" | hr | cs | da | nl | en | "en-au" | "en-gb" | et | fil | fi | fr | de | el | iw | hi | hu | id | it | ja | ko | lv | lt | ms | no | pl | "pt-br" | "pt-pt" | ro | ru | sr | sk | sl | es | "es-419" | sv | th | tr | uk | vi)';

const numPostsForumArraysToSum = [3, 4];

function isCommunityConsole(ui: UI) {
  return (
    ui === UI_COMMUNITY_CONSOLE ||
    ui === UI_COMMUNITY_CONSOLE_INTEROP ||
    ui === UI_COMMUNITY_CONSOLE_INTEROP_V2
  );
}

function isInteropV1(ui: UI) {
  return ui === UI_TW_INTEROP || ui === UI_COMMUNITY_CONSOLE_INTEROP;
}

function isInteropV2(ui: UI) {
  return ui === UI_TW_INTEROP_V2 || ui === UI_COMMUNITY_CONSOLE_INTEROP_V2;
}

function getPosts(
  query: string,
  forumId: ProtobufNumber,
  context: OurContext,
): Promise<any> {
  return CCApi(
    'ViewForum',
    {
      '1': forumId,
      '2': {
        '1': {
          '2': 5,
        },
        '2': {
          '1': 1,
          '2': true,
        },
        '12': query,
      },
    },
    /* authenticated = */ true,
    context.authuser,
  );
}

function getProfile(
  userId: ProtobufNumber,
  forumId: ProtobufNumber,
  context: OurContext,
): Promise<any> {
  return CCApi(
    'ViewUser',
    {
      '1': userId,
      '2': 0,
      '3': forumId,
      '4': {
        '20': true,
      },
    },
    /* authenticated = */ true,
    context.authuser,
  );
}

// Inject the indicator dot/badge to the appropriate position.
function injectIndicator(
  sourceNode: HTMLAnchorElement,
  indicatorEl: HTMLElement,
  ui: UI,
) {
  if (!isInteropV2(ui)) {
    sourceNode.parentNode.appendChild(indicatorEl);
    return;
  }

  const username = sourceNode.querySelector(
    '.scTailwindThreadPost_headerUserinfoname',
  );
  username.append(indicatorEl);
}

// Create profile indicator dot with a loading state, or return the numPosts
// badge if it is already created.
function createIndicatorDot(
  sourceNode: HTMLAnchorElement,
  searchURL: string,
  context: OurContext,
) {
  if (context.options.numPosts)
    return document.querySelector('.num-posts-indicator');
  const dotContainer = document.createElement('div');
  dotContainer.classList.add('profile-indicator', 'profile-indicator--loading');

  const dotLink = isCommunityConsole(context.ui)
    ? createImmuneLink()
    : document.createElement('a');
  dotLink.classList.add(
    'profile-indicator-link',
    'profile-indicator-link--dot',
  );
  dotLink.href = searchURL;
  dotLink.innerText = '●';

  dotContainer.appendChild(dotLink);
  injectIndicator(sourceNode, dotContainer, context.ui);

  context.i18n
    .getMessage({ messageName: 'inject_profileindicator_loading' })
    .then((string) => createPlainTooltip(dotContainer, string));

  return dotContainer;
}

// Create badge indicating the number of posts with a loading state
function createNumPostsBadge(
  sourceNode: HTMLAnchorElement,
  searchURL: string,
  context: OurContext,
) {
  const link = isCommunityConsole(context.ui)
    ? createImmuneLink()
    : document.createElement('a');
  link.classList.add(
    'profile-indicator-link',
    'profile-indicator-link--num-posts',
  );
  link.href = searchURL;

  const numPostsContainer = document.createElement('div');
  numPostsContainer.classList.add(
    'num-posts-indicator',
    'num-posts-indicator--loading',
  );

  const numPostsSpan = document.createElement('span');
  numPostsSpan.classList.add('num-posts-indicator--num');

  numPostsContainer.appendChild(numPostsSpan);
  link.appendChild(numPostsContainer);
  injectIndicator(sourceNode, link, context.ui);

  context.i18n
    .getMessage({ messageName: 'inject_profileindicator_loading' })
    .then((string) => createPlainTooltip(numPostsContainer, string));

  return numPostsContainer;
}

// Set the badge text
function setNumPostsBadge(badge: HTMLElement, text: string) {
  badge.classList.remove('num-posts-indicator--loading');
  badge
    .querySelector('span')
    .classList.remove('num-posts-indicator--num--loading');
  badge.querySelector('span').textContent = text;
}

// Get options and then handle all the indicators
export async function getOptionsAndHandleIndicators(
  sourceNode: HTMLAnchorElement,
  context: Context,
) {
  const optionsConfiguration =
    await context.optionsProvider.getOptionsConfiguration();
  const options = {
    numPosts: optionsConfiguration.isEnabled('profileindicatoralt') ?? false,
    indicatorDot: optionsConfiguration.isEnabled('profileindicator') ?? false,
    numPostMonths:
      optionsConfiguration.getOptionValue('profileindicatoralt_months') ?? 12,
  };

  const ourContext: OurContext = {
    authuser: context.authuser,
    optionsProvider: context.optionsProvider,
    ui: context.ui,
    i18n: context.i18n,
    options,
  };
  handleIndicators(sourceNode, ourContext);
}

// Handle the profile indicator dot
function handleIndicators(sourceNode: HTMLAnchorElement, context: OurContext) {
  let nameEl;
  if (context.ui === UI_COMMUNITY_CONSOLE)
    nameEl = sourceNode.querySelector('.name-text');
  if (context.ui === UI_TW_LEGACY) nameEl = sourceNode.querySelector('span');
  if (isInteropV1(context.ui)) nameEl = sourceNode;
  if (isInteropV2(context.ui))
    nameEl = sourceNode.querySelector(
      '.scTailwindThreadPost_headerUserinfoname',
    );
  const escapedUsername = escapeUsername(nameEl.textContent);

  let threadLink: string;
  if (isCommunityConsole(context.ui)) {
    threadLink = document.location.href;
  } else {
    const CCLink = document.getElementById('onebar-community-console');
    if (CCLink === null) {
      console.error(
        '[opindicator] The user is not a PE so the dot indicator cannot be shown in TW.',
      );
      return;
    }
    if (!(CCLink instanceof HTMLAnchorElement)) {
      console.error(
        '[opindicator] Unexpected: the OP link is not an anchor element.',
      );
      return;
    }
    threadLink = CCLink.href;
  }

  const forumUrlSplit = threadLink.split('/forum/');
  if (forumUrlSplit.length < 2) {
    console.error("[opindicator] Can't get forum id.");
    return;
  }

  const forumId = forumUrlSplit[1].split('/')[0];

  const query =
    '(replier:"' +
    escapedUsername +
    '" | creator:"' +
    escapedUsername +
    '") ' +
    FILTER_ALL_LANGUAGES +
    ' forum:' +
    forumId;
  const encodedQuery = encodeURIComponent(query);
  const authuserPart =
    context.authuser == '0'
      ? ''
      : '?authuser=' + encodeURIComponent(context.authuser);
  const searchURL =
    'https://support.google.com/s/community/search/' +
    encodeURIComponent('query=' + encodedQuery) +
    authuserPart;

  if (context.options.numPosts) {
    const profileURL = new URL(sourceNode.href);
    const userId = profileURL.pathname
      .split(isCommunityConsole(context.ui) ? 'user/' : 'profile/')[1]
      .split('?')[0]
      .split('/')[0];

    const numPostsContainer = createNumPostsBadge(
      sourceNode,
      searchURL,
      context,
    );

    getProfile(userId, forumId, context)
      .then((res) => {
        if (!('1' in res) || !('2' in res[1])) {
          throw new Error('Unexpected profile response.');
        }

        if (!context.options.indicatorDot)
          context.i18n
            .getMessage({
              messageName: 'inject_profileindicatoralt_numposts',
              substitutions: [context.options.numPostMonths.toString()],
            })
            .then((string) => createPlainTooltip(numPostsContainer, string));

        let numPosts = 0;

        for (const index of numPostsForumArraysToSum) {
          if (!(index in res[1][2])) {
            throw new Error('Unexpected profile response.');
          }

          let i = 0;
          for (const month of res[1][2][index].reverse()) {
            if (i == context.options.numPostMonths) break;
            numPosts += month[3] || 0;
            ++i;
          }
        }

        setNumPostsBadge(numPostsContainer, numPosts.toString());
      })
      .catch((err) => {
        console.error(
          "[opindicator] Unexpected error. Couldn't load profile.",
          err,
        );
        setNumPostsBadge(numPostsContainer, '?');
      });
  }

  if (context.options.indicatorDot) {
    const dotContainer = createIndicatorDot(sourceNode, searchURL, context);

    // Query threads in order to see what state the indicator should be in
    getPosts(query, forumId, context)
      .then((res) => {
        // Throw an error when the replies array is not present in the reply.
        if (!('1' in res) || !('2' in res['1'])) {
          // Throw a different error when the numThreads field exists and is
          // equal to 0. This reply can be received, but is enexpected,
          // because we know that the user has replied in at least 1 thread
          // (the current one).
          if ('1' in res && '4' in res['1'] && res['1']['4'] == 0)
            throw new Error(
              'Thread list is empty ' +
                '(but the OP has participated in this thread, ' +
                "so it shouldn't be empty).",
            );

          throw new Error('Unexpected thread list response.');
        }

        // Current thread ID
        const threadUrlSplit = threadLink.split('/thread/');
        if (threadUrlSplit.length < 2) throw new Error("Can't get thread id.");

        const currId = threadUrlSplit[1].split('?')[0].split('/')[0];

        let OPStatus: OPStatus = OP_FIRST_POST;

        for (const thread of res['1']['2']) {
          const id = thread['2']['1']['1'] || undefined;
          if (id === undefined || id == currId) continue;

          const isRead = thread['6'] || false;
          if (isRead) {
            OPStatus =
              OP_OTHER_POSTS_READ > OPStatus ? OP_OTHER_POSTS_READ : OPStatus;
          } else {
            OPStatus =
              OP_OTHER_POSTS_UNREAD > OPStatus
                ? OP_OTHER_POSTS_UNREAD
                : OPStatus;
          }
        }

        const dotContainerPrefix = context.options.numPosts
          ? 'num-posts-indicator'
          : 'profile-indicator';

        if (!context.options.numPosts)
          dotContainer.classList.remove(dotContainerPrefix + '--loading');
        dotContainer.classList.add(
          dotContainerPrefix + '--' + OPClasses[OPStatus],
        );
        context.i18n
          .getMessage({
            messageName: 'inject_profileindicator_' + OPi18n[OPStatus],
          })
          .then((string) => createPlainTooltip(dotContainer, string));
      })
      .catch((err) =>
        console.error(
          "[opindicator] Unexpected error. Couldn't load recent posts.",
          err,
        ),
      );
  }
}
