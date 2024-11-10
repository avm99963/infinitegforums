import StylesheetScript from '../../../../common/architecture/scripts/stylesheet/StylesheetScript';

export default class UiSpacingSharedStylesScript extends StylesheetScript {
  stylesheet = 'css/ui_spacing/shared.css';
  page: never;

  async shouldBeInjected(): Promise<boolean> {
    return await this.optionsProvider.isEnabled('uispacing');
  }
}
