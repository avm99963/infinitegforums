import StylesheetScript from '../../../../common/architecture/scripts/stylesheet/StylesheetScript';

export default class StickySidebarHeadersStylesScript extends StylesheetScript {
  stylesheet = 'css/sticky_sidebar_headers.css';
  page: never;

  async shouldBeInjected(): Promise<boolean> {
    return await this.optionsProvider.isEnabled('stickysidebarheaders');
  }
}
