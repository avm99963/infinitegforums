import PerForumStatsSection from '../contentScripts/communityConsole/utils/PerForumStatsSection.js';

window.addEventListener('message', e => {
  if (e.source === window && e.data?.prefix === 'TWPT-extrainfo') {
    switch (e.data?.action) {
      case 'injectPerForumStatsSection':
        let existingChartSection =
            document
                .querySelector(
                    'sc-tailwind-user_profile-user-profile sc-tailwind-shared-activity-chart')
                ?.parentNode;
        if (!existingChartSection) {
          console.error('extraInfo: couldn\'t find existing chart section.');
          return;
        }
        new PerForumStatsSection(
            existingChartSection, e.data?.profile, e.data?.locale);
        break;

      default:
        console.error(
            'Action \'' + e.data?.action +
            '\' unknown to TWPT-extrainfo receiver.');
    }
  }
});
