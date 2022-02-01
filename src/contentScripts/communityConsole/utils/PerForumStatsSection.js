import {MDCTooltip} from '@material/tooltip';

import {createExtBadge} from './common.js';

// Each entry includes the following information in order:
// - ID
// - Codename
// - Color (for the label in the legend)
const kDataKeys = [
  [4, 'recommended', '#34A853'],
  [6, 'replies', '#DADCE0'],
  [5, 'questions', '#77909D'],
];
const kRoles = {
  1: 'bronze',
  2: 'silver',
  3: 'gold',
  4: 'platinum',
  5: 'diamond',
  10: 'community_manager',
  20: 'community_specialist',
  100: 'google_employee',
  30: 'alumnus',
};

export default class PerForumStatsSection {
  constructor(existingChartSection, profile, locale) {
    this.locale = locale;
    this.parseAndSetData(profile);
    this.buildDOM(existingChartSection);
    if (this.data.length) this.injectChart(this.data[0]?.id);
  }

  parseAndSetData(profile) {
    const forumUserInfos = profile?.[1]?.[7] ?? [];
    const forumTitles = profile?.[1]?.[8] ?? [];

    const forumUserInfoIDs = forumUserInfos.map(ui => ui[1]);
    const forumTitleIDs = forumTitles.map(t => t[1]);
    const intersectionForumIDs =
        forumUserInfoIDs.filter(id => forumTitleIDs.includes(id));

    this.data = [];
    for (const id of intersectionForumIDs) {
      const fui = forumUserInfos.find(ui => ui[1] === id)?.[2];
      const numMessages = kDataKeys.reduce((prevVal, key) => {
        if (!fui?.[key[0]]) return prevVal;
        return prevVal + fui[key[0]].reduce((prevVal, userActivity) => {
          return prevVal + (userActivity?.[3] ?? 0);
        }, /* initialValue = */ 0);
      }, /* initialValue = */ 0);
      this.data.push({
        id,
        forumTitle: forumTitles.find(t => t[1] === id)?.[2],
        forumUserInfo: fui,
        numMessages,
      });
    }
    this.data.sort((a, b) => {
      // First sort by number of messages
      if (b.numMessages > a.numMessages) return 1;
      if (b.numMessages < a.numMessages) return -1;
      // Then sort by name
      return a.forumTitle.localeCompare(
          b.forumTitle, 'en', {sensitivity: 'base'});
    });
  }

  buildDOM(existingChartSection) {
    let section = document.createElement('div');
    section.classList.add('scTailwindUser_profileUserprofilesection');

    let root = document.createElement('div');
    root.classList.add(
        'scTailwindSharedActivitychartroot',
        'TWPT-scTailwindSharedActivitychartroot');

    let title = document.createElement('h2');
    title.classList.add('scTailwindSharedActivitycharttitle');

    const [badge, badgeTooltip] = createExtBadge();
    let titleText = document.createElement('span');
    titleText.textContent = chrome.i18n.getMessage('inject_perforumstats_heading');

    title.append(badge, titleText);

    let selector = this.createForumSelector();

    let chartEl = document.createElement('div');
    chartEl.classList.add('scTailwindSharedActivitychartchart');
    chartEl.setAttribute('data-twpt-per-forum-chart', '');

    root.append(title, selector, chartEl);
    section.append(root);
    existingChartSection.after(section);
    new MDCTooltip(badgeTooltip);
  }

  getAplosData(forumId) {
    let aplosData = [];
    for (const [key, name, color] of kDataKeys) {
      let rawData = this.data.find(f => f.id === forumId)?.forumUserInfo?.[key];
      let data;
      if (!rawData)
        data = [];
      else
        data = rawData.map(m => JSON.stringify(Object.values(m)));
      aplosData.push({
        color,
        data,
        label: chrome.i18n.getMessage('inject_perforumstats_chart_' + name),
        name,
      });
    }
    return aplosData;
  }

  getMessagesString(num) {
    if (num == 1) {
      return chrome.i18n.getMessage(
          'inject_perforumstats_nummessages_singular');
    }
    return chrome.i18n.getMessage(
        'inject_perforumstats_nummessages_plural', [num]);
  }

  getForumOptionString(forumTitle, labels) {
    if (labels.length == 0) return forumTitle;
    if (labels.length == 1)
      return chrome.i18n.getMessage(
          'inject_perforumstats_forumoption_1helper', [forumTitle, ...labels]);
    if (labels.length == 2)
      return chrome.i18n.getMessage(
          'inject_perforumstats_forumoption_2helpers', [forumTitle, ...labels]);

    // If labels.length > 3, this is unexpected. Here's a sensible fallback:
    return forumTitle + ' (' + labels.join(', ') + ')';
  }

  createForumSelector() {
    let div = document.createElement('div');
    div.classList.add('TWPT-select-container');

    let select = document.createElement('select');
    let noPostsGroup;
    let noPostsGroupFlag = false;
    for (const forumData of this.data) {
      const hasPosted = forumData.numMessages > 0;

      if (!hasPosted && !noPostsGroupFlag) {
        noPostsGroup = document.createElement('optgroup');
        noPostsGroup.label =
            chrome.i18n.getMessage('inject_perforumstats_optgroup_notposted');
        noPostsGroupFlag = true;
      }

      let additionalLabels = [];
      if (hasPosted)
        additionalLabels.push(this.getMessagesString(forumData.numMessages));
      let role = forumData.forumUserInfo?.[1]?.[3] ?? 0;
      if (role)
        additionalLabels.push(chrome.i18n.getMessage(
            'inject_perforumstats_role_' + kRoles[role]));

      let option = document.createElement('option');
      option.textContent =
          this.getForumOptionString(forumData.forumTitle, additionalLabels);
      option.value = forumData.id;
      if (hasPosted)
        select.append(option);
      else
        noPostsGroup.append(option);
    }
    if (noPostsGroupFlag) select.append(noPostsGroup);
    select.addEventListener('change', e => {
      let forumId = e.target.value;
      this.injectChart(forumId);
    });

    div.append(select);
    return div;
  }

  injectChart(forumId) {
    let data = this.getAplosData(forumId);
    let metadata = {
      activities: [],
      finalMonth: undefined,
      locale: this.locale,
      shouldDisableTransitions: true,
    };
    let chartTitle = chrome.i18n.getMessage('inject_perforumstats_chart_label');
    const message = {
      action: 'renderProfileActivityChart',
      prefix: 'TWPT-extrainfo',
      data,
      metadata,
      chartTitle,
    };
    window.postMessage(message, '*');
  }
}
