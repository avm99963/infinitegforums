import StylesheetScript from '../../../../common/architecture/scripts/stylesheet/StylesheetScript';

export default class IncreaseContrastStylesScript extends StylesheetScript {
  stylesheet = 'css/increase_contrast.css';
  page: never;

  async shouldBeInjected(): Promise<boolean> {
    return await this.optionsProvider.isEnabled('increasecontrast');
  }
}
