import {getOptions} from '../common/optionsUtils.js';

import {injectPreviousPostsLinksUnifiedProfile} from './utilsCommon/unifiedProfiles.js';

getOptions('history').then(options => {
  if (options?.history)
    injectPreviousPostsLinksUnifiedProfile(/* isCommunityConsole = */ false);
});
