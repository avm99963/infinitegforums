import {getDisplayLanguage} from '../../utils/common.js';
import PerForumStatsSection from '../../utils/PerForumStatsSection.js';

import BaseExtraInfoInjection from './base.js';

export default class ProfilePerForumStatsExtraInfoInjection extends
    BaseExtraInfoInjection {
  constructor(infoHandler, optionsWatcher) {
    super(infoHandler, optionsWatcher);
    this.displayLanguage = getDisplayLanguage();
  }

  async isEnabled() {
    return await this.optionsWatcher.isEnabled('perforumstats');
  }

  inject(profileInfo, injectionDetails) {
    new PerForumStatsSection(
        injectionDetails.chart?.parentNode, profileInfo.body,
        this.displayLanguage, /* isCommunityConsole = */ true);
  }
}
