// Each entry includes the following information in order:
// - ID
// - Name (for the label in the legend)
// - Codename
// - Color (for the label in the legend)
const kDataKeys = [
  [4, 'Recommended', 'recommended', '#34A853'],
  [6, 'Replies (not recommended)', 'replies', '#DADCE0'],
  [5, 'Questions', 'questions', '#77909D'],
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
    if (typeof window.sc_renderProfileActivityChart !== 'function') {
      console.error(
          'PerForumStatsSection: window.sc_renderProfileActivityChart is not available.');
      return;
    }
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
    title.textContent = 'Per-forum activity';

    let selector = this.createForumSelector();

    let chartEl = document.createElement('div');
    chartEl.classList.add('scTailwindSharedActivitychartchart');

    root.append(title, selector, chartEl);
    section.append(root);
    existingChartSection.after(section);

    this.chartEl = chartEl;
  }

  getAplosData(forumId) {
    let aplosData = [];
    for (const [key, label, name, color] of kDataKeys) {
      let rawData = this.data.find(f => f.id === forumId)?.forumUserInfo?.[key];
      let data;
      if (!rawData)
        data = [];
      else
        data = rawData.map(m => JSON.stringify(Object.values(m)));
      aplosData.push({
        color,
        data,
        label,
        name,
      });
    }
    return aplosData;
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
        noPostsGroup.label = 'Not posted to within the last 12 months';
        noPostsGroupFlag = true;
      }

      let additionalLabelsArray = [];
      if (hasPosted)
        additionalLabelsArray.push(forumData.numMessages + ' messages');
      let role = forumData.forumUserInfo?.[1]?.[3] ?? 0;
      if (role) additionalLabelsArray.push(kRoles[role]);
      let additionalLabels = '';
      if (additionalLabelsArray.length > 0)
        additionalLabels = ' (' + additionalLabelsArray.join(', ') + ')';

      let option = document.createElement('option');
      option.textContent = forumData.forumTitle + additionalLabels;
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
    this.chartEl.replaceChildren();

    let data = this.getAplosData(forumId);
    let metadata = {
      activities: [],
      finalMonth: undefined,
      locale: this.locale,
      shouldDisableTransitions: true,
    };
    let chartTitle = 'User activity chart';
    let chart = window.sc_renderProfileActivityChart(
        this.chartEl, data, metadata, chartTitle);
  }
}
