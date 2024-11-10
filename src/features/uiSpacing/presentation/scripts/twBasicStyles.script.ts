import StylesheetScript from '../../../../common/architecture/scripts/stylesheet/StylesheetScript';
import UiSpacingSharedStylesScript from './sharedStyles.script';

export default class UiSpacingTwBasicStylesScript extends StylesheetScript {
  stylesheet = 'css/ui_spacing/twbasic.css';

  runAfter = [UiSpacingSharedStylesScript];
  page: never;

  async shouldBeInjected(): Promise<boolean> {
    return await this.optionsProvider.isEnabled('uispacing');
  }
}
