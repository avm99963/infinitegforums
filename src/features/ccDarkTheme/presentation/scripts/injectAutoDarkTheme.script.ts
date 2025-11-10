import { ScriptPage } from '../../../../common/architecture/scripts/Script';
import StylesheetScript from '../../../../common/architecture/scripts/stylesheet/StylesheetScript';

export default class CCDarkThemeInjectAutoDarkTheme extends StylesheetScript {
  stylesheet = 'cc_dark_theme_styles/main.css';
  attributes = { media: '(prefers-color-scheme: dark)' };
  page = ScriptPage.CommunityConsole;

  async shouldBeInjected(): Promise<boolean> {
    const ccDarkThemeEnabled =
      await this.optionsProvider.isEnabled('ccdarktheme');
    const ccDarkThemeMode =
      await this.optionsProvider.getOptionValue('ccdarktheme_mode');

    return ccDarkThemeEnabled && ccDarkThemeMode === 'system';
  }
}
