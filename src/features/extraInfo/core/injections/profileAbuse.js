import {kAbuseCategories, kAbuseViolationCategories, kAbuseViolationCategoriesI18n, kAbuseViolationTypes} from '../consts.js';

import BaseExtraInfoInjection from './base.js';

export default class ProfileAbuseExtraInfoInjection extends
    BaseExtraInfoInjection {
  constructor(infoHandler, optionsWatcher) {
    super(infoHandler, optionsWatcher);
    this.unifiedUserView = undefined;
  }

  inject(profileInfo, injectionDetails) {
    this.unifiedUserView = profileInfo.body?.['1'];
    const chips = this.getChips();
    this.addExtraInfoChips(
        chips, injectionDetails.card, /* withContainer = */ true);
  }

  getChips() {
    const chips = [
      this.getGeneralAbuseViolationCategoryChip(),
      ...this.getProfileAbuseChips(),
      this.getAppealCountChip(),
    ];

    return chips.filter(chip => chip !== null);
  }

  getGeneralAbuseViolationCategoryChip() {
    const abuseViolationCategory = this.unifiedUserView?.['6'];
    if (!abuseViolationCategory) return null;
    return this.getAbuseViolationCategoryChipContent(abuseViolationCategory);
  }

  getProfileAbuseChips() {
    return kAbuseCategories
        .map(category => {
          return this.getProfileAbuseCategoryChip(category);
        })
        .filter(chip => chip !== null);
  }

  getAppealCountChip() {
    const profileAbuse = this.unifiedUserView?.['1']?.['8'];
    const appealCount = profileAbuse?.['4'];
    if (appealCount === undefined) return null;

    return chrome.i18n.getMessage(
        'inject_extrainfo_profile_appealsnum', [appealCount]);
  }

  getAbuseViolationCategoryChipContent(abuseViolationCategory) {
    const content = document.createElement('span');

    const categoryI18nKey = 'inject_extrainfo_profile_abusecategory_' +
        kAbuseViolationCategoriesI18n[abuseViolationCategory];
    const categoryLocalized =
        chrome.i18n.getMessage(categoryI18nKey) ?? abuseViolationCategory;
    content.textContent = chrome.i18n.getMessage(
        'inject_extrainfo_profile_abusecategory', [categoryLocalized]);

    content.title = kAbuseViolationCategories[abuseViolationCategory] ??
        abuseViolationCategory;

    return content;
  }

  getProfileAbuseCategoryChip(abuseCategory) {
    const [protoIndex, category] = abuseCategory;
    const profileAbuse = this.unifiedUserView?.['1']?.['8'];
    const violation = profileAbuse?.[protoIndex]?.['1']?.['1'];
    if (!violation) return null;

    return chrome.i18n.getMessage(
        'inject_extrainfo_profile_abuse_' + category,
        [kAbuseViolationTypes[violation]]);
  }
}
