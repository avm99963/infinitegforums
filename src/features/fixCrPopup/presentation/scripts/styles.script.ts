import StylesheetScript from '@/common/architecture/scripts/stylesheet/StylesheetScript';

/**
 * Script that injects dynamically the styles that fix the CR popup.
 */
export default class FixCrPopupStylesScript extends StylesheetScript {
  stylesheet = 'css/fix_cr_popup.css';
  page: never;

  async shouldBeInjected(): Promise<boolean> {
    return await this.optionsProvider.isEnabled('fixcrpopup');
  }
}
