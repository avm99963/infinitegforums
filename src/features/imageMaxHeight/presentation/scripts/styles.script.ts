import StylesheetScript from '../../../../common/architecture/scripts/stylesheet/StylesheetScript';

export default class ImageMaxHeightStylesScript extends StylesheetScript {
  stylesheet = 'css/image_max_height.css';
  page: never;

  async shouldBeInjected(): Promise<boolean> {
    return await this.optionsProvider.isEnabled('imagemaxheight');
  }
}
