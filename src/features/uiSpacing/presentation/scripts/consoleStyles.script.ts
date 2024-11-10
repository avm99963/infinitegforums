import StylesheetScript from '../../../../common/architecture/scripts/stylesheet/StylesheetScript';
import UiSpacingSharedStylesScript from './sharedStyles.script';

export default class UiSpacingConsoleStylesScript extends StylesheetScript {
  stylesheet = 'css/ui_spacing/console.css';

  runAfter = [UiSpacingSharedStylesScript];
  page: never;

  async shouldBeInjected(): Promise<boolean> {
    return await this.optionsProvider.isEnabled('uispacing');
  }
}
