import {getCurrentColorTheme, kColorThemeMode} from './darkTheme';

const kReportingWidgetThemes = {
  [kColorThemeMode.Auto]: '0',
  [kColorThemeMode.Light]: '1',
  [kColorThemeMode.Dark]: '2',
};

export default class ReportDialogColorThemeFix {
  constructor() {}

  async fixThemeIfReportDialogIframeAndApplicable(iframe, optionsProvider) {
    if (!this.isReportDialogIframe(iframe)) return;

    const options = await optionsProvider.getOptionsValues();
    const currentColorTheme = getCurrentColorTheme(options);

    // By default the report dialog is added with the light theme
    if (currentColorTheme === kColorThemeMode.Light) return;

    console.debug('[reportDialogColorThemeFix] Fixing report dialog iframe');
    let url = new URL(iframe.src);
    url.searchParams.set('theme', kReportingWidgetThemes[currentColorTheme]);
    iframe.src = url.href;
  }

  isReportDialogIframe(iframe) {
    return iframe.src?.includes?.('reportingwidget') ?? false;
  }
}
