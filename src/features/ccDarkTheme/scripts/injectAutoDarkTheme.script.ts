import { ScriptPage } from '../../../common/architecture/scripts/Script';
import StylesheetScript from '../../../common/architecture/scripts/stylesheet/StylesheetScript';

export default class InjectAutoDarkTheme extends StylesheetScript {
  stylesheet = 'ccDarkTheme.bundle.css';
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
