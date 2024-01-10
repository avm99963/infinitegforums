import {getOptions} from '../common/optionsUtils.js';
import {parseView} from '../common/TWBasicUtils.js';

import PerForumStatsSection from './communityConsole/utils/PerForumStatsSection.js';
import {injectPreviousPostsLinksUnifiedProfile} from './utilsCommon/unifiedProfiles.js';

const kProfileViewVar = 'view';

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
      const profileView = parseView(kProfileViewVar);
      const profileViewC = {'1': profileView};
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
