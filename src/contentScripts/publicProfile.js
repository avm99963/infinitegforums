import {getOptions} from '../common/optionsUtils.js';
import {correctArrayKeys} from '../common/protojs.js';

import PerForumStatsSection from './communityConsole/utils/PerForumStatsSection.js';
import {injectPreviousPostsLinksUnifiedProfile} from './utilsCommon/unifiedProfiles.js';

const profileViewRegex = /var view ?= ?'([^']+)';/;

getOptions(['history', 'perforumstats']).then(options => {
  if (options?.history)
    injectPreviousPostsLinksUnifiedProfile(/* isCommunityConsole = */ false);

  if (options?.perforumstats) {
    try {
      // Find chart
      const chart = document.querySelector(
          'sc-tailwind-user_profile-user-profile ' +
          '.scTailwindUser_profileUserprofilesection ' +
          'sc-tailwind-shared-activity-chart');
      if (!chart) throw new Error('Couldn\'t find existing chart.');

      // Extract profile JSON information
      const scripts = document.querySelectorAll('script');
      let profileView = null;
      for (let i = 0; i < scripts.length; ++i) {
        const matches = scripts[i].textContent.match(profileViewRegex);
        if (matches?.[1]) {
          let rawJsonStringContents =
              matches[1]
                  .replace(
                      /\\x([0-9a-f]{2})/ig,
                      (_, pair) => {
                        return String.fromCharCode(parseInt(pair, 16));
                      })
                  .replace(/\\'/g, `'`)
                  .replace(/"/g, `\\"`);
          let rawJsonString = `"${rawJsonStringContents}"`;
          let rawJson = JSON.parse(rawJsonString);
          profileView = JSON.parse(rawJson);
          break;
        }
      }
      const profileViewC = {'1': correctArrayKeys(profileView)};
      if (!profileView) throw new Error('Could not find user view data.');
      new PerForumStatsSection(
          chart?.parentNode, profileViewC,
          document.documentElement?.lang ?? 'en',
          /* isCommunityConsole = */ false);
    } catch (err) {
      console.error('Error while injecting extra info: ', err);
    }
  }
});
