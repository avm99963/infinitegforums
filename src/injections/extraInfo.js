window.addEventListener('message', e => {
  if (e.source === window && e.data?.prefix === 'TWPT-extrainfo') {
    switch (e.data?.action) {
      case 'renderProfileActivityChart':
        if (typeof window.sc_renderProfileActivityChart !== 'function') {
          console.error(
              'extraInfo: window.sc_renderProfileActivityChart is not available.');
          return;
        }

        let chartEl = document.querySelector(
            '.scTailwindSharedActivitychartchart[data-twpt-per-forum-chart]');
        if (!chartEl) {
          console.error('extraInfo: couldn\'t find per-forum chart div.');
          return;
        }

        chartEl.replaceChildren();
        window.sc_renderProfileActivityChart(
            chartEl, e.data?.data, e.data?.metadata, e.data?.chartTitle);
        break;

      default:
        console.error(
            'Action \'' + e.data?.action +
            '\' unknown to TWPT-extrainfo receiver.');
    }
  }
});
