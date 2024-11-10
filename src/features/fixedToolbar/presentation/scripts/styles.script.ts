import StylesheetScript from '../../../../common/architecture/scripts/stylesheet/StylesheetScript';

export default class FixedToolbarStylesScript extends StylesheetScript {
  stylesheet = 'css/fixed_toolbar.css';
  page: never;

  async shouldBeInjected(): Promise<boolean> {
    return await this.optionsProvider.isEnabled('fixedtoolbar');
  }
}
