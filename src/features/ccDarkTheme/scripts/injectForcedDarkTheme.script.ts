import { ScriptPage } from '../../../common/architecture/scripts/Script';
import StylesheetScript from '../../../common/architecture/scripts/stylesheet/StylesheetScript';

export default class CCDarkThemeInjectForcedDarkTheme extends StylesheetScript {
  stylesheet = 'ccDarkTheme.bundle.css';
  page = ScriptPage.CommunityConsole;

  async shouldBeInjected(): Promise<boolean> {
    const ccDarkThemeEnabled =
      await this.optionsProvider.isEnabled('ccdarktheme');
    const ccDarkThemeMode =
      await this.optionsProvider.getOptionValue('ccdarktheme_mode');
    const ccDarkThemeSwitchEnabled = await this.optionsProvider.isEnabled(
      'ccdarktheme_switch_status',
    );

    return (
      ccDarkThemeEnabled &&
      ccDarkThemeMode === 'switch' &&
      ccDarkThemeSwitchEnabled
    );
  }
}
