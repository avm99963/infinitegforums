import StylesheetScript from '../../../../common/architecture/scripts/stylesheet/StylesheetScript';

export default class RepositionExpandThreadStylesScript extends StylesheetScript {
  stylesheet = 'css/reposition_expand_thread.css';
  page: never;

  async shouldBeInjected(): Promise<boolean> {
    return await this.optionsProvider.isEnabled('repositionexpandthread');
  }
}
